
import { Owner, Base } from './types';

export const TICK_RATE = 100; // ms
export const TROOP_SPEED = 0.01; // progress increment per tick
export const BASE_PRODUCTION_INTERVAL = 1000; // ms

export const MAP_CONFIG: Base[] = [
  { id: 'b1', pos: { x: 15, y: 50 }, troops: 20, owner: Owner.PLAYER, maxCapacity: 100, productionRate: 1 },
  { id: 'b2', pos: { x: 85, y: 50 }, troops: 20, owner: Owner.ENEMY, maxCapacity: 100, productionRate: 1 },
  { id: 'b3', pos: { x: 50, y: 20 }, troops: 10, owner: Owner.NEUTRAL, maxCapacity: 50, productionRate: 0.5 },
  { id: 'b4', pos: { x: 50, y: 80 }, troops: 10, owner: Owner.NEUTRAL, maxCapacity: 50, productionRate: 0.5 },
  { id: 'b5', pos: { x: 35, y: 40 }, troops: 5, owner: Owner.NEUTRAL, maxCapacity: 40, productionRate: 0.3 },
  { id: 'b6', pos: { x: 65, y: 40 }, troops: 5, owner: Owner.NEUTRAL, maxCapacity: 40, productionRate: 0.3 },
  { id: 'b7', pos: { x: 35, y: 60 }, troops: 5, owner: Owner.NEUTRAL, maxCapacity: 40, productionRate: 0.3 },
  { id: 'b8', pos: { x: 65, y: 60 }, troops: 5, owner: Owner.NEUTRAL, maxCapacity: 40, productionRate: 0.3 },
];

export const COLORS = {
  [Owner.PLAYER]: '#3b82f6', // blue
  [Owner.ENEMY]: '#ef4444', // red
  [Owner.NEUTRAL]: '#64748b' // slate
};
