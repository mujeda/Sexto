
import { Student, Mission, Badge, ShopItem } from './types';

export const INITIAL_STUDENTS: Student[] = [
  { id: '1', alias: 'IRON KNIGHT', level: 1, sextos: 200, lifetimeSextos: 200, badges: [], isHelper: true, hasBeenHelper: true, helperRole: 'Capitán de Orden', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hero1', secretCode: 'HERO-123', purchases: [] },
  { id: '2', alias: 'SHADOW WALKER', level: 1, sextos: 200, lifetimeSextos: 200, badges: [], isHelper: false, hasBeenHelper: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hero2', secretCode: 'HERO-456', purchases: [] },
  { id: '3', alias: 'STAR MAGE', level: 1, sextos: 200, lifetimeSextos: 200, badges: [], isHelper: false, hasBeenHelper: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hero3', secretCode: 'HERO-789', purchases: [] },
];

for (let i = 4; i <= 24; i++) {
  INITIAL_STUDENTS.push({
    id: `${i}`,
    alias: `HÉROE ${i}`,
    level: 1,
    sextos: 200,
    lifetimeSextos: 200,
    badges: [],
    isHelper: false,
    hasBeenHelper: false,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Hero${i}`,
    secretCode: `HERO-${1000 + i}`,
    purchases: []
  });
}

export const INITIAL_MISSIONS: Mission[] = [
  { id: 'm1', title: 'Operación Multiplicación', description: 'Resuelve 20 ecuaciones complejas antes del viernes.', reward: 100, isActive: true, timeLeft: '2d : 14h' }
];

export const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: 'Héroe Solidario', description: 'Ayuda a un compañero en apuros.', icon: 'volunteer_activism', rewardSextos: 20 },
  { id: 'b2', name: 'Maestro del Orden', description: 'Mantén tu mesa impecable.', icon: 'auto_awesome', rewardSextos: 15 }
];

export const INITIAL_SHOP: ShopItem[] = [
  { id: 's1', name: 'Salto de Tiempo', description: 'Añade 2 minutos extra a cualquier examen.', price: 500, icon: 'hourglass_empty' },
  { id: 's2', name: 'Escudo de Equipo', description: 'Protege a tu equipo de una multa por ruido.', price: 800, icon: 'security' }
];
