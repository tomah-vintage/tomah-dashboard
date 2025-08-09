import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTables, addTable } from '$lib/server/database';
import type { Table } from '$lib/types/seating';
import qrcode from 'qrcode';

// GET /api/restaurants/[restaurantId]/tables
export const GET: RequestHandler = ({ params }) => {
    const tables = getTables(params.restaurantId);
    return json(tables);
};

// POST /api/restaurants/[restaurantId]/tables
export const POST: RequestHandler = async ({ request, params, url }) => {
    const { name } = await request.json();
    const { restaurantId } = params;

    const tableId = crypto.randomUUID();
    const orderUrl = `${url.origin}/order/${restaurantId}/${tableId}`;

    try {
        const qrCodeUrl = await qrcode.toDataURL(orderUrl);
        const newTable: Table = {
            id: tableId,
            restaurantId,
            name,
            qrCodeUrl,
            orderUrl,
        };

        const addedTable = addTable(newTable);
        return json(addedTable, { status: 201 });
    } catch (error) {
        return json({ message: 'Failed to generate QR code.' }, { status: 500 });
    }
};
