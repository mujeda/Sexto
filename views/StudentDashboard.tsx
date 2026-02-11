
import React, { useState, useEffect } from 'react';
import { Student, AppState, Purchase } from '../types';

interface Props {
  student: Student;
  state: AppState;
  onUseItem?: (purchaseId: string) => void;
  onMissionSeen?: (missionId: string) => void;
}

const StudentDashboard: React.FC<Props> = ({ student, state, onUseItem, onMissionSeen }) => {
  const [showMissionAlert, setShowMissionAlert] = useState(false);
  const [showHelperAlert, setShowHelperAlert] = useState(false);

  useEffect(() => {
    if (state.latestMissionId && student.lastSeenMissionId !== state.latestMissionId) {
      setShowMissionAlert(true);
    }
  }, [state.latestMissionId, student.lastSeenMissionId]);

  useEffect(() => {
    // If student just became a helper (simulated by checking if role is assigned but modal not shown)
    if (student.isHelper && !localStorage.getItem(`helper_alert_${student.id}`)) {
      setShowHelperAlert(true);
    }
  }, [student.isHelper, student.id]);

  const handleCloseHelperAlert = () => {
    setShowHelperAlert(false);
    localStorage.setItem(`helper_alert_${student.id}`, 'true');
  };

  const handleCloseMission = () => {
    setShowMissionAlert(false);
    if (onMissionSeen && state.latestMissionId) {
      onMissionSeen(state.latestMissionId);
    }
  };

  const availablePurchases = student.purchases.filter(p => !p.used);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Profiles Header */}
      <div className="bg-panel bg-[#1b2333] comic-border overflow-hidden">
        <header className="bg-secondary px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-white text-3xl">rocket_launch</span>
            <h1 className="text-white font-comic text-2xl italic">CUARTEL DE HÉROE</h1>
          </div>
          {student.isHelper && (
            <div className="bg-comic-red px-4 py-1 border-2 border-black rotate-3 shadow-[2px_2px_0px_#000]">
              <span className="font-comic text-white uppercase italic text-sm">RANGO: AYUDANTE</span>
            </div>
          )}
        </header>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative">
              <div className="size-32 rounded-lg bg-secondary/20 border-4 border-secondary overflow-hidden">
                <img src={student.avatar} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-green-500 text-white font-comic text-sm px-3 py-1 comic-border rotate-3">ACTIVO</div>
            </div>

            <div className="flex-1 space-y-4">
              <h2 className="text-white text-5xl font-comic italic uppercase text-stroke leading-none">{student.alias}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/30 p-3 comic-border">
                  <p className="font-marker text-[9px] text-slate-500 uppercase">Balance Sextos</p>
                  <p className="font-comic text-2xl text-comic-yellow">{student.sextos} SXT</p>
                </div>
                <div className="bg-black/30 p-3 comic-border">
                  <p className="font-marker text-[9px] text-slate-500 uppercase">Nivel Heroico</p>
                  <p className="font-comic text-2xl text-white">LVL {student.level}</p>
                </div>
                {student.isHelper && (
                  <div className="bg-comic-yellow p-3 comic-border text-black">
                    <p className="font-marker text-[9px] uppercase">Función Semanal</p>
                    <p className="font-comic text-xl uppercase italic">{student.helperRole || 'Ayudante General'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inventory */}
        <div className="bg-white comic-border p-6 space-y-6">
          <h3 className="font-comic text-3xl uppercase italic text-black border-b-4 border-black pb-2">INVENTARIO</h3>
          <div className="space-y-4">
            {availablePurchases.length === 0 ? (
              <p className="py-8 text-center text-slate-400 font-marker">Bolsillo vacío...</p>
            ) : (
              availablePurchases.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-slate-100 p-4 border-2 border-black">
                  <span className="font-comic text-xl text-black">{p.name}</span>
                  <button onClick={() => onUseItem?.(p.id)} className="bg-secondary text-white font-comic px-4 py-2 border-2 border-black hover:bg-black transition-all">USAR</button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Missions */}
        <div className="bg-comic-yellow comic-border p-6">
          <h3 className="font-comic text-3xl uppercase italic text-black border-b-2 border-black pb-2 mb-4">MISIÓN ACTUAL</h3>
          {state.missions.filter(m => m.isActive).slice(0, 1).map(m => (
            <div key={m.id} className="bg-white p-4 border-2 border-black shadow-[4px_4px_0px_#000]">
              <h4 className="font-comic text-xl text-black uppercase">{m.title}</h4>
              <p className="text-xs text-slate-600 mt-1 font-bold">{m.description}</p>
              <div className="mt-4 flex justify-between items-end">
                <span className="bg-comic-red text-white font-comic text-xs px-2 border-2 border-black">+{m.reward} SXT</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Helper Modal */}
      {showHelperAlert && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-comic-red border-8 border-black p-8 comic-border max-w-md animate-bounce-short">
            <h2 className="font-comic text-5xl text-white text-stroke mb-4 italic">¡HAS SIDO ELEGIDO!</h2>
            <div className="bg-white p-6 comic-border text-black mb-6">
              <p className="font-marker uppercase text-xs text-slate-500 mb-2">Nueva Responsabilidad</p>
              <p className="font-comic text-3xl mb-2">ROL: {student.helperRole}</p>
              <p className="font-marker text-xs text-slate-600 border-t border-dashed border-black pt-4 mt-2 italic">
                {student.helperRoleDescription || 'Tu labor es fundamental para el éxito de la clase.'}
              </p>
              <div className="bg-secondary/10 p-3 mt-4 border border-secondary/20">
                 <p className="font-display font-bold text-sm text-slate-800">Se ha activado tu consola de control. Úsala sabiamente para mantener el orden en el multiverso.</p>
              </div>
            </div>
            <button onClick={handleCloseHelperAlert} className="w-full py-4 bg-white text-comic-red font-comic text-2xl border-4 border-black shadow-[4px_4px_0px_#000] active:shadow-none translate-y-0 active:translate-y-1">ACEPTAR CARGO</button>
          </div>
        </div>
      )}

      {/* Mission Modal */}
      {showMissionAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="bg-white border-8 border-black p-8 comic-border max-w-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-8xl">priority_high</span></div>
            <h2 className="font-comic text-5xl text-comic-red italic mb-2">¡NUEVA MISIÓN!</h2>
            <div className="border-y-4 border-black py-6 my-6 bg-slate-50 p-4">
              <h3 className="font-comic text-3xl text-black">{state.missions.find(m => m.id === state.latestMissionId)?.title}</h3>
              <p className="font-display font-bold text-slate-600 mt-2">{state.missions.find(m => m.id === state.latestMissionId)?.description}</p>
            </div>
            <button onClick={handleCloseMission} className="w-full py-5 bg-secondary text-white font-comic text-3xl tracking-widest border-4 border-black shadow-[6px_6px_0px_#000] hover:scale-[1.02] transition-transform">MISIÓN VISTA</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
