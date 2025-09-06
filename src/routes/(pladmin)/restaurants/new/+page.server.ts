
import { fail, redirect } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const actions = {
	default: async ({ request, cookies }) => {
		const sessionToken = cookies.get('session');

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const representativeName = formData.get('representativeName') as string;
		const phone = formData.get('phone') as string;
		const registrationNumber = formData.get('registrationNumber') as string;
		const workingHours = formData.get('workingHours') as string;
		const address = formData.get('address') as string;
		const imageFile = formData.get('image');

		const errors: Record<string, string[]> = {};

		if (!name || name.trim() === '') {
			errors.name = ['Рестораны нэр заавал оруулна.'];
		}
		if (!representativeName || representativeName.trim() === '') {
			errors.representativeName = ['Төлөөлөгчийн нэр заавал оруулна.'];
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				data: {
					name,
					representativeName,
					phone,
					registrationNumber,
					workingHours,
					address,
				},
				errors
			});
		}

		let imageUrl: string | null = null;

		if (imageFile instanceof File && imageFile.size > 0) {
			const uploadFormData = new FormData();
			uploadFormData.append('file', imageFile);

			try {
				const uploadResponse = await fetch(`${PUBLIC_BACKEND_URL}/api/upload/`, {
					method: 'POST',
					headers: {
						...(sessionToken && { 'Authorization': `Bearer ${sessionToken}` })
					},
					body: uploadFormData,
				});

				if (uploadResponse.ok) {
					const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.url;
				} else {
					const uploadErrorData = await uploadResponse.json();
					console.error('Failed to upload image:', uploadErrorData);
					return fail(uploadResponse.status, {
						data: { name, representativeName, phone, registrationNumber, workingHours, address },
						errors: {
							image: uploadErrorData.message || 'Failed to upload image.'
						}
					});
				}
			} catch (error) {
				console.error('Error uploading image:', error);
				return fail(500, {
					data: { name, representativeName, phone, registrationNumber, workingHours, address },
					errors: {
						image: 'An unexpected error occurred during image upload.'
					}
				});
			}
		}


		const restaurantData = {
			name,
			representativeName,
			phone,
			registrationNumber,
			workingHours,
			address,
			logo: imageUrl,
		};

		try {
			const response = await fetch(`${PUBLIC_BACKEND_URL}/api/restaurants/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(sessionToken && { 'Authorization': `Bearer ${sessionToken}` })
				},
				body: JSON.stringify(restaurantData),
			});

			if (response.ok) {
				const result = await response.json();
				return redirect(303, '/restaurants');
			} else {
				const errorData = await response.json();
				console.error('Failed to create restaurant:', errorData);
				return fail(response.status, {
					data: restaurantData,
					errors: {
						api: errorData.message || 'Failed to create restaurant. Please try again.'
					}
				});
			}
		}
		catch (error) {
			console.error('Error sending request to backend:', error);
			return fail(500, {
				data: restaurantData,
				errors: {
					api: 'An unexpected error occurred. Please try again later.'
				}
			});
		}
	}
};