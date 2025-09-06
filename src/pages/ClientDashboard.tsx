import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Purchase, Application, ChatMessage } from '@/types/auth';

const ClientDashboard = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = () => {
    const stored = localStorage.getItem('fitness_app_data');
    if (stored && user) {
      const data = JSON.parse(stored);
      
      // Загружаем только данные текущего пользователя
      setPurchases((data.purchases || []).filter((p: Purchase) => p.userId === user.id));
      setApplications((data.applications || []).filter((app: Application) => app.userId === user.id));
      setChatMessages((data.chatMessages || []).filter((msg: ChatMessage) => msg.userId === user.id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">⏳ Ожидает</Badge>;
      case 'approved':
        return <Badge variant="default">✅ Одобрено</Badge>;
      case 'rejected':
        return <Badge variant="destructive">❌ Отклонено</Badge>;
      case 'completed':
        return <Badge variant="default">✅ Завершено</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">❌ Отменено</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalPurchases = purchases.length;
  const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
  const completedPurchases = purchases.filter(p => p.status === 'completed').length;
  const pendingApplications = applications.filter(app => app.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Личный кабинет</h1>
          <div className="flex gap-4">
            <span className="text-white bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              👤 {user?.name}
            </span>
            <Button onClick={logout} variant="outline" className="bg-white bg-opacity-20 text-white border-white">
              Выйти
            </Button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="rainbow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">🛒 Покупки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPurchases}</div>
              <div className="text-sm text-gray-600">Всего заказов</div>
            </CardContent>
          </Card>

          <Card className="rainbow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">💰 Потрачено</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSpent}₽</div>
              <div className="text-sm text-gray-600">На тренировки</div>
            </CardContent>
          </Card>

          <Card className="rainbow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">✅ Завершено</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedPurchases}</div>
              <div className="text-sm text-gray-600">Программ пройдено</div>
            </CardContent>
          </Card>

          <Card className="rainbow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">📋 Заявки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApplications}</div>
              <div className="text-sm text-gray-600">Ожидают ответа</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* История покупок */}
          <Card className="rainbow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🛒</span>
                История покупок
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              {purchases.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">🛍️</div>
                  <p>У вас пока нет покупок</p>
                  <p className="text-sm">Выберите подходящую программу тренировок!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(purchase => (
                      <div key={purchase.id} className="border rounded-lg p-4 bg-white bg-opacity-80">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{purchase.program}</h4>
                            <p className="text-2xl font-bold text-green-600">{purchase.amount}₽</p>
                          </div>
                          {getStatusBadge(purchase.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(purchase.date).toLocaleString('ru-RU')}
                        </div>
                        {purchase.status === 'completed' && (
                          <div className="mt-2 text-sm text-green-600">
                            ✅ Программа успешно завершена!
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Мои заявки */}
          <Card className="rainbow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📋</span>
                Мои заявки
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              {applications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">📝</div>
                  <p>У вас пока нет заявок</p>
                  <p className="text-sm">Свяжитесь с нами для консультации!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map(app => (
                      <div key={app.id} className="border rounded-lg p-4 bg-white bg-opacity-80">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{app.program}</h4>
                            <div className="text-sm text-gray-600">
                              {new Date(app.createdAt).toLocaleString('ru-RU')}
                            </div>
                          </div>
                          {getStatusBadge(app.status)}
                        </div>
                        
                        <div className="mb-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-800">{app.message}</p>
                        </div>
                        
                        {app.status !== 'pending' && (
                          <div className="text-sm">
                            <p className="text-gray-600">
                              Обработано: {app.reviewedBy} • {new Date(app.reviewedAt || '').toLocaleString('ru-RU')}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* История чата */}
          <Card className="rainbow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>💬</span>
                История общения с чат-ботом
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">🤖</div>
                  <p>У вас пока нет сообщений с чат-ботом</p>
                  <p className="text-sm">Задайте вопрос боту внизу страницы!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map(msg => (
                      <div key={msg.id} className="border rounded-lg p-4 bg-white bg-opacity-80">
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <div className="text-blue-500 font-medium">👤 Вы:</div>
                            <div className="text-blue-800 bg-blue-50 p-2 rounded-md flex-1">
                              {msg.message}
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="text-green-500 font-medium">🤖 Бот:</div>
                            <div className="text-green-800 bg-green-50 p-2 rounded-md flex-1">
                              {msg.response}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 text-right">
                          {new Date(msg.timestamp).toLocaleString('ru-RU')}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;