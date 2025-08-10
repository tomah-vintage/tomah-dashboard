import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Table } from '$lib/types/seating';
import type { Permission } from '$lib/types/auth';

// Define the permissions required to view and interact with this page
const requiredPermissions: Permission[] = ['view-seating-charts'];

export const load: PageServerLoad = async ({ fetch, params, locals }) => {
    const user = locals.user;
    const hasPermission = requiredPermissions.every(p => user?.permissions.includes(p));

    if (!hasPermission) {
        throw error(403, 'Forbidden: You do not have permission to view seating charts.');
    }

    const response = await fetch(`/api/restaurants/${params.restaurantId}/tables`);
    const tables: Table[] = await response.json();
    return { tables };
};

export const actions: Actions = {
    addTable: async ({ fetch, request, params, locals }) => {
        const user = locals.user;
        const hasPermission = requiredPermissions.every(p => user?.permissions.includes(p));

        if (!hasPermission) {
            throw error(403, 'Forbidden: You do not have permission to modify seating charts.');
        }

        const formData = await request.formData();
        const name = formData.get('name') as string;

        const response = await fetch(`/api/restaurants/${params.restaurantId}/tables`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });

        if (!response.ok) {
            const { message } = await response.json();
            return { success: false, message };
        }

        return { success: true };
    },
    removeTable: async ({ fetch, request, params, locals }) => {
        const user = locals.user;
        const hasPermission = requiredPermissions.every(p => user?.permissions.includes(p));

        if (!hasPermission) {
            throw error(403, 'Forbidden: You do not have permission to modify seating charts.');
        }

        const formData = await request.formData();
        const tableId = formData.get('tableId') as string;

        const response = await fetch(`/api/restaurants/${params.restaurantId}/tables/${tableId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const { message } = await response.json();
            return { success: false, message };
        }

        return { success: true };
    }
};