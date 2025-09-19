<script lang="ts">
  import { ArrowRightLeft, Filter, Download, RefreshCw } from '@lucide/svelte';
  import { Input } from '$lib/components/ui/input';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { OrderStatus, OrderType, DateRange, type OrderFilters } from '$lib/types/order';

  export let filters: OrderFilters;
  export let onApplyFilters: (filters: OrderFilters) => void;
  export let onExport: () => void;
  export let onReset: () => void;

  let showAdvancedFilters = false;

  // Date range options with Mongolian labels
  const dateRangeOptions = [
    { value: DateRange.TODAY, label: 'Өнөөдөр' },
    { value: DateRange.YESTERDAY, label: 'Өчигдөр' },
    { value: DateRange.LAST_7_DAYS, label: 'Сүүлийн 7 хоног' },
    { value: DateRange.LAST_30_DAYS, label: 'Сүүлийн 30 хоног' },
    { value: DateRange.THIS_WEEK, label: 'Энэ долоо хоног' },
    { value: DateRange.THIS_MONTH, label: 'Энэ сар' },
    { value: DateRange.LAST_WEEK, label: 'Өнгөрсөн долоо хоног' },
    { value: DateRange.LAST_MONTH, label: 'Өнгөрсөн сар' }
  ];

  // Order status options with Mongolian labels
  const orderStatusOptions = [
    { value: OrderStatus.PENDING, label: 'Хүлээж байна' },
    { value: OrderStatus.PREPARING, label: 'Бэлтгэж байна' },
    { value: OrderStatus.IN_BOX, label: 'Савнаш' },
    { value: OrderStatus.DONE, label: 'Дууссан' },
    { value: OrderStatus.CANCELLED, label: 'Цуцлагдсан' }
  ];

  // Order type options with Mongolian labels
  const orderTypeOptions = [
    { value: OrderType.DINE_IN, label: 'Суугаад идэх' },
    { value: OrderType.TAKE_OUT, label: 'Авч явах' }
  ];

  function handleApplyFilters() {
    onApplyFilters(filters);
  }

  function handleReset() {
    filters = {};
    onReset();
  }

  function toggleAdvancedFilters() {
    showAdvancedFilters = !showAdvancedFilters;
  }

  // Handle date range selection
  function handleDateRangeChange(value: string) {
    if (value) {
      filters.date_range = value as DateRange;
      // Clear manual date range when predefined range is selected
      delete filters.created_at__gte;
      delete filters.created_at__lte;
    } else {
      delete filters.date_range;
    }
    handleApplyFilters();
  }

  // Handle manual date range
  function handleManualDateChange() {
    if (filters.created_at__gte || filters.created_at__lte) {
      // Clear predefined date range when manual dates are set
      delete filters.date_range;
    }
    handleApplyFilters();
  }
</script>

<div class="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
  <!-- Quick Filters Row -->
  <div class="flex flex-wrap items-center justify-between gap-4">
    <!-- Predefined Date Range Buttons -->
    <div class="flex items-center border border-gray-200 rounded-lg p-1 flex-wrap gap-1">
      <button 
        class="px-3 py-1 rounded-md text-sm transition-colors {!filters.date_range ? 'bg-primary-blue text-white' : 'hover:bg-gray-100'}" 
        on:click={() => handleDateRangeChange('')}
      >
        Бүгд
      </button>
      {#each dateRangeOptions as option}
        <button 
          class="px-3 py-1 rounded-md text-sm whitespace-nowrap transition-colors {filters.date_range === option.value ? 'bg-primary-blue text-white' : 'hover:bg-gray-100'}" 
          on:click={() => handleDateRangeChange(option.value)}
        >
          {option.label}
        </button>
      {/each}
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm" on:click={toggleAdvancedFilters} class="flex items-center gap-2">
        <Filter class="h-4 w-4" />
        Нэмэлт шүүлтүүр
      </Button>
      <Button variant="outline" size="sm" on:click={onExport} class="flex items-center gap-2">
        <Download class="h-4 w-4" />
        Татаж авах
      </Button>
      <Button variant="outline" size="sm" on:click={handleReset} class="flex items-center gap-2">
        <RefreshCw class="h-4 w-4" />
        Цэвэрлэх
      </Button>
    </div>
  </div>

  <!-- Advanced Filters -->
  {#if showAdvancedFilters}
    <div class="border-t border-gray-200 pt-4 space-y-4">
      <!-- First Row: Status and Type -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Захиалгын төлөв</label>
          <Select value={filters.order_status} onValueChange={(value) => { filters.order_status = value as OrderStatus; handleApplyFilters(); }}>
            <SelectTrigger>
              <SelectValue placeholder="Төлөв сонгох" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Бүгд</SelectItem>
              {#each orderStatusOptions as option}
                <SelectItem value={option.value}>{option.label}</SelectItem>
              {/each}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Захиалгын төрөл</label>
          <Select value={filters.order_type} onValueChange={(value) => { filters.order_type = value as OrderType; handleApplyFilters(); }}>
            <SelectTrigger>
              <SelectValue placeholder="Төрөл сонгох" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Бүгд</SelectItem>
              {#each orderTypeOptions as option}
                <SelectItem value={option.value}>{option.label}</SelectItem>
              {/each}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Хэрэглэгчийн ID</label>
          <Input 
            type="text" 
            placeholder="Хэрэглэгчийн ID" 
            bind:value={filters.user}
            on:blur={handleApplyFilters}
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Хайх</label>
          <Input 
            type="text" 
            placeholder="Хайх үгс..." 
            bind:value={filters.search}
            on:input={handleApplyFilters}
          />
        </div>
      </div>

      <!-- Second Row: Custom Date Range -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Эхлэх огноо</label>
          <div class="flex items-center gap-2">
            <Input 
              type="date" 
              bind:value={filters.created_at__gte}
              on:change={handleManualDateChange}
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Дуусах огноо</label>
          <div class="flex items-center gap-2">
            <ArrowRightLeft class="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Input 
              type="date" 
              bind:value={filters.created_at__lte}
              on:change={handleManualDateChange}
            />
          </div>
        </div>
      </div>

      <!-- Filter Summary -->
      <div class="bg-gray-50 rounded-lg p-3">
        <p class="text-sm text-gray-600">
          <strong>Идэвхтэй шүүлтүүр:</strong>
          {#if filters.date_range}
            {dateRangeOptions.find(o => o.value === filters.date_range)?.label}
          {:else if filters.created_at__gte || filters.created_at__lte}
            Тусгай огнооны хязгаар
          {:else}
            Огнооны шүүлтүүр байхгүй
          {/if}
          {#if filters.order_status}, Төлөв: {orderStatusOptions.find(o => o.value === filters.order_status)?.label}{/if}
          {#if filters.order_type}, Төрөл: {orderTypeOptions.find(o => o.value === filters.order_type)?.label}{/if}
          {#if filters.user}, Хэрэглэгч: {filters.user}{/if}
          {#if filters.search}, Хайх: "{filters.search}"{/if}
        </p>
      </div>
    </div>
  {/if}
</div>