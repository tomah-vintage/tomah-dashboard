import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { z } from 'zod';

const editRestaurantSchema = z.object({
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
});

export const load: PageServerLoad = async ({ params, locals, fetch }) => {
	const user = locals.user;
	const userRole = user?.role_name;

	if (userRole !== 'admin') {
		throw error(403, 'Forbidden: You do not have permission to edit restaurants.');
	}

	try {
		const restaurantResponse = await fetch(
			`${PUBLIC_BACKEND_URL}/api/restaurants/${params.restaurantId}/`
		);

		if (!restaurantResponse.ok) {
			throw error(404, 'Restaurant not found');
		}

		const restaurant = await restaurantResponse.json();

		return {
			restaurant
		};
	} catch (err) {
		console.error('Error loading restaurant for edit:', err);
		throw error(500, 'Failed to load restaurant data');
	}
};

export const actions: Actions = {
    default: async ({ request, cookies, params }) => {
        const sessionToken = cookies.get('session');
        const restaurantId = params.restaurantId;

        if (!sessionToken) {
            throw error(401, 'Unauthorized');
        }

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const address = formData.get('address') as string;
        const latitude = formData.get('latitude');
        const longitude = formData.get('longitude');
        const openHoursJson = formData.get('open_hours') as string;
        const logo_file = formData.get('logo_file');
        const restaurant_img_urls = formData.getAll('restaurant_images');

        const openHours = openHoursJson ? JSON.parse(openHoursJson) : [];

        let parsedLatitude: number | undefined;
        if (typeof latitude === 'string' && !isNaN(parseFloat(latitude))) {
            parsedLatitude = parseFloat(latitude);
        }

        let parsedLongitude: number | undefined;
        if (typeof longitude === 'string' && !isNaN(parseFloat(longitude))) {
            parsedLongitude = parseFloat(longitude);
        }

        const dataToValidate = {
            name,
            phone,
            address,
            latitude: parsedLatitude,
            longitude: parsedLongitude,
            open_hours: openHours,
        };

        const validation = editRestaurantSchema.safeParse(dataToValidate);

        if (!validation.success) {
            const errors: Record<string, string[]> = {};
            validation.error.errors.forEach((err) => {
                const key = err.path.join('.');
                if (!errors[key]) {
                    errors[key] = [];
                }
                errors[key].push(err.message);
            });

            return fail(400, {
                errors,
                ...dataToValidate,
            });
        }

        try {
            // Create the form data for multipart request
            const updateFormData = new FormData();
            updateFormData.append('name', name);
            updateFormData.append('phone', phone);
            updateFormData.append('address', address);
            
            if (parsedLatitude !== undefined) {
                updateFormData.append('latitude', parsedLatitude.toString());
            }
            if (parsedLongitude !== undefined) {
                updateFormData.append('longitude', parsedLongitude.toString());
            }
            if (openHours.length > 0) {
                updateFormData.append('open_hours', JSON.stringify(openHours));
            }

            // Add logo file if provided
            if (logo_file && logo_file instanceof File && logo_file.size > 0) {
                updateFormData.append('logo', logo_file);
            }

            // Add restaurant images if provided
            if (restaurant_img_urls && restaurant_img_urls.length > 0) {
                restaurant_img_urls.forEach((file) => {
                    if (file instanceof File && file.size > 0) {
                        updateFormData.append('restaurant_img_urls', file);
                    }
                });
            }

            const response = await fetch(`${PUBLIC_BACKEND_URL}/api/restaurant/${restaurantId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${sessionToken}`,
                },
                body: updateFormData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Restaurant update failed:', errorData);
                return fail(400, {
                    errors: { general: ['Failed to update restaurant'] },
                    ...dataToValidate,
                });
            }

            // Success - redirect to restaurant detail page
            throw redirect(303, `/restaurants/${restaurantId}`);

        } catch (err) {
            if (err instanceof Error && 'status' in err) {
                throw err; // Re-throw redirect
            }
            console.error('Error updating restaurant:', err);
            return fail(500, {
                errors: { general: ['Server error occurred'] },
                ...dataToValidate,
            });
        }
    }
};