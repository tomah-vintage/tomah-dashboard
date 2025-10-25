import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { PlatformBanner, PlatformBannerCreateRequest, PlatformBannerUpdateRequest } from '$lib/types/platform-banner';
import { apiFetch } from '$lib/utils/api';
import { uploadImage } from '$lib/utils/image-upload';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import toast from 'svelte-french-toast';

// Get all platform banners
export function createGetPlatformBannersQuery() {
  return createQuery({
    queryKey: ['platformBanners'],
    queryFn: (): Promise<PlatformBanner[]> => apiFetch<PlatformBanner[]>(`${PUBLIC_BACKEND_URL}/api/platform-banner/`)
  });
}

// Get specific platform banner
export function createGetPlatformBannerQuery(id: number) {
  return createQuery({
    queryKey: ['platformBanner', id],
    queryFn: (): Promise<PlatformBanner> => apiFetch<PlatformBanner>(`${PUBLIC_BACKEND_URL}/api/platform-banner/${id}/`),
    enabled: !!id
  });
}

// Create platform banner
export function createAddPlatformBannerMutation() {
  const queryClient = useQueryClient();
  
  return createMutation({
    mutationFn: async (bannerData: {
      file: File;
      restaurant: number;
      order_index: number;
    }): Promise<PlatformBanner> => {
      // First upload the image to get URL
      const imageUrl = await uploadImage(bannerData.file);
      
      // Then create the banner with the image URL
      const payload: PlatformBannerCreateRequest = {
        image_url: imageUrl,
        restaurant: bannerData.restaurant,
        order_index: bannerData.order_index
      };
      
      return apiFetch<PlatformBanner>(`${PUBLIC_BACKEND_URL}/api/platform-banner/`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },
    onSuccess: () => {
      toast.success('Баннер амжилттай нэмэгдлээ!');
      queryClient.invalidateQueries({ queryKey: ['platformBanners'] });
    },
    onError: (error) => {
      console.error('Error adding platform banner:', error);
      toast.error('Баннер нэмэхэд алдаа гарлаа!');
    }
  });
}

// Update platform banner
export function createUpdatePlatformBannerMutation() {
  const queryClient = useQueryClient();
  
  return createMutation({
    mutationFn: async (data: {
      id: number;
      file?: File;
      restaurant?: number;
      order_index?: number;
    }): Promise<PlatformBanner> => {
      let payload: PlatformBannerUpdateRequest = {};
      
      // Upload new image if provided
      if (data.file) {
        payload.image_url = await uploadImage(data.file);
      }
      
      if (data.restaurant !== undefined) {
        payload.restaurant = data.restaurant;
      }
      
      if (data.order_index !== undefined) {
        payload.order_index = data.order_index;
      }
      
      return apiFetch<PlatformBanner>(`${PUBLIC_BACKEND_URL}/api/platform-banner/${data.id}/`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    },
    onSuccess: () => {
      toast.success('Баннер амжилттай засагдлаа!');
      queryClient.invalidateQueries({ queryKey: ['platformBanners'] });
    },
    onError: (error) => {
      console.error('Error updating platform banner:', error);
      toast.error('Баннер засахад алдаа гарлаа!');
    }
  });
}

// Delete platform banner
export function createDeletePlatformBannerMutation() {
  const queryClient = useQueryClient();
  
  return createMutation({
    mutationFn: (bannerId: number): Promise<void> =>
      apiFetch<void>(`${PUBLIC_BACKEND_URL}/api/platform-banner/${bannerId}/`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      toast.success('Баннер амжилттай устгагдлаа!');
      queryClient.invalidateQueries({ queryKey: ['platformBanners'] });
    },
    onError: (error) => {
      console.error('Error deleting platform banner:', error);
      toast.error('Баннер устгахад алдаа гарлаа!');
    }
  });
}

// Bulk update banner positions
export function createUpdatePlatformBannerPositionsMutation() {
  const queryClient = useQueryClient();
  
  return createMutation({
    mutationFn: async (banners: { id: number; order_index: number }[]): Promise<void> => {
      // Update each banner's position individually
      await Promise.all(
        banners.map(banner =>
          apiFetch<PlatformBanner>(`${PUBLIC_BACKEND_URL}/api/platform-banner/${banner.id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ order_index: banner.order_index })
          })
        )
      );
    },
    onSuccess: () => {
      toast.success('Баннерын эрэмбэ амжилттай засагдлаа!');
      queryClient.invalidateQueries({ queryKey: ['platformBanners'] });
    },
    onError: (error) => {
      console.error('Error updating banner positions:', error);
      toast.error('Баннерын эрэмбэ засахад алдаа гарлаа!');
    }
  });
}