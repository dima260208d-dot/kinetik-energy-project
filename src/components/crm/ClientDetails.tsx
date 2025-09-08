import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Client } from '@/types/crm';

interface ClientDetailsProps {
  client: Client;
  onBack: () => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client, onBack }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Button 
        variant="ghost" 
        onClick={onBack}
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

export default ClientDetails;