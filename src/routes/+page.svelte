<script lang="ts">
  import type { DashboardHeaderCardData, SalesChartData, OrderItem, RestaurantPerformanceData, UserActivity } from "$lib/types/dashboard";
  import { DashboardHeaderCard, SalesChart, OrderList, RestaurantPerformanceChart, UserActivityList, DataModal } from "$lib/components/dashboard";
  import { createGetInsightsQuery } from "$lib/queries/insights-queries";
  import type { RestaurantInsights, PlatformInsights } from "$lib/types/insights";
  import { sessionStore } from "$lib/stores/sessionStore";

  // Fetch insights data with 30 days default
  const insightsQuery = createGetInsightsQuery({ days: 30 });

  // Reactive data based on insights
  $: insights = $insightsQuery.data as RestaurantInsights | PlatformInsights | undefined;
  $: isAdmin = $sessionStore.user?.role_name === "admin";

  // Modal state management
  let isOrdersModalOpen = false;
  let isCustomersModalOpen = false;

  function openOrdersModal() {
    isOrdersModalOpen = true;
  }

  function closeOrdersModal() {
    isOrdersModalOpen = false;
  }

  function openCustomersModal() {
    isCustomersModalOpen = true;
  }

  function closeCustomersModal() {
    isCustomersModalOpen = false;
  }
  
  $: headerCards = getHeaderCards(insights);
  
  function getHeaderCards(insights: RestaurantInsights | PlatformInsights | undefined): DashboardHeaderCardData[] {
    if (!insights) {
      return [
        {
          title: "Нийт орлого",
          value: 0,
          percentageChange: 0,
          isPositive: true,
          icon: "DollarSign",
        },
        {
          title: "Нийт захиалга",
          value: 0,
          percentageChange: 0,
          isPositive: true,
          icon: "ShoppingCart",
        },
        {
          title: "Дундаж захиалгын үнэ",
          value: 0,
          percentageChange: 0,
          isPositive: true,
          icon: "TrendingUp",
        },
      ];
    }

    const orderInsights = 'platform_order_insights' in insights 
      ? insights.platform_order_insights 
      : insights.order_insights;

    return [
      {
        title: "Нийт орлого",
        value: orderInsights.total_revenue,
        percentageChange: orderInsights.revenue_growth_percentage,
        isPositive: orderInsights.revenue_growth_percentage >= 0,
        icon: "DollarSign",
      },
      {
        title: "Нийт захиалга",
        value: orderInsights.total_orders,
        percentageChange: orderInsights.order_growth_percentage,
        isPositive: orderInsights.order_growth_percentage >= 0,
        icon: "ShoppingCart",
      },
      {
        title: "Дундаж захиалгын үнэ",
        value: Math.round(orderInsights.average_order_value),
        percentageChange: orderInsights.customer_growth_percentage,
        isPositive: orderInsights.customer_growth_percentage >= 0,
        icon: "TrendingUp",
      },
    ];
  }

  $: salesChartData = getSalesChartData(insights);
  
  function getSalesChartData(insights: RestaurantInsights | PlatformInsights | undefined): SalesChartData {
    if (!insights || !insights.time_series_data || insights.time_series_data.length === 0) {
      return {
        labels: ["Өгөгдөл байхгүй"],
        datasets: [
          {
            label: "Борлуулалт",
            data: [0],
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            fill: false,
            tension: 0.1,
          },
        ],
      };
    }

    const sortedData = insights.time_series_data.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      labels: sortedData.map(item => {
        const date = new Date(item.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          label: "Борлуулалт",
          data: sortedData.map(item => item.revenue),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          fill: false,
          tension: 0.1,
        },
      ],
    };
  }

  $: orderItems = getOrderItems(insights);
  
  function getOrderItems(insights: RestaurantInsights | PlatformInsights | undefined): OrderItem[] {
    if (!insights || !insights.top_menu_items || insights.top_menu_items.length === 0) {
      return [];
    }

    return insights.top_menu_items.map((item, index) => ({
      id: index + 1,
      name: item.item_name,
      restaurant: item.restaurant_name,
      orderCount: item.total_orders,
      imageUrl: item.item_image || "/guide/pictures/new-menu-item.png",
    }));
  }

  $: restaurantPerformanceData = getRestaurantPerformanceData(insights);
  
  function getRestaurantPerformanceData(insights: RestaurantInsights | PlatformInsights | undefined): RestaurantPerformanceData[] {
    if (!insights || !('restaurant_rankings' in insights) || !insights.restaurant_rankings || insights.restaurant_rankings.length === 0) {
      return [];
    }

    const colors = ["#4CAF50", "#FFC107", "#FF5722", "#2196F3", "#9C27B0", "#FF9800", "#795548", "#607D8B"];

    return insights.restaurant_rankings.slice(0, 8).map((restaurant, index) => ({
      name: restaurant.restaurant_name,
      percentage: Math.round(restaurant.revenue_percentage),
      color: colors[index % colors.length],
    }));
  }

  $: userActivities = getUserActivities(insights);
  
  function getUserActivities(insights: RestaurantInsights | PlatformInsights | undefined): UserActivity[] {
    if (!insights || !insights.top_customers || insights.top_customers.length === 0) {
      return [];
    }

    return insights.top_customers.map((customer) => ({
      id: customer.user_id,
      name: customer.name,
      email: customer.email,
      restaurant: customer.favorite_restaurant,
      activityCount: customer.total_orders,
      location: "Улаанбаатар", // Default location since not provided by API
      avatarUrl: customer.avatar || "https://via.placeholder.com/150x150/cccccc/666666?text=Avatar",
    }));
  }
</script>

<svelte:head>
  <title>Тойм дэлгэц | Qpick</title>
</svelte:head>

<div class="p-4 sm:p-6 bg-content-background min-h-screen font-sans text-gray-800">
  <h1 class="text-2xl font-bold mb-6">Тойм дэлгэц</h1>

  {#if $insightsQuery.isLoading}
    <div class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  {:else if $insightsQuery.error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      <strong>Алдаа гарлаа:</strong> {$insightsQuery.error.message}
    </div>
  {:else}

  <!-- Header Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    {#each headerCards as card (card.title)}
      <DashboardHeaderCard data={card} />
    {/each}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
    <!-- Sales Chart -->
    <div class="lg:col-span-2">
      <SalesChart data={salesChartData} />
    </div>

    <!-- Order List -->
    <div>
      <OrderList orders={orderItems.slice(0, 3)} onShowAll={openOrdersModal} />
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {#if isAdmin}
      <!-- Restaurant Performance Chart - Admin only -->
      <div class="lg:col-span-2">
        <RestaurantPerformanceChart data={restaurantPerformanceData} />
      </div>

      <!-- User Activity List -->
      <div>
        <UserActivityList users={userActivities.slice(0, 4)} onShowAll={openCustomersModal} />
      </div>
    {:else}
      <!-- User Activity List - Full width for restaurant users -->
      <div class="lg:col-span-3">
        <UserActivityList users={userActivities.slice(0, 4)} onShowAll={openCustomersModal} />
      </div>
    {/if}
  </div>

  {/if}
</div>

<!-- Modals -->
<DataModal
  isOpen={isOrdersModalOpen}
  onClose={closeOrdersModal}
  title="Бүх захиалгын тоо"
  type="orders"
  orders={orderItems}
/>

<DataModal
  isOpen={isCustomersModalOpen}
  onClose={closeCustomersModal}
  title="Бүх үйлчлүүлэгчид"
  type="customers"
  customers={userActivities}
/>
