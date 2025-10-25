import type { RestaurantHighlight, RestaurantHighlightForm, SimpleRestaurant, HighlightType } from '$lib/types/restaurant-highlight';

/**
 * Filtering utilities
 */
export function filterHighlights(highlights: RestaurantHighlight[], searchValue: string): RestaurantHighlight[] {
  if (!searchValue.trim()) {
    return highlights;
  }
  
  const search = searchValue.toLowerCase().trim();
  return highlights.filter(highlight => 
    highlight.name.toLowerCase().includes(search) ||
    highlight.display_name.toLowerCase().includes(search) ||
    highlight.highlight_type.toLowerCase().includes(search)
  );
}

export function filterRestaurants(restaurants: SimpleRestaurant[], searchValue: string): SimpleRestaurant[] {
  if (!searchValue.trim()) {
    return restaurants;
  }
  
  const search = searchValue.toLowerCase().trim();
  return restaurants.filter(restaurant => 
    restaurant.name?.toLowerCase().includes(search)
  );
}

/**
 * Display utilities
 */
export function getHighlightTypeLabel(type: string): string {
  switch (type) {
    case 'BADGE':
      return 'Тэмдэг/Шошго';
    case 'FEATURED':
      return 'Онцлох';
    default:
      return type;
  }
}

export function getHighlightTypeColor(type: string): string {
  switch (type) {
    case 'BADGE':
      return 'bg-blue-100 text-blue-800';
    case 'FEATURED':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusBadgeClass(isActive: boolean): string {
  return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
}

export function getStatusLabel(isActive: boolean): string {
  return isActive ? 'Идэвхтэй' : 'Идэвхгүй';
}

/**
 * Form utilities
 */
export function createEmptyHighlightForm(): RestaurantHighlightForm {
  return {
    name: '',
    display_name: '',
    highlight_type: 'BADGE',
    color: '#007bff',
    icon: '',
    image_url: '',
    is_active: true,
    order_index: 0
  };
}

export function highlightToForm(highlight: RestaurantHighlight): RestaurantHighlightForm {
  return {
    name: highlight.name,
    display_name: highlight.display_name,
    highlight_type: highlight.highlight_type,
    color: highlight.color,
    icon: highlight.icon || '',
    image_url: highlight.image_url || '',
    is_active: highlight.is_active,
    order_index: highlight.order_index
  };
}

/**
 * Validation utilities
 */
export function validateHighlightForm(form: RestaurantHighlightForm): string[] {
  const errors: string[] = [];
  
  if (!form.name?.trim()) {
    errors.push('Нэр заавал бөглөнө үү');
  }
  
  if (!form.display_name?.trim()) {
    errors.push('Харуулах нэр заавал бөглөнө үү');
  }
  
  if (!form.color?.match(/^#[0-9A-Fa-f]{6}$/)) {
    errors.push('Өнгөний код буруу байна');
  }
  
  if (form.order_index < 0) {
    errors.push('Эрэмбийн дугаар 0-ээс их байх ёстой');
  }
  
  return errors;
}