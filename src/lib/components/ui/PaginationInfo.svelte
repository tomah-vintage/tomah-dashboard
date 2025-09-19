<script lang="ts">
  import type { PaginationInfo } from '$lib/utils/order-utils';

  export let paginationInfo: PaginationInfo;
</script>

<div class="text-sm text-gray-700">
  Нийт <span class="font-medium">{paginationInfo.totalItems}</span> захиалгаас
  <span class="font-medium">{paginationInfo.startItem}</span>-
  <span class="font-medium">{paginationInfo.endItem}</span>
  харуулж байна
</div>