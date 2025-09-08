import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Client, Trainer } from '@/types/crm';

interface DashboardStatsProps {
  clients: Client[];
  trainers: Trainer[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ clients, trainers }) => {
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

  return (
    <>
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
    </>
  );
};

export default DashboardStats;