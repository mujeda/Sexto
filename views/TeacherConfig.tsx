
import React, { useState } from 'react';
import { AppState, Badge, Student, Reason, HelperRoleConfig, TeacherProfile } from '../types';


interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const TeacherConfig: React.FC<Props> = ({ state, setState }) => {
  const [activeTab, setActiveTab] = useState<'HEROES' | 'HELPERS' | 'REASONS' | 'BADGES' | 'SYSTEM'>('HEROES');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHeroInventory, setSelectedHeroInventory] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newReasonText, setNewReasonText] = useState('');
  const [newReasonValue, setNewReasonValue] = useState(10);
  const [newBadge, setNewBadge] = useState<Partial<Badge>>({ name: '', icon: 'military_tech', rewardSextos: 20 });

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `universexto_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (confirm("¿Estás seguro de que quieres sobreescribir todos los datos actuales con esta copia de seguridad?")) {
          setState(json);
          alert("Datos importados con éxito.");
        }
      } catch (error) {
        alert("Error al importar: El archivo no es un formato válido de Universexto.");
      }
    };
    reader.readAsText(file);
  };

  const updateStudentField = (id: string, field: keyof Student, value: any) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const resetCode = (id: string) => {
    const newCode = `HERO-${Math.floor(1000 + Math.random() * 8999)}`;
    updateStudentField(id, 'secretCode', newCode);
  };

  const toggleHelper = (studentId: string) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => {
        if (s.id !== studentId) return s;
        const willBeHelper = !s.isHelper;
        const defaultRole = prev.helperRoles[0];
        return {
          ...s,
          isHelper: willBeHelper,
          hasBeenHelper: s.hasBeenHelper || willBeHelper,
          helperRole: willBeHelper ? defaultRole.name : undefined,
          helperRoleDescription: willBeHelper ? defaultRole.description : undefined
        };
      })
    }));
  };

  const updateStudentHelperRole = (studentId: string, roleName: string) => {
    const role = state.helperRoles.find(r => r.name === roleName);
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === studentId ? {
        ...s,
        helperRole: roleName,
        helperRoleDescription: role?.description
      } : s)
    }));
  };

  const addBadge = () => {
    if (!newBadge.name) return;
    const badge: Badge = {
      id: Math.random().toString(),
      name: newBadge.name,
      description: newBadge.description || '',
      icon: newBadge.icon || 'star',
      rewardSextos: newBadge.rewardSextos || 0
    };
    setState(prev => ({ ...prev, badges: [...prev.badges, badge] }));
    setNewBadge({ name: '', icon: 'military_tech', rewardSextos: 20 });
  };

  const addReason = (type: 'REWARD' | 'PENALTY') => {
    if (!newReasonText) return;
    const reason: Reason = {
      id: Math.random().toString(),
      text: newReasonText,
      value: newReasonValue
    };
    setState(prev => ({
      ...prev,
      [type === 'REWARD' ? 'rewardReasons' : 'penaltyReasons']: [...(type === 'REWARD' ? prev.rewardReasons : prev.penaltyReasons), reason]
    }));
    setNewReasonText('');
    setNewReasonValue(10);
  };

  const updateReason = (type: 'REWARD' | 'PENALTY', id: string, field: keyof Reason, value: any) => {
    setState(prev => ({
      ...prev,
      [type === 'REWARD' ? 'rewardReasons' : 'penaltyReasons']: (type === 'REWARD' ? prev.rewardReasons : prev.penaltyReasons).map(r =>
        r.id === id ? { ...r, [field]: value } : r
      )
    }));
  };

  const removeReason = (type: 'REWARD' | 'PENALTY', id: string) => {
    setState(prev => ({
      ...prev,
      [type === 'REWARD' ? 'rewardReasons' : 'penaltyReasons']: (type === 'REWARD' ? prev.rewardReasons : prev.penaltyReasons).filter(r => r.id !== id)
    }));
  };

  const addHelperRole = () => {
    if (!newRoleName) return;
    const newRole: HelperRoleConfig = { name: newRoleName, description: newRoleDescription };
    setState(prev => ({ ...prev, helperRoles: [...prev.helperRoles, newRole] }));
    setNewRoleName('');
    setNewRoleDescription('');
  };

  const updateHelperRoleConfig = (index: number, field: keyof HelperRoleConfig, value: string) => {
    setState(prev => ({
      ...prev,
      helperRoles: prev.helperRoles.map((r, i) => i === index ? { ...r, [field]: value } : r)
    }));
  };

  const removeHelperRole = (index: number) => {
    setState(prev => ({
      ...prev,
      helperRoles: prev.helperRoles.filter((_, i) => i !== index)
    }));
  };

  const filteredStudents = state.students.filter(s =>
    s.alias.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="font-comic text-5xl text-comic-yellow italic text-stroke">Configuración Avanzada</h2>
      </header>

      <div className="flex border-b-4 border-black gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {['HEROES', 'HELPERS', 'REASONS', 'BADGES', 'SYSTEM'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`px-6 py-2 font-comic text-xl border-t-4 border-x-4 border-black transition-all flex-shrink-0 ${activeTab === t ? 'bg-secondary text-white' : 'bg-white text-black translate-y-1'}`}
          >
            {t === 'HEROES' ? 'GESTIÓN HÉROES' : t === 'HELPERS' ? 'AYUDANTES' : t === 'REASONS' ? 'MOTIVOS' : t === 'BADGES' ? 'BADGES' : 'SISTEMA'}
          </button>
        ))}
      </div>

      {activeTab === 'HEROES' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center bg-white comic-border p-4 gap-4">
            <h3 className="font-comic text-2xl uppercase italic text-slate-900">Base de Datos de Identidades</h3>
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                type="text"
                placeholder="Buscar héroe..."
                className="w-full pl-10 pr-4 py-2 border-2 border-black font-bold text-slate-900 uppercase text-xs"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white comic-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-100 border-b-4 border-black font-comic text-lg uppercase text-slate-900">
                  <tr>
                    <th className="p-4">Héroe (Alias)</th>
                    <th className="p-4 text-center">Código Acceso</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {filteredStudents.map(s => (
                    <React.Fragment key={s.id}>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative group">
                              <img src={s.avatar} className="size-10 border-2 border-black rounded-full bg-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity" />
                              <label
                                className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 hover:bg-black/60 rounded-full transition-all group-hover:opacity-100 opacity-0"
                                title="Cambiar avatar"
                              >
                                <span className="material-symbols-outlined text-white text-sm">upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const base64 = event.target?.result as string;
                                      updateStudentField(s.id, 'avatar', base64);
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            <input
                              type="text"
                              value={s.alias}
                              onChange={e => updateStudentField(s.id, 'alias', e.target.value)}
                              className="bg-transparent font-comic text-xl text-secondary outline-none border-b-2 border-transparent focus:border-secondary w-full"
                            />
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <input
                            type="text"
                            value={s.secretCode}
                            onChange={e => updateStudentField(s.id, 'secretCode', e.target.value)}
                            className="bg-black text-comic-yellow px-3 py-1 font-mono text-sm border-2 border-black shadow-[2px_2px_0px_#000] text-center w-32 outline-none focus:ring-2 focus:ring-comic-yellow"
                          />
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedHeroInventory(selectedHeroInventory === s.id ? null : s.id)}
                              className={`size-10 border-2 border-black flex items-center justify-center transition-all shadow-[2px_2px_0px_#000] active:shadow-none translate-y-0 active:translate-y-0.5 ${selectedHeroInventory === s.id ? 'bg-secondary text-white' : 'bg-white text-slate-900 hover:bg-slate-100'}`}
                              title="Ver Tienda del Alumno"
                            >
                              <span className="material-symbols-outlined">shopping_bag</span>
                            </button>
                            <button
                              onClick={() => resetCode(s.id)}
                              className="size-10 bg-comic-yellow border-2 border-black flex items-center justify-center hover:bg-white active:scale-95 transition-all text-slate-900 shadow-[2px_2px_0px_#000] active:shadow-none translate-y-0 active:translate-y-0.5"
                              title="Reset Código Aleatorio"
                            >
                              <span className="material-symbols-outlined">refresh</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {selectedHeroInventory === s.id && (
                        <tr className="bg-slate-50 border-b-2 border-black animate-in slide-in-from-top-2">
                          <td colSpan={4} className="p-6">
                            <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_#000] relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><span className="material-symbols-outlined text-9xl">inventory_2</span></div>
                              <h4 className="font-comic text-2xl uppercase italic border-b-2 border-dashed border-black pb-2 mb-4 text-slate-900">Poderes Comprados por {s.alias}</h4>
                              {s.purchases && s.purchases.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {s.purchases.map(p => (
                                    <div key={p.id} className="flex justify-between items-center p-3 border-2 border-black bg-slate-100 group">
                                      <div>
                                        <p className={`font-comic text-lg leading-none ${p.used ? 'line-through text-slate-400' : 'text-slate-900'}`}>{p.name}</p>
                                        <p className="font-marker text-[8px] uppercase text-slate-500">{new Date(p.date).toLocaleDateString()}</p>
                                      </div>
                                      <div className={`px-2 py-1 font-marker text-[10px] uppercase border ${p.used ? 'bg-comic-red text-white' : 'bg-green-600 text-white'}`}>
                                        {p.used ? 'USADO' : 'LISTO'}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-center py-6 font-marker text-slate-400 uppercase italic">Este héroe aún no ha adquirido ningún objeto.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'HELPERS' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white comic-border p-6 shadow-[6px_6px_0px_#000]">
            <h3 className="font-comic text-2xl mb-4 italic uppercase text-slate-900 border-b-2 border-black">Asignar Ayudantes Semanales</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {state.students.map(s => (
                <div key={s.id} className={`flex items-center justify-between p-3 border-2 border-black transition-all ${s.isHelper ? 'bg-comic-yellow/40 scale-[1.02]' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} className="size-10 bg-white border border-black rounded-full" />
                    <div>
                      <p className="font-comic text-lg leading-none text-slate-900">{s.alias}</p>
                      {s.hasBeenHelper && <span className="text-[9px] font-marker text-slate-500 uppercase">EXPERIENCIA PREVIA</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {s.isHelper && (
                      <select
                        value={s.helperRole}
                        onChange={(e) => updateStudentHelperRole(s.id, e.target.value)}
                        className="bg-white border-2 border-black font-marker text-[10px] p-1 uppercase text-slate-900 outline-none"
                      >
                        {state.helperRoles.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                      </select>
                    )}
                    <button
                      onClick={() => toggleHelper(s.id)}
                      className={`px-3 py-1 font-comic text-sm border-2 border-black transition-all shadow-[2px_2px_0px_#000] active:shadow-none translate-y-0 active:translate-y-0.5 ${s.isHelper ? 'bg-comic-red text-white' : 'bg-white text-black hover:bg-comic-yellow'}`}
                    >
                      {s.isHelper ? 'REVOCAR' : 'ELEGIR'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-panel bg-[#211b27] comic-border p-6 h-fit border-comic-yellow shadow-[6px_6px_0px_rgba(254,203,0,0.3)]">
            <h3 className="font-comic text-2xl mb-4 text-comic-yellow italic uppercase">Roles de Ayudante Disponibles</h3>
            <div className="space-y-4 mb-6">
              {state.helperRoles.map((role, i) => (
                <div key={i} className="bg-black/40 p-3 border border-white/20 hover:border-comic-yellow transition-colors group">
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="text"
                      value={role.name}
                      onChange={e => updateHelperRoleConfig(i, 'name', e.target.value)}
                      className="bg-transparent font-display font-bold text-white uppercase text-sm outline-none border-b border-white/10 focus:border-comic-yellow flex-1 mr-4"
                    />
                    <button onClick={() => removeHelperRole(i)} className="text-comic-red text-xs font-bold uppercase hover:underline opacity-0 group-hover:opacity-100">Eliminar</button>
                  </div>
                  <textarea
                    value={role.description}
                    onChange={e => updateHelperRoleConfig(i, 'description', e.target.value)}
                    placeholder="Descripción de la función..."
                    className="w-full bg-black/20 text-slate-400 text-[10px] p-2 border border-white/5 outline-none focus:border-comic-yellow resize-none h-16 font-marker"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-3 bg-black/20 p-4 border-2 border-dashed border-white/10">
              <p className="font-marker text-[10px] text-slate-500 uppercase">Crear Nuevo Rol:</p>
              <input
                type="text"
                value={newRoleName}
                onChange={e => setNewRoleName(e.target.value)}
                className="w-full bg-white p-2 border-2 border-black font-bold text-slate-900 text-sm uppercase outline-none focus:ring-2 focus:ring-comic-yellow"
                placeholder="Nombre del rol..."
              />
              <textarea
                value={newRoleDescription}
                onChange={e => setNewRoleDescription(e.target.value)}
                placeholder="Explicación de sus tareas..."
                className="w-full bg-white p-2 border-2 border-black font-bold text-slate-900 text-xs outline-none focus:ring-2 focus:ring-comic-yellow h-20 resize-none"
              />
              <button onClick={addHelperRole} className="w-full bg-comic-yellow px-4 py-2 border-2 border-black font-comic text-black shadow-[4px_4px_0px_#000] active:shadow-none active:translate-y-1">AÑADIR ROL</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SYSTEM' && (
        <div className="space-y-8">
          {/* Teacher Profile Section */}
          <div className="bg-white comic-border p-8 shadow-[10px_10px_0px_#000]">
            <h3 className="font-comic text-3xl uppercase italic text-black border-b-4 border-black pb-2 mb-6">PERFIL DEL PROFESOR</h3>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center gap-4">
                <div className="size-32 bg-slate-100 border-4 border-black overflow-hidden shadow-[6px_6px_0px_#000]">
                  <img
                    src={state.teacherProfile.avatar}
                    alt="Avatar del profesor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-comic-yellow text-black font-comic text-lg border-4 border-black shadow-[4px_4px_0px_#000] cursor-pointer hover:bg-secondary hover:text-white active:shadow-none active:translate-y-1 transition-all uppercase">
                  <span className="material-symbols-outlined">upload</span>
                  SUBIR AVATAR
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const base64 = event.target?.result as string;
                        setState(prev => ({
                          ...prev,
                          teacherProfile: {
                            ...prev.teacherProfile,
                            avatar: base64
                          }
                        }));
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="font-display font-bold text-sm text-slate-900 uppercase mb-2 block">Nombre del Profesor</label>
                  <input
                    type="text"
                    value={state.teacherProfile.name}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      teacherProfile: {
                        ...prev.teacherProfile,
                        name: e.target.value
                      }
                    }))}
                    className="w-full border-2 border-black p-3 font-bold text-slate-900 uppercase focus:ring-2 focus:ring-secondary outline-none"
                    placeholder="Nombre del profesor..."
                  />
                </div>
                <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300">
                  <p className="font-marker text-[10px] text-slate-500 uppercase mb-1">Información</p>
                  <p className="text-xs text-slate-600 italic">Puedes subir una imagen desde tu ordenador. Los formatos soportados son: JPG, PNG, GIF, WEBP. La imagen se guardará localmente en el navegador.</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Tools Section */}
          <div className="bg-white comic-border p-8 shadow-[10px_10px_0px_#000]">
            <h3 className="font-comic text-3xl uppercase italic text-black border-b-4 border-black pb-2 mb-6">HERRAMIENTAS DE SISTEMA</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-display font-bold text-xl text-slate-900 uppercase">Exportar Datos</h4>
                <p className="text-sm text-slate-600">Descarga una copia de seguridad completa del estado de la clase (puntos, niveles, misiones) en formato JSON.</p>
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-comic text-xl border-4 border-black shadow-[4px_4px_0px_#000] active:shadow-none active:translate-y-1"
                >
                  <span className="material-symbols-outlined">download</span>
                  DESCARGAR BACKUP
                </button>
              </div>
              <div className="space-y-4">
                <h4 className="font-display font-bold text-xl text-slate-900 uppercase">Importar Datos</h4>
                <p className="text-sm text-slate-600">Sube un archivo .json de Universexto para restaurar una copia de seguridad previa o mover los datos a otro equipo.</p>
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-comic text-xl border-4 border-black shadow-[4px_4px_0px_#000] cursor-pointer hover:bg-black active:shadow-none active:translate-y-1">
                  <span className="material-symbols-outlined">upload</span>
                  SUBIR ARCHIVO JSON
                  <input type="file" accept=".json" onChange={importData} className="hidden" />
                </label>
              </div>
            </div>
            <div className="mt-12 p-4 bg-comic-red/10 border-2 border-dashed border-comic-red">
              <p className="font-marker text-xs text-comic-red uppercase">AVISO DE SEGURIDAD</p>
              <p className="text-xs text-slate-800 mt-1 italic">Los datos se guardan localmente en este navegador. Si borras el historial o cambias de ordenador sin exportar primero, perderás el progreso de la clase.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'REASONS' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rewards Section */}
            <div className="bg-white comic-border p-6 flex flex-col gap-4 border-green-600 shadow-[6px_6px_0px_rgba(22,163,74,0.3)]">
              <h3 className="font-comic text-3xl uppercase italic text-green-700 border-b-4 border-green-700 pb-2">Premios del Multiverso</h3>
              <div className="space-y-3">
                {state.rewardReasons.map(r => (
                  <div key={r.id} className="flex gap-2 items-center bg-white border-2 border-black p-2 hover:bg-slate-50 transition-colors">
                    <input
                      type="text"
                      value={r.text}
                      onChange={e => updateReason('REWARD', r.id, 'text', e.target.value)}
                      className="flex-1 bg-white border border-slate-300 p-2 font-display font-bold text-slate-900 uppercase text-xs focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <div className="flex items-center bg-slate-100 border-2 border-black px-2">
                      <span className="text-slate-900 font-comic text-2xl">+</span>
                      <input
                        type="number"
                        value={r.value}
                        onChange={e => updateReason('REWARD', r.id, 'value', Number(e.target.value))}
                        className="w-16 bg-transparent p-2 font-comic text-2xl text-slate-900 text-center outline-none"
                      />
                    </div>
                    <button onClick={() => removeReason('REWARD', r.id)} className="size-10 bg-comic-red text-white flex items-center justify-center border-2 border-black hover:bg-black transition-colors shadow-[2px_2px_0px_#000] active:shadow-none translate-y-0 active:translate-y-0.5">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-300 bg-slate-50/50 p-4 rounded">
                <p className="font-marker text-[10px] text-slate-500 uppercase mb-2 tracking-widest">Crear Nuevo Motivo de Premio:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej: Liderazgo positivo..."
                    className="flex-1 bg-white border-2 border-black p-3 font-bold text-slate-900 text-sm uppercase outline-none focus:ring-2 focus:ring-green-500"
                    value={newReasonText}
                    onChange={e => setNewReasonText(e.target.value)}
                  />
                  <input
                    type="number"
                    className="w-20 bg-white border-2 border-black p-3 font-comic text-3xl text-slate-900 text-center outline-none focus:ring-2 focus:ring-green-500"
                    value={newReasonValue}
                    onChange={e => setNewReasonValue(Number(e.target.value))}
                  />
                  <button onClick={() => addReason('REWARD')} className="bg-green-600 text-white font-comic px-6 py-2 border-2 border-black hover:bg-black transition-all shadow-[4px_4px_0px_#000] active:shadow-none active:translate-y-1">AÑADIR</button>
                </div>
              </div>
            </div>

            {/* Penalties Section */}
            <div className="bg-white comic-border p-6 flex flex-col gap-4 border-comic-red shadow-[6px_6px_0px_rgba(237,29,36,0.3)]">
              <h3 className="font-comic text-3xl uppercase italic text-comic-red border-b-4 border-comic-red pb-2">Sanciones y Multas</h3>
              <div className="space-y-3">
                {state.penaltyReasons.map(r => (
                  <div key={r.id} className="flex gap-2 items-center bg-white border-2 border-black p-2 hover:bg-slate-50 transition-colors">
                    <input
                      type="text"
                      value={r.text}
                      onChange={e => updateReason('PENALTY', r.id, 'text', e.target.value)}
                      className="flex-1 bg-white border border-slate-300 p-2 font-display font-bold text-slate-900 uppercase text-xs focus:ring-2 focus:ring-comic-red outline-none"
                    />
                    <div className="flex items-center bg-slate-100 border-2 border-black px-2">
                      <span className="text-slate-900 font-comic text-2xl">-</span>
                      <input
                        type="number"
                        value={r.value}
                        onChange={e => updateReason('PENALTY', r.id, 'value', Number(e.target.value))}
                        className="w-16 bg-transparent p-2 font-comic text-2xl text-slate-900 text-center outline-none"
                      />
                    </div>
                    <button onClick={() => removeReason('PENALTY', r.id)} className="size-10 bg-comic-red text-white flex items-center justify-center border-2 border-black hover:bg-black transition-colors shadow-[2px_2px_0px_#000] active:shadow-none translate-y-0 active:translate-y-0.5">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-300 bg-slate-50/50 p-4 rounded">
                <p className="font-marker text-[10px] text-slate-500 uppercase mb-2 tracking-widest">Crear Nueva Multa de Campo:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej: Interrupción excesiva..."
                    className="flex-1 bg-white border-2 border-black p-3 font-bold text-slate-900 text-sm uppercase outline-none focus:ring-2 focus:ring-comic-red"
                    value={newReasonText}
                    onChange={e => setNewReasonText(e.target.value)}
                  />
                  <input
                    type="number"
                    className="w-20 bg-white border-2 border-black p-3 font-comic text-3xl text-slate-900 text-center outline-none focus:ring-2 focus:ring-comic-red"
                    value={newReasonValue}
                    onChange={e => setNewReasonValue(Number(e.target.value))}
                  />
                  <button onClick={() => addReason('PENALTY')} className="bg-comic-red text-white font-comic px-6 py-2 border-2 border-black hover:bg-black transition-all shadow-[4px_4px_0px_#000] active:shadow-none active:translate-y-1">AÑADIR</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'BADGES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white comic-border p-6 h-fit shadow-[6px_6px_0px_#000]">
            <h3 className="font-comic text-2xl mb-4 italic uppercase text-slate-900 border-b-2 border-black">Creador de Medallas</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Nombre de Medalla..." value={newBadge.name} onChange={e => setNewBadge({ ...newBadge, name: e.target.value })} className="w-full border-2 border-black p-3 font-bold text-slate-900 uppercase focus:ring-2 focus:ring-secondary outline-none" />
              <input type="text" placeholder="Icono (ej: star, bolt)..." value={newBadge.icon} onChange={e => setNewBadge({ ...newBadge, icon: e.target.value })} className="w-full border-2 border-black p-3 font-bold text-slate-900 focus:ring-2 focus:ring-secondary outline-none" />
              <input type="number" placeholder="Premio Sextos..." value={newBadge.rewardSextos} onChange={e => setNewBadge({ ...newBadge, rewardSextos: Number(e.target.value) })} className="w-full border-2 border-black p-3 font-comic text-3xl text-slate-900 focus:ring-2 focus:ring-secondary outline-none" />
              <button onClick={addBadge} className="w-full bg-comic-yellow py-3 font-comic text-xl border-4 border-black text-black hover:bg-secondary hover:text-white transition-all shadow-[6px_6px_0px_#000] active:shadow-none active:translate-y-1">GUARDAR MEDALLA</button>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white comic-border p-6 shadow-[6px_6px_0px_#000]">
            <h3 className="font-comic text-2xl mb-4 italic uppercase text-slate-900 border-b-2 border-black">Catálogo de Badges</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {state.badges.map(b => (
                <div key={b.id} className="border-4 border-black p-4 flex flex-col items-center text-center bg-slate-50 relative group transition-transform hover:scale-105">
                  <button onClick={() => setState(p => ({ ...p, badges: p.badges.filter(bx => bx.id !== b.id) }))} className="absolute top-1 right-1 size-6 bg-comic-red text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-2 border-black"><span className="material-symbols-outlined text-xs">close</span></button>
                  <span className="material-symbols-outlined text-5xl mb-2 text-secondary">{b.icon}</span>
                  <p className="font-comic text-lg uppercase leading-none text-slate-900">{b.name}</p>
                  <p className="font-marker text-[9px] mt-1 text-green-700 font-black">RECOMPENSA: +{b.rewardSextos} SXT</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherConfig;
