export function calculateTotalPages(totalCount: number, pageSize: number = 20): number {
  return Math.ceil(totalCount / pageSize);
}

export function generatePageNumbers(currentPage: number, totalPages: number, maxVisiblePages: number = 5): number[] {
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}