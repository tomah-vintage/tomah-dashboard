export interface Banner {
  id: string;
  image_url: string;
  layout_type: BannerLayoutType;
  position: BannerPosition;
  order_index: number;
  width?: number;
  height?: number;
  animation_type?: string;
  responsive_settings?: Record<string, any>;
  restaurant: string;
  created_at: string;
  updated_at: string;
}

export enum BannerLayoutType {
  Hero = 'HERO',
  Carousel = 'CAROUSEL',
  Featured = 'FEATURED',
  Promotional = 'PROMOTIONAL',
  Magazine = 'MAGAZINE'
}

export enum BannerPosition {
  Top = 'TOP',
  Middle = 'MIDDLE',
  Bottom = 'BOTTOM',
  Sidebar = 'SIDEBAR'
}

export interface BannerUpload {
  file: File;
  layout_type: BannerLayoutType;
  position: BannerPosition;
  width?: number;
  height?: number;
  animation_type?: string;
}

export interface BannerLayoutConfig {
  type: BannerLayoutType;
  name: string;
  description: string;
  maxItems: number;
  dimensions: {
    width: number;
    height: number;
  };
}