import fs from 'fs';
import path from 'path';
import type { Restaurant, RestaurantFormData } from '$lib/types/restaurant';

const dbPath = path.resolve('src/lib/server/db.json');

interface DbData {
  restaurants: Restaurant[];
}

function readData(): DbData {
  const json_data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(json_data);
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
  const newRestaurant: Restaurant = { id: newId, ...data };
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
