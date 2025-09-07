<div class="p-4 md:p-6 animate-pulse">
  <!-- Restaurant Header Skeleton -->
  <div class="bg-white rounded-lg shadow p-6 mb-8">
    <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
      <!-- Logo skeleton -->
      <div class="w-20 h-20 bg-gray-200 rounded-lg"></div>
      
      <!-- Info skeleton -->
      <div class="flex-1 space-y-3">
        <div class="h-8 bg-gray-200 rounded w-64"></div>
        <div class="space-y-2">
          <div class="h-5 bg-gray-200 rounded w-48"></div>
          <div class="h-5 bg-gray-200 rounded w-56"></div>
        </div>
      </div>
      
      <!-- Rating skeleton -->
      <div class="bg-gray-200 h-16 w-24 rounded-lg"></div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Main Content Skeleton -->
    <div class="lg:col-span-2 space-y-8">
      <!-- Images Gallery Skeleton -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="h-6 bg-gray-200 rounded w-48 mb-6"></div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          {#each Array(6) as _}
            <div class="w-full h-40 bg-gray-200 rounded-lg"></div>
          {/each}
        </div>
      </div>

      <!-- Reviews Section Skeleton -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="h-6 bg-gray-200 rounded w-32 mb-6"></div>
        <div class="space-y-4">
          {#each Array(3) as _}
            <div class="border-b pb-4 space-y-2">
              <div class="flex justify-between">
                <div class="h-4 bg-gray-200 rounded w-24"></div>
                <div class="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div class="flex space-x-1">
                {#each Array(5) as _}
                  <div class="w-4 h-4 bg-gray-200 rounded"></div>
                {/each}
              </div>
              <div class="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Sidebar Skeleton -->
    <div class="space-y-8">
      <!-- Opening Hours Skeleton -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="h-6 bg-gray-200 rounded w-32 mb-6"></div>
        <div class="space-y-3">
          {#each Array(6) as _}
            <div class="flex justify-between py-2">
              <div class="h-4 bg-gray-200 rounded w-16"></div>
              <div class="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Restaurant Info Skeleton -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="h-6 bg-gray-200 rounded w-40 mb-6"></div>
        <div class="space-y-4">
          {#each Array(4) as _}
            <div class="space-y-2">
              <div class="h-3 bg-gray-200 rounded w-20"></div>
              <div class="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>