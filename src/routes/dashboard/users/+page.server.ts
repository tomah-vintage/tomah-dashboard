import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Permission } from '$lib/types/auth';
import type { PlatformUser } from '$lib/types/user';

const requiredPermissions: Permission[] = ['manage-users'];

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    const hasPermission = requiredPermissions.every(p => user?.permissions.includes(p));

    if (!hasPermission) {
        throw error(403, 'Forbidden: You do not have permission to manage users.');
    }

    // Mock data for the user list
    const mockUsers: PlatformUser[] = [
        { id: 'user-1', name: 'John Doe', email: 'john.doe@example.com', registrationDate: '2023-01-15', orderCount: 12 },
        { id: 'user-2', name: 'Jane Smith', email: 'jane.smith@example.com', registrationDate: '2023-02-20', orderCount: 5 },
        { id: 'user-3', name: 'Peter Jones', email: 'peter.jones@example.com', registrationDate: '2023-03-10', orderCount: 23 },
        { id: 'user-4', name: 'Mary Williams', email: 'mary.williams@example.com', registrationDate: '2023-04-05', orderCount: 8 },
        { id: 'user-5', name: 'David Brown', email: 'david.brown@example.com', registrationDate: '2023-05-12', orderCount: 2 },
    ];

    return {
        users: mockUsers
    };
};