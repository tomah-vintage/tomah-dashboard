<script lang="ts">
  import type { PlatformUser } from "$lib/types/user";

  export let users: PlatformUser[];

</script>

<div class="bg-card-background shadow-md rounded-lg p-6">
  <h2 class="text-xl font-semibold mb-4 text-gray-800">Бүх хэрэглэгчид</h2>
  <div class="overflow-x-auto">
    <table class="min-w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3">Нэр</th>
          <th scope="col" class="px-6 py-3">И-мэйл</th>
          <th scope="col" class="px-6 py-3">Бүртгүүлсэн огноо</th>
          <th scope="col" class="px-6 py-3">Захиалга</th>
          <th scope="col" class="px-6 py-3"><span class="sr-only">Үйлдэл</span></th>
        </tr>
      </thead>
      <tbody>
        {#each users as user (user.id)}
          <tr class="bg-white border-b hover:bg-gray-50">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              {user.name}
            </th>
            <td class="px-6 py-4">{user.email}</td>
            <td class="px-6 py-4">{user.registrationDate}</td>
            <td class="px-6 py-4">{user.orderCount}</td>
            <td class="px-6 py-4 text-right">
              <a href={`/dashboard/users/${user.id}`} class="font-medium text-primary-blue hover:underline">Түүхийг харах</a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
