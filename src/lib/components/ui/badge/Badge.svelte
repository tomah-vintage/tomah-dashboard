<script lang="ts">
  export let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  export let class_ = '';
  
  function getVariantClass(variant: string) {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'destructive':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'outline':
        return 'border border-gray-200 text-gray-700 hover:bg-gray-50';
      case 'default':
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
  }
</script>

<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors {getVariantClass(variant)} {class_}">
  <slot />
</span>