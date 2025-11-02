/**
 * Format revenue amount in Mongolian format
 */
export function formatRevenue(revenue: string | number): string {
  const amount = typeof revenue === 'string' ? parseFloat(revenue) : revenue;
  return new Intl.NumberFormat('mn-MN').format(amount) + '₮';
}

/**
 * Format date string in Mongolian format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get subscription status color classes
 */
export function getSubscriptionStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'expired':
    case 'canceled':
      return 'bg-red-100 text-red-800';
    case 'trial':
      return 'bg-blue-100 text-blue-800';
    case 'past_due':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get subscription status label in Mongolian
 */
export function getSubscriptionStatusLabel(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'Идэвхтэй';
    case 'expired':
      return 'Дууссан';
    case 'canceled':
      return 'Цуцлагдсан';
    case 'trial':
      return 'Туршилт';
    case 'past_due':
      return 'Хэтэрсэн';
    default:
      return status;
  }
}
