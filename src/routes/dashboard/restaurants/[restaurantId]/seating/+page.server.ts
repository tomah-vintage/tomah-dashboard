import type { Actions, PageServerLoad } from './$types';
import type { Table } from '$lib/types/seating';

export const load: PageServerLoad = async ({ fetch, params }) => {
    const response = await fetch(`/api/restaurants/${params.restaurantId}/tables`);
    const tables: Table[] = await response.json();
    return { tables };
};

export const actions: Actions = {
    addTable: async ({ fetch, request, params }) => {
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
    removeTable: async ({ fetch, request, params }) => {
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