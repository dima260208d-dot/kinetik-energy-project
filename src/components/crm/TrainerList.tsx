import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trainer } from '@/types/crm';

interface TrainerListProps {
  trainers: Trainer[];
}

const TrainerList: React.FC<TrainerListProps> = ({ trainers }) => {
  return (
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
  );
};

export default TrainerList;