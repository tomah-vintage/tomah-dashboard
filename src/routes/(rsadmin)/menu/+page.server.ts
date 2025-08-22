import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    const userRole = user?.role_name;

    if (userRole !== 'admin' && userRole !== 'restaurant') {
        throw error(403, 'Forbidden: You do not have permission to edit menus.');
    }

    // Data loading for the menu page would go here.
    return {};
};