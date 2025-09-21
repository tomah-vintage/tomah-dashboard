/**
 * Date formatting utilities
 */

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'Тодорхойгүй';
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.warn('Invalid date string:', dateString);
    return 'Буруу огноо';
  }
}

export function formatDateMongolian(dateString: string | undefined): string {
  if (!dateString) return 'Тодорхойгүй';
  
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
  } catch (error) {
    console.warn('Invalid date string:', dateString);
    return 'Буруу огноо';
  }
}

export function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return 'Тодорхойгүй';
  
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.warn('Invalid date string:', dateString);
    return 'Буруу огноо';
  }
}