
import React, { useState, useEffect } from 'react';
import { Role, AppState, ShopItem, Purchase, Student, Reason, Badge } from './types';
import { INITIAL_STUDENTS, INITIAL_MISSIONS, INITIAL_BADGES, INITIAL_SHOP } from './constants';
import TeacherDashboard from './views/TeacherDashboard';
import StudentDashboard from './views/StudentDashboard';
import GadgetLab from './views/GadgetLab';
import MissionControl from './views/MissionControl';
import TeacherConfig from './views/TeacherConfig';
import Login from './views/Login';
import Shop from './views/Shop';
import HelperConsole from './views/HelperConsole';

const App: React.FC = () => {
  const [role, setRole] = useState<Role>('GUEST');
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>('DASHBOARD');

  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('universexto_state_v6');
    if (saved) return JSON.parse(saved);
    return {
      teacherProfile: {
        name: 'Profesor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher'
      },
      students: INITIAL_STUDENTS,
      missions: INITIAL_MISSIONS,
      badges: INITIAL_BADGES,
      shopItems: INITIAL_SHOP,
      weeklyPayout: 50,
      secretCode: 'HERO-2024',
      payrollMessage: 'Los fondos han sido transferidos a tu bóveda personal.',
      helperRoles: [
        { name: 'Capitán de Orden', description: 'Encargado de supervisar que las filas y el comportamiento en el aula sean heroicos.' },
        { name: 'Guardián del Material', description: 'Responsable de repartir y recoger el equipamiento de la misión diaria.' },
        { name: 'Explorador de Limpieza', description: 'Asegura que la base de operaciones (el aula) quede impecable tras la jornada.' },
        { name: 'Vigilante del Ruido', description: 'Controla el sensor sónico para evitar multas masivas por estruendo.' }
      ],
      rewardReasons: [
        { id: 'r1', text: 'Buen comportamiento', value: 10 },
        { id: 'r2', text: 'Participación activa', value: 20 },
        { id: 'r3', text: 'Ayudar a un compañero', value: 15 },
        { id: 'r4', text: 'Tarea extra', value: 50 }
      ],
      penaltyReasons: [
        { id: 'p1', text: 'Ruido excesivo', value: 10 },
        { id: 'p2', text: 'Falta de material', value: 15 },
        { id: 'p3', text: 'No seguir instrucciones', value: 20 },
        { id: 'p4', text: 'Mesa desordenada', value: 10 }
      ],
      latestMissionId: 'm1'
    };
  });

  useEffect(() => {
    localStorage.setItem('universexto_state_v6', JSON.stringify(state));
  }, [state]);

  const updateStudentSextos = (id: string, amount: number) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => {
        if (s.id !== id) return s;
        const newLifetime = amount > 0 ? s.lifetimeSextos + amount : s.lifetimeSextos;
        const newLevel = Math.floor(newLifetime / 200) + 1;
        return {
          ...s,
          sextos: Math.max(0, s.sextos + amount),
          lifetimeSextos: newLifetime,
          level: newLevel
        };
      })
    }));
  };

  const awardBadgeToStudent = (studentId: string, badgeId: string) => {
    const badge = state.badges.find(b => b.id === badgeId);
    if (!badge) return;

    setState(prev => ({
      ...prev,
      students: prev.students.map(s => {
        if (s.id !== studentId) return s;
        const newLifetime = s.lifetimeSextos + badge.rewardSextos;
        const newLevel = Math.floor(newLifetime / 200) + 1;
        return {
          ...s,
          badges: [...s.badges, badgeId],
          sextos: s.sextos + badge.rewardSextos,
          lifetimeSextos: newLifetime,
          level: newLevel
        };
      })
    }));
  };

  const applyMassiveAdjustment = (amount: number) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => {
        const newLifetime = amount > 0 ? s.lifetimeSextos + amount : s.lifetimeSextos;
        const newLevel = Math.floor(newLifetime / 200) + 1;
        return {
          ...s,
          sextos: Math.max(0, s.sextos + amount),
          lifetimeSextos: newLifetime,
          level: newLevel
        };
      })
    }));
  };

  const updateStudentMissionSeen = (studentId: string, missionId: string) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === studentId ? { ...s, lastSeenMissionId: missionId } : s)
    }));
  };

  const togglePurchaseUsage = (studentId: string, purchaseId: string, forceUsed?: boolean) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(s =>
        s.id === studentId ? {
          ...s,
          purchases: s.purchases.map(p => p.id === purchaseId ? { ...p, used: forceUsed !== undefined ? forceUsed : !p.used } : p)
        } : s
      )
    }));
  };

  const handleLogout = () => {
    setRole('GUEST');
    setActiveStudentId(null);
  };

  if (role === 'GUEST') {
    return (
      <Login
        onTeacherLogin={() => setRole('TEACHER')}
        onStudentLogin={(id) => {
          setRole('STUDENT');
          setActiveStudentId(id);
          setCurrentView('DASHBOARD');
        }}
        students={state.students}
      />
    );
  }

  const activeStudent = state.students.find(s => s.id === activeStudentId);

  return (
    <div className="flex h-screen overflow-hidden bg-background-dark halftone">
      <aside className="w-72 bg-comic-yellow border-r-4 border-black flex flex-col h-full relative z-20 shadow-[8px_0px_30px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(black_1px,transparent_0)] bg-[length:4px_4px]"></div>
        <div className="p-6">
          <div className="comic-border overflow-hidden bg-comic-red hover:scale-105 transition-transform cursor-pointer group p-4">
            <h2 className="font-comic text-4xl text-white italic uppercase tracking-tighter text-stroke leading-none text-center">
              UNIVERSEXTO
            </h2>
            <p className="font-marker text-comic-yellow text-sm uppercase tracking-widest text-center mt-1">
              HERO HQ
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-3 mt-4 overflow-y-auto custom-scrollbar">
          {role === 'TEACHER' ? (
            <>
              <button onClick={() => setCurrentView('DASHBOARD')} className={`w-full flex items-center gap-3 px-6 py-4 comic-border transition-all ${currentView === 'DASHBOARD' ? 'bg-secondary text-white shadow-none translate-x-1 translate-y-1' : 'bg-white text-black hover:rotate-1'}`}>
                <span className="material-symbols-outlined">dashboard</span>
                <span className="font-comic text-xl uppercase tracking-tighter">Dashboard</span>
              </button>
              <button onClick={() => setCurrentView('GADGET_LAB')} className={`w-full flex items-center gap-3 px-6 py-4 comic-border transition-all ${currentView === 'GADGET_LAB' ? 'bg-secondary text-white shadow-none translate-x-1 translate-y-1' : 'bg-white text-black hover:rotate-1'}`}>
                <span className="material-symbols-outlined">construction</span>
                <span className="font-comic text-xl uppercase tracking-tighter">Gadget Lab</span>
              </button>
              <button onClick={() => setCurrentView('SHOP')} className={`w-full flex items-center gap-3 px-6 py-4 comic-border transition-all ${currentView === 'SHOP' ? 'bg-secondary text-white shadow-none translate-x-1 translate-y-1' : 'bg-white text-black hover:rotate-1'}`}>
                <span className="material-symbols-outlined">shopping_cart</span>
                <span className="font-comic text-xl uppercase tracking-tighter">Tienda</span>
              </button>
              <button onClick={() => setCurrentView('MISSIONS')} className={`w-full flex items-center gap-3 px-6 py-4 comic-border transition-all ${currentView === 'MISSIONS' ? 'bg-secondary text-white shadow-none translate-x-1 translate-y-1' : 'bg-white text-black hover:rotate-1'}`}>
                <span className="material-symbols-outlined">rocket_launch</span>
                <span className="font-comic text-xl uppercase tracking-tighter">Missions</span>
              </button>
              <button onClick={() => setCurrentView('CONFIG')} className={`w-full flex items-center gap-3 px-6 py-4 comic-border transition-all ${currentView === 'CONFIG' ? 'bg-secondary text-white shadow-none translate-x-1 translate-y-1' : 'bg-white text-black hover:rotate-1'}`}>
                <span className="material-symbols-outlined">settings</span>
                <span className="font-comic text-xl uppercase tracking-tighter">Config</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setCurrentView('DASHBOARD')} className={`w-full flex items-center gap-3 px-6 py-4 comic-border transition-all ${currentView === 'DASHBOARD' ? 'bg-secondary text-white shadow-none translate-x-1 translate-y-1' : 'bg-white text-black hover:rotate-1'}`}>
                <span className="material-symbols-outlined">person</span>
                <span className="font-comic text-xl uppercase tracking-tighter">Mi Cuartel</span>
              </button>
              <button onClick={() => setCurrentView('SHOP')} className={`w-full flex items-center gap-3 px-6 py-4 comic-border transition-all ${currentView === 'SHOP' ? 'bg-secondary text-white shadow-none translate-x-1 translate-y-1' : 'bg-white text-black hover:rotate-1'}`}>
                <span className="material-symbols-outlined">shopping_cart</span>
                <span className="font-comic text-xl uppercase tracking-tighter">Tienda</span>
              </button>
              {activeStudent?.isHelper && (
                <button onClick={() => setCurrentView('HELPER')} className={`w-full flex items-center gap-3 px-6 py-4 comic-border transition-all ${currentView === 'HELPER' ? 'bg-comic-red text-white shadow-none translate-x-1 translate-y-1' : 'bg-white text-black hover:-rotate-1'}`}>
                  <span className="material-symbols-outlined">verified_user</span>
                  <span className="font-comic text-xl uppercase tracking-tighter">Consola Ayudante</span>
                </button>
              )}
            </>
          )}
        </nav>

        <div className="p-6 mt-auto">
          <button onClick={handleLogout} className="w-full bg-comic-red text-white font-comic text-xl py-3 border-4 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest">
            Salir
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative p-8 custom-scrollbar">
        {role === 'TEACHER' ? (
          <>
            {currentView === 'DASHBOARD' && <TeacherDashboard state={state} onUpdateSextos={updateStudentSextos} onMassiveAdjustment={applyMassiveAdjustment} />}
            {currentView === 'GADGET_LAB' && <GadgetLab state={state} onUpdateSextos={updateStudentSextos} />}
            {currentView === 'MISSIONS' && <MissionControl state={state} setState={setState} />}
            {currentView === 'CONFIG' && <TeacherConfig state={state} setState={setState} />}
            {currentView === 'SHOP' && <Shop role="TEACHER" state={state} onUpdateShop={(items) => setState(prev => ({ ...prev, shopItems: items }))} />}
          </>
        ) : (
          <>
            {currentView === 'DASHBOARD' && activeStudent && (
              <StudentDashboard
                student={activeStudent}
                state={state}
                onUseItem={(purchaseId) => togglePurchaseUsage(activeStudentId!, purchaseId, true)}
                onMissionSeen={(mid) => updateStudentMissionSeen(activeStudentId!, mid)}
              />
            )}
            {currentView === 'SHOP' && activeStudent && (
              <Shop role="STUDENT" state={state} studentId={activeStudentId!} onBuyItem={(item) => {
                if (activeStudent.sextos < item.price) return;
                updateStudentSextos(activeStudent.id, -item.price);
                const newPurchase: Purchase = {
                  id: Math.random().toString(),
                  itemId: item.id,
                  name: item.name,
                  used: false,
                  date: new Date().toISOString()
                };
                setState(prev => ({
                  ...prev,
                  students: prev.students.map(s => s.id === activeStudent.id ? { ...s, purchases: [newPurchase, ...s.purchases] } : s)
                }));
              }} />
            )}
            {currentView === 'HELPER' && activeStudent?.isHelper && (
              <HelperConsole state={state} helper={activeStudent} onUpdateSextos={updateStudentSextos} onAwardBadge={awardBadgeToStudent} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
