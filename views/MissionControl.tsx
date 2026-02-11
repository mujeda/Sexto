
import React, { useState } from 'react';
import { AppState, Mission } from '../types';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const MissionControl: React.FC<Props> = ({ state, setState }) => {
  const [newMission, setNewMission] = useState({ title: '', description: '', reward: 100 });

  const addMission = () => {
    if (!newMission.title) return;
    const missionId = Math.random().toString();
    const mission: Mission = {
      id: missionId,
      title: newMission.title,
      description: newMission.description,
      reward: newMission.reward,
      isActive: true
    };
    setState(prev => ({ 
      ...prev, 
      missions: [mission, ...prev.missions],
      latestMissionId: missionId
    }));
    setNewMission({ title: '', description: '', reward: 100 });
  };

  const toggleMission = (id: string) => {
    setState(prev => ({
      ...prev,
      missions: prev.missions.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m)
    }));
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end gap-6">
        <div>
          <h2 className="text-5xl font-comic uppercase italic tracking-tighter text-comic-yellow text-stroke">Centro de Mando de Misiones</h2>
          <p className="font-marker text-slate-400 mt-2">Reparto de tareas heroicas y control de objetivos</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Mission Feed */}
        <div className="space-y-6">
          <h3 className="font-comic text-3xl uppercase italic tracking-widest text-secondary">Misiones de Campo</h3>
          {state.missions.map(m => (
            <div key={m.id} className={`comic-border p-6 flex flex-col gap-4 bg-white transition-opacity ${m.isActive ? 'opacity-100' : 'opacity-60 bg-slate-200'}`}>
              <div className="flex justify-between items-start">
                <div className="bg-comic-red text-white font-comic px-4 py-1 text-sm italic border-2 border-black rotate-[-2deg]">
                  {m.isActive ? 'MISIÓN ACTIVA' : 'ARCHIVADA'}
                </div>
                {m.timeLeft && <span className="font-marker text-xs text-black uppercase">{m.timeLeft} RESTANTE</span>}
              </div>
              <div>
                <h4 className="font-comic text-2xl text-black uppercase italic leading-tight">{m.title}</h4>
                <p className="font-display text-slate-600 font-medium mt-1">{m.description}</p>
              </div>
              <div className="flex justify-between items-center border-t-2 border-dashed border-black pt-4">
                <span className="font-marker text-black text-sm uppercase">Recompensa: {m.reward} SXT</span>
                <button 
                  onClick={() => toggleMission(m.id)}
                  className="px-4 py-1 bg-black text-white font-comic text-sm comic-border hover:bg-secondary transition-colors"
                >
                  {m.isActive ? 'CERRAR' : 'REABRIR'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Creator Form */}
        <div className="bg-panel bg-[#211b27] comic-border p-8 flex flex-col gap-6 sticky top-8 h-fit">
          <h3 className="font-comic text-3xl uppercase italic tracking-widest text-comic-yellow">Nueva Directiva Heroica</h3>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="font-marker text-xs uppercase text-slate-500">Nombre de la Misión</label>
              <input 
                type="text" 
                className="w-full bg-background-dark border-4 border-black p-3 font-bold text-white focus:ring-secondary"
                value={newMission.title}
                onChange={e => setNewMission({...newMission, title: e.target.value})}
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="font-marker text-xs uppercase text-slate-500">Descripción del Objetivo</label>
              <textarea 
                className="w-full bg-background-dark border-4 border-black p-3 font-bold text-white focus:ring-secondary h-32"
                value={newMission.description}
                onChange={e => setNewMission({...newMission, description: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-marker text-xs uppercase text-slate-500">Recompensa (Sextos)</label>
              <input 
                type="number" 
                className="w-full bg-background-dark border-4 border-black p-3 font-bold text-white focus:ring-secondary"
                value={newMission.reward}
                onChange={e => setNewMission({...newMission, reward: Number(e.target.value)})}
              />
            </div>
          </div>

          <button 
            onClick={addMission}
            className="w-full py-5 bg-comic-yellow text-black font-comic text-2xl tracking-widest comic-border hover:bg-secondary hover:text-white transition-all transform hover:scale-[1.02] active:scale-95"
          >
            DESPLEGAR MISIÓN
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionControl;
