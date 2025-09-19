<script lang="ts">
  import { X } from "@lucide/svelte";
  import type { OrderItem, UserActivity } from "$lib/types/dashboard";

  export let isOpen: boolean;
  export let onClose: () => void;
  export let title: string;
  export let type: 'orders' | 'customers';
  export let orders: OrderItem[] = [];
  export let customers: UserActivity[] = [];
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    style="background-color: rgba(0, 0, 0, 0.5);"
    on:click={onClose}
  >
    <div
      class="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      on:click|stopPropagation
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800">{title}</h2>
        <button
          class="text-gray-400 hover:text-gray-600 transition-colors"
          on:click={onClose}
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        {#if type === 'orders'}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each orders as order (order.id)}
              <div class="bg-gray-50 rounded-lg p-4 flex items-center space-x-4">
                <img
                  src={order.imageUrl}
                  alt={order.name}
                  class="w-16 h-16 rounded-md object-cover flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-800 truncate">{order.name}</h3>
                  <p class="text-gray-500 text-sm truncate">{order.restaurant}</p>
                  <div class="mt-1">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {order.orderCount} захиалга
                    </span>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {:else if type === 'customers'}
          <div class="space-y-4">
            {#each customers as customer (customer.id)}
              <div class="bg-gray-50 rounded-lg p-4 flex items-center space-x-4">
                <img
                  src={customer.avatarUrl}
                  alt={customer.name}
                  class="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-800">{customer.name}</h3>
                  <p class="text-gray-500 text-sm">{customer.email}</p>
                  <p class="text-gray-500 text-sm">{customer.restaurant}</p>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="font-bold text-gray-800">{customer.activityCount} удаа</p>
                  <p class="text-gray-500 text-sm">{customer.location}</p>
                </div>
              </div>
            {/each}
          </div>
        {/if}

        {#if (type === 'orders' && orders.length === 0) || (type === 'customers' && customers.length === 0)}
          <div class="text-center py-12">
            <p class="text-gray-500 text-lg">Өгөгдөл байхгүй</p>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-500">
            {#if type === 'orders'}
              Нийт: {orders.length} зүйл
            {:else}
              Нийт: {customers.length} үйлчлүүлэгч
            {/if}
          </p>
          <button
            on:click={onClose}
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Хаах
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}