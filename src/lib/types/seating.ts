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
  capacity: number;
  label: string;
  status: TableStatus;
}

export interface SeatingLayout {
  id: string;
  restaurantId: string;
  name: string;
  tables: SeatingTable[];
}
