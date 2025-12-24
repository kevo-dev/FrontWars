
import React from 'react';
import { TroopGroup, Position, Base } from '../types';
import { COLORS } from '../constants';

interface TroopUnitProps {
  troop: TroopGroup;
  bases: Base[];
}

const TroopUnit: React.FC<TroopUnitProps> = ({ troop, bases }) => {
  const fromBase = bases.find(b => b.id === troop.fromBaseId);
  const toBase = bases.find(b => b.id === troop.toBaseId);

  if (!fromBase || !toBase) return null;

  const currentX = fromBase.pos.x + (toBase.pos.x - fromBase.pos.x) * troop.progress;
  const currentY = fromBase.pos.y + (toBase.pos.y - fromBase.pos.y) * troop.progress;

  return (
    <div
      className="absolute w-6 h-6 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 shadow-lg z-10 transition-all duration-100 ease-linear"
      style={{ 
        left: `${currentX}%`, 
        top: `${currentY}%`,
        backgroundColor: COLORS[troop.owner],
        border: '2px solid rgba(255,255,255,0.3)'
      }}
    >
      <span className="text-[10px] font-bold text-white leading-none">
        {troop.count}
      </span>
    </div>
  );
};

export default TroopUnit;
