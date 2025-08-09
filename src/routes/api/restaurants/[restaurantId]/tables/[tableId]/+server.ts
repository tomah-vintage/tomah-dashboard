import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { removeTable } from '$lib/server/database';

// DELETE /api/restaurants/[restaurantId]/tables/[tableId]
export const DELETE: RequestHandler = ({ params }) => {
    const { tableId } = params;
    const success = removeTable(tableId);
    if (success) {
        return json({ message: 'Table removed successfully.' }, { status: 200 });
    } else {
        return json({ message: 'Table not found.' }, { status: 404 });
    }
};
