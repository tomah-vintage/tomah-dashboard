import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    const userRole = user?.role_name;

    if (userRole !== 'admin') {
        throw error(403, 'Forbidden: You do not have permission to manage default categories.');
    }

    // Data loading for the default categories page would go here.
    // For now, we just ensure the user has permission to see the page.
    return {};
};