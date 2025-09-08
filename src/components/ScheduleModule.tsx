import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface Lesson {
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

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'overdue';
}

interface Trainer {
  id: string;
  name: string;
  specialization: string[];
  rating: number;
  experience: number;
}

const mockTrainers: Trainer[] = [
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

const mockLessons: Lesson[] = [
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

const ScheduleModule = () => {
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'list'>('week');

  // Генерация временных слотов
  const timeSlots = [];
  for (let hour = 8; hour <= 22; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  // Генерация дней недели
  const getWeekDays = (startDate: string) => {
    const date = new Date(startDate);
    const monday = new Date(date.setDate(date.getDate() - date.getDay() + 1));
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(day.toISOString().split('T')[0]);
    }
    return days;
  };

  const weekDays = getWeekDays(selectedDate);

  const addLesson = (lessonData: Partial<Lesson>) => {
    const newLesson: Lesson = {
      id: `l${Date.now()}`,
      name: lessonData.name || 'Новое занятие',
      trainerId: lessonData.trainerId || 't1',
      trainerName: mockTrainers.find(t => t.id === lessonData.trainerId)?.name || 'Неизвестный тренер',
      date: lessonData.date || selectedDate,
      startTime: lessonData.startTime || '10:00',
      endTime: lessonData.endTime || '11:00',
      maxParticipants: lessonData.maxParticipants || 8,
      currentParticipants: [],
      type: lessonData.type || 'group',
      price: lessonData.price || 800,
      description: lessonData.description || '',
      skills: lessonData.skills || [],
      ageGroup: lessonData.ageGroup || 'all',
      difficulty: lessonData.difficulty || 'beginner',
      status: 'scheduled'
    };
    setLessons([...lessons, newLesson]);
    setShowAddLesson(false);
  };

  const getLessonsForDate = (date: string) => {
    return lessons.filter(lesson => lesson.date === date);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAgeGroupIcon = (ageGroup: string) => {
    switch (ageGroup) {
      case 'kids': return '🧒';
      case 'teens': return '🧑‍🎓';
      case 'adults': return '👨‍💼';
      default: return '👥';
    }
  };

  const LessonCard = ({ lesson }: { lesson: Lesson }) => (
    <Card 
      className="h-full cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-purple-500"
      onClick={() => setSelectedLesson(lesson)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{lesson.name}</CardTitle>
          <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
            {lesson.difficulty}
          </Badge>
        </div>
        <div className="text-xs text-gray-600">
          {lesson.startTime} - {lesson.endTime}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="User" className="w-4 h-4 text-gray-400" />
            <span>{lesson.trainerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Users" className="w-4 h-4 text-gray-400" />
            <span>{lesson.currentParticipants.length} / {lesson.maxParticipants}</span>
            <span className="ml-auto">{getAgeGroupIcon(lesson.ageGroup)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <Badge variant="secondary" className="text-xs">
              {lesson.type === 'group' ? 'Группа' : 'Индивидуально'}
            </Badge>
            <span className="font-semibold">{lesson.price} ₽</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const LessonDetails = ({ lesson }: { lesson: Lesson }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedLesson(null)}
          className="flex items-center gap-2"
        >
          <Icon name="ArrowLeft" className="w-4 h-4" />
          Назад к расписанию
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Icon name="Edit" className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Users" className="w-4 h-4 mr-2" />
            Участники
          </Button>
          <Button size="sm">
            <Icon name="MessageCircle" className="w-4 h-4 mr-2" />
            Уведомить
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{lesson.name}</CardTitle>
              <p className="text-gray-600 mt-2">{lesson.description}</p>
            </div>
            <Badge 
              variant={lesson.status === 'scheduled' ? 'default' : 'secondary'}
              className="ml-4"
            >
              {lesson.status === 'scheduled' ? 'Запланировано' : 'Завершено'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Основная информация</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon name="Calendar" className="w-4 h-4 text-gray-400" />
                    <span>{new Date(lesson.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" className="w-4 h-4 text-gray-400" />
                    <span>{lesson.startTime} - {lesson.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="User" className="w-4 h-4 text-gray-400" />
                    <span>{lesson.trainerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="DollarSign" className="w-4 h-4 text-gray-400" />
                    <span>{lesson.price} ₽</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Характеристики</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{lesson.type === 'group' ? 'Групповое' : 'Индивидуальное'}</Badge>
                  <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
                    {lesson.difficulty === 'beginner' ? 'Начинающий' : 
                     lesson.difficulty === 'intermediate' ? 'Средний' : 'Продвинутый'}
                  </Badge>
                  <Badge variant="outline">
                    {getAgeGroupIcon(lesson.ageGroup)} 
                    {lesson.ageGroup === 'kids' ? 'Дети' :
                     lesson.ageGroup === 'teens' ? 'Подростки' :
                     lesson.ageGroup === 'adults' ? 'Взрослые' : 'Все возрасты'}
                  </Badge>
                </div>
              </div>

              {lesson.skills.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Изучаемые навыки</h4>
                  <div className="flex flex-wrap gap-1">
                    {lesson.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Участники</h4>
                  <Badge variant="outline">
                    {lesson.currentParticipants.length} / {lesson.maxParticipants}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {lesson.currentParticipants.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      Пока нет записавшихся
                    </div>
                  ) : (
                    lesson.currentParticipants.map(participant => (
                      <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{participant.name}</p>
                            <p className="text-xs text-gray-600">{participant.phone}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Badge 
                            variant={participant.status === 'confirmed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {participant.status === 'confirmed' ? '✓' : '?'}
                          </Badge>
                          <Badge 
                            variant={participant.paymentStatus === 'paid' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {participant.paymentStatus === 'paid' ? '💳' : '❌'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button size="sm" className="w-full">
                    <Icon name="UserPlus" className="w-4 h-4 mr-2" />
                    Записать клиента
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Icon name="MessageCircle" className="w-4 h-4 mr-2" />
                    Уведомить всех
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AddLessonForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      trainerId: '',
      date: selectedDate,
      startTime: '10:00',
      endTime: '11:00',
      maxParticipants: 8,
      type: 'group' as 'group' | 'individual',
      price: 800,
      description: '',
      ageGroup: 'all' as 'kids' | 'teens' | 'adults' | 'all',
      difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
    });

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Создать новое занятие</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Название</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Основы скейтборда"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Тренер</label>
              <Select value={formData.trainerId} onValueChange={(value) => setFormData(prev => ({ ...prev, trainerId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тренера" />
                </SelectTrigger>
                <SelectContent>
                  {mockTrainers.map(trainer => (
                    <SelectItem key={trainer.id} value={trainer.id}>
                      {trainer.name} - {trainer.specialization.join(', ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Дата</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Начало</label>
                <Select value={formData.startTime} onValueChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Конец</label>
                <Select value={formData.endTime} onValueChange={(value) => setFormData(prev => ({ ...prev, endTime: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Макс. участников</label>
              <Input
                type="number"
                min="1"
                max="20"
                value={formData.maxParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Цена (₽)</label>
              <Input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Тип занятия</label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group">Групповое</SelectItem>
                  <SelectItem value="individual">Индивидуальное</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Возрастная группа</label>
              <Select value={formData.ageGroup} onValueChange={(value) => setFormData(prev => ({ ...prev, ageGroup: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kids">🧒 Дети (3-10)</SelectItem>
                  <SelectItem value="teens">🧑‍🎓 Подростки (11-17)</SelectItem>
                  <SelectItem value="adults">👨‍💼 Взрослые (18+)</SelectItem>
                  <SelectItem value="all">👥 Все возрасты</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Описание</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Описание занятия..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => addLesson(formData)}>
              <Icon name="Plus" className="w-4 h-4 mr-2" />
              Создать занятие
            </Button>
            <Button variant="outline" onClick={() => setShowAddLesson(false)}>
              Отмена
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (selectedLesson) {
    return <LessonDetails lesson={selectedLesson} />;
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и управление */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Расписание и онлайн-запись</h2>
          <p className="text-gray-600">Управление занятиями и бронированием</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-lg">
            <Button 
              variant={viewMode === 'week' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('week')}
            >
              Неделя
            </Button>
            <Button 
              variant={viewMode === 'day' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('day')}
            >
              День
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('list')}
            >
              Список
            </Button>
          </div>
          <Button onClick={() => setShowAddLesson(true)}>
            <Icon name="Plus" className="w-4 h-4 mr-2" />
            Добавить занятие
          </Button>
        </div>
      </div>

      {/* Форма добавления занятия */}
      {showAddLesson && <AddLessonForm />}

      {/* Выбор даты */}
      <div className="flex items-center gap-4">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-auto"
        />
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Icon name="Calendar" className="w-4 h-4" />
          <span>Всего занятий: {lessons.length}</span>
        </div>
      </div>

      {/* Расписание */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => {
            const dayLessons = getLessonsForDate(day);
            const dayName = new Date(day).toLocaleDateString('ru-RU', { weekday: 'short' });
            const isToday = day === new Date().toISOString().split('T')[0];
            
            return (
              <div key={day} className={`space-y-2 ${isToday ? 'bg-blue-50 p-2 rounded-lg' : ''}`}>
                <div className="text-center">
                  <div className="font-medium">{dayName}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(day).getDate()}
                  </div>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {dayLessons.map(lesson => (
                    <div key={lesson.id} className="scale-90 origin-top">
                      <LessonCard lesson={lesson} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'day' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {new Date(selectedDate).toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getLessonsForDate(selectedDate).map(lesson => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
          {getLessonsForDate(selectedDate).length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Icon name="Calendar" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>На этот день занятий не запланировано</p>
            </div>
          )}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="space-y-4">
          {lessons
            .sort((a, b) => new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime())
            .map(lesson => (
              <Card key={lesson.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedLesson(lesson)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-bold text-lg">
                          {new Date(lesson.date).getDate()}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(lesson.date).toLocaleDateString('ru-RU', { month: 'short' })}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{lesson.name}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>{lesson.startTime} - {lesson.endTime}</div>
                          <div>{lesson.trainerName}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">{lesson.currentParticipants.length}/{lesson.maxParticipants}</div>
                        <div className="text-xs text-gray-600">участников</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold">{lesson.price} ₽</div>
                        <div className="text-xs text-gray-600">цена</div>
                      </div>
                      <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
                        {lesson.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleModule;