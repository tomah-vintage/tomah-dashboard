import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    const userRole = user?.role_name;

    if (userRole === 'admin') {
        throw redirect(303, '/');
    }

    if (userRole !== 'restaurant') {
        throw error(403, 'Forbidden: You do not have permission to edit menus.');
    }

    // Data loading for the menu highlights page would go here.
    return {};
};