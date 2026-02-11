
import React, { useState, useEffect, useRef } from 'react';
import { AppState, Student } from '../types';

interface Props {
  state: AppState;
  onUpdateSextos: (id: string, amount: number) => void;
}

const CROMOS_POOL = [
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-ice-pablo.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-guardians.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-captain-adrian.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-heroes-collectible.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-adrian-laser.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-greta-sai.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-five-fantastic.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-greta-swim.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-dani-magnifico.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-dani-batman.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-super-valentina.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-valentina-space.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-bruno-wolverine.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-pantheras.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-bruno-kick.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-sofia-super.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-sofia-spider.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-dani-dunk.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-sandro-strange.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-three-fantastic.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-sandro-guardian.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-mateo-thanos.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-mateo-cyber.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-mario-flash.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-power-trio.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-lucas-pingpong.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-adriana-storm.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-adriana-piano.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-deadpool-dani.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-sandro-silence.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-natacion-girl.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-captain-mirasur.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-martina-shazam.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-cindy-wonder.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-carla-fly.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-martina-save.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-flexible-falcon.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-skyhawk.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-maria-tennis.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-maria-football.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-five-team.png",
  "https://raw.githubusercontent.com/fede-pro-ai/universexto-assets/main/card-lucas-green.png"
];

const GadgetLab: React.FC<Props> = ({ state, onUpdateSextos }) => {
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [isSensorOn, setIsSensorOn] = useState(false);
  const [noiseViolations, setNoiseViolations] = useState(0);
  const [isPenaltyActive, setIsPenaltyActive] = useState(false);
  const [noiseThreshold, setNoiseThreshold] = useState(85);
  const [penaltyTriggered, setPenaltyTriggered] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isPenaltyActiveRef = useRef(isPenaltyActive);

  useEffect(() => {
    isPenaltyActiveRef.current = isPenaltyActive;
  }, [isPenaltyActive]);

  const [customMinutes, setCustomMinutes] = useState(15);
  const [customSeconds, setCustomSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [selectedHero, setSelectedHero] = useState<Student | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const [teamSize, setTeamSize] = useState(4);
  const [teams, setTeams] = useState<Student[][]>([]);

  const [selectedCromo, setSelectedCromo] = useState<string | null>(null);
  const [isCromoLoading, setIsCromoLoading] = useState(false);

  const playSound = (type: 'bell' | 'click' | 'whoosh') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'bell') {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.5);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
        osc.start();
        osc.stop(ctx.currentTime + 2);
      } else if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'whoosh') {
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn("Audio Context error", e);
    }
  };

  useEffect(() => {
    let isActive = true;
    let animationFrameId: number;

    const stopSensor = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(console.error);
        }
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      if (isActive) setNoiseLevel(0);
      
      if (penaltyTriggered && isPenaltyActiveRef.current) {
        const deduction = 10;
        alert(`¡Sensor Apagado! Se aplica multa de ${deduction} Sextos a toda la clase por ruido excesivo.`);
        state.students.forEach(s => onUpdateSextos(s.id, -deduction));
        setPenaltyTriggered(false);
      }
    };

    const startSensor = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isActive) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const updateNoise = () => {
          if (!isActive || !analyserRef.current || !isSensorOn) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          const level = Math.min(100, Math.round((average / 128) * 100));
          setNoiseLevel(level);
          if (level > noiseThreshold) {
            setPenaltyTriggered(true);
            setNoiseViolations(prev => prev + 1);
            playSound('click');
          }
          animationFrameId = requestAnimationFrame(updateNoise);
        };
        updateNoise();
      } catch (err) {
        console.error("Microphone access denied", err);
        if (isActive) setIsSensorOn(false);
      }
    };

    if (isSensorOn) {
      setPenaltyTriggered(false);
      startSensor();
    } else {
      stopSensor();
    }

    return () => {
      isActive = false;
      stopSensor();
    };
  }, [isSensorOn, noiseThreshold, state.students, onUpdateSextos]);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playSound('bell');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const handleResetNoise = () => {
    setNoiseViolations(0);
    setPenaltyTriggered(false);
  };

  const handleApplyTimer = () => {
    const totalSeconds = (customMinutes * 60) + customSeconds;
    setTimeLeft(Math.max(30, Math.min(1800, totalSeconds)));
    setIsTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pickRandomHero = () => {
    if (isSelecting) return;
    setIsSelecting(true);
    setSelectedHero(null);
    let count = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * state.students.length);
      setSelectedHero(state.students[randomIdx]);
      count++;
      if (count > 15) {
        clearInterval(interval);
        setIsSelecting(false);
        playSound('bell');
      } else {
        playSound('click');
      }
    }, 100);
  };

  const pickRandomCromo = () => {
    if (isCromoLoading) return;
    setIsCromoLoading(true);
    setSelectedCromo(null);
    playSound('whoosh');
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * CROMOS_POOL.length);
      setSelectedCromo(CROMOS_POOL[randomIdx]);
      setIsCromoLoading(false);
      playSound('bell');
    }, 1200);
  };

  const generateTeams = () => {
    const shuffled = [...state.students].sort(() => Math.random() - 0.5);
    const newTeams: Student[][] = [];
    for (let i = 0; i < shuffled.length; i += teamSize) {
      newTeams.push(shuffled.slice(i, i + teamSize));
    }
    setTeams(newTeams);
    playSound('bell');
  };

  return (
    <div className="space-y-12 pb-24 overflow-y-visible">
      <header className="flex flex-col gap-2">
        <h2 className="text-6xl font-comic uppercase italic tracking-tighter text-comic-yellow text-stroke leading-none">Gadget Lab</h2>
        <p className="font-marker text-slate-400 max-w-xl uppercase text-xs tracking-widest">Herramientas de gestión heroica</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {/* Sonic Sensor */}
        <div className="bg-panel bg-[#211b27] comic-border p-6 flex flex-col gap-6 group relative overflow-hidden h-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined ${isSensorOn ? 'text-green-500 animate-pulse' : 'text-slate-500'}`}>
                {isSensorOn ? 'settings_voice' : 'mic_off'}
              </span>
              <h3 className="font-comic text-2xl uppercase italic leading-none">Sensor Sónico</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={handleResetNoise} className="size-8 bg-background-dark rounded-full flex items-center justify-center hover:bg-comic-red transition-colors" title="Reset Strikes"><span className="material-symbols-outlined text-sm">refresh</span></button>
              <button onClick={() => setIsSensorOn(!isSensorOn)} className={`size-10 comic-border flex items-center justify-center transition-all ${isSensorOn ? 'bg-comic-red text-white' : 'bg-green-600 text-white'}`}><span className="material-symbols-outlined font-black">{isSensorOn ? 'power_settings_new' : 'play_arrow'}</span></button>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-6 py-4">
            <div className={`relative size-40 rounded-full border-8 border-background-dark flex items-center justify-center overflow-hidden transition-all ${isSensorOn ? 'scale-100' : 'scale-90 opacity-50'}`}>
              <div className={`absolute bottom-0 left-0 right-0 transition-all duration-100 ${noiseLevel > noiseThreshold ? 'bg-comic-red/60' : 'bg-secondary/40'}`} style={{ height: `${noiseLevel}%` }}></div>
              <div className="absolute w-full border-t-2 border-dashed border-white opacity-50 z-20 pointer-events-none" style={{ bottom: `${noiseThreshold}%` }}></div>
              <div className="relative z-10 flex flex-col items-center">
                <span className={`text-5xl font-comic italic text-stroke ${noiseLevel > noiseThreshold ? 'text-comic-red' : 'text-white'}`}>{isSensorOn ? `${noiseLevel}%` : 'OFF'}</span>
              </div>
            </div>
            <div className="w-full space-y-2 px-4">
              <div className="flex justify-between font-marker text-[10px] uppercase text-slate-500"><span>Límite de Ruido</span><span className="text-white">{noiseThreshold}%</span></div>
              <input type="range" min="30" max="95" value={noiseThreshold} onChange={(e) => setNoiseThreshold(Number(e.target.value))} className="w-full accent-comic-red" />
            </div>
          </div>
          <div className="bg-background-dark/50 p-4 comic-border flex justify-between items-center">
             <div><p className="font-marker text-[10px] text-slate-500 uppercase">Alertas de Ruido</p><p className="font-comic text-3xl text-comic-yellow">{noiseViolations} STRIKES</p></div>
             <div className="bg-comic-red/20 p-2 rounded animate-pulse"><span className={`material-symbols-outlined text-comic-red text-3xl ${noiseLevel > noiseThreshold ? 'scale-125' : ''}`}>warning</span></div>
          </div>
          <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
            <div className="flex flex-col"><span className="font-marker text-xs uppercase text-slate-500">Multar al Apagar</span><span className="text-[10px] text-slate-600 italic leading-none">{penaltyTriggered ? 'REBASADO - MULTA LISTA' : 'POR DEBAJO DEL LÍMITE'}</span></div>
            <button onClick={() => setIsPenaltyActive(!isPenaltyActive)} className={`w-14 h-7 rounded-full p-1 border-2 border-black transition-colors ${isPenaltyActive ? 'bg-secondary shadow-[0_0_10px_rgba(13,89,242,0.5)]' : 'bg-slate-700'}`}><div className={`size-4 bg-white rounded-full transition-transform ${isPenaltyActive ? 'translate-x-7' : 'translate-x-0'}`}></div></button>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-panel bg-[#211b27] comic-border p-6 flex flex-col gap-6 md:col-span-1 lg:col-span-2 h-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary">timer</span><h3 className="font-comic text-2xl uppercase italic leading-none">Cronómetro de Misión</h3></div>
            <div className="flex items-center gap-2 bg-background-dark p-2 border-2 border-black shadow-[4px_4px_0px_#000]">
               <div className="flex flex-col items-center"><input type="number" min="0" max="30" value={customMinutes} onChange={e => setCustomMinutes(Number(e.target.value))} className="w-14 bg-transparent text-center font-comic text-2xl text-white outline-none" /><span className="text-[10px] font-marker text-slate-500 uppercase">MINS</span></div>
               <span className="text-white font-bold text-2xl">:</span>
               <div className="flex flex-col items-center"><input type="number" min="0" max="59" value={customSeconds} onChange={e => setCustomSeconds(Number(e.target.value))} className="w-14 bg-transparent text-center font-comic text-2xl text-white outline-none" /><span className="text-[10px] font-marker text-slate-500 uppercase">SEGS</span></div>
               <button onClick={handleApplyTimer} className="ml-4 bg-secondary text-white font-comic px-5 py-2 text-lg comic-border hover:bg-white hover:text-secondary transition-all">SET</button>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-8"><div className={`text-[12rem] font-comic italic tracking-tighter text-secondary drop-shadow-[0_0_20px_rgba(127,13,242,0.4)] text-stroke leading-none ${isTimerRunning ? 'animate-pulse' : ''}`}>{formatTime(timeLeft)}</div></div>
          <div className="flex gap-4">
            <button onClick={() => setIsTimerRunning(!isTimerRunning)} className={`flex-1 py-5 text-white font-comic text-3xl tracking-widest comic-border transition-all ${isTimerRunning ? 'bg-comic-red' : 'bg-green-600'}`}>{isTimerRunning ? 'DETENER' : 'INICIAR MISIÓN'}</button>
            <button onClick={() => { setIsTimerRunning(false); setTimeLeft((customMinutes * 60) + customSeconds); playSound('click'); }} className="px-10 bg-white text-black font-comic text-3xl comic-border hover:bg-comic-yellow transition-colors"><span className="material-symbols-outlined text-4xl">restart_alt</span></button>
          </div>
        </div>

        {/* Cromo Especial */}
        <div className="bg-panel bg-[#211b27] comic-border p-6 flex flex-col gap-6 h-full border-comic-yellow">
           <div className="flex items-center gap-3"><span className="material-symbols-outlined text-comic-yellow text-3xl">style</span><h3 className="font-comic text-2xl uppercase italic leading-none text-white">Cromo Especial</h3></div>
           <div className="flex-1 bg-black/40 comic-border relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
              {selectedCromo ? (
                <div className={`w-full h-full p-2 animate-in zoom-in duration-500`}><img src={selectedCromo} className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(254,203,0,0.5)]" alt="Cromo" /></div>
              ) : isCromoLoading ? (
                <div className="flex flex-col items-center gap-4"><div className="size-20 border-4 border-comic-yellow border-t-transparent rounded-full animate-spin"></div><p className="font-comic text-xl text-comic-yellow animate-pulse uppercase">Invocando...</p></div>
              ) : (
                <div className="flex flex-col items-center text-slate-600 text-center px-4"><span className="material-symbols-outlined text-7xl mb-4">auto_awesome</span><p className="font-marker uppercase text-xs">Descubre un cromo legendario</p></div>
              )}
           </div>
           <button onClick={pickRandomCromo} disabled={isCromoLoading} className="w-full py-4 bg-comic-yellow text-black font-comic text-2xl tracking-widest comic-border hover:bg-white transition-all active:scale-95 disabled:opacity-50">¡INVOCAR CROMO!</button>
        </div>

        {/* Hero Selector */}
        <div className="bg-panel bg-[#1b2333] comic-border p-6 flex flex-col gap-6 h-full">
          <div className="flex items-center gap-3"><span className="material-symbols-outlined text-comic-yellow">casino</span><h3 className="font-comic text-2xl uppercase italic text-white leading-none">Selector del Azar</h3></div>
          <div className="flex-1 bg-background-dark comic-border relative overflow-hidden flex flex-col items-center justify-center min-h-[250px]">
            {selectedHero ? (
              <div className={`flex flex-col items-center gap-4 transition-all ${isSelecting ? 'blur-sm scale-95 opacity-50' : 'scale-100'}`}><div className="size-32 comic-border bg-white p-2"><img src={selectedHero.avatar} className="w-full h-full object-cover" /></div><div className="bg-comic-red text-white font-comic text-3xl px-4 py-1 border-4 border-black rotate-[-3deg] shadow-[4px_4px_0px_#000] text-stroke">{selectedHero.alias}</div></div>
            ) : (
              <div className="flex flex-col items-center text-slate-500"><span className="material-symbols-outlined text-7xl mb-4">person_search</span><p className="font-marker uppercase text-xs">Esperando elección...</p></div>
            )}
          </div>
          <button onClick={pickRandomHero} disabled={isSelecting} className="w-full py-4 bg-comic-yellow text-black font-comic text-2xl tracking-widest comic-border hover:bg-white transition-all active:scale-95 disabled:opacity-50">{isSelecting ? 'ESCANEANDO...' : '¡ELEGIR HÉROE!'}</button>
        </div>

        {/* Team Generator */}
        <div className="bg-panel bg-[#1b2333] comic-border p-6 flex flex-col gap-6 h-full lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary">groups</span><h3 className="font-comic text-2xl uppercase italic text-white leading-none">Generador de Equipos</h3></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><span className="font-marker text-[10px] text-slate-500 uppercase">Por Equipo:</span><input type="range" min="2" max="12" value={teamSize} onChange={e => setTeamSize(Number(e.target.value))} className="w-32 accent-secondary" /><span className="font-comic text-2xl text-comic-yellow w-8">{teamSize}</span></div>
              <button onClick={generateTeams} className="bg-secondary text-white font-comic px-6 py-2 text-lg comic-border hover:bg-white hover:text-secondary transition-all">GENERAR</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[350px] space-y-4 pr-2 custom-scrollbar">
            {teams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team, idx) => (
                  <div key={idx} className="bg-white comic-border p-4">
                    <h4 className="font-comic text-xl text-black border-b-2 border-black mb-3 italic uppercase">EQUIPO {idx + 1}</h4>
                    <div className="space-y-2">{team.map(member => (<div key={member.id} className="flex items-center gap-2"><img src={member.avatar} className="size-6 border border-black rounded-full bg-slate-100" /><span className="font-marker text-[10px] text-black truncate uppercase">{member.alias}</span></div>))}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12"><span className="material-symbols-outlined text-6xl mb-4">diversity_3</span><p className="font-marker uppercase text-xs">Configura los escuadrones</p></div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border: 2px solid black; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fecb00; border: 2px solid black; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ed1d24; }
      `}</style>
    </div>
  );
};

export default GadgetLab;
