<script lang="ts">
  import { Check, X, Clock, Package, Utensils, ShoppingBag, CreditCard, User } from '@lucide/svelte';
  import { Badge } from '$lib/components/ui/badge';
  import type { Order } from '$lib/types/order';
  import { OrderStatus, OrderType } from '$lib/types/order';

  export let orders: Order[];
  export let isLoading: boolean = false;

  // Status display configuration
  const statusConfig = {
    [OrderStatus.PENDING]: { label: 'Хүлээж байна', color: 'yellow', icon: Clock },
    [OrderStatus.PREPARING]: { label: 'Бэлтгэж байна', color: 'blue', icon: Utensils },
    [OrderStatus.IN_BOX]: { label: 'Савнаш', color: 'purple', icon: Package },
    [OrderStatus.DONE]: { label: 'Дууссан', color: 'green', icon: Check },
    [OrderStatus.CANCELLED]: { label: 'Цуцлагдсан', color: 'red', icon: X }
  };

  // Order type display configuration
  const typeConfig = {
    [OrderType.DINE_IN]: { label: 'Суугаад идэх', icon: Utensils },
    [OrderType.TAKE_OUT]: { label: 'Авч явах', icon: ShoppingBag }
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatPrice(price: string): string {
    return new Intl.NumberFormat('mn-MN').format(parseFloat(price)) + '₮';
  }

  function getOrderTotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + (parseFloat(item.unit_price) * item.quantity), 0);
  }

  function getItemsCount(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }
</script>

<div class="bg-white rounded-lg border border-gray-200">
  <!-- Table Header -->
  <div class="border-b border-gray-200 bg-gray-50 px-6 py-3">
    <h3 class="text-lg font-semibold text-gray-800">Захиалгын тайлан</h3>
  </div>

  {#if isLoading}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
      <span class="ml-3 text-gray-600">Ачааллаж байна...</span>
    </div>
  {:else if orders.length === 0}
    <div class="text-center py-12">
      <Package class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500 text-lg">Захиалга олдсонгүй</p>
      <p class="text-gray-400 text-sm">Шүүлтүүрийг өөрчилж дахин оролдоно уу</p>
    </div>
  {:else}
    <!-- Table Content -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Захиалга
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Үйлчлүүлэгч
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Төлөв
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Төрөл
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Зүйлийн тоо
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Нийт дүн
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Огноо
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each orders as order (order.id)}
            <tr class="hover:bg-gray-50 transition-colors">
              <!-- Order Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-primary-blue/10 flex items-center justify-center">
                      <Package class="h-5 w-5 text-primary-blue" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">#{order.id}</div>
                    <div class="text-sm text-gray-500">Ресторан #{order.restaurant}</div>
                  </div>
                </div>
              </td>

              <!-- Customer -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User class="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">
                      Хэрэглэгч #{order.user}
                    </div>
                    <div class="text-sm text-gray-500">ID: {order.user}</div>
                  </div>
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                {#if statusConfig[order.order_status]}
                  {@const config = statusConfig[order.order_status]}
                  <Badge variant={config.color} class="flex items-center gap-1 w-fit">
                    <svelte:component this={config.icon} class="h-3 w-3" />
                    {config.label}
                  </Badge>
                {/if}
              </td>

              <!-- Type -->
              <td class="px-6 py-4 whitespace-nowrap">
                {#if typeConfig[order.order_type]}
                  {@const config = typeConfig[order.order_type]}
                  <div class="flex items-center gap-2 text-sm text-gray-700">
                    <svelte:component this={config.icon} class="h-4 w-4" />
                    {config.label}
                  </div>
                {/if}
                {#if order.table}
                  <div class="text-xs text-gray-500">Ширээ #{order.table.table_number}</div>
                {:else if order.box}
                  <div class="text-xs text-gray-500">Савлах #{order.box.box_number}</div>
                {/if}
              </td>

              <!-- Items Count -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center gap-1">
                  <Package class="h-4 w-4 text-gray-400" />
                  {getItemsCount(order)} зүйл
                </div>
              </td>

              <!-- Total Amount -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {formatPrice(order.total_price)}
                </div>
                {#if order.payments && order.payments.length > 0}
                  <div class="flex items-center gap-1 text-xs text-gray-500">
                    <CreditCard class="h-3 w-3" />
                    {order.payments[0].status === 'COMPLETED' ? 'Төлөгдсөн' : 'Төлөгдөөгүй'}
                  </div>
                {/if}
              </td>

              <!-- Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(order.created_at)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>