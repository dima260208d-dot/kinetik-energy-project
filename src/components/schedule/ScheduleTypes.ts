export interface Lesson {
  id: string;
  name: string;
  trainerId: string;
  trainerName: string;
  date: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants: Participant[];
  type: 'group' | 'individual';
  price: number;
  description: string;
  skills: string[];
  ageGroup: 'kids' | 'teens' | 'adults' | 'all';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'overdue';
}

export interface Trainer {
  id: string;
  name: string;
  specialization: string[];
  rating: number;
  experience: number;
}

export const mockTrainers: Trainer[] = [
  {
    id: 't1',
    name: 'Сергей Иванов',
    specialization: ['скейтборд', 'трюковой самокат', 'батуты'],
    rating: 4.9,
    experience: 5
  },
  {
    id: 't2',
    name: 'Анна Петрова',
    specialization: ['ролики', 'паркур', 'детские группы'],
    rating: 4.8,
    experience: 3
  },
  {
    id: 't3',
    name: 'Михаил Смирнов',
    specialization: ['BMX', 'воркаут', 'взрослые группы'],
    rating: 4.7,
    experience: 7
  }
];

export const mockLessons: Lesson[] = [
  {
    id: 'l1',
    name: 'Основы скейтборда',
    trainerId: 't1',
    trainerName: 'Сергей Иванов',
    date: '2024-09-09',
    startTime: '10:00',
    endTime: '11:00',
    maxParticipants: 8,
    currentParticipants: [
      {
        id: 'p1',
        name: 'Анна Петрова',
        email: 'anna@email.com',
        phone: '+7999123456',
        status: 'confirmed',
        paymentStatus: 'paid'
      }
    ],
    type: 'group',
    price: 800,
    description: 'Изучение базовых элементов скейтборда для начинающих',
    skills: ['олли', 'кикфлип', 'равновесие'],
    ageGroup: 'kids',
    difficulty: 'beginner',
    status: 'scheduled'
  }
];

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getAgeGroupIcon = (ageGroup: string) => {
  switch (ageGroup) {
    case 'kids': return '🧒';
    case 'teens': return '🧑‍🎓';
    case 'adults': return '👨‍💼';
    default: return '👥';
  }
};