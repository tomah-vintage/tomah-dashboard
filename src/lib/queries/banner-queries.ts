import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { Banner } from '$lib/types/banner';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

// Upload image and get URL
async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiFetch<{ url: string }>(
    `${PUBLIC_BACKEND_URL}/api/upload/`,
    {
      method: 'POST',
      body: formData
    },
    'file'
  );
  
  return response.url;
}

// Get all banners for a restaurant
export function createGetBannersQuery(initialData?: Banner[]) {
  return createQuery({
    queryKey: ['banners'],
    queryFn: (): Promise<Banner[]> => apiFetch<Banner[]>(`${PUBLIC_BACKEND_URL}/api/banner/`),
    initialData
  });
}

// Add new banner
export function createAddBannerMutation() {
  const queryClient = useQueryClient();
  
  return createMutation({
    mutationFn: async (bannerData: {
      file: File;
      layout_type: string;
      position: string;
      restaurant: string;
      width?: number;
      height?: number;
      animation_type?: string;
    }): Promise<Banner> => {
      // First upload the image to get URL
      const imageUrl = await uploadImage(bannerData.file);
      
      // Then create the banner with the image URL
      const payload = {
        image_url: imageUrl,
        layout_type: bannerData.layout_type,
        position: bannerData.position,
        restaurant: bannerData.restaurant,
        order_index: 0, // Default order index
        ...(bannerData.width && { width: bannerData.width }),
        ...(bannerData.height && { height: bannerData.height }),
        ...(bannerData.animation_type && { animation_type: bannerData.animation_type })
      };
      
      return apiFetch<Banner>(`${PUBLIC_BACKEND_URL}/api/banner/`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },
    onSuccess: () => {
      // Invalidate and refetch banners
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
    onError: (error) => {
      console.error('Error adding banner:', error);
    }
  });
}

// Update existing banner
export function createUpdateBannerMutation() {
  const queryClient = useQueryClient();
  
  return createMutation({
    mutationFn: (banner: Banner): Promise<Banner> =>
      apiFetch<Banner>(`${PUBLIC_BACKEND_URL}/api/banner/${banner.id}/`, {
        method: 'PATCH',
        body: JSON.stringify(banner)
      }),
    onSuccess: () => {
      // Invalidate and refetch banners
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
    onError: (error) => {
      console.error('Error updating banner:', error);
    }
  });
}

// Delete banner
export function createDeleteBannerMutation() {
  const queryClient = useQueryClient();
  
  return createMutation({
    mutationFn: (bannerId: string): Promise<void> =>
      apiFetch<void>(`${PUBLIC_BACKEND_URL}/api/banner/${bannerId}/`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      // Invalidate and refetch banners
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
    onError: (error) => {
      console.error('Error deleting banner:', error);
    }
  });
}

// Bulk update banner positions
export function createUpdateBannerPositionsMutation() {
  const queryClient = useQueryClient();
  
  return createMutation({
    mutationFn: (banners: Banner[]): Promise<Banner[]> =>
      apiFetch<Banner[]>(`${PUBLIC_BACKEND_URL}/api/banner/bulk-update/`, {
        method: 'PATCH',
        body: JSON.stringify({ banners })
      }),
    onSuccess: () => {
      // Invalidate and refetch banners
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
    onError: (error) => {
      console.error('Error updating banner positions:', error);
    }
  });
}