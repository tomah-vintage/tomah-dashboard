import { z } from 'zod';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const menuItemFormSchema = z.object({
  name: z.string().min(1, { message: 'Нэр оруулна уу' }),
  description: z.string().min(1, { message: 'Тайлбар оруулна уу' }),
  price: z.number().refine((val) => !isNaN(val) && val > 0, {
    message: 'Үнэ 0-с их байх ёстой',
  }),
  categories: z.array(z.number()).min(1, { message: 'Ангилал оруулна уу' }),
  is_available: z.boolean(),
  meta_data: z.object({
    calories: z.number().refine((val) => !isNaN(val), {
      message: 'Калори оруулна уу',
    }),
    ingredients: z.array(z.string()).min(1, { message: 'Орц оруулна уу' }),
  }),
  img_urls: z.array(z.any()).optional(),
});

export async function uploadImages(files: (File | string)[]): Promise<string[]> {
  const uploads = files.map(async (item) => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', item);

    try {
      const uploadResponse = await apiFetch<{ url: string }>(
        `${PUBLIC_BACKEND_URL}/api/upload/`,
        {
          method: 'POST',
          body: uploadFormData,
        },
        'file'
      );

      return uploadResponse.url
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Зураг байршуулахад гэнэтийн алдаа гарлаа.'
      );
    }
  })

  const uploadedUrls: string[] = await Promise.all(uploads)

  return uploadedUrls;
}

export function processIngredients(input: string): string[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value) + "₮";
}; 