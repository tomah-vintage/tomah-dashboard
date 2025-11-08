<script lang="ts">
  import RestaurantSettingsFormModern from "./RestaurantSettingsFormModern.svelte";
  import { Info, MapPin, Clock, CreditCard } from "@lucide/svelte";

  export let restaurantId: string;

  let activeSection: string = "basic";

  const sections = [
    { id: "basic", label: "Үндсэn мэдээлэл", icon: Info },
    { id: "location", label: "Байршил", icon: MapPin },
    { id: "hours", label: "Ажлын цаг", icon: Clock },
    { id: "payment", label: "Төлбөрийн тохиргоо", icon: CreditCard },
  ];

  function scrollToSection(sectionId: string) {
    activeSection = sectionId;
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }

  // Update active section on scroll
  function handleScroll() {
    const scrollPosition = window.scrollY + 150;

    for (const section of sections) {
      const element = document.getElementById(`section-${section.id}`);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          activeSection = section.id;
          break;
        }
      }
    }
  }
</script>

<svelte:window on:scroll={handleScroll} />

<div class="max-w-7xl mx-auto">
  <!-- Header Section -->
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6"
  >
    <div
      class="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white"
    >
      <div class="flex items-center">
        <div class="p-3 bg-white/10 rounded-lg mr-4">
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold">Ресторан тохиргоо</h1>
          <p class="text-blue-100 mt-1">
            Рестораны мэдээлэл, байршил болон ажлын цагийг тохируулна уу
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Content with Sidebar -->
  <div class="flex gap-6">
    <!-- Sidebar Navigation -->
    <div class="hidden lg:block w-64 flex-shrink-0">
      <div class="sticky top-20">
        <nav class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 class="text-sm font-semibold text-gray-900 mb-3 px-3">Хэсгүүд</h3>
          <ul class="space-y-1">
            {#each sections as section}
              <li>
                <button
                  on:click={() => scrollToSection(section.id)}
                  class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 {activeSection ===
                  section.id
                    ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600 pl-[10px]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
                >
                  <svelte:component
                    this={section.icon}
                    size={18}
                    class="flex-shrink-0"
                  />
                  <span class="text-left">{section.label}</span>
                </button>
              </li>
            {/each}
          </ul>
        </nav>
      </div>
    </div>

    <!-- Mobile Horizontal Scroll Menu -->
    <div class="lg:hidden w-full mb-6 -mx-4 px-4">
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {#each sections as section}
          <button
            on:click={() => scrollToSection(section.id)}
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 {activeSection ===
            section.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}"
          >
            <svelte:component this={section.icon} size={16} />
            <span>{section.label}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 min-w-0">
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="p-6 lg:p-8">
          <RestaurantSettingsFormModern {restaurantId} />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
