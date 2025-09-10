<script lang="ts">
  import UserList from "$lib/components/user-control/UserList.svelte";
  import { createGetUsersQuery } from "$lib/queries/user-queries";
  import { Button } from "$lib/components/ui/button";
  import { Plus, Search, SlidersHorizontal } from "@lucide/svelte";
  import type { UserListData, PaginatedResponse } from "$lib/types/auth";
  import { Pagination } from "$lib/components/ui/pagination";

  let currentPage = 1;
  let page_size = 10;

  $: getUsersQuery = createGetUsersQuery(currentPage, page_size);

  function handlePageChange(page: number) {
    currentPage = page;
  }
</script>

<svelte:head>
  <title>User Management | Qpick</title>
</svelte:head>

<div class="px-6 py-8">
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Хэрэглэгчийн удирдлага
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        Багийн гишүүд болон тэдний эрхийн тохиргоог эндээс удирдах.
      </p>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6 space-y-6">
      <!-- Card structure for content -->
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
          {#if $getUsersQuery.data}
            Бүх хэрэглэгчид <span class="text-gray-500">
              {($getUsersQuery.data as PaginatedResponse<UserListData>).count}</span
            >
          {/if}
        </h2>
        <div class="flex items-center space-x-3">
          <!-- Adjusted spacing -->
          <div class="relative w-72">
            <!-- Wider search input -->
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Хайх"
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-primary-blue focus:border-primary-blue shadow-sm"
            />
            <!-- Added shadow-sm -->
          </div>
          <Button variant="secondary" class="px-4 py-2">
            <!-- Adjusted padding for button -->
            <SlidersHorizontal class="w-5 h-5 mr-2" />
            Шүүлтүүр
          </Button>
          <Button class="px-4 py-2">
            <!-- Adjusted padding for button -->
            <Plus class="w-5 h-5 mr-2" />
            Хэрэглэгч нэмэх
          </Button>
        </div>
      </div>

      {#if $getUsersQuery.isLoading}
        <p class="text-center text-gray-500">Ачаалж байна...</p>
      {:else if $getUsersQuery.isError}
        <p class="text-center text-red-500">
          Алдаа гарлаа: {$getUsersQuery.error.message}
        </p>
      {:else if $getUsersQuery.data}
        <UserList users={($getUsersQuery.data as PaginatedResponse<UserListData>).results} />

        <!-- Pagination component -->
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(($getUsersQuery.data as PaginatedResponse<UserListData>).count / page_size)}
          onPageChange={handlePageChange}
          totalItems={($getUsersQuery.data as PaginatedResponse<UserListData>).count}
          page_size={page_size}
        />
      {/if}
    </div>
  </div>
</div>