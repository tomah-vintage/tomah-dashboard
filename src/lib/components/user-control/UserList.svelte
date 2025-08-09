<script lang="ts">
  import type { PlatformUser } from "$lib/types/user";

  export let users: PlatformUser[];

</script>

<div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
  <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">All Users</h2>
  <div class="overflow-x-auto">
    <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3">Email</th>
          <th scope="col" class="px-6 py-3">Registration Date</th>
          <th scope="col" class="px-6 py-3">Orders</th>
          <th scope="col" class="px-6 py-3"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {#each users as user (user.id)}
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {user.name}
            </th>
            <td class="px-6 py-4">{user.email}</td>
            <td class="px-6 py-4">{user.registrationDate}</td>
            <td class="px-6 py-4">{user.orderCount}</td>
            <td class="px-6 py-4 text-right">
              <a href={`/dashboard/users/${user.id}`} class="font-medium text-orange-600 dark:text-orange-500 hover:underline">View History</a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
