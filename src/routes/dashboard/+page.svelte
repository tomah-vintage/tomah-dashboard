<script lang="ts">
  import type { DashboardHeaderCardData, SalesChartData, OrderItem, RestaurantPerformanceData, UserActivity } from "$lib/types/dashboard";
  import { DashboardHeaderCard, SalesChart, OrderList, RestaurantPerformanceChart, UserActivityList } from "$lib/components/dashboard";

  // Mock Data for DashboardHeaderCard
  const headerCards: DashboardHeaderCardData[] = [
    {
      title: "Өнөөдөр Борлуулалт",
      value: 5000000,
      percentageChange: 36,
      isPositive: true,
      icon: "Box",
    },
    {
      title: "7 хоногийн борлуулалт",
      value: 10000000,
      percentageChange: 14,
      isPositive: false,
      icon: "History",
    },
    {
      title: "Үйлчлүүлэгчийн тоо",
      value: 100000,
      percentageChange: 36,
      isPositive: true,
      icon: "Users",
    },
  ];

  // Mock Data for SalesChart
  const salesChartData: SalesChartData = {
    labels: ["2cap", "3cap", "4cap", "5cap", "6cap", "7cap", "8cap", "9cap", "10cap", "11cap", "12cap", "1cap"],
    datasets: [
      {
        label: "Борлуулалт",
        data: [10000000, 12000000, 15000000, 13000000, 20000000, 18000000, 22000000, 25000000, 23000000, 27000000, 26000000, 28000000],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Mock Data for OrderList
  const orderItems: OrderItem[] = [
    {
      id: 1,
      name: "Pizza hut 1",
      restaurant: "Баянзүрх дүүрэг 19 хороо",
      orderCount: 32,
      imageUrl: "/guide/pictures/new-menu-item.png", // Placeholder image
    },
    {
      id: 2,
      name: "Pizza Hut 2",
      restaurant: "Баянзүрх дүүрэг 19 хороо",
      orderCount: 30,
      imageUrl: "/guide/pictures/new-menu-item.png", // Placeholder image
    },
    {
      id: 3,
      name: "Pizza hut 3",
      restaurant: "Баянзүрх дүүрэг 19 хороо",
      orderCount: 40,
      imageUrl: "/guide/pictures/new-menu-item.png", // Placeholder image
    },
  ];

  // Mock Data for RestaurantPerformanceChart
  const restaurantPerformanceData: RestaurantPerformanceData[] = [
    { name: "Pizza hut 1", percentage: 22, color: "#4CAF50" },
    { name: "Pizza hut 2", percentage: 28, color: "#FFC107" },
    { name: "Pizza hut 3", percentage: 25, color: "#FF5722" },
    { name: "Pizza hut 4", percentage: 16, color: "#2196F3" },
    { name: "Pizza hut 5", percentage: 9, color: "#9C27B0" },
  ];

  // Mock Data for UserActivityList
  const userActivities: UserActivity[] = [
    {
      id: 1,
      name: "Алтанцэцэг",
      email: "Altaa2233@gmail.com",
      restaurant: "Pizza hut 1",
      activityCount: 20,
      location: "Чингэлтэй",
      avatarUrl: "/guide/pictures/new-restaurant.png", // Placeholder image
    },
    {
      id: 2,
      name: "Ганболд",
      email: "Ganbold3344@gmail.com",
      restaurant: "Pizza hut 2",
      activityCount: 20,
      location: "Сонгинохайран",
      avatarUrl: "/guide/pictures/new-restaurant.png", // Placeholder image
    },
    {
      id: 3,
      name: "Гэрэлээ",
      email: "Gerelee.8899@gmail.com",
      restaurant: "Pizza hut 3",
      activityCount: 20,
      location: "Хан-уул",
      avatarUrl: "/guide/pictures/new-restaurant.png", // Placeholder image
    },
    {
      id: 4,
      name: "Төгөлдөр",
      email: "Tuguldur.33@gmail.com",
      restaurant: "Pizza hut 4",
      activityCount: 20,
      location: "Баянзүрх",
      avatarUrl: "/guide/pictures/new-restaurant.png", // Placeholder image
    },
  ];
</script>

<svelte:head>
  <title>Тойм дэлгэц | Qpick</title>
</svelte:head>

<div class="p-4 sm:p-6 bg-content-background min-h-screen font-sans text-gray-800">
  <h1 class="text-2xl font-bold mb-6">Тойм дэлгэц</h1>

  <!-- Header Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    {#each headerCards as card}
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
      <OrderList orders={orderItems} />
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Restaurant Performance Chart -->
    <div class="lg:col-span-2">
      <RestaurantPerformanceChart data={restaurantPerformanceData} />
    </div>

    <!-- User Activity List -->
    <div>
      <UserActivityList users={userActivities} />
    </div>
  </div>
</div>
