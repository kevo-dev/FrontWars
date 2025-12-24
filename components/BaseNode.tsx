
import React from 'react';
import { Base, Owner } from '../types';
import { COLORS } from '../constants';

interface BaseNodeProps {
  base: Base;
  isSelected: boolean;
  onClick: () => void;
}

const BaseNode: React.FC<BaseNodeProps> = ({ base, isSelected, onClick }) => {
  const color = COLORS[base.owner];
  
  return (
    <div
      onClick={onClick}
      className={`absolute cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 group`}
      style={{ left: `${base.pos.x}%`, top: `${base.pos.y}%` }}
    >
      {/* Glow Effect */}
      <div 
        className={`absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-50 transition-opacity`}
        style={{ backgroundColor: color }}
      ></div>
      
      {/* Outer Ring */}
      <div 
        className={`w-16 h-16 rounded-full border-4 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm shadow-2xl transition-transform ${isSelected ? 'scale-125 border-white' : 'border-transparent'}`}
        style={{ borderColor: isSelected ? '#fff' : color }}
      >
        <div className="text-center">
          <div className="text-xs font-orbitron opacity-70 leading-none mb-0.5">
            {base.owner === Owner.PLAYER ? 'CMD' : base.owner === Owner.ENEMY ? 'E-CMD' : 'NTRL'}
          </div>
          <div className="text-lg font-bold font-orbitron leading-none">
            {Math.floor(base.troops)}
          </div>
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="mt-2 w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-500"
          style={{ 
            width: `${(base.troops / base.maxCapacity) * 100}%`,
            backgroundColor: color 
          }}
        ></div>
      </div>
    </div>
  );
};

export default BaseNode;
