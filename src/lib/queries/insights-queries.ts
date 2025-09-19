import { createQuery } from '@tanstack/svelte-query';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { RestaurantInsights, PlatformInsights, InsightsFilters } from '$lib/types/insights';

export function createGetInsightsQuery(filters: InsightsFilters = {}) {
  const queryParams = new URLSearchParams();
  
  if (filters.days) queryParams.append('days', filters.days.toString());

  const url = `${PUBLIC_BACKEND_URL}/api/insights/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

  return createQuery({
    queryKey: ['insights', filters],
    queryFn: (): Promise<RestaurantInsights | PlatformInsights> => apiFetch(url, {}, 'json'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000 // Auto-refresh every 5 minutes
  });
}