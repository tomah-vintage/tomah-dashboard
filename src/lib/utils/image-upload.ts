import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

// Upload image and get URL
export async function uploadImage(file: File): Promise<string> {
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