<script lang="ts">
  import type { PlatformUser, OrderHistoryItem } from "$lib/types/user";

  export let user: PlatformUser;
  export let orderHistory: OrderHistoryItem[];
</script>

<div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
  <div class="mb-6 border-b pb-4 dark:border-gray-700">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">User Details</h2>
    <div class="mt-2 text-gray-600 dark:text-gray-400 grid grid-cols-1 md:grid-cols-2 gap-2">
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Registration Date:</strong> {user.registrationDate}</p>
      <p><strong>Total Orders:</strong> {user.orderCount}</p>
    </div>
  </div>

  <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Order History</h2>
  <div class="overflow-x-auto">
    <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Order ID</th>
          <th scope="col" class="px-6 py-3">Date</th>
          <th scope="col" class="px-6 py-3">Restaurant</th>
          <th scope="col" class="px-6 py-3">Amount</th>
          <th scope="col" class="px-6 py-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {#each orderHistory as item (item.orderId)}
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {item.orderId}
            </th>
            <td class="px-6 py-4">{item.date}</td>
            <td class="px-6 py-4">{item.restaurantName}</td>
            <td class="px-6 py-4">${item.totalAmount.toFixed(2)}</td>
            <td class="px-6 py-4">
              <span class:text-green-500={item.status === 'Completed'}
                    class:text-red-500={item.status === 'Cancelled'}>
                {item.status}
              </span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
