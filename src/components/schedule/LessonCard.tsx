import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Lesson, getDifficultyColor, getAgeGroupIcon } from './ScheduleTypes';

interface LessonCardProps {
  lesson: Lesson;
  onClick: (lesson: Lesson) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onClick }) => (
  <Card 
    className="h-full cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-purple-500"
    onClick={() => onClick(lesson)}
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

export default LessonCard;