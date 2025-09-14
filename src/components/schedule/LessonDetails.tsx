import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Lesson, getDifficultyColor, getAgeGroupIcon } from './ScheduleTypes';

interface LessonDetailsProps {
  lesson: Lesson;
  onBack: () => void;
}

const LessonDetails: React.FC<LessonDetailsProps> = ({ lesson, onBack }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Button 
        variant="ghost" 
        onClick={onBack}
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

export default LessonDetails;