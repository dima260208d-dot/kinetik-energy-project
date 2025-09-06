import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Application, User } from '@/types/auth';
import Navigation from '@/components/Navigation';
import ProfileSettings from '@/components/ProfileSettings';

const AdminDashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  
  const { user, logout } = useAuth();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    const stored = localStorage.getItem('fitness_app_data');
    if (stored) {
      const data = JSON.parse(stored);
      setApplications(data.applications || []);
      setUsers(data.users || []);
    }
  };

  const handleApplicationAction = (appId: string, action: 'approved' | 'rejected') => {
    const stored = localStorage.getItem('fitness_app_data');
    if (stored) {
      const data = JSON.parse(stored);
      
      const updatedApplications = data.applications.map((app: Application) =>
        app.id === appId 
          ? { 
              ...app, 
              status: action, 
              reviewedBy: user?.name || '',
              reviewedAt: new Date() 
            }
          : app
      );
      
      const newData = {
        ...data,
        applications: updatedApplications
      };
      
      localStorage.setItem('fitness_app_data', JSON.stringify(newData));
      setApplications(updatedApplications);
    }
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const processedApplications = applications.filter(app => app.status !== 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Панель администратора</h1>
          <Navigation 
            currentPage="dashboard" 
            onSettingsClick={() => setShowSettings(true)}
          />
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="rainbow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">⏳ Ожидают обработки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingApplications.length}</div>
            </CardContent>
          </Card>

          <Card className="rainbow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">✅ Обработано</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{processedApplications.length}</div>
            </CardContent>
          </Card>

          <Card className="rainbow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">📋 Всего заявок</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Заявки, ожидающие обработки */}
        <Card className="rainbow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>⏳</span>
              Заявки, ожидающие обработки
              {pendingApplications.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingApplications.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">✨</div>
                <p>Все заявки обработаны!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingApplications.map(app => (
                  <div key={app.id} className="border rounded-lg p-4 bg-white bg-opacity-80">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{app.userName}</h4>
                        <p className="text-gray-600">{app.userEmail}</p>
                        <div className="text-sm text-gray-500">
                          {new Date(app.createdAt).toLocaleString('ru-RU')}
                        </div>
                      </div>
                      <Badge variant="secondary">⏳ Ожидает</Badge>
                    </div>
                    
                    <div className="mb-3">
                      <p className="font-medium">Программа: <span className="text-blue-600">{app.program}</span></p>
                    </div>
                    
                    <div className="mb-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-gray-800">{app.message}</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleApplicationAction(app.id, 'approved')}
                        className="rainbow-button flex-1"
                      >
                        ✅ Одобрить
                      </Button>
                      <Button
                        onClick={() => handleApplicationAction(app.id, 'rejected')}
                        variant="destructive"
                        className="flex-1"
                      >
                        ❌ Отклонить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* История обработанных заявок */}
        <Card className="rainbow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📊</span>
              История обработанных заявок
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {processedApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>История пуста</p>
              </div>
            ) : (
              <div className="space-y-3">
                {processedApplications
                  .sort((a, b) => new Date(b.reviewedAt || 0).getTime() - new Date(a.reviewedAt || 0).getTime())
                  .map(app => (
                    <div key={app.id} className="border rounded-lg p-3 bg-white bg-opacity-60">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{app.userName}</div>
                          <div className="text-sm text-gray-600">{app.userEmail}</div>
                        </div>
                        <div className="text-right">
                          <Badge variant={app.status === 'approved' ? 'default' : 'destructive'}>
                            {app.status === 'approved' ? '✅ Одобрено' : '❌ Отклонено'}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            {app.reviewedBy}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm mb-1">
                        <strong>Программа:</strong> {app.program}
                      </div>
                      <div className="text-xs text-gray-500">
                        Обработано: {new Date(app.reviewedAt || '').toLocaleString('ru-RU')}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Настройки профиля */}
      {showSettings && (
        <ProfileSettings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;