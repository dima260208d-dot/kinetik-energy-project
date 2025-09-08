import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import ScheduleModule from './ScheduleModule';

// Типы данных
interface Client {
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

interface Subscription {
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

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: Date;
  videoUrl?: string;
}

interface ProgressEntry {
  id: string;
  date: Date;
  skill: string;
  level: number;
  notes: string;
  trainerName: string;
}

interface Trainer {
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

interface TrainerSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxClients: number;
}

interface TrainerStats {
  totalClients: number;
  clientRetentionRate: number;
  monthlyEarnings: number;
  totalLessons: number;
}

interface Lesson {
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

interface Payment {
  id: string;
  clientId: string;
  amount: number;
  type: 'subscription' | 'single_lesson' | 'merchandise';
  method: 'card' | 'cash' | 'transfer';
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

// Мок данных
const mockClients: Client[] = [
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

const mockTrainers: Trainer[] = [
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

const KineticCRM = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [trainers, setTrainers] = useState<Trainer[]>(mockTrainers);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Сохранение данных в localStorage
  useEffect(() => {
    localStorage.setItem('kinetic_crm_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('kinetic_crm_trainers', JSON.stringify(trainers));
  }, [trainers]);

  // Загрузка данных из localStorage
  useEffect(() => {
    const savedClients = localStorage.getItem('kinetic_crm_clients');
    const savedTrainers = localStorage.getItem('kinetic_crm_trainers');
    
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
    if (savedTrainers) {
      setTrainers(JSON.parse(savedTrainers));
    }
  }, []);

  // Статистика для дашборда
  const stats = {
    totalClients: clients.length,
    activeSubscriptions: clients.filter(c => c.activeSubscription?.status === 'active').length,
    totalTrainers: trainers.length,
    monthlyRevenue: clients.reduce((sum, client) => {
      if (client.activeSubscription?.status === 'active') {
        return sum + client.activeSubscription.price;
      }
      return sum;
    }, 0),
    avgVisitsPerClient: Math.round(clients.reduce((sum, c) => sum + c.totalVisits, 0) / clients.length),
    newClientsThisMonth: clients.filter(c => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return c.registrationDate > monthAgo;
    }).length
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  const ClientCard = ({ client }: { client: Client }) => (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setSelectedClient(client)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-purple-100 text-purple-600">
                {client.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{client.name}</h3>
              <p className="text-sm text-gray-600">{client.age} лет</p>
            </div>
          </div>
          <Badge variant={client.activeSubscription?.status === 'active' ? 'default' : 'secondary'}>
            {client.activeSubscription?.status === 'active' ? 'Активен' : 'Неактивен'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="Phone" className="w-4 h-4 text-gray-400" />
            <span>{client.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Mail" className="w-4 h-4 text-gray-400" />
            <span>{client.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Calendar" className="w-4 h-4 text-gray-400" />
            <span>Посещений: {client.totalVisits}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {client.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ClientDetails = ({ client }: { client: Client }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedClient(null)}
          className="flex items-center gap-2"
        >
          <Icon name="ArrowLeft" className="w-4 h-4" />
          Назад к списку
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Icon name="Edit" className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="MessageCircle" className="w-4 h-4 mr-2" />
            Отправить SMS
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                {client.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <p className="text-gray-600">{client.age} лет • Родитель: {client.parentName}</p>
              <div className="flex gap-2 mt-2">
                {client.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">Информация</TabsTrigger>
              <TabsTrigger value="subscription">Абонемент</TabsTrigger>
              <TabsTrigger value="progress">Прогресс</TabsTrigger>
              <TabsTrigger value="achievements">Достижения</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Телефон</label>
                  <p className="font-medium">{client.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="font-medium">{client.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Телефон родителя</label>
                  <p className="font-medium">{client.parentPhone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Дата регистрации</label>
                  <p className="font-medium">{client.registrationDate.toLocaleDateString('ru-RU')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Последнее посещение</label>
                  <p className="font-medium">{client.lastVisit.toLocaleDateString('ru-RU')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Всего посещений</label>
                  <p className="font-medium">{client.totalVisits}</p>
                </div>
              </div>
              
              {client.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Заметки тренера</label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{client.notes}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="subscription">
              {client.activeSubscription ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {client.activeSubscription.name}
                      <Badge variant={client.activeSubscription.status === 'active' ? 'default' : 'secondary'}>
                        {client.activeSubscription.status === 'active' ? 'Активен' : 'Неактивен'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Стоимость</label>
                        <p className="font-medium">{client.activeSubscription.price.toLocaleString()} ₽</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Тип</label>
                        <p className="font-medium">
                          {client.activeSubscription.type === 'monthly' ? 'Месячный' : 
                           client.activeSubscription.type === 'quarterly' ? 'Квартальный' : 
                           client.activeSubscription.type === 'annual' ? 'Годовой' : 'По занятиям'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Начало</label>
                        <p className="font-medium">{client.activeSubscription.startDate.toLocaleDateString('ru-RU')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Окончание</label>
                        <p className="font-medium">{client.activeSubscription.endDate.toLocaleDateString('ru-RU')}</p>
                      </div>
                    </div>
                    
                    {client.activeSubscription.type === 'visits' && (
                      <div className="mt-4">
                        <label className="text-sm font-medium text-gray-600">Использовано занятий</label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ 
                                width: `${((client.activeSubscription.usedVisits || 0) / (client.activeSubscription.totalVisits || 1)) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {client.activeSubscription.usedVisits || 0} / {client.activeSubscription.totalVisits || 0}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm">Продлить</Button>
                      <Button size="sm" variant="outline">Заморозить</Button>
                      <Button size="sm" variant="outline">Отменить</Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Нет активного абонемента</p>
                  <Button>Оформить абонемент</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="progress">
              <div className="space-y-4">
                {client.progress.map(entry => (
                  <Card key={entry.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{entry.skill}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Уровень:</span>
                          <Badge variant="outline">{entry.level}/10</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{entry.notes}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Тренер: {entry.trainerName}</span>
                        <span>{entry.date.toLocaleDateString('ru-RU')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="achievements">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {client.achievements.map(achievement => (
                  <Card key={achievement.id} className="border-2 border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {achievement.dateEarned.toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      {achievement.videoUrl && (
                        <Button size="sm" variant="outline" className="mt-3">
                          <Icon name="Play" className="w-4 h-4 mr-2" />
                          Посмотреть видео
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="Rocket" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Kinetic Kids CRM</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-600 border-green-200">
              🟢 Система работает
            </Badge>
            <Button size="sm">
              <Icon name="Plus" className="w-4 h-4 mr-2" />
              Добавить клиента
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {selectedClient ? (
          <ClientDetails client={selectedClient} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
              <TabsTrigger value="clients">Клиенты ({clients.length})</TabsTrigger>
              <TabsTrigger value="schedule">Расписание</TabsTrigger>
              <TabsTrigger value="trainers">Тренеры ({trainers.length})</TabsTrigger>
              <TabsTrigger value="finances">Финансы</TabsTrigger>
              <TabsTrigger value="reports">Отчеты</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="Users" className="w-5 h-5 text-blue-600" />
                      Клиенты
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalClients}</div>
                    <p className="text-sm text-gray-600">+{stats.newClientsThisMonth} за месяц</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="CreditCard" className="w-5 h-5 text-green-600" />
                      Активные абонементы
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.activeSubscriptions}</div>
                    <p className="text-sm text-gray-600">из {stats.totalClients} клиентов</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="DollarSign" className="w-5 h-5 text-purple-600" />
                      Месячный доход
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.monthlyRevenue.toLocaleString()} ₽</div>
                    <p className="text-sm text-gray-600">от абонементов</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="Target" className="w-5 h-5 text-orange-600" />
                      Среднее посещений
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.avgVisitsPerClient}</div>
                    <p className="text-sm text-gray-600">на клиента</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Недавние клиенты</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {clients.slice(0, 5).map(client => (
                        <div key={client.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-purple-100 text-purple-600">
                                {client.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-sm text-gray-600">{client.email}</p>
                            </div>
                          </div>
                          <Badge variant={client.activeSubscription?.status === 'active' ? 'default' : 'secondary'}>
                            {client.activeSubscription?.status === 'active' ? 'Активен' : 'Неактивен'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Статистика тренеров</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trainers.map(trainer => (
                        <div key={trainer.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{trainer.name}</h4>
                            <Badge variant="outline">{trainer.stats.totalClients} клиентов</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Удержание:</span>
                              <span className="font-medium ml-1">{trainer.stats.clientRetentionRate}%</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Доход:</span>
                              <span className="font-medium ml-1">{trainer.stats.monthlyEarnings.toLocaleString()} ₽</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="clients">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Поиск клиентов..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Icon name="Filter" className="w-4 h-4 mr-2" />
                      Фильтры
                    </Button>
                    <Button>
                      <Icon name="Plus" className="w-4 h-4 mr-2" />
                      Добавить клиента
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClients.map(client => (
                    <ClientCard key={client.id} client={client} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule">
              <ScheduleModule />
            </TabsContent>

            <TabsContent value="trainers">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {trainers.map(trainer => (
                  <Card key={trainer.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {trainer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{trainer.name}</h3>
                          <p className="text-sm text-gray-600">{trainer.specialization.join(', ')}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Клиенты:</span>
                          <p className="font-semibold">{trainer.stats.totalClients}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Удержание:</span>
                          <p className="font-semibold">{trainer.stats.clientRetentionRate}%</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Оклад:</span>
                          <p className="font-semibold">{trainer.salary.toLocaleString()} ₽</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Процент:</span>
                          <p className="font-semibold">{trainer.commissionRate}%</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Расписание:</h4>
                        {trainer.schedule.map((schedule, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'][schedule.dayOfWeek]}
                            </span>
                            <span>{schedule.startTime} - {schedule.endTime}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="finances">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Доходы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {stats.monthlyRevenue.toLocaleString()} ₽
                    </div>
                    <p className="text-sm text-gray-600">за текущий месяц</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Активные абонементы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {stats.activeSubscriptions}
                    </div>
                    <p className="text-sm text-gray-600">приносят доход</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Средний чек</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {Math.round(stats.monthlyRevenue / Math.max(stats.activeSubscriptions, 1)).toLocaleString()} ₽
                    </div>
                    <p className="text-sm text-gray-600">за абонемент</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Отчеты и аналитика</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Icon name="BarChart" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Модуль отчетов</h3>
                    <p className="text-gray-600 mb-4">Здесь будут подробные отчеты и аналитика</p>
                    <Button>Создать отчет</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default KineticCRM;