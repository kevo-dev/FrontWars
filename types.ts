
export enum Owner {
  NEUTRAL = 'NEUTRAL',
  PLAYER = 'PLAYER',
  ENEMY = 'ENEMY'
}

export interface Position {
  x: number;
  y: number;
}

export interface Base {
  id: string;
  pos: Position;
  troops: number;
  owner: Owner;
  maxCapacity: number;
  productionRate: number; // troops per second
}

export interface TroopGroup {
  id: string;
  fromBaseId: string;
  toBaseId: string;
  count: number;
  owner: Owner;
  progress: number; // 0 to 1
  speed: number;
}

export interface GameState {
  bases: Base[];
  troops: TroopGroup[];
  score: {
    player: number;
    enemy: number;
  };
  gameStatus: 'LOBBY' | 'PLAYING' | 'GAMEOVER';
  winner?: Owner;
}

export interface MoveAction {
  fromId: string;
  toId: string;
}
