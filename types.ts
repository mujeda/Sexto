
export type Role = 'TEACHER' | 'STUDENT' | 'GUEST';

export interface Purchase {
  id: string;
  itemId: string;
  name: string;
  used: boolean;
  date: string;
}

export interface Reason {
  id: string;
  text: string;
  value: number;
}

export interface HelperRoleConfig {
  name: string;
  description: string;
}

export interface Student {
  id: string;
  alias: string;
  level: number;
  sextos: number;
  lifetimeSextos: number; // For level calculation
  badges: string[];
  isHelper: boolean;
  hasBeenHelper: boolean; // Tracking history
  helperRole?: string;
  helperRoleDescription?: string;
  avatar: string;
  secretCode: string;
  purchases: Purchase[];
  lastSeenMissionId?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  isActive: boolean;
  timeLeft?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rewardSextos: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

export interface TeacherProfile {
  name: string;
  avatar: string; // base64 encoded image or URL
}

export interface AppState {
  teacherProfile: TeacherProfile;
  students: Student[];
  missions: Mission[];
  badges: Badge[];
  shopItems: ShopItem[];
  weeklyPayout: number;
  secretCode: string;
  payrollMessage: string;
  helperRoles: HelperRoleConfig[];
  rewardReasons: Reason[];
  penaltyReasons: Reason[];
  latestMissionId?: string;
}
