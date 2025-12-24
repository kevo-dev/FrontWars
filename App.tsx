
import React, { useState } from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import BaseNode from './components/BaseNode';
import TroopUnit from './components/TroopUnit';
import { Owner } from './types';

const App: React.FC = () => {
  const { gameState, startGame, handleMove } = useGameLoop();
  const [selectedBaseId, setSelectedBaseId] = useState<string | null>(null);

  const onBaseClick = (baseId: string) => {
    const base = gameState.bases.find(b => b.id === baseId);
    if (!base) return;

    if (selectedBaseId) {
      if (selectedBaseId === baseId) {
        setSelectedBaseId(null);
      } else {
        handleMove(selectedBaseId, baseId, Owner.PLAYER);
        setSelectedBaseId(null);
      }
    } else {
      if (base.owner === Owner.PLAYER) {
        setSelectedBaseId(baseId);
      }
    }
  };

  return (
    <div className="h-screen w-screen relative bg-slate-950 overflow-hidden select-none">
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

      {/* Header HUD */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none">
        <div className="flex flex-col">
          <h1 className="text-3xl font-orbitron font-bold tracking-tighter text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            FRONTWARS
          </h1>
          <div className="text-xs font-orbitron opacity-50">TACTICAL COMMANDER</div>
        </div>

        <div className="flex gap-8 items-center bg-slate-900/50 backdrop-blur-md p-4 rounded-xl border border-slate-800 pointer-events-auto">
          <div className="text-center">
            <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">Player</div>
            <div className="text-2xl font-orbitron">
              {Math.floor(gameState.bases.filter(b => b.owner === Owner.PLAYER).reduce((acc, b) => acc + b.troops, 0))}
            </div>
          </div>
          <div className="h-10 w-px bg-slate-800"></div>
          <div className="text-center">
            <div className="text-xs text-red-400 font-bold uppercase tracking-wider">Enemy</div>
            <div className="text-2xl font-orbitron">
              {Math.floor(gameState.bases.filter(b => b.owner === Owner.ENEMY).reduce((acc, b) => acc + b.troops, 0))}
            </div>
          </div>
        </div>
      </div>

      {/* Game Field */}
      <div className="w-full h-full relative" onClick={() => setSelectedBaseId(null)}>
        {/* Connection Lines (Aesthetic) */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          {/* We could dynamically draw connections based on proximity, but for simplicity let's do a few central lines */}
          <line x1="15%" y1="50%" x2="50%" y2="20%" stroke="#475569" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="15%" y1="50%" x2="50%" y2="80%" stroke="#475569" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="85%" y1="50%" x2="50%" y2="20%" stroke="#475569" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="85%" y1="50%" x2="50%" y2="80%" stroke="#475569" strokeWidth="2" strokeDasharray="5,5" />
        </svg>

        {gameState.bases.map(base => (
          <BaseNode 
            key={base.id} 
            base={base} 
            isSelected={selectedBaseId === base.id}
            onClick={() => onBaseClick(base.id)} 
          />
        ))}

        {gameState.troops.map(troop => (
          <TroopUnit key={troop.id} troop={troop} bases={gameState.bases} />
        ))}
      </div>

      {/* UI Overlays */}
      {gameState.gameStatus === 'LOBBY' && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl">
          <div className="max-w-md p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl">
            <h2 className="text-5xl font-orbitron font-bold mb-4 text-blue-500 italic">DEPLOY</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Command your forces, capture neutral outposts, and eliminate the enemy presence in this tactical battleground.
            </p>
            <button 
              onClick={startGame}
              className="w-full py-4 px-8 bg-blue-600 hover:bg-blue-500 text-white font-orbitron font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
            >
              INITIALIZE MISSION
            </button>
            <div className="mt-8 grid grid-cols-2 gap-4 text-left">
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <i className="fas fa-mouse-pointer text-blue-400 mb-2"></i>
                <div className="text-xs font-bold uppercase">Select Base</div>
                <div className="text-[10px] text-slate-500">Left click your base</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <i className="fas fa-bullseye text-red-400 mb-2"></i>
                <div className="text-xs font-bold uppercase">Attack Target</div>
                <div className="text-[10px] text-slate-500">Left click target base</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState.gameStatus === 'GAMEOVER' && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-1000">
          <div className="text-center p-12">
            <h2 className={`text-7xl font-orbitron font-black mb-6 ${gameState.winner === Owner.PLAYER ? 'text-blue-500' : 'text-red-500'} italic`}>
              {gameState.winner === Owner.PLAYER ? 'MISSION SUCCESS' : 'MISSION FAILURE'}
            </h2>
            <p className="text-xl text-slate-400 mb-12">
              The operation has concluded. Final territory control established.
            </p>
            <button 
              onClick={startGame}
              className="py-5 px-16 bg-slate-100 hover:bg-white text-slate-950 font-orbitron font-bold rounded-2xl transition-all shadow-2xl"
            >
              RE-ENGAGE
            </button>
          </div>
        </div>
      )}

      {/* Controls / Info Tray */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-800 shadow-2xl z-40">
        <div className="flex items-center gap-3 px-6 py-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
          <span className="text-sm font-orbitron font-medium text-slate-300">COMMANDER ONLINE</span>
        </div>
        <div className="h-6 w-px bg-slate-800"></div>
        <div className="px-6 py-2 flex items-center gap-4">
           <div className="text-xs font-medium text-slate-500">TROOP DISPATCH: <span className="text-slate-100">50% PER MOVE</span></div>
        </div>
      </div>
    </div>
  );
};

export default App;
