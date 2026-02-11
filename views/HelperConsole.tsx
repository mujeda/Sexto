
import React, { useState } from 'react';
import { AppState, Student, Reason } from '../types';

interface Props {
  state: AppState;
  helper: Student;
  onUpdateSextos: (studentId: string, amount: number) => void;
  onAwardBadge: (studentId: string, badgeId: string) => void;
}

const HelperConsole: React.FC<Props> = ({ state, helper, onUpdateSextos, onAwardBadge }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeMode, setActiveMode] = useState<'REWARD' | 'PENALTY' | 'BADGE'>('REWARD');
  const [awardedBadgesCount, setAwardedBadgesCount] = useState(0);

  const isFriday = new Date().getDay() === 5;

  const handleAction = (type: 'ADD' | 'SUB', reason: Reason) => {
    if (!selectedStudent) return;
    const amount = type === 'ADD' ? reason.value : -reason.value;
    onUpdateSextos(selectedStudent.id, amount);
    alert(`¡${selectedStudent.alias} ha recibido un ajuste de ${amount} Sextos por "${reason.text}"!`);
    setSelectedStudent(null);
  };

  const handleBadgeAward = (badgeId: string) => {
    if (!selectedStudent || awardedBadgesCount >= 2) return;
    onAwardBadge(selectedStudent.id, badgeId);
    setAwardedBadgesCount(prev => prev + 1);
    alert(`Badge otorgada a ${selectedStudent.alias}`);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-8 border-black pb-6">
        <div>
          <h2 className="font-comic text-6xl text-comic-red italic text-stroke tracking-tighter uppercase leading-none">CONSOLA AYUDANTE</h2>
          <p className="font-marker text-slate-400 mt-2 uppercase text-xs tracking-widest">Identificación: {helper.helperRole} // {helper.alias}</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => { setActiveMode('REWARD'); setSelectedStudent(null); }} className={`px-6 py-2 font-comic text-xl border-4 border-black transition-all ${activeMode === 'REWARD' ? 'bg-secondary text-white' : 'bg-white text-black'}`}>PREMIAR</button>
           <button onClick={() => { setActiveMode('PENALTY'); setSelectedStudent(null); }} className={`px-6 py-2 font-comic text-xl border-4 border-black transition-all ${activeMode === 'PENALTY' ? 'bg-comic-red text-white' : 'bg-white text-black'}`}>MULTAR</button>
           {isFriday && <button onClick={() => { setActiveMode('BADGE'); setSelectedStudent(null); }} className={`px-6 py-2 font-comic text-xl border-4 border-black transition-all ${activeMode === 'BADGE' ? 'bg-comic-yellow text-black' : 'bg-white text-black'}`}>BADGES VIERNES</button>}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Selector */}
        <div className="bg-white comic-border p-6 flex flex-col gap-4">
          <h3 className="font-comic text-2xl italic uppercase text-black border-b-2 border-black pb-1">Seleccionar Héroe</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {state.students.filter(s => s.id !== helper.id).map(s => (
              <button 
                key={s.id}
                onClick={() => setSelectedStudent(s)}
                className={`flex flex-col items-center p-3 border-4 border-black transition-all ${selectedStudent?.id === s.id ? 'bg-comic-yellow scale-105' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                <img src={s.avatar} className="size-12 rounded-full border-2 border-black bg-white mb-2 shadow-[2px_2px_0px_#000]" />
                <span className="font-marker text-[10px] uppercase truncate w-full text-black">{s.alias}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-panel bg-[#211b27] comic-border p-8 flex flex-col gap-6 border-secondary">
          {!selectedStudent ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center py-20 animate-pulse">
              <span className="material-symbols-outlined text-8xl mb-4 opacity-20">person_search</span>
              <p className="font-marker uppercase text-sm">Elige a un héroe a la izquierda para actuar</p>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in duration-300">
               <div className="flex items-center gap-4 mb-8 bg-black/40 p-4 border-2 border-dashed border-white/20">
                 <img src={selectedStudent.avatar} className="size-20 border-4 border-black rounded-lg bg-white" />
                 <div>
                   <h4 className="font-comic text-3xl text-white uppercase italic">{selectedStudent.alias}</h4>
                   <p className="font-marker text-xs text-comic-yellow uppercase">OBJETIVO LOCALIZADO</p>
                 </div>
                 <button onClick={() => setSelectedStudent(null)} className="ml-auto text-white/50 hover:text-white"><span className="material-symbols-outlined">close</span></button>
               </div>

               {activeMode === 'REWARD' && (
                 <div className="space-y-4">
                    <p className="font-marker text-xs text-slate-400 uppercase tracking-widest border-b border-white/10 pb-1">Motivos de Premio Autorizados:</p>
                    <div className="grid grid-cols-1 gap-2">
                       {state.rewardReasons.map(r => (
                         <button key={r.id} onClick={() => handleAction('ADD', r)} className="w-full text-left p-4 bg-green-600/10 border-2 border-green-600 text-white font-display text-sm uppercase font-bold hover:bg-green-600 group transition-all flex justify-between items-center shadow-[4px_4px_0px_rgba(22,163,74,0.2)]">
                           <span className="group-hover:translate-x-1 transition-transform">{r.text}</span>
                           <span className="font-comic text-2xl text-green-500 group-hover:text-white">+{r.value}</span>
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               {activeMode === 'PENALTY' && (
                 <div className="space-y-4">
                    <p className="font-marker text-xs text-slate-400 uppercase tracking-widest border-b border-white/10 pb-1">Infracciones y Multas:</p>
                    <div className="grid grid-cols-1 gap-2">
                       {state.penaltyReasons.map(r => (
                         <button key={r.id} onClick={() => handleAction('SUB', r)} className="w-full text-left p-4 bg-comic-red/10 border-2 border-comic-red text-white font-display text-sm uppercase font-bold hover:bg-comic-red group transition-all flex justify-between items-center shadow-[4px_4px_0px_rgba(237,29,36,0.2)]">
                           <span className="group-hover:translate-x-1 transition-transform">{r.text}</span>
                           <span className="font-comic text-2xl text-comic-red group-hover:text-white">-{r.value}</span>
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               {activeMode === 'BADGE' && (
                 <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-1">
                       <p className="font-marker text-xs text-slate-400 uppercase">Seleccionar Medalla ({awardedBadgesCount}/2 hoy):</p>
                    </div>
                    {awardedBadgesCount < 2 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {state.badges.map(b => (
                          <button key={b.id} onClick={() => handleBadgeAward(b.id)} className="p-4 bg-white border-4 border-black text-black flex flex-col items-center hover:bg-comic-yellow hover:rotate-2 transition-all group">
                             <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-125 transition-transform text-secondary">{b.icon}</span>
                             <span className="font-comic text-lg uppercase leading-none">{b.name}</span>
                             <span className="font-marker text-[9px] mt-2 text-green-600">+{b.rewardSextos} SXT</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 text-center bg-black/50 border-4 border-dashed border-white/10">
                        <span className="material-symbols-outlined text-comic-yellow text-6xl mb-2">lock</span>
                        <p className="font-comic text-3xl text-comic-yellow italic uppercase">Cupo Semanal Completo</p>
                        <p className="font-marker text-xs text-slate-400 mt-2">Has entregado tus 2 medallas de este viernes.</p>
                      </div>
                    )}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelperConsole;
