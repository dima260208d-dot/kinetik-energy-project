import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    admins: number;
    trainers: number;
    clients: number;
    pendingApplications: number;
    totalPurchases: number;
    totalRevenue: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="rainbow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">👥 Пользователи</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <div className="text-sm text-gray-600">Активных: {stats.activeUsers}</div>
        </CardContent>
      </Card>

      <Card className="rainbow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">⚡ Роли</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">Админы: {stats.admins}</div>
          <div className="text-sm">Тренеры: {stats.trainers}</div>
          <div className="text-sm">Клиенты: {stats.clients}</div>
        </CardContent>
      </Card>

      <Card className="rainbow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">📋 Заявки</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingApplications}</div>
          <div className="text-sm text-gray-600">Ожидают</div>
        </CardContent>
      </Card>

      <Card className="rainbow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">💰 Доход</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRevenue}₽</div>
          <div className="text-sm text-gray-600">Покупок: {stats.totalPurchases}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;