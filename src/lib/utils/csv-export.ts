import type { Order } from '$lib/types/order';

/**
 * Generic CSV export function
 */
export function exportToCSV(
  data: any[][],
  headers: string[],
  filename: string
): void {
  const csvContent = [headers, ...data]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Export orders to CSV file
 */
export function exportOrdersToCSV(orders: Order[]): void {
  const headers = [
    'Захиалгын ID',
    'Үйлчлүүлэгч ID',
    'Ресторан ID',
    'Төлөв',
    'Төрөл',
    'Нийт дүн',
    'Огноо'
  ];

  const csvData = orders.map(order => [
    order.id,
    order.user,
    order.restaurant,
    order.order_status,
    order.order_type,
    order.total_price,
    new Date(order.created_at).toLocaleDateString('mn-MN')
  ]);

  const filename = `orders_report_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(csvData, headers, filename);
}

/**
 * Export detailed orders with items to CSV
 */
export function exportDetailedOrdersToCSV(orders: Order[]): void {
  const headers = [
    'Захиалгын ID',
    'Үйлчлүүлэгч ID',
    'Ресторан ID',
    'Төлөв',
    'Төрөл',
    'Бүтээгдэхүүн',
    'Тоо ширхэг',
    'Нэгжийн үнэ',
    'Нийт дүн',
    'Огноо'
  ];

  const csvData: any[][] = [];
  
  orders.forEach(order => {
    if (order.items.length === 0) {
      // Order with no items
      csvData.push([
        order.id,
        order.user,
        order.restaurant,
        order.order_status,
        order.order_type,
        '',
        0,
        0,
        order.total_price,
        new Date(order.created_at).toLocaleDateString('mn-MN')
      ]);
    } else {
      // Order with items
      order.items.forEach((item, index) => {
        csvData.push([
          index === 0 ? order.id : '', // Only show order info on first item
          index === 0 ? order.user : '',
          index === 0 ? order.restaurant : '',
          index === 0 ? order.order_status : '',
          index === 0 ? order.order_type : '',
          item.menu_item.name,
          item.quantity,
          item.unit_price,
          index === 0 ? order.total_price : '', // Only show total on first item
          index === 0 ? new Date(order.created_at).toLocaleDateString('mn-MN') : ''
        ]);
      });
    }
  });

  const filename = `detailed_orders_report_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(csvData, headers, filename);
}