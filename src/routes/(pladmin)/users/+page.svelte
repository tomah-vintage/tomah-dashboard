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
  <title>Хэрэглэгчийн удирдлага | Tomah</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6">
        <h1 class="text-3xl font-bold text-gray-900">Хэрэглэгчийн удирдлага</h1>
        <p class="mt-1 text-sm text-gray-500">Багийн гишүүд болон тэдний эрхийн тохиргоог эндээс удирдах</p>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900">
          {#if $getUsersQuery.data}
            Бүх хэрэглэгчид <span class="text-gray-500">
              {($getUsersQuery.data as PaginatedResponse<UserListData>).count}</span
            >
          {/if}
        </h2>
        <div class="flex items-center space-x-3">
          <div class="relative w-72">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Хайх"
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
          <Button variant="secondary" class="px-4 py-2">
            <SlidersHorizontal class="w-5 h-5 mr-2" />
            Шүүлтүүр
          </Button>
          <Button class="px-4 py-2">
            <Plus class="w-5 h-5 mr-2" />
            Хэрэглэгч нэмэх
          </Button>
        </div>
      </div>

      {#if $getUsersQuery.isLoading}
        <p class="text-center text-gray-500">Ачаалж байна...</p>
      {:else if $getUsersQuery.isError}
        <p class="text-center text-red-600">
          Алдаа гарлаа: {$getUsersQuery.error.message}
        </p>
      {:else if $getUsersQuery.data}
        <UserList users={($getUsersQuery.data as PaginatedResponse<UserListData>).results} />

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