import type { HighlightType } from '$lib/types/restaurant-highlight';

/**
 * Restaurant highlight types configuration
 */
export const HIGHLIGHT_TYPES: Array<{
  value: HighlightType;
  label: string;
  description: string;
}> = [
  {
    value: 'BADGE',
    label: 'Тэмдэг/Шошго',
    description: 'Жижиг шошго "Санал болгосон", "Өглөөний цай", "Гэр бүлийн"'
  },
  {
    value: 'BANNER',
    label: 'Баннер/Сурталчилгаа',
    description: 'Нүүр хуудасны том сурталчилгааны баннер'
  },
  {
    value: 'FEATURED',
    label: 'Онцлох',
    description: 'Тусгайлан онцолсон ресторанууд'
  }
] as const;

/**
 * Default form values
 */
export const DEFAULT_HIGHLIGHT_COLOR = '#007bff';
export const DEFAULT_ORDER_INDEX = 0;

/**
 * Form validation constants
 */
export const VALIDATION_RULES = {
  COLOR_PATTERN: /^#[0-9A-Fa-f]{6}$/,
  MIN_ORDER_INDEX: 0,
  MAX_NAME_LENGTH: 255,
  MAX_DISPLAY_NAME_LENGTH: 255,
  MAX_ICON_LENGTH: 50
} as const;