
import React, { useState } from 'react';
import { AppState, Student } from '../types';

interface Props {
  state: AppState;
  onUpdateSextos: (id: string, amount: number) => void;
  onMassiveAdjustment?: (amount: number) => void;
}

const TeacherDashboard: React.FC<Props> = ({ state, onUpdateSextos, onMassiveAdjustment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdjustmentAmount, setSelectedAdjustmentAmount] = useState(10);

  const filteredStudents = state.students.filter(s =>
    s.alias.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSextos = state.students.reduce((sum, s) => sum + s.sextos, 0);

  const adjustmentOptions = [10, 20, 50, 100];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col xl:flex-row justify-between items-end gap-6">
        <div className="w-full xl:w-auto">
          <h2 className="font-comic text-5xl text-comic-yellow tracking-widest text-stroke italic uppercase leading-none">HERO COMMAND CENTER</h2>
          <p className="font-marker text-slate-400 mt-2 uppercase text-xs tracking-widest">Estado global del multiverso - {state.students.length} héroes activos</p>
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-6 w-full xl:w-auto">
          {/* Global Adjustment Control */}
          <div className="bg-panel/80 border-4 border-black p-3 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto shadow-[6px_6px_0px_#000]">
            <div className="flex flex-col items-center sm:items-start">
              <span className="font-marker text-[10px] text-white uppercase mb-1 tracking-widest">Ajuste Masivo</span>
              <div className="flex gap-1">
                {adjustmentOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSelectedAdjustmentAmount(opt)}
                    className={`size-8 font-comic text-lg border-2 border-black transition-all ${selectedAdjustmentAmount === opt ? 'bg-comic-yellow text-black scale-110' : 'bg-white text-black'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onMassiveAdjustment?.(selectedAdjustmentAmount)}
                className="px-4 py-2 bg-green-600 text-white font-comic text-xl uppercase italic border-2 border-black hover:bg-green-500 transition-colors shadow-[2px_2px_0px_#000] active:translate-y-0.5"
                title={`Sumar ${selectedAdjustmentAmount} a todos`}
              >
                BONUS EXTRA
              </button>
              <button
                onClick={() => onMassiveAdjustment?.(-selectedAdjustmentAmount)}
                className="px-4 py-2 bg-comic-red text-white font-comic text-xl uppercase italic border-2 border-black hover:bg-red-500 transition-colors shadow-[2px_2px_0px_#000] active:translate-y-0.5"
                title={`Restar ${selectedAdjustmentAmount} a todos`}
              >
                VACIAR FONDOS
              </button>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-black text-2xl font-bold">search</span>
            <input
              type="text"
              placeholder="BUSCAR HÉROE..."
              className="w-full pl-12 pr-4 py-3 bg-white border-4 border-black text-black font-bold rounded-none focus:ring-0 italic text-sm uppercase outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-comic-red comic-border p-5 flex items-center gap-4 transform -rotate-1 shadow-[8px_8px_0px_rgba(237,29,36,0.3)] group hover:rotate-0 transition-transform">
          <div className="size-14 bg-white rounded-full flex items-center justify-center border-4 border-black group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl text-comic-red font-black">account_balance_wallet</span>
          </div>
          <div>
            <p className="font-marker text-[10px] text-white uppercase opacity-90 tracking-tighter">Bóveda General Clase</p>
            <p className="font-comic text-4xl text-white leading-none text-stroke">{totalSextos.toLocaleString()} SXT</p>
          </div>
        </div>

        <div className="bg-secondary comic-border p-5 flex items-center gap-4 transform rotate-1 shadow-[8px_8px_0px_rgba(13,89,242,0.3)]">
          <span className="material-symbols-outlined text-4xl text-white">shield</span>
          <div>
            <p className="font-marker text-[10px] text-white uppercase opacity-80">Misiones Activas</p>
            <p className="font-comic text-4xl text-white leading-none text-stroke">12 STRIKES</p>
          </div>
        </div>

        <div className="bg-comic-yellow comic-border p-5 flex items-center gap-4 transform -rotate-1 shadow-[8px_8px_0px_rgba(254,203,0,0.3)]">
          <span className="material-symbols-outlined text-4xl text-black">military_tech</span>
          <div>
            <p className="font-marker text-[10px] text-black uppercase opacity-70">Nivel Medio</p>
            <p className="font-comic text-4xl text-black leading-none uppercase">LVL 14</p>
          </div>
        </div>

        <div className="bg-white comic-border p-5 flex items-center gap-4 transform rotate-1 shadow-[8px_8px_0px_rgba(255,255,255,0.2)]">
          <span className="material-symbols-outlined text-4xl text-comic-red">emergency</span>
          <div>
            <p className="font-marker text-[10px] text-slate-500 uppercase">Alertas</p>
            <p className="font-comic text-4xl text-black leading-none uppercase">3 CRÍTICAS</p>
          </div>
        </div>
      </div>

      {/* Hero Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 pb-12">
        {filteredStudents.map(student => (
          <div key={student.id} className="bg-white comic-card p-4 flex flex-col items-center text-center relative group">
            {student.isHelper && (
              <div className="absolute -top-3 -left-3 bg-comic-yellow border-4 border-black p-1 rounded-full rotate-[-12deg] z-10 shadow-[2px_2px_0px_#000]">
                <span className="material-symbols-outlined text-black font-black">verified_user</span>
              </div>
            )}

            <div className="relative mb-3">
              <div className="size-24 bg-slate-100 border-4 border-black overflow-hidden relative shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                <img src={student.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute -top-3 -right-3 bg-comic-red text-white font-comic text-2xl px-2 border-4 border-black shadow-[2px_2px_0px_#000] rotate-12">
                {student.level}
              </div>
            </div>

            <h3 className="font-comic text-xl text-black uppercase leading-tight mb-2 border-b-2 border-black/10 w-full pb-1 truncate" title={student.alias}>
              {student.alias}
            </h3>

            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="font-marker text-[10px] text-secondary">SXT: <span className="font-comic text-lg text-black">{student.sextos}</span></span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onUpdateSextos(student.id, -10)}
                    className="size-5 flex items-center justify-center bg-white border-2 border-black text-black font-bold hover:bg-comic-red hover:text-white transition-all active:scale-90"
                  >-</button>
                  <button
                    onClick={() => onUpdateSextos(student.id, 10)}
                    className="size-5 flex items-center justify-center bg-white border-2 border-black text-black font-bold hover:bg-secondary hover:text-white transition-all active:scale-90"
                  >+</button>
                </div>
              </div>
              <div className="w-full bg-slate-200 border-2 border-black h-3 overflow-hidden">
                <div
                  className="bg-comic-yellow h-full transition-all duration-700 ease-out shadow-[inset_-2px_0_4px_rgba(0,0,0,0.2)]"
                  style={{ width: `${Math.min(100, (student.sextos / 1500) * 100)}%` }}
                ></div>
              </div>
            </div>

            <button className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 font-marker text-[8px] text-slate-400 uppercase hover:text-secondary">Ver Expediente</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
