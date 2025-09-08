import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Client } from '@/types/crm';

interface FinanceModuleProps {
  clients: Client[];
}

const FinanceModule: React.FC<FinanceModuleProps> = ({ clients }) => {
  const stats = {
    activeSubscriptions: clients.filter(c => c.activeSubscription?.status === 'active').length,
    monthlyRevenue: clients.reduce((sum, client) => {
      if (client.activeSubscription?.status === 'active') {
        return sum + client.activeSubscription.price;
      }
      return sum;
    }, 0)
  };

  return (
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
  );
};

export default FinanceModule;