import fs from 'fs';
import path from 'path';
import type { Restaurant, RestaurantFormData } from '$lib/types/restaurant';
import type { Table } from '$lib/types/seating';

const dbPath = path.resolve('src/lib/server/db.json');

interface DbData {
  restaurants: Restaurant[];
  tables: Table[];
}

function readData(): DbData {
  const json_data = fs.readFileSync(dbPath, 'utf-8');
  const data = JSON.parse(json_data);
  // Ensure tables array exists
  if (!data.tables) {
    data.tables = [];
  }
  return data;
}

function writeData(data: DbData): void {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function getRestaurants(): Restaurant[] {
  const { restaurants } = readData();
  return restaurants;
}

export function addRestaurant(data: RestaurantFormData): Restaurant {
  const dbData = readData();
  const newId = (Math.max(...dbData.restaurants.map(r => parseInt(r.id))) + 1).toString();
  const newRestaurant: Restaurant = { 
    id: newId, 
    ...data, 
    logo: '', // Default empty logo
    created_at: new Date().toISOString() // Current timestamp
  };
  dbData.restaurants.push(newRestaurant);
  writeData(dbData);
  return newRestaurant;
}

export function updateRestaurant(id: string, data: RestaurantFormData): Restaurant | null {
  const dbData = readData();
  const index = dbData.restaurants.findIndex(r => r.id === id);
  if (index !== -1) {
    const updatedRestaurant = { ...dbData.restaurants[index], ...data };
    dbData.restaurants[index] = updatedRestaurant;
    writeData(dbData);
    return updatedRestaurant;
  }
  return null;
}

export function deleteRestaurant(id: string): boolean {
  const dbData = readData();
  const initialLength = dbData.restaurants.length;
  dbData.restaurants = dbData.restaurants.filter(r => r.id !== id);
  if (dbData.restaurants.length < initialLength) {
    writeData(dbData);
    return true;
  }
  return false;
}

// --- Table Functions ---

export function getTables(restaurantId: string): Table[] {
    const { tables } = readData();
    return tables.filter(t => t.restaurant === restaurantId);
}

export function addTable(table: Table): Table {
    const dbData = readData();
    dbData.tables.push(table);
    writeData(dbData);
    return table;
}

export function removeTable(tableId: string): boolean {
    const dbData = readData();
    const initialLength = dbData.tables.length;
    dbData.tables = dbData.tables.filter(t => t.id !== tableId);
    if (dbData.tables.length < initialLength) {
        writeData(dbData);
        return true;
    }
    return false;
}
