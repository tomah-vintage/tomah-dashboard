export interface Table {
  id: string;
  restaurantId: string;
  name: string; // e.g., "Table 5", "Patio 2"
  qrCodeUrl: string; // Will store a data URL of the generated QR code
  orderUrl: string; // The URL embedded in the QR code
}

export interface TableFormData {
  name: string;
}
