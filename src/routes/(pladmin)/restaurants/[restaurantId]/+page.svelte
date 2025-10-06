<script lang="ts">
  import { 
    createGetAdminRestaurantDetailQuery,
    createAddUserToRestaurantMutation,
    createRemoveUserFromRestaurantMutation
  } from '$lib/queries/restaurant-queries';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { 
    DollarSign, 
    ShoppingCart, 
    Star, 
    Users, 
    TrendingUp, 
    Calendar,
    MapPin,
    Phone,
    Mail,
    Clock,
    Badge as BadgeIcon,
    Table,
    Menu,
    Plus,
    Trash2,
    X,
    ArrowLeft,
    CreditCard,
    Calendar as CalendarIcon,
    AlertCircle
  } from "@lucide/svelte";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import type { AddUserToRestaurantData } from '$lib/types/restaurant';

  $: restaurantId = $page.params.restaurantId;
  $: restaurantQuery = createGetAdminRestaurantDetailQuery(restaurantId);
  $: ({ data: restaurant, isLoading, isError, error } = $restaurantQuery);

  // User management mutations
  const addUserMutation = createAddUserToRestaurantMutation();
  const removeUserMutation = createRemoveUserFromRestaurantMutation();

  // Add user form state
  let showAddUserForm = false;
  let addUserData: AddUserToRestaurantData = {
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    role: 3 // Default role for restaurant admin
  };

  function formatRevenue(revenue: string): string {
    return new Intl.NumberFormat('mn-MN').format(parseFloat(revenue)) + '₮';
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleAddUser() {
    if (!restaurantId) return;
    
    $addUserMutation.mutate(
      { restaurantId, userData: addUserData },
      {
        onSuccess: () => {
          // Reset form
          addUserData = {
            email: '',
            first_name: '',
            last_name: '',
            phone: '',
            password: '',
            role: 3
          };
          showAddUserForm = false;
        },
        onError: (error) => {
          console.error('Failed to add user:', error);
        }
      }
    );
  }

  function handleRemoveUser(userId: number) {
    if (!restaurantId) return;
    
    if (confirm('Энэ хэрэглэгчийг устгахдаа итгэлтэй байна уу?')) {
      $removeUserMutation.mutate(
        { restaurantId, userId },
        {
          onError: (error) => {
            console.error('Failed to remove user:', error);
          }
        }
      );
    }
  }

  function resetAddUserForm() {
    addUserData = {
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      password: '',
      role: 3
    };
    showAddUserForm = false;
  }

  function handleGoBack() {
    goto(`${base}/restaurants`);
  }

  function getSubscriptionStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function getSubscriptionStatusLabel(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Идэвхтэй';
      case 'expired':
        return 'Дууссан';
      case 'canceled':
        return 'Цуцлагдсан';
      case 'trial':
        return 'Туршилт';
      case 'past_due':
        return 'Хэтэрсэн';
      default:
        return status;
    }
  }
</script>

<svelte:head>
  <title>{restaurant?.name || 'Ресторан'} | Admin</title>
</svelte:head>

<div class="p-4 md:p-6 bg-gray-50 min-h-screen">
  <!-- Back Button -->
  <div class="mb-6">
    <Button 
      on:click={handleGoBack} 
      variant="outline" 
      size="sm"
      class="flex items-center gap-2"
    >
      <ArrowLeft class="w-4 h-4" />
      Буцах
    </Button>
  </div>

  {#if isLoading}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span class="ml-3 text-gray-600">Ачааллаж байна...</span>
    </div>
  {:else if isError}
    <div class="text-center py-10">
      <p class="text-red-600">Алдаа гарлаа: {error?.message || 'Тодорхойгүй алдаа'}</p>
    </div>
  {:else if restaurant}
    <!-- Restaurant Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-4">
          <img
            src={restaurant.logo}
            alt={restaurant.name}
            class="w-16 h-16 rounded-lg object-cover"
            on:error={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23f3f4f6"/><text x="32" y="38" text-anchor="middle" fill="%236b7280" font-size="12">No Image</text></svg>';
            }}
          />
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
            <div class="flex items-center space-x-2 mt-2">
              <MapPin class="w-4 h-4 text-gray-500" />
              <span class="text-gray-600">{restaurant.address}</span>
            </div>
            {#if restaurant.highlights && restaurant.highlights.length > 0}
              <div class="flex gap-2 mt-3">
                {#each restaurant.highlights as highlight}
                  <Badge variant="outline" class_="text-xs" style="color: {highlight.color}; border-color: {highlight.color};">
                    {#if highlight.icon}<BadgeIcon class="w-3 h-3 mr-1" />{/if}
                    {highlight.display_name}
                  </Badge>
                {/each}
              </div>
            {/if}
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-500">Үүссэн</p>
          <p class="text-sm font-medium">{formatDate(restaurant.created_at)}</p>
        </div>
      </div>
    </div>

    <!-- Insights Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Total Orders -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Нийт захиалга</p>
            <p class="text-2xl font-bold text-gray-900">{restaurant.insights.orders.total_orders}</p>
          </div>
          <ShoppingCart class="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <!-- Total Revenue -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Нийт орлого</p>
            <p class="text-2xl font-bold text-green-600">{formatRevenue(restaurant.insights.orders.total_revenue)}</p>
          </div>
          <DollarSign class="w-8 h-8 text-green-500" />
        </div>
      </div>

      <!-- Average Rating -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Дундаж үнэлгээ</p>
            <p class="text-2xl font-bold text-yellow-600">{restaurant.insights.reviews.average_rating.toFixed(1)}</p>
            <p class="text-xs text-gray-500">{restaurant.insights.reviews.total_reviews} үнэлгээ</p>
          </div>
          <Star class="w-8 h-8 text-yellow-500" />
        </div>
      </div>

      <!-- Menu Items -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Меню зүйл</p>
            <p class="text-2xl font-bold text-gray-900">{restaurant.insights.menu_items_count}</p>
            <p class="text-xs text-gray-500">{restaurant.insights.tables_count} ширээ</p>
          </div>
          <Menu class="w-8 h-8 text-purple-500" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Order Analytics -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">Захиалгын дэлгэрэнгүй</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-yellow-50 rounded-lg">
            <Clock class="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <p class="text-2xl font-bold text-yellow-600">{restaurant.insights.orders.pending_orders}</p>
            <p class="text-sm text-gray-600">Хүлээгдэж буй</p>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <ShoppingCart class="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p class="text-2xl font-bold text-green-600">{restaurant.insights.orders.completed_orders}</p>
            <p class="text-sm text-gray-600">Дууссан</p>
          </div>
          <div class="text-center p-4 bg-red-50 rounded-lg">
            <TrendingUp class="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p class="text-2xl font-bold text-red-600">{restaurant.insights.orders.cancelled_orders}</p>
            <p class="text-sm text-gray-600">Цуцлагдсан</p>
          </div>
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <DollarSign class="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p class="text-xl font-bold text-blue-600">{formatRevenue(restaurant.insights.orders.average_order_value)}</p>
            <p class="text-sm text-gray-600">Дундаж дүн</p>
          </div>
        </div>

      </div>

      <!-- Admin Users & Info -->
      <div class="space-y-6">
        <!-- Subscription Info -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <CreditCard class="w-5 h-5 mr-2" />
            Захиалга төлөлт
          </h3>
          
          <div class="space-y-4">
            <!-- Subscription Status -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Статус:</span>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getSubscriptionStatusColor(restaurant.subscription.status)}">
                {getSubscriptionStatusLabel(restaurant.subscription.status)}
              </span>
            </div>

            <!-- Plan Info -->
            <div class="border-t pt-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">Төлөвлөгөө:</span>
                <span class="font-medium">{restaurant.subscription.plan.name}</span>
              </div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">Үнэ:</span>
                <span class="font-medium">{formatRevenue(restaurant.subscription.plan.price.toString())}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Давтамж:</span>
                <span class="text-sm">{restaurant.subscription.plan.interval === 'monthly' ? 'Сар бүр' : restaurant.subscription.plan.interval}</span>
              </div>
            </div>

            <!-- Expiry Info -->
            <div class="border-t pt-4">
              <div class="flex items-center gap-2 mb-2">
                <CalendarIcon class="w-4 h-4 text-gray-500" />
                <span class="text-sm text-gray-600">Дуусах хугацаа:</span>
              </div>
              <div class="text-sm font-medium">
                {formatDate(restaurant.subscription.end_date)}
              </div>
              <div class="flex items-center gap-1 mt-1">
                {#if restaurant.subscription.is_due_soon}
                  <AlertCircle class="w-4 h-4 text-yellow-500" />
                  <span class="text-xs text-yellow-600">Удахгүй дуусах</span>
                {:else}
                  <span class="text-xs text-gray-500">{restaurant.subscription.days_until_expiry} өдөр үлдсэн</span>
                {/if}
              </div>
            </div>

            <!-- Payment Summary -->
            <div class="border-t pt-4">
              <h4 class="text-sm font-medium mb-2">Төлбөрийн хураангуй</h4>
              <div class="bg-gray-50 rounded p-3 space-y-2">
                <div class="flex justify-between text-xs">
                  <span>Нийт төлөгдсөн:</span>
                  <span class="font-medium text-green-600">{formatRevenue(restaurant.subscription.payment_summary.total_paid.toString())}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span>Үлдэгдэл дүн:</span>
                  <span class="font-medium" class:text-red-600={restaurant.subscription.payment_summary.outstanding_amount > 0} class:text-gray-600={restaurant.subscription.payment_summary.outstanding_amount === 0}>
                    {formatRevenue(restaurant.subscription.payment_summary.outstanding_amount.toString())}
                  </span>
                </div>
                <div class="flex justify-between text-xs">
                  <span>Хугацаа хэтэрсэн нэхэмжлэх:</span>
                  <span class="font-medium" class:text-red-600={restaurant.subscription.payment_summary.overdue_invoices_count > 0} class:text-gray-600={restaurant.subscription.payment_summary.overdue_invoices_count === 0}>
                    {restaurant.subscription.payment_summary.overdue_invoices_count}
                  </span>
                </div>
              </div>
            </div>

            <!-- Latest Invoice -->
            {#if restaurant.subscription.latest_invoice}
              <div class="border-t pt-4">
                <h4 class="text-sm font-medium mb-2">Сүүлийн нэхэмжлэх</h4>
                <div class="bg-gray-50 rounded p-3 space-y-1">
                  <div class="flex justify-between text-xs">
                    <span>Дугаар:</span>
                    <span class="font-mono">{restaurant.subscription.latest_invoice.invoice_number}</span>
                  </div>
                  <div class="flex justify-between text-xs">
                    <span>Дүн:</span>
                    <span>{formatRevenue(restaurant.subscription.latest_invoice.amount_due.toString())}</span>
                  </div>
                  <div class="flex justify-between text-xs">
                    <span>Статус:</span>
                    <span class="font-medium" class:text-green-600={restaurant.subscription.latest_invoice.status === 'paid'} class:text-red-600={restaurant.subscription.latest_invoice.status !== 'paid'}>
                      {restaurant.subscription.latest_invoice.status === 'paid' ? 'Төлөгдсөн' : 'Төлөгдөөгүй'}
                    </span>
                  </div>
                </div>
              </div>
            {:else}
              <div class="border-t pt-4">
                <h4 class="text-sm font-medium mb-2">Сүүлийн нэхэмжлэх</h4>
                <div class="bg-gray-50 rounded p-3">
                  <span class="text-xs text-gray-500">Нэхэмжлэх байхгүй</span>
                </div>
              </div>
            {/if}
          </div>
        </div>

        <!-- Admin Users -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold flex items-center">
              <Users class="w-5 h-5 mr-2" />
              Админ хэрэглэгчид
            </h3>
            <Button 
              on:click={() => showAddUserForm = true} 
              size="sm" 
              variant="outline"
              class="flex items-center gap-2"
            >
              <Plus class="w-4 h-4" />
              Хэрэглэгч нэмэх
            </Button>
          </div>

          <!-- Add User Form -->
          {#if showAddUserForm}
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-medium">Шинэ хэрэглэгч нэмэх</h4>
                <Button on:click={resetAddUserForm} variant="ghost" size="sm">
                  <X class="w-4 h-4" />
                </Button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  bind:value={addUserData.first_name} 
                  placeholder="Нэр" 
                  required 
                />
                <Input 
                  bind:value={addUserData.last_name} 
                  placeholder="Овог" 
                  required 
                />
                <Input 
                  bind:value={addUserData.email} 
                  type="email" 
                  placeholder="И-мэйл" 
                  required 
                />
                <Input 
                  bind:value={addUserData.phone} 
                  placeholder="Утасны дугаар" 
                  required 
                />
                <Input 
                  bind:value={addUserData.password} 
                  type="password" 
                  placeholder="Нууц үг" 
                  required 
                />
              </div>
              
              <div class="flex gap-2 mt-4">
                <Button 
                  on:click={handleAddUser} 
                  disabled={$addUserMutation.isPending}
                  class="flex items-center gap-2"
                >
                  {#if $addUserMutation.isPending}
                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {:else}
                    <Plus class="w-4 h-4" />
                  {/if}
                  Нэмэх
                </Button>
                <Button on:click={resetAddUserForm} variant="outline">
                  Цуцлах
                </Button>
              </div>
            </div>
          {/if}

          <!-- User List -->
          <div class="space-y-3">
            {#each restaurant.admin_users as user}
              <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                </div>
                <div class="flex-1">
                  <p class="font-medium">{user.first_name} {user.last_name}</p>
                  <p class="text-sm text-gray-600">{user.email}</p>
                  <p class="text-xs text-gray-500">{user.phone}</p>
                  <div class="flex items-center mt-1">
                    <div class="w-2 h-2 rounded-full mr-2" 
                         class:bg-green-500={user.is_active}
                         class:bg-red-500={!user.is_active}>
                    </div>
                    <span class="text-xs text-gray-500">
                      {user.is_active ? 'Идэвхтэй' : 'Идэвхгүй'}
                    </span>
                  </div>
                </div>
                <Button 
                  on:click={() => handleRemoveUser(user.id)}
                  variant="ghost" 
                  size="sm"
                  disabled={$removeUserMutation.isPending}
                  class="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {#if $removeUserMutation.isPending}
                    <div class="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  {:else}
                    <Trash2 class="w-4 h-4" />
                  {/if}
                </Button>
              </div>
            {/each}
          </div>
        </div>

        <!-- Restaurant Images -->
        {#if restaurant.restaurant_img_urls && restaurant.restaurant_img_urls.length > 0}
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">Рестораны зургууд</h3>
            <div class="grid grid-cols-2 gap-2">
              {#each restaurant.restaurant_img_urls.slice(0, 4) as img}
                <img src={img} alt="Restaurant" class="w-full h-20 object-cover rounded-lg" />
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
