<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "$lib/components/ui/select";
  import { RefreshCcw } from "@lucide/svelte";
  import { OrderStatus, OrderType } from "$lib/types/order";
  import { getStatusLabel, getOrderTypeLabel, getDateRangeLabel } from "$lib/utils/orders";

  export let user: string = "";
  export let phone: string = "";
  export let selectedStatus: string = "";
  export let selectedOrderType: string = "";
  export let selectedDateRange: string = "";
  export let isLoading: boolean = false;
  export let onApplyFilters: () => void;
  export let onResetFilters: () => void;
  export let onRefresh: () => void;
</script>

<div class="bg-white border-b border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div class="flex flex-wrap gap-4 items-center">
      <Input bind:value={phone} placeholder="Утасны дугаараар хайх..." class="w-52" />

      <Select bind:value={selectedStatus}>
        <SelectTrigger class_="w-48">
          <SelectValue placeholder="Төлөвөөр шүүх">
            {selectedStatus ? getStatusLabel(selectedStatus as OrderStatus) : ""}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Бүх төлөв</SelectItem>
          <SelectItem value={OrderStatus.PENDING}>Хүлээгдэж буй</SelectItem>
          <SelectItem value={OrderStatus.PREPARING}>Бэлтгэж байна</SelectItem>
          <SelectItem value={OrderStatus.IN_BOX}>Хайрцагт орсон</SelectItem>
          <SelectItem value={OrderStatus.DONE}>Дууссан</SelectItem>
          <SelectItem value={OrderStatus.CANCELLED}>Цуцлагдсан</SelectItem>
        </SelectContent>
      </Select>

      <Select bind:value={selectedOrderType}>
        <SelectTrigger class_="w-48">
          <SelectValue placeholder="Төрлөөр шүүх">
            {selectedOrderType ? getOrderTypeLabel(selectedOrderType as OrderType) : ""}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Бүх төрөл</SelectItem>
          <SelectItem value={OrderType.DINE_IN}>Газар дээр идэх</SelectItem>
          <SelectItem value={OrderType.TAKE_OUT}>Авч явах</SelectItem>
        </SelectContent>
      </Select>

      <Select bind:value={selectedDateRange}>
        <SelectTrigger class_="w-48">
          <SelectValue placeholder="Хугацаагаар шүүх">
            {selectedDateRange ? getDateRangeLabel(selectedDateRange) : ""}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Бүх хугацаа</SelectItem>
          <SelectItem value="today">Өнөөдөр</SelectItem>
          <SelectItem value="yesterday">Өчигдөр</SelectItem>
          <SelectItem value="last_7_days">Сүүлийн 7 хоног</SelectItem>
          <SelectItem value="last_30_days">Сүүлийн 30 хоног</SelectItem>
          <SelectItem value="this_week">Энэ долоо хоног</SelectItem>
          <SelectItem value="this_month">Энэ сар</SelectItem>
          <SelectItem value="last_week">Өнгөрсөн долоо хоног</SelectItem>
          <SelectItem value="last_month">Өнгөрсөн сар</SelectItem>
        </SelectContent>
      </Select>

      <div class="flex gap-2">
        <Button on:click={onApplyFilters} disabled={isLoading}>Хайх</Button>
        <Button variant="secondary" on:click={onResetFilters}>Цэвэрлэх</Button>
        <Button
          variant="secondary"
          size="sm"
          on:click={onRefresh}
          disabled={isLoading}
        >
          <RefreshCcw class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</div>
