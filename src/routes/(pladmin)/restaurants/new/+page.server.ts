
import { fail, redirect } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { z } from 'zod';

const newRestaurantSchema = z.object({
    name: z.string().min(1, 'Рестораны нэр заавал оруулна.'),
    phone: z.string().min(1, 'Утасны дугаар заавал оруулна.').regex(/^\d+$/, 'Утасны дугаар нь зөвхөн тоо байна.'),
    address: z.string().min(1, 'Хаяг заавал оруулна.'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    open_hours: z.array(z.object({
        day_of_week: z.number().int().min(0).max(6),
        opening_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Invalid time format (HH:MM:SS)'),
        closing_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Invalid time format (HH:MM:SS)'),
    })).optional(),
    user: z.object({
        email: z.string().email('Invalid email address.'),
        password: z.string().min(6, 'Password must be at least 6 characters long.'),
        first_name: z.string().min(1, 'First name is required.'),
        last_name: z.string().min(1, 'Last name is required.'),
        phone: z.string().min(1, 'Phone number is required.').regex(/^\d+$/, 'Phone number must be digits only.'),
    }).optional(),
});

export const actions = {
    default: async ({ request, cookies }) => {
        const sessionToken = cookies.get('session');

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const address = formData.get('address') as string;
        const latitude = formData.get('latitude');
        const longitude = formData.get('longitude');
        const openHoursJson = formData.get('open_hours') as string;
        const first_name = formData.get('first_name');
        const last_name = formData.get('last_name');
        const email = formData.get('email');
        const password = formData.get('password');
        const role = 2;
        const logo_file = formData.get('logo_file');
        const restaurant_img_urls = formData.getAll('restaurant_images');
        const user = { first_name, last_name, email, password, role, phone }

        const openHours = openHoursJson ? JSON.parse(openHoursJson) : []

        let parsedLatitude: number | undefined;
        if (typeof latitude === 'string' && !isNaN(parseFloat(latitude))) {
            parsedLatitude = parseFloat(latitude);
        }

        let parsedLongitude: number | undefined;
        if (typeof longitude === 'string' && !isNaN(parseFloat(longitude))) {
            parsedLongitude = parseFloat(longitude);
        }

        const parsedForm = newRestaurantSchema.safeParse({
            name,
            phone,
            address,
            latitude: parsedLatitude,
            longitude: parsedLongitude,
            open_hours: openHours,
            user,
        });

        if (!parsedForm.success) {
            const errors: Record<string, string[]> = {};
            for (const issue of parsedForm.error.issues) {
                if (typeof issue.path[0] === 'string') {
                    errors[issue.path[0]] = [issue.message];
                }
            }
            return fail(400, {
                data: {
                    name,
                    phone,
                    address,
                    latitude: parsedLatitude,
                    longitude: parsedLongitude,
                    open_hours: openHours,
                    user,
                },
                errors
            });
        }

        let logoUrl: string | null = null;

        if (logo_file instanceof File && logo_file.size > 0) {
            const uploadFormData = new FormData();
            uploadFormData.append('file', logo_file);

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
                    logoUrl = uploadResult.url;
                } else {
                    const uploadErrorData = await uploadResponse.json();
                    console.error('Failed to upload logo:', uploadErrorData);
                    return fail(uploadResponse.status, {
                        data: { name, phone, address },
                        errors: {
                            logo_file: [uploadErrorData.message || 'Failed to upload logo.']
                        }
                    });
                }
            } catch (error) {
                console.error('Error uploading logo:', error);
                return fail(500, {
                    data: { name, phone, address },
                    errors: {
                        logo_file: ['An unexpected error occurred during logo upload.']
                    }
                });
            }
        }

        const restaurantImageUrls: string[] = [];
        const filesToUpload = restaurant_img_urls.filter(f => f instanceof File && f.size > 0) as File[];

        if (filesToUpload.length > 0) {
            const uploadPromises = filesToUpload.map(async (imageFile) => {
                const uploadFormData = new FormData();
                uploadFormData.append('file', imageFile);

                const uploadResponse = await fetch(`${PUBLIC_BACKEND_URL}/api/upload/`, {
                    method: 'POST',
                    headers: {
                        ...(sessionToken && { 'Authorization': `Bearer ${sessionToken}` })
                    },
                    body: uploadFormData,
                });

                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    return uploadResult.url;
                } else {
                    const uploadErrorData = await uploadResponse.json();
                    throw new Error(uploadErrorData.message || `Failed to upload image ${imageFile.name}`);
                }
            });

            try {
                const urls = await Promise.all(uploadPromises);
                restaurantImageUrls.push(...urls);
            } catch (error: unknown) {
                console.error('Error uploading restaurant images:', error);
                return fail(500, {
                    data: { name, phone, address },
                    errors: {
                        restaurant_img_urls: [(error as { message: string }).message || 'An unexpected error occurred during image upload.']
                    }
                });
            }
        }

        const restaurantData = {
            name,
            address,
            logo: logoUrl,
            restaurant_img_urls: restaurantImageUrls,
            latitude: parsedLatitude,
            longitude: parsedLongitude,
            open_hours: openHours,
            user,
        };

        try {
            console.log('JSON.stringify(restaurantData)', JSON.stringify(restaurantData))

            const response = await fetch(`${PUBLIC_BACKEND_URL}/api/restaurants/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(sessionToken && { 'Authorization': `Bearer ${sessionToken}` })
                },
                body: JSON.stringify(restaurantData),
            });

            if (response.ok) {
                await response.json();
                return redirect(303, '/restaurants');
            } else {
                console.log(response.status)
                const errorData = await response.json();
                console.error('Failed to create restaurant:', errorData);
                return fail(response.status, {
                    data: restaurantData,
                    errors: {
                        api: [errorData.message || 'Failed to create restaurant. Please try again.']
                    }
                });
            }
        }
        catch (error) {
            console.error('Error sending request to backend:', error);
            return fail(500, {
                data: restaurantData,
                errors: {
                    api: ['An unexpected error occurred. Please try again later.']
                }
            });
        }
    }
};