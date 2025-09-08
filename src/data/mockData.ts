import { Client, Trainer } from '@/types/crm';

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Анна Петрова',
    email: 'anna.petrova@email.com',
    phone: '+7 (999) 123-45-67',
    age: 8,
    parentName: 'Елена Петрова',
    parentPhone: '+7 (999) 123-45-68',
    registrationDate: new Date('2024-01-15'),
    lastVisit: new Date('2024-09-07'),
    totalVisits: 24,
    activeSubscription: {
      id: 's1',
      type: 'monthly',
      name: 'Детский месячный',
      price: 5000,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-09-30'),
      status: 'active',
      autoRenew: true
    },
    tags: ['новичок', 'детская группа', 'активный'],
    notes: 'Очень активная, быстро учится новым элементам',
    achievements: [
      {
        id: 'a1',
        title: 'Первый прыжок',
        description: 'Выполнил первый прыжок на батуте',
        icon: '🦘',
        dateEarned: new Date('2024-02-01')
      }
    ],
    progress: [
      {
        id: 'p1',
        date: new Date('2024-09-01'),
        skill: 'Базовые прыжки',
        level: 7,
        notes: 'Отлично выполняет все базовые элементы',
        trainerName: 'Сергей Иванов'
      }
    ]
  }
];

export const mockTrainers: Trainer[] = [
  {
    id: 't1',
    name: 'Сергей Иванов',
    email: 'sergey@kinetic-kids.ru',
    phone: '+7 (999) 555-01-01',
    specialization: ['батуты', 'акробатика', 'детские группы'],
    hireDate: new Date('2023-06-01'),
    salary: 50000,
    commissionRate: 15,
    schedule: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '18:00', maxClients: 8 },
      { dayOfWeek: 3, startTime: '10:00', endTime: '18:00', maxClients: 8 },
      { dayOfWeek: 5, startTime: '10:00', endTime: '18:00', maxClients: 8 }
    ],
    stats: {
      totalClients: 25,
      clientRetentionRate: 92,
      monthlyEarnings: 65000,
      totalLessons: 120
    }
  }
];