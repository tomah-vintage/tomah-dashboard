export interface PlatformBanner {
  id: number;
  image_url: string;
  restaurant: number;
  restaurant_name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface PlatformBannerForm {
  image_url?: string;
  restaurant: number;
  order_index: number;
}

export interface PlatformBannerCreateRequest {
  image_url: string;
  restaurant: number;
  order_index: number;
}

export interface PlatformBannerUpdateRequest {
  image_url?: string;
  restaurant?: number;
  order_index?: number;
}