import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    const userRole = user?.role_name;

    if (userRole !== 'admin') {
        throw error(403, 'Хориглосон: Та онцлох ресторан удирдах эрхгүй байна.');
    }

    // Data loading for the restaurant highlights page would go here.
    // For now, we just ensure the user has permission to see the page.
    return {};
};