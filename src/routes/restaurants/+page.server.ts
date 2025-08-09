import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Permission } from '$lib/types/auth';

const requiredPermissions: Permission[] = ['manage-restaurants'];

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    const hasPermission = requiredPermissions.every(p => user?.permissions.includes(p));

    if (!hasPermission) {
        throw error(403, 'Forbidden: You do not have permission to manage restaurants.');
    }

    // Data loading for the restaurants page would go here.
    // For now, we just ensure the user has permission to see the page.
    return {};
};