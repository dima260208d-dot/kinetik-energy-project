export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  parentName: string;
  parentPhone: string;
  registrationDate: Date;
  lastVisit: Date;
  totalVisits: number;
  activeSubscription: Subscription | null;
  tags: string[];
  notes: string;
  achievements: Achievement[];
  progress: ProgressEntry[];
}

export interface Subscription {
  id: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'visits';
  name: string;
  price: number;
  totalVisits?: number;
  usedVisits?: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'frozen' | 'expired';
  autoRenew: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: Date;
  videoUrl?: string;
}

export interface ProgressEntry {
  id: string;
  date: Date;
  skill: string;
  level: number;
  notes: string;
  trainerName: string;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  hireDate: Date;
  salary: number;
  commissionRate: number;
  schedule: TrainerSchedule[];
  stats: TrainerStats;
}

export interface TrainerSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxClients: number;
}

export interface TrainerStats {
  totalClients: number;
  clientRetentionRate: number;
  monthlyEarnings: number;
  totalLessons: number;
}

export interface Lesson {
  id: string;
  name: string;
  trainerId: string;
  date: Date;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants: Client[];
  type: 'group' | 'individual';
  price: number;
  description: string;
}

export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  type: 'subscription' | 'single_lesson' | 'merchandise';
  method: 'card' | 'cash' | 'transfer';
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}