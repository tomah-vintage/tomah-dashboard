<script lang="ts">
  import type { PlatformUser, OrderHistoryItem } from "$lib/types/user";

  export let user: PlatformUser;
  export let orderHistory: OrderHistoryItem[];
</script>

<div class="bg-card-background shadow-md rounded-lg p-6">
  <div class="mb-6 border-b pb-4 border-gray-200">
    <h2 class="text-xl font-semibold text-gray-800">Хэрэглэгчийн дэлгэрэнгүй</h2>
    <div class="mt-2 text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2">
      <p><strong>Нэр:</strong> {user.name}</p>
      <p><strong>И-мэйл:</strong> {user.email}</p>
      <p><strong>Бүртгүүлсэн огноо:</strong> {user.registrationDate}</p>
      <p><strong>Нийт захиалга:</strong> {user.orderCount}</p>
    </div>
  </div>

  <h2 class="text-xl font-semibold mb-4 text-gray-800">Захиалгын түүх</h2>
  <div class="overflow-x-auto">
    <table class="min-w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3">Захиалгын дугаар</th>
          <th scope="col" class="px-6 py-3">Огноо</th>
          <th scope="col" class="px-6 py-3">Ресторан</th>
          <th scope="col" class="px-6 py-3">Дүн</th>
          <th scope="col" class="px-6 py-3">Төлөв</th>
        </tr>
      </thead>
      <tbody>
        {#each orderHistory as item (item.orderId)}
          <tr class="bg-white border-b hover:bg-gray-50">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              {item.orderId}
            </th>
            <td class="px-6 py-4">{item.date}</td>
            <td class="px-6 py-4">{item.restaurantName}</td>
            <td class="px-6 py-4">${item.totalAmount.toFixed(2)}</td>
            <td class="px-6 py-4">
              <span class:text-status-success={item.status === 'Completed'}
                    class:text-status-error={item.status === 'Cancelled'}>
                {item.status === 'Completed' ? 'Дууссан' : item.status === 'Cancelled' ? 'Цуцлагдсан' : item.status}
              </span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
