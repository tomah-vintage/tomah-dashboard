
import { fail, redirect } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { z } from 'zod';

const newRestaurantSchema = z.object({
    name: z.string().min(1, 'Рестораны нэр заавал оруулна.'),
    address: z.string().min(1, 'Хаяг заавал оруулна.'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    logo: z.string().url().optional().nullable(),
    restaurant_img_urls: z.array(z.string().url()).optional(),
    takeout_container_price: z.string().optional(),
    bonum_api_key: z.string().optional(),
    bonum_secret_key: z.string().optional(),
    open_hours: z.array(z.object({
        day_of_week: z.number().int().min(0).max(6),
        opening_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Invalid time format (HH:MM:SS)'),
        closing_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Invalid time format (HH:MM:SS)'),
    })).optional(),
    user: z.object({
        email: z.string().email('Invalid email address.'),
        password: z.string().min(8, 'Password must be at least 8 characters long.'),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        phone: z.string().regex(/^[6-9]\d{7}$/, 'Phone must be 8 digits starting with 6, 7, 8, or 9.'),
        role: z.number().int(),
    }),
});

export const actions = {
    default: async ({ request, cookies }) => {
        const sessionToken = cookies.get('session');

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const address = formData.get('address') as string;
        const latitude = formData.get('latitude');
        const longitude = formData.get('longitude');
        const openHoursJson = formData.get('open_hours') as string;
        const first_name = formData.get('first_name');
        const last_name = formData.get('last_name');
        const email = formData.get('email');
        const password = formData.get('password');
        const phone = formData.get('phone');
        const role = 2;
        const logo_file = formData.get('logo_file');
        const restaurant_img_urls = formData.getAll('restaurant_images');
        const takeout_container_price = formData.get('takeout_container_price') as string | null;
        const bonum_api_key = formData.get('bonum_api_key') as string | null;
        const bonum_secret_key = formData.get('bonum_secret_key') as string | null;
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
            address,
            latitude: parsedLatitude,
            longitude: parsedLongitude,
            open_hours: openHours,
            takeout_container_price,
            bonum_api_key,
            bonum_secret_key,
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
                    address,
                    latitude: parsedLatitude,
                    longitude: parsedLongitude,
                    open_hours: openHours,
                    takeout_container_price,
                    bonum_api_key,
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
                        data: { name, address },
                        errors: {
                            logo_file: [uploadErrorData.message || 'Failed to upload logo.']
                        }
                    });
                }
            } catch (error) {
                console.error('Error uploading logo:', error);
                return fail(500, {
                    data: { name, address },
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
                    data: { name, address },
                    errors: {
                        restaurant_img_urls: [(error as { message: string }).message || 'An unexpected error occurred during image upload.']
                    }
                });
            }
        }

        const restaurantData: Record<string, unknown> = {
            name,
            address,
            logo: logoUrl,
            restaurant_img_urls: restaurantImageUrls,
            latitude: parsedLatitude,
            longitude: parsedLongitude,
            open_hours: openHours,
            user,
        };

        // Add optional fields only if they have values
        if (takeout_container_price) {
            restaurantData.takeout_container_price = takeout_container_price;
        }
        if (bonum_api_key) {
            restaurantData.bonum_api_key = bonum_api_key;
        }
        if (bonum_secret_key) {
            restaurantData.bonum_secret_key = bonum_secret_key;
        }

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