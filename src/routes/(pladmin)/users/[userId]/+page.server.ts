import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PlatformUser, OrderHistoryItem } from '$lib/types/user';

export const load: PageServerLoad = async ({ locals, params }) => {
    const user = locals.user;
    const userRole = user?.role_name;

    if (userRole !== 'admin') {
        throw error(403, 'Forbidden: You do not have permission to manage users.');
    }

    // In a real app, you would use params.userId to fetch data from a database.
    // Here, we'll generate mock data.
    const mockUser: PlatformUser = {
        id: params.userId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        registrationDate: '2023-01-15',
        orderCount: 12
    };

    const mockOrderHistory: OrderHistoryItem[] = [
        { orderId: 'order-123', date: '2023-08-01', restaurantName: 'Pizza Palace', totalAmount: 25.50, status: 'Completed' },
        { orderId: 'order-456', date: '2023-07-25', restaurantName: 'Sushi Spot', totalAmount: 45.00, status: 'Completed' },
        { orderId: 'order-789', date: '2023-07-10', restaurantName: 'Burger Barn', totalAmount: 15.75, status: 'Cancelled' },
        { orderId: 'order-987', date: '2023-06-22', restaurantName: 'Pizza Palace', totalAmount: 30.00, status: 'Completed' },
    ];

    return {
        user: mockUser,
        orderHistory: mockOrderHistory
    };
};