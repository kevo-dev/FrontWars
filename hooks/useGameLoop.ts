
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Owner, Base, TroopGroup, MoveAction } from '../types';
import { MAP_CONFIG, TICK_RATE, TROOP_SPEED, BASE_PRODUCTION_INTERVAL } from '../constants';
import { getEnemyMove } from '../services/geminiService';

export const useGameLoop = () => {
  const [gameState, setGameState] = useState<GameState>({
    bases: MAP_CONFIG.map(b => ({ ...b })),
    troops: [],
    score: { player: 0, enemy: 0 },
    gameStatus: 'LOBBY'
  });

  const lastAiMoveRef = useRef<number>(0);
  const aiCooldown = 5000; // 5 seconds between AI moves

  const startGame = () => {
    setGameState({
      bases: MAP_CONFIG.map(b => ({ ...b })),
      troops: [],
      score: { player: 0, enemy: 0 },
      gameStatus: 'PLAYING'
    });
  };

  const handleMove = useCallback((fromId: string, toId: string, owner: Owner) => {
    setGameState(prev => {
      const fromBase = prev.bases.find(b => b.id === fromId);
      if (!fromBase || fromBase.owner !== owner || fromBase.troops < 2) return prev;

      const sendCount = Math.floor(fromBase.troops / 2);
      const newTroop: TroopGroup = {
        id: Math.random().toString(36).substr(2, 9),
        fromBaseId: fromId,
        toBaseId: toId,
        count: sendCount,
        owner,
        progress: 0,
        speed: TROOP_SPEED
      };

      return {
        ...prev,
        bases: prev.bases.map(b => b.id === fromId ? { ...b, troops: b.troops - sendCount } : b),
        troops: [...prev.troops, newTroop]
      };
    });
  }, []);

  // AI Logic
  useEffect(() => {
    if (gameState.gameStatus !== 'PLAYING') return;

    const now = Date.now();
    if (now - lastAiMoveRef.current > aiCooldown) {
      lastAiMoveRef.current = now;
      getEnemyMove(gameState).then(moves => {
        moves.forEach(m => handleMove(m.fromId, m.toId, Owner.ENEMY));
      });
    }
  }, [gameState, handleMove]);

  // Production and Tick
  useEffect(() => {
    if (gameState.gameStatus !== 'PLAYING') return;

    const interval = setInterval(() => {
      setGameState(prev => {
        // 1. Update Troop Progress
        const nextTroops: TroopGroup[] = [];
        const baseImpacts: Record<string, { count: number; owner: Owner }[]> = {};

        prev.troops.forEach(t => {
          const nextProgress = t.progress + t.speed;
          if (nextProgress >= 1) {
            if (!baseImpacts[t.toBaseId]) baseImpacts[t.toBaseId] = [];
            baseImpacts[t.toBaseId].push({ count: t.count, owner: t.owner });
          } else {
            nextTroops.push({ ...t, progress: nextProgress });
          }
        });

        // 2. Resolve Base Impact
        let nextBases = prev.bases.map(base => {
          let currentTroops = base.troops;
          let currentOwner = base.owner;

          const impacts = baseImpacts[base.id] || [];
          impacts.forEach(impact => {
            if (impact.owner === currentOwner) {
              currentTroops += impact.count;
            } else {
              currentTroops -= impact.count;
              if (currentTroops < 0) {
                currentTroops = Math.abs(currentTroops);
                currentOwner = impact.owner;
              }
            }
          });

          return { ...base, troops: Math.min(currentTroops, base.maxCapacity), owner: currentOwner };
        });

        // 3. Base Production (Internal logic handled by timestamp)
        // For simplicity, we'll use base production on a per-tick basis normalized
        nextBases = nextBases.map(b => {
           if (b.owner === Owner.NEUTRAL) return b;
           const increment = (b.productionRate * TICK_RATE) / 1000;
           return { ...b, troops: Math.min(b.troops + increment, b.maxCapacity) };
        });

        // 4. Check Win Condition
        const owners = new Set(nextBases.filter(b => b.owner !== Owner.NEUTRAL).map(b => b.owner));
        let nextStatus = prev.gameStatus;
        let winner = prev.winner;
        
        if (owners.size === 1) {
          nextStatus = 'GAMEOVER';
          winner = Array.from(owners)[0];
        } else if (nextBases.every(b => b.owner === Owner.NEUTRAL)) {
          // Should not happen, but safety check
        }

        return {
          ...prev,
          bases: nextBases,
          troops: nextTroops,
          gameStatus: nextStatus,
          winner
        };
      });
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [gameState.gameStatus]);

  return { gameState, startGame, handleMove };
};
