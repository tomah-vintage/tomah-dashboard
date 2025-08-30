export enum TableShape {
  Rectangle = 'rectangle',
  Square = 'square',
  Circle = 'circle',
  Oval = 'oval',
}

export enum TableStatus {
  Available = 'available',
  Occupied = 'occupied',
  Reserved = 'reserved',
}

export interface SeatingTable {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: TableShape;
  seat_capacity: number;
  table_number: string;
  status: TableStatus;
  restaurant: string;
}

export interface SeatingLayout {
  id: string;
  restaurantId: string;
  name: string;
  tables: SeatingTable[];
}
