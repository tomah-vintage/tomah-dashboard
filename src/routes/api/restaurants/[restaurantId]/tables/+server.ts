import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTables, addTable } from '$lib/server/database';
import type { Table } from '$lib/types/seating';

// GET /api/restaurants/[restaurantId]/tables
export const GET: RequestHandler = ({ params }) => {
    const tables = getTables(params.restaurantId);
    return json(tables);
};

// POST /api/restaurants/[restaurantId]/tables
export const POST: RequestHandler = async ({ request, params, url: _url }) => {
    const { name } = await request.json();
    const { restaurantId } = params;

    const tableId = crypto.randomUUID();

    try {
        const newTable: Table = {
            id: tableId,
            restaurant: restaurantId,
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            shape: 'rectangle',
            seat_capacity: 4,
            table_number: name,
            status: 'available',
        };

        const addedTable = addTable(newTable);
        return json(addedTable, { status: 201 });
    } catch (_error) {
        return json({ message: 'Failed to generate QR code.' }, { status: 500 });
    }
};
