
import React, { useState } from 'react';
import { Student } from '../types';

interface LoginProps {
  onTeacherLogin: () => void;
  onStudentLogin: (id: string) => void;
  students: Student[];
}

const Login: React.FC<LoginProps> = ({ onTeacherLogin, onStudentLogin, students }) => {
  const [mode, setMode] = useState<'CHOICE' | 'TEACHER' | 'STUDENT'>('CHOICE');
  const [inputCode, setInputCode] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleTeacherAuth = () => {
    if (inputCode === 'ADMIN-6') onTeacherLogin();
    else setError('Código de profesor incorrecto');
  };

  const handleStudentAuth = (student: Student) => {
    if (inputCode === student.secretCode) {
      onStudentLogin(student.id);
    } else {
      setError('Código secreto incorrecto. Pídeselo a tu profesor.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark halftone p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block mb-6 group transition-all duration-500">
            <img 
              src="https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/header-logo.png" 
              alt="UNIVERSEXTO MARVEL" 
              className="w-full max-w-xl h-auto border-4 border-black shadow-[12px_12px_0px_#ed1d24] group-hover:shadow-[12px_12px_0px_#fecb00] group-hover:-translate-y-1 transition-all"
            />
          </div>
          <h2 className="text-3xl font-comic text-comic-yellow italic uppercase tracking-widest text-stroke">Centro de Acceso Universal</h2>
        </div>

        <div className="max-w-md mx-auto bg-white p-8 comic-border space-y-6">
          {mode === 'CHOICE' && (
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setMode('TEACHER')}
                className="py-4 bg-secondary text-white font-comic text-2xl tracking-widest comic-border hover:scale-105 transition-transform"
              >
                SOY EL PROFESOR
              </button>
              <button 
                onClick={() => setMode('STUDENT')}
                className="py-4 bg-comic-yellow text-black font-comic text-2xl tracking-widest comic-border hover:scale-105 transition-transform"
              >
                SOY UN HÉROE
              </button>
            </div>
          )}

          {mode === 'TEACHER' && (
            <div className="space-y-4">
              <label className="block text-black font-bold uppercase text-sm">Clave de Acceso Profesor</label>
              <input 
                type="password"
                className="w-full border-4 border-black p-3 text-black font-bold focus:ring-0"
                placeholder="****"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
              />
              <button 
                onClick={handleTeacherAuth}
                className="w-full py-4 bg-secondary text-white font-comic text-2xl tracking-widest comic-border"
              >
                ENTRAR AL PANEL
              </button>
              <button onClick={() => setMode('CHOICE')} className="text-slate-400 font-bold uppercase text-xs w-full text-center">Volver</button>
            </div>
          )}

          {mode === 'STUDENT' && !selectedStudentId && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-bold uppercase mb-2">Identifícate, Héroe:</p>
              <div className="max-h-64 overflow-y-auto space-y-2 border-2 border-black p-2">
                {students.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => {
                      setSelectedStudentId(s.id);
                      setError('');
                    }}
                    className="w-full flex items-center gap-3 p-2 bg-slate-100 hover:bg-comic-yellow transition-colors border-2 border-black font-bold text-black"
                  >
                    <img src={s.avatar} className="size-8 bg-white border border-black rounded-full" />
                    <span className="flex-1 text-left">{s.alias}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setMode('CHOICE')} className="text-slate-400 font-bold uppercase text-xs w-full text-center mt-2">Volver</button>
            </div>
          )}

          {mode === 'STUDENT' && selectedStudentId && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-slate-100 p-3 border-2 border-black">
                <img src={students.find(s => s.id === selectedStudentId)?.avatar} className="size-12 bg-white border border-black rounded-full" />
                <div className="flex-1">
                   <p className="text-[10px] text-slate-500 font-bold uppercase">Identidad Seleccionada</p>
                   <p className="font-comic text-xl text-black">{students.find(s => s.id === selectedStudentId)?.alias}</p>
                </div>
                <button onClick={() => setSelectedStudentId(null)} className="text-slate-400 hover:text-black">
                   <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              
              <label className="block text-black font-bold uppercase text-sm">Tu Código Secreto Personal</label>
              <input 
                type="text"
                className="w-full border-4 border-black p-3 text-black font-bold focus:ring-0"
                placeholder="HERO-XXXX"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
              />
              <button 
                onClick={() => handleStudentAuth(students.find(s => s.id === selectedStudentId)!)}
                className="w-full py-4 bg-comic-yellow text-black font-comic text-2xl tracking-widest comic-border"
              >
                CONFIRMAR ACCESO
              </button>
              <button onClick={() => setSelectedStudentId(null)} className="text-slate-400 font-bold uppercase text-xs w-full text-center mt-2">Cambiar de Héroe</button>
            </div>
          )}

          {error && <p className="text-comic-red font-bold text-center animate-bounce uppercase text-sm italic">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
