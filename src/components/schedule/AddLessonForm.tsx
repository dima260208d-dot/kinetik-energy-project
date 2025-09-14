import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Lesson, mockTrainers } from './ScheduleTypes';

interface AddLessonFormProps {
  selectedDate: string;
  onAddLesson: (lessonData: Partial<Lesson>) => void;
  onCancel: () => void;
}

const AddLessonForm: React.FC<AddLessonFormProps> = ({ selectedDate, onAddLesson, onCancel }) => {
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

  // Генерация временных слотов
  const timeSlots = [];
  for (let hour = 8; hour <= 22; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

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
          <Button onClick={() => onAddLesson(formData)}>
            <Icon name="Plus" className="w-4 h-4 mr-2" />
            Создать занятие
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddLessonForm;