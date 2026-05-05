import * as XLSX from 'xlsx';
import type { Order } from '$lib/types/order';

function downloadWorkbook(wb: XLSX.WorkBook, filename: string): void {
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel(data: any[][], headers: string[], filename: string): void {
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  downloadWorkbook(wb, filename);
}

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

  const data = orders.map(order => [
    order.id,
    order.user,
    order.restaurant,
    order.order_status,
    order.order_type,
    order.total_price,
    new Date(order.created_at).toLocaleDateString('mn-MN')
  ]);

  const filename = `orders_report_${new Date().toISOString().split('T')[0]}.xlsx`;
  exportToExcel(data, headers, filename);
}

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

  const data: any[][] = [];

  orders.forEach(order => {
    if (order.items.length === 0) {
      data.push([
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
      order.items.forEach((item, index) => {
        data.push([
          index === 0 ? order.id : '',
          index === 0 ? order.user : '',
          index === 0 ? order.restaurant : '',
          index === 0 ? order.order_status : '',
          index === 0 ? order.order_type : '',
          item.menu_item.name,
          item.quantity,
          item.unit_price,
          index === 0 ? order.total_price : '',
          index === 0 ? new Date(order.created_at).toLocaleDateString('mn-MN') : ''
        ]);
      });
    }
  });

  const filename = `detailed_orders_report_${new Date().toISOString().split('T')[0]}.xlsx`;
  exportToExcel(data, headers, filename);
}
