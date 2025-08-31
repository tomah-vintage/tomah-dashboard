<script lang="ts">
  import type { UserListData } from "$lib/types/auth";
  import { MoreHorizontal } from "lucide-svelte";

  export let users: UserListData[];

  const getRoleClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "restaurant":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };


</script>

<div class="overflow-x-auto">
  <table class="min-w-full text-sm text-left text-gray-500">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th scope="col" class="p-4">
          <div class="flex items-center">
            <input
              id="checkbox-all"
              type="checkbox"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="checkbox-all" class="sr-only">checkbox</label>
          </div>
        </th>
        <th scope="col" class="px-6 py-3">Хэрэглэгч</th>
        <th scope="col" class="px-6 py-3">Хандах эрх</th>
        <th scope="col" class="px-6 py-3">Сүүлд идэвхтэй байсан</th>
        <th scope="col" class="px-6 py-3">Нэмэгдсэн огноо</th>
        <th scope="col" class="px-6 py-3"></th>
        <!-- Empty for ellipsis menu -->
      </tr>
    </thead>
    <tbody>
      {#each users as user (user.id)}
        <tr class="bg-white border-b hover:bg-gray-50">
          <td class="w-4 p-4">
            <div class="flex items-center">
              <input
                id="checkbox-{user.id}"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="checkbox-{user.id}" class="sr-only">checkbox</label>
            </div>
          </td>
          <th
            scope="row"
            class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
          >
            <!-- Profile picture/initials placeholder -->
            <div
              class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3"
            >
              <span class="font-semibold text-gray-500"
                >{user.first_name[0]}{user.last_name[0]}</span
              >
            </div>
            <div>
              <div class="text-base font-semibold">
                {user.first_name}
                {user.last_name}
              </div>
              <div class="font-normal text-gray-500">
                {user.email}
              </div>
            </div>
          </th>
          <td class="px-6 py-4">
            <span
              class="px-2 py-1 font-semibold leading-tight rounded-full text-xs {getRoleClass(
                user.role.name
              )}"
            >
              {user.role.name}
            </span>
          </td>
          <td class="px-6 py-4">
            {user.last_login ? formatDate(user.last_login) : "N/A"}
          </td>
          <td class="px-6 py-4">
            {formatDate(user.created_at)}
          </td>
          <td class="px-6 py-4 text-right">
            <button class="text-gray-500 hover:text-gray-700">
              <MoreHorizontal class="w-5 h-5" />
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- Pagination -->
<nav
  class="flex items-center justify-between pt-4"
  aria-label="Table navigation"
>
  <span class="text-sm font-normal text-gray-500 dark:text-gray-400"
    >Харуулж байна <span class="font-semibold text-gray-900 dark:text-white"
      >1-10</span
    >
    нийт
    <span class="font-semibold text-gray-900 dark:text-white">1000</span></span
  >
  <ul class="inline-flex -space-x-px text-sm h-8">
    <li>
      <button
        type="button"
        class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >Өмнөх</button
      >
    </li>
    <li>
      <button
        type="button"
        aria-current="page"
        class="flex items-center justify-center px-3 h-8 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
        >1</button
      >
    </li>
    <li>
      <button
        type="button"
        class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >2</button
      >
    </li>
    <li>
      <button
        type="button"
        class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >3</button
      >
    </li>
    <li>
      <button
        type="button"
        class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >Дараах</button
      >
    </li>
  </ul>
</nav>
