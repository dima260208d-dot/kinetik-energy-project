import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { User, Purchase, UserActivity } from '@/types/auth';

interface UserMonitoringModalProps {
  users: User[];
  purchases: Purchase[];
  userActivities: UserActivity[];
  onClose: () => void;
}

const UserMonitoringModal = ({ users, purchases, userActivities, onClose }: UserMonitoringModalProps) => {
  const [monitoringFilter, setMonitoringFilter] = useState<'all' | 'clients' | 'trainers' | 'admins'>('all');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Icon name="Eye" className="w-6 h-6 text-green-600" />
              Мониторинг всех пользователей
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
            >
              <Icon name="X" className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={monitoringFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setMonitoringFilter('all')}
            >
              Все ({users.length})
            </Button>
            <Button
              size="sm"
              variant={monitoringFilter === 'clients' ? 'default' : 'outline'}
              onClick={() => setMonitoringFilter('clients')}
            >
              Клиенты ({users.filter(u => u.role === 'client').length})
            </Button>
            <Button
              size="sm"
              variant={monitoringFilter === 'trainers' ? 'default' : 'outline'}
              onClick={() => setMonitoringFilter('trainers')}
            >
              Тренеры ({users.filter(u => u.role === 'trainer').length})
            </Button>
            <Button
              size="sm"
              variant={monitoringFilter === 'admins' ? 'default' : 'outline'}
              onClick={() => setMonitoringFilter('admins')}
            >
              Админы ({users.filter(u => u.role === 'admin').length})
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="space-y-4">
            {users
              .filter(u => {
                if (monitoringFilter === 'all') return true;
                if (monitoringFilter === 'clients') return u.role === 'client';
                if (monitoringFilter === 'trainers') return u.role === 'trainer';
                if (monitoringFilter === 'admins') return u.role === 'admin';
                return true;
              })
              .map(targetUser => {
                const userPurchases = purchases.filter(p => p.userId === targetUser.id);
                const userActivitiesFiltered = userActivities.filter(a => a.userId === targetUser.id);
                const totalSpent = userPurchases.reduce((sum, p) => sum + p.amount, 0);
                const lastActivity = userActivitiesFiltered[0];
                const isOnline = lastActivity && (Date.now() - new Date(lastActivity.timestamp).getTime()) < 5 * 60 * 1000;
                
                const getLastSeenText = () => {
                  if (!lastActivity) return 'Никогда';
                  const diff = Date.now() - new Date(lastActivity.timestamp).getTime();
                  const minutes = Math.floor(diff / 60000);
                  const hours = Math.floor(diff / 3600000);
                  const days = Math.floor(diff / 86400000);
                  
                  if (isOnline) return 'Онлайн';
                  if (minutes < 1) return 'Только что';
                  if (minutes < 60) return `${minutes} мин назад`;
                  if (hours < 24) return `${hours} ч назад`;
                  return `${days} дн назад`;
                };

                return (
                  <Card key={targetUser.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl">
                              {targetUser.name.charAt(0)}
                            </div>
                            {isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-lg">{targetUser.name}</div>
                            <div className="text-sm text-gray-600">{targetUser.email}</div>
                            <div className="flex gap-2 mt-1">
                              <Badge variant={targetUser.role === 'admin' ? 'default' : targetUser.role === 'trainer' ? 'secondary' : 'outline'}>
                                {targetUser.role === 'admin' ? '⚡ Админ' : targetUser.role === 'trainer' ? '🎯 Тренер' : targetUser.role === 'director' ? '👑 Директор' : '👤 Клиент'}
                              </Badge>
                              <Badge variant={isOnline ? 'default' : 'outline'} className={isOnline ? 'bg-green-500' : ''}>
                                {getLastSeenText()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Потрачено</div>
                          <div className="text-xl font-bold text-green-600">{totalSpent}₽</div>
                          <div className="text-xs text-gray-500">Покупок: {userPurchases.length}</div>
                        </div>
                      </div>

                      {userActivitiesFiltered.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold mb-2 flex items-center gap-2">
                            <Icon name="Activity" className="w-4 h-4" />
                            Последние действия ({userActivitiesFiltered.length})
                          </div>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {userActivitiesFiltered.slice(0, 5).map((activity, idx) => (
                              <div key={idx} className="text-sm flex justify-between">
                                <span className="text-gray-700">{activity.action}</span>
                                <span className="text-gray-500 text-xs">
                                  {new Date(activity.timestamp).toLocaleString('ru-RU', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {userPurchases.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <div className="font-semibold mb-2 flex items-center gap-2">
                            <Icon name="ShoppingCart" className="w-4 h-4" />
                            История покупок
                          </div>
                          <div className="space-y-1">
                            {userPurchases.slice(0, 3).map((purchase, idx) => (
                              <div key={idx} className="text-sm flex justify-between">
                                <span className="text-gray-700">{purchase.serviceName}</span>
                                <span className="font-semibold text-green-600">{purchase.amount}₽</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserMonitoringModal;
