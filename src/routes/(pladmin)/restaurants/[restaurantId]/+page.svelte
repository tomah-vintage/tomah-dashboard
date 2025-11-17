<script lang="ts">
  import {
    createGetAdminRestaurantDetailQuery,
    createAddUserToRestaurantMutation,
    createRemoveUserFromRestaurantMutation,
    createActivateSubscriptionMutation,
    createDeactivateSubscriptionMutation,
  } from "$lib/queries/restaurant-queries";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { ArrowLeft } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import type { AddUserToRestaurantData } from "$lib/types/restaurant";
  import {
    RestaurantDetailHeader,
    QuickStatsSidebar,
    SubscriptionInfo,
    AdminUsersSection,
    OrderAnalytics,
    SubscriptionActionModal,
  } from "$lib/components/restaurant-detail";
  import CircularLoader from "$lib/components/ui/CircularLoader.svelte";

  $: restaurantId = $page.params.restaurantId;
  $: restaurantQuery = createGetAdminRestaurantDetailQuery(restaurantId);
  $: ({ data: restaurant, isLoading, isError, error } = $restaurantQuery);

  // User management mutations
  const addUserMutation = createAddUserToRestaurantMutation();
  const removeUserMutation = createRemoveUserFromRestaurantMutation();

  // Subscription management mutations
  const activateSubscriptionMutation = createActivateSubscriptionMutation();
  const deactivateSubscriptionMutation = createDeactivateSubscriptionMutation();

  // Add user form state
  let showAddUserForm = false;
  let addUserData: AddUserToRestaurantData = {
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
    role: 3, // Default role for restaurant admin
  };

  // Subscription action confirmation modal state
  let showSubscriptionModal = false;
  let subscriptionAction: "activate" | "deactivate" | null = null;

  function handleAddUser() {
    if (!restaurantId) return;

    $addUserMutation.mutate(
      { restaurantId, userData: addUserData },
      {
        onSuccess: () => {
          resetAddUserForm();
        },
        onError: (error) => {
          console.error("Хэрэглэгч нэмэхэд алдаа гарлаа:", error);
        },
      },
    );
  }

  function handleRemoveUser(userId: number) {
    if (!restaurantId) return;

    if (confirm("Энэ хэрэглэгчийг устгахдаа итгэлтэй байна уу?")) {
      $removeUserMutation.mutate(
        { restaurantId, userId },
        {
          onError: (error) => {
            console.error("Хэрэглэгч устгахад алдаа гарлаа:", error);
          },
        },
      );
    }
  }

  function resetAddUserForm() {
    addUserData = {
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      password: "",
      role: 3,
    };
    showAddUserForm = false;
  }

  function handleGoBack() {
    goto("/restaurants");
  }

  function handleActivateSubscription() {
    subscriptionAction = "activate";
    showSubscriptionModal = true;
  }

  function handleDeactivateSubscription() {
    subscriptionAction = "deactivate";
    showSubscriptionModal = true;
  }

  function confirmSubscriptionAction() {
    if (!restaurant?.subscription?.id || !restaurantId || !subscriptionAction)
      return;

    if (subscriptionAction === "activate") {
      $activateSubscriptionMutation.mutate(
        { subscriptionId: restaurant.subscription.id, restaurantId },
        {
          onError: (error) => {
            console.error("Захиалгыг идэвхжүүлэхэд алдаа гарлаа:", error);
            alert("Захиалгыг идэвхжүүлэхэд алдаа гарлаа");
          },
          onSuccess: () => {
            showSubscriptionModal = false;
            subscriptionAction = null;
          },
        },
      );
    } else if (subscriptionAction === "deactivate") {
      $deactivateSubscriptionMutation.mutate(
        { subscriptionId: restaurant.subscription.id, restaurantId },
        {
          onError: (error) => {
            console.error("Захиалгыг идэвхгүй болгоход алдаа гарлаа:", error);
            alert("Захиалгыг идэвхгүй болгоход алдаа гарлаа");
          },
          onSuccess: () => {
            showSubscriptionModal = false;
            subscriptionAction = null;
          },
        },
      );
    }
  }

  function cancelSubscriptionAction() {
    showSubscriptionModal = false;
    subscriptionAction = null;
  }
</script>

<svelte:head>
  <title>{restaurant?.name || "Ресторан"} | Админ</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {restaurant?.name || "Ресторан"}
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              Рестораны дэлгэрэнгүй мэдээлэл болон удирдлага
            </p>
          </div>
          <Button
            on:click={handleGoBack}
            variant="secondary"
            size="sm"
            class="flex items-center gap-2"
          >
            <ArrowLeft class="w-4 h-4" />
            Буцах
          </Button>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if isLoading}
      <div class="flex items-center justify-center py-12">
        <CircularLoader size="md" color="blue" />
        <span class="ml-3 text-gray-600">Ачааллаж байна...</span>
      </div>
    {:else if isError}
      <div class="text-center py-10">
        <p class="text-red-600">
          Алдаа гарлаа: {error?.message || "Тодорхойгүй алдаа"}
        </p>
      </div>
    {:else if restaurant}
      <!-- Restaurant Header - Compact -->
      <RestaurantDetailHeader {restaurant} />

      <!-- Payment & Subscription Focus Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Subscription Info - MAIN FOCUS -->
        <SubscriptionInfo
          {restaurant}
          onActivate={handleActivateSubscription}
          onDeactivate={handleDeactivateSubscription}
          {activateSubscriptionMutation}
          {deactivateSubscriptionMutation}
        />

        <!-- Quick Stats Sidebar -->
        <QuickStatsSidebar {restaurant} />
      </div>

      <!-- Secondary Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Order Analytics -->
        <OrderAnalytics {restaurant} />

        <!-- Admin Users & Info -->
        <div class="space-y-6">
          <!-- Admin Users -->
          <AdminUsersSection
            {restaurant}
            bind:showAddUserForm
            bind:addUserData
            onAddUser={handleAddUser}
            onRemoveUser={handleRemoveUser}
            onResetForm={resetAddUserForm}
            {addUserMutation}
            {removeUserMutation}
          />

          <!-- Restaurant Images -->
          {#if restaurant.restaurant_img_urls && restaurant.restaurant_img_urls.length > 0}
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h3 class="text-lg font-semibold mb-4 text-gray-900">
                Рестораны зургууд
              </h3>
              <div class="grid grid-cols-2 gap-2">
                {#each restaurant.restaurant_img_urls.slice(0, 4) as img}
                  <img
                    src={img}
                    alt="Ресторан"
                    class="w-full h-20 object-cover rounded-lg"
                  />
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<!-- Subscription Action Confirmation Modal -->
<SubscriptionActionModal
  bind:open={showSubscriptionModal}
  action={subscriptionAction}
  onConfirm={confirmSubscriptionAction}
  onCancel={cancelSubscriptionAction}
  {activateSubscriptionMutation}
  {deactivateSubscriptionMutation}
/>
