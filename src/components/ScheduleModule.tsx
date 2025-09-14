import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

// Импорты новых компонентов
import { Lesson, mockLessons, mockTrainers, getDifficultyColor } from './schedule/ScheduleTypes';
import LessonCard from './schedule/LessonCard';
import LessonDetails from './schedule/LessonDetails';
import AddLessonForm from './schedule/AddLessonForm';

const ScheduleModule = () => {
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'list'>('week');

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

  if (selectedLesson) {
    return <LessonDetails lesson={selectedLesson} onBack={() => setSelectedLesson(null)} />;
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
      {showAddLesson && (
        <AddLessonForm 
          selectedDate={selectedDate}
          onAddLesson={addLesson}
          onCancel={() => setShowAddLesson(false)}
        />
      )}

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
                      <LessonCard lesson={lesson} onClick={setSelectedLesson} />
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
              <LessonCard key={lesson.id} lesson={lesson} onClick={setSelectedLesson} />
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