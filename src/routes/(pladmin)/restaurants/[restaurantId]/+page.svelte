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
    <!-- Restaurant Header - Compact -->
    <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <img
            src={restaurant.logo}
            alt={restaurant.name}
            class="w-12 h-12 rounded-lg object-cover"
            on:error={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" fill="%23f3f4f6"/><text x="24" y="28" text-anchor="middle" fill="%236b7280" font-size="10">No Image</text></svg>';
            }}
          />
          <div>
            <h1 class="text-xl font-bold text-gray-900">{restaurant.name}</h1>
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin class="w-3 h-3 text-gray-500" />
              <span class="truncate max-w-md">{restaurant.address}</span>
            </div>
          </div>
        </div>
        {#if restaurant.highlights && restaurant.highlights.length > 0}
          <div class="flex gap-1">
            {#each restaurant.highlights.slice(0, 2) as highlight}
              <Badge variant="outline" class_="text-xs" style="color: {highlight.color}; border-color: {highlight.color};">
                {highlight.display_name}
              </Badge>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Payment & Subscription Focus Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Subscription Info - MAIN FOCUS -->
      <div class="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold flex items-center text-gray-900">
            <CreditCard class="w-7 h-7 mr-3 text-gray-700" />
            Захиалга төлөлтийн мэдээлэл
          </h2>
          <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold {getSubscriptionStatusColor(restaurant.subscription.status)}">
            {getSubscriptionStatusLabel(restaurant.subscription.status)}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Plan Details -->
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Төлөвлөгөөний мэдээлэл</h3>
            <div class="space-y-3">
              <div>
                <p class="text-xs text-gray-600">Төлөвлөгөө</p>
                <p class="text-lg font-bold text-gray-900">{restaurant.subscription.plan.name}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Үнэ</p>
                <p class="text-2xl font-bold text-gray-900">{formatRevenue(restaurant.subscription.plan.price.toString())}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Давтамж</p>
                <p class="text-sm font-medium text-gray-900">{restaurant.subscription.plan.interval === 'monthly' ? 'Сар бүр' : restaurant.subscription.plan.interval}</p>
              </div>
            </div>
          </div>

          <!-- Expiry & Status -->
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Хугацааны мэдээлэл</h3>
            <div class="space-y-3">
              <div>
                <p class="text-xs text-gray-600">Эхлэх огноо</p>
                <p class="text-sm font-medium text-gray-900">{formatDate(restaurant.subscription.start_date)}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Дуусах огноо</p>
                <p class="text-sm font-medium text-gray-900">{formatDate(restaurant.subscription.end_date)}</p>
              </div>
              <div class="flex items-center gap-2 mt-2 p-2 bg-white rounded border border-gray-200">
                {#if restaurant.subscription.is_due_soon}
                  <AlertCircle class="w-5 h-5 text-yellow-600" />
                  <span class="text-sm font-semibold text-yellow-700">Удахгүй дуусах</span>
                {:else if restaurant.subscription.is_expired}
                  <AlertCircle class="w-5 h-5 text-red-600" />
                  <span class="text-sm font-semibold text-red-700">Дууссан</span>
                {:else}
                  <Clock class="w-5 h-5 text-gray-600" />
                  <span class="text-sm font-semibold text-gray-700">{restaurant.subscription.days_until_expiry} өдөр үлдсэн</span>
                {/if}
              </div>
            </div>
          </div>

          <!-- Payment Summary -->
          <div class="md:col-span-2 bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Төлбөрийн хураангуй</h3>
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-white rounded border border-gray-200 p-4 text-center">
                <p class="text-xs text-gray-600 mb-1">Нийт төлөгдсөн</p>
                <p class="text-xl font-bold text-gray-900">{formatRevenue(restaurant.subscription.payment_summary.total_paid.toString())}</p>
              </div>
              <div class="bg-white rounded border border-gray-200 p-4 text-center">
                <p class="text-xs text-gray-600 mb-1">Үлдэгдэл дүн</p>
                <p class="text-xl font-bold" class:text-red-600={restaurant.subscription.payment_summary.outstanding_amount > 0} class:text-gray-900={restaurant.subscription.payment_summary.outstanding_amount === 0}>
                  {formatRevenue(restaurant.subscription.payment_summary.outstanding_amount.toString())}
                </p>
              </div>
              <div class="bg-white rounded border border-gray-200 p-4 text-center">
                <p class="text-xs text-gray-600 mb-1">Хугацаа хэтэрсэн</p>
                <p class="text-xl font-bold" class:text-red-600={restaurant.subscription.payment_summary.overdue_invoices_count > 0} class:text-gray-900={restaurant.subscription.payment_summary.overdue_invoices_count === 0}>
                  {restaurant.subscription.payment_summary.overdue_invoices_count}
                </p>
              </div>
            </div>
          </div>

          <!-- Latest Invoice -->
          <div class="md:col-span-2">
            {#if restaurant.subscription.latest_invoice}
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h3 class="text-sm font-semibold text-gray-900 mb-4">Сүүлийн нэхэмжлэх</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p class="text-xs text-gray-600">Дугаар</p>
                    <p class="text-sm font-mono font-medium text-gray-900">{restaurant.subscription.latest_invoice.invoice_number}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600">Дүн</p>
                    <p class="text-sm font-bold text-gray-900">{formatRevenue(restaurant.subscription.latest_invoice.amount_due.toString())}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600">Төлбөр</p>
                    <p class="text-sm font-bold text-gray-900">{formatRevenue(restaurant.subscription.latest_invoice.amount_paid.toString())}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600">Статус</p>
                    <p class="text-sm font-semibold" class:text-green-600={restaurant.subscription.latest_invoice.status === 'paid'} class:text-red-600={restaurant.subscription.latest_invoice.status !== 'paid'}>
                      {restaurant.subscription.latest_invoice.status === 'paid' ? 'Төлөгдсөн' : 'Төлөгдөөгүй'}
                    </p>
                  </div>
                </div>
              </div>
            {:else}
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-200 text-center">
                <p class="text-sm text-gray-500">Нэхэмжлэх байхгүй</p>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Quick Stats Sidebar -->
      <div class="space-y-4">
        <!-- Total Revenue Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-gray-600">Нийт орлого</p>
            <DollarSign class="w-6 h-6 text-gray-400" />
          </div>
          <p class="text-3xl font-bold text-gray-900">{formatRevenue(restaurant.insights.orders.total_revenue)}</p>
          <p class="text-xs text-gray-500 mt-1">{restaurant.insights.orders.total_orders} захиалга</p>
        </div>

        <!-- Rating Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-gray-600">Дундаж үнэлгээ</p>
            <Star class="w-6 h-6 text-gray-400" />
          </div>
          <p class="text-3xl font-bold text-gray-900">{restaurant.insights.reviews.average_rating.toFixed(1)}</p>
          <p class="text-xs text-gray-500 mt-1">{restaurant.insights.reviews.total_reviews} үнэлгээ</p>
        </div>

        <!-- Menu Items Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-gray-600">Меню зүйл</p>
            <Menu class="w-6 h-6 text-gray-400" />
          </div>
          <p class="text-3xl font-bold text-gray-900">{restaurant.insights.menu_items_count}</p>
          <p class="text-xs text-gray-500 mt-1">{restaurant.insights.tables_count} ширээ</p>
        </div>
      </div>
    </div>

    <!-- Secondary Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Order Analytics -->
      <div class="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-900">Захиалгын дэлгэрэнгүй</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Clock class="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p class="text-2xl font-bold text-gray-900">{restaurant.insights.orders.pending_orders}</p>
            <p class="text-sm text-gray-600">Хүлээгдэж буй</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <ShoppingCart class="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p class="text-2xl font-bold text-gray-900">{restaurant.insights.orders.completed_orders}</p>
            <p class="text-sm text-gray-600">Дууссан</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <TrendingUp class="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p class="text-2xl font-bold text-gray-900">{restaurant.insights.orders.cancelled_orders}</p>
            <p class="text-sm text-gray-600">Цуцлагдсан</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <DollarSign class="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p class="text-xl font-bold text-gray-900">{formatRevenue(restaurant.insights.orders.average_order_value)}</p>
            <p class="text-sm text-gray-600">Дундаж дүн</p>
          </div>
        </div>

      </div>

      <!-- Admin Users & Info -->
      <div class="space-y-6">
        <!-- Admin Users -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
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
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">Рестораны зургууд</h3>
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
