import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Permission } from '$lib/types/auth';

const requiredPermissions: Permission[] = ['create_menuitem', 'update_menuitem', 'delete_menuitem'];

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    const hasPermission = requiredPermissions.every(p => user?.permissions.includes(p));

    if (!hasPermission) {
        throw error(403, 'Forbidden: You do not have permission to edit menus.');
    }

    // Data loading for the menu page would go here.
    return {};
};