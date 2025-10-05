import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Application, ChatMessage, Purchase, UserActivity, UserRole } from '@/types/auth';
import Icon from '@/components/ui/icon';
import Navigation from '@/components/Navigation';
import ProfileSettings from '@/components/ProfileSettings';
import CrmSpecification from '@/components/CrmSpecification';

const DirectorDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [showAddTrainer, setShowAddTrainer] = useState(false);
  const [newTrainerEmail, setNewTrainerEmail] = useState('');
  const [newTrainerName, setNewTrainerName] = useState('');
  const [newTrainerPhone, setNewTrainerPhone] = useState('');
  const [newTrainerPassword, setNewTrainerPassword] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showFullChatHistory, setShowFullChatHistory] = useState(false);
  const [showCrmSpec, setShowCrmSpec] = useState(false);
  const [showUserMonitoring, setShowUserMonitoring] = useState(false);
  const [monitoringFilter, setMonitoringFilter] = useState<'all' | 'clients' | 'trainers' | 'admins'>('all');
  
  const { user, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const stored = localStorage.getItem('fitness_app_data');
    if (stored) {
      const data = JSON.parse(stored);
      setUsers(data.users || []);
      setApplications(data.applications || []);
      setChatMessages(data.chatMessages || []);
      setPurchases(data.purchases || []);
      setUserActivities(data.userActivities || []);
    }
  };

  const saveData = (updatedUsers?: User[], updatedApplications?: Application[]) => {
    const stored = localStorage.getItem('fitness_app_data');
    const data = stored ? JSON.parse(stored) : {};
    
    const newData = {
      ...data,
      users: updatedUsers || users,
      applications: updatedApplications || applications,
      chatMessages,
      purchases,
      userActivities
    };
    
    localStorage.setItem('fitness_app_data', JSON.stringify(newData));
  };

  const addAdmin = () => {
    if (!newAdminEmail || !newAdminName || !newAdminPassword) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    if (users.find(u => u.email === newAdminEmail)) {
      toast({
        title: "Ошибка",
        description: "Пользователь с таким email уже существует",
        variant: "destructive"
      });
      return;
    }

    const newAdmin: User = {
      id: Date.now().toString(),
      email: newAdminEmail,
      password: newAdminPassword,
      name: newAdminName,
      role: 'admin',
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true
    };

    const updatedUsers = [...users, newAdmin];
    setUsers(updatedUsers);
    saveData(updatedUsers);

    setNewAdminEmail('');
    setNewAdminName('');
    setNewAdminPassword('');
    setShowAddAdmin(false);
    toast({
      title: "Успех",
      description: "Администратор добавлен"
    });
  };

  const addTrainer = () => {
    if (!newTrainerEmail || !newTrainerName || !newTrainerPassword) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    if (users.find(u => u.email === newTrainerEmail)) {
      toast({
        title: "Ошибка",
        description: "Пользователь с таким email уже существует",
        variant: "destructive"
      });
      return;
    }

    const newTrainer: User = {
      id: Date.now().toString(),
      email: newTrainerEmail,
      password: newTrainerPassword,
      name: newTrainerName,
      phone: newTrainerPhone,
      role: 'trainer',
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true
    };

    const updatedUsers = [...users, newTrainer];
    setUsers(updatedUsers);
    saveData(updatedUsers);

    const activity: UserActivity = {
      id: Date.now().toString(),
      userId: user?.id || '',
      action: 'create_admin',
      details: `Создан администратор: ${newAdminName} (${newAdminEmail})`,
      timestamp: new Date()
    };
    
    const updatedActivities = [...userActivities, activity];
    setUserActivities(updatedActivities);

    toast({
      title: "Успех",
      description: "Администратор добавлен"
    });

    setShowAddAdmin(false);
    setNewAdminEmail('');
    setNewAdminName('');
    setNewAdminPassword('');
  };

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    );
    setUsers(updatedUsers);
    saveData(updatedUsers);
  };

  const changeUserRole = (userId: string, newRole: UserRole) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    );
    setUsers(updatedUsers);
    saveData(updatedUsers);
  };

  const handleApplicationAction = (appId: string, action: 'approved' | 'rejected') => {
    const updatedApplications = applications.map(app =>
      app.id === appId 
        ? { 
            ...app, 
            status: action, 
            reviewedBy: user?.name || '',
            reviewedAt: new Date() 
          }
        : app
    );
    setApplications(updatedApplications);
    saveData(users, updatedApplications);
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length,
    trainers: users.filter(u => u.role === 'trainer').length,
    clients: users.filter(u => u.role === 'client').length,
    pendingApplications: applications.filter(a => a.status === 'pending').length,
    totalPurchases: purchases.length,
    totalRevenue: purchases.reduce((sum, p) => sum + p.amount, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Панель директора</h1>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowCrmSpec(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Icon name="FileText" className="w-4 h-4 mr-2" />
              Техническое задание CRM
            </Button>
            <Button
              onClick={() => setShowUserMonitoring(true)}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
            >
              <Icon name="Eye" className="w-4 h-4 mr-2" />
              Мониторинг пользователей
            </Button>
            <Navigation 
              currentPage="dashboard" 
              onSettingsClick={() => setShowSettings(true)}
            />
          </div>
        </div>

        {/* Статистика */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Управление пользователями */}
          <Card className="rainbow-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>👥 Пользователи</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowAddAdmin(!showAddAdmin)}
                    className="rainbow-button"
                    size="sm"
                  >
                    + Добавить админа
                  </Button>
                  <Button 
                    onClick={() => setShowAddTrainer(!showAddTrainer)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    size="sm"
                  >
                    + Добавить тренера
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              {showAddTrainer && (
                <div className="mb-4 p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-semibold mb-3">Добавить тренера</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Email *</Label>
                      <Input
                        value={newTrainerEmail}
                        onChange={(e) => setNewTrainerEmail(e.target.value)}
                        placeholder="trainer@example.com"
                      />
                    </div>
                    <div>
                      <Label>Имя *</Label>
                      <Input
                        value={newTrainerName}
                        onChange={(e) => setNewTrainerName(e.target.value)}
                        placeholder="Имя тренера"
                      />
                    </div>
                    <div>
                      <Label>Телефон</Label>
                      <Input
                        value={newTrainerPhone}
                        onChange={(e) => setNewTrainerPhone(e.target.value)}
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>
                    <div>
                      <Label>Пароль *</Label>
                      <Input
                        value={newTrainerPassword}
                        onChange={(e) => setNewTrainerPassword(e.target.value)}
                        type="password"
                        placeholder="Пароль"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addTrainer} size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        Добавить
                      </Button>
                      <Button 
                        onClick={() => setShowAddTrainer(false)}
                        size="sm" 
                        variant="outline"
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {showAddAdmin && (
                <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-semibold mb-3">Добавить администратора</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <Label>Имя</Label>
                      <Input
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        placeholder="Имя администратора"
                      />
                    </div>
                    <div>
                      <Label>Пароль</Label>
                      <Input
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        type="password"
                        placeholder="Пароль"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addAdmin} size="sm" className="rainbow-button">
                        Добавить
                      </Button>
                      <Button 
                        onClick={() => setShowAddAdmin(false)}
                        size="sm" 
                        variant="outline"
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {users.filter(u => u.role !== 'trainer').map(u => (
                  <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-sm text-gray-600">{u.email}</div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={u.role === 'director' ? 'default' : u.role === 'admin' ? 'secondary' : 'outline'}>
                          {u.role === 'director' ? '👑 Директор' : u.role === 'admin' ? '⚡ Админ' : '👤 Клиент'}
                        </Badge>
                        <Badge variant={u.isActive ? 'default' : 'destructive'}>
                          {u.isActive ? '✅ Активен' : '❌ Заблокирован'}
                        </Badge>
                      </div>
                    </div>
                    {u.role !== 'director' && (
                      <div className="flex gap-2">
                        <Select value={u.role} onValueChange={(role: UserRole) => changeUserRole(u.id, role)}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="client">Клиент</SelectItem>
                            <SelectItem value="admin">Админ</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant={u.isActive ? "destructive" : "default"}
                          onClick={() => toggleUserStatus(u.id)}
                        >
                          {u.isActive ? '🚫' : '✅'}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Тренеры */}
          <Card className="rainbow-card">
            <CardHeader>
              <CardTitle>🎯 Тренеры</CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {users.filter(u => u.role === 'trainer').length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Тренеров пока нет</p>
                ) : (
                  users.filter(u => u.role === 'trainer').map(trainer => (
                    <div key={trainer.id} className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                      <div>
                        <div className="font-medium">{trainer.name}</div>
                        <div className="text-sm text-gray-600">{trainer.email}</div>
                        {trainer.phone && (
                          <div className="text-sm text-gray-600">{trainer.phone}</div>
                        )}
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary">🎯 Тренер</Badge>
                          <Badge variant={trainer.isActive ? 'default' : 'destructive'}>
                            {trainer.isActive ? '✅ Активен' : '❌ Заблокирован'}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={trainer.isActive ? "destructive" : "default"}
                        onClick={() => toggleUserStatus(trainer.id)}
                      >
                        {trainer.isActive ? '🚫 Заблокировать' : '✅ Разблокировать'}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-8">
          {/* Заявки */}
          <Card className="rainbow-card">
            <CardHeader>
              <CardTitle>📋 Заявки клиентов</CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {applications.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Заявок пока нет</p>
                ) : (
                  applications.map(app => (
                    <div key={app.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{app.userName}</div>
                          <div className="text-sm text-gray-600">{app.userEmail}</div>
                        </div>
                        <Badge variant={
                          app.status === 'approved' ? 'default' : 
                          app.status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {app.status === 'approved' ? '✅ Одобрено' : 
                           app.status === 'rejected' ? '❌ Отклонено' : '⏳ Ожидает'}
                        </Badge>
                      </div>
                      <div className="text-sm mb-2">
                        <strong>Программа:</strong> {app.program}
                      </div>
                      <div className="text-sm mb-3">{app.message}</div>
                      {app.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApplicationAction(app.id, 'approved')}
                            className="rainbow-button"
                          >
                            Одобрить
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApplicationAction(app.id, 'rejected')}
                          >
                            Отклонить
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* История активности */}
          <Card className="rainbow-card">
            <CardHeader>
              <CardTitle>📊 История активности</CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {userActivities
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 20)
                  .map(activity => {
                    const user = users.find(u => u.id === activity.userId);
                    return (
                      <div key={activity.id} className="text-sm p-2 bg-gray-50 rounded">
                        <div className="font-medium">{user?.name || 'Неизвестный'}</div>
                        <div>{activity.details}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString('ru-RU')}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* История чата */}
          <Card className="rainbow-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>💬 История чат-бота</CardTitle>
                <Button 
                  onClick={() => setShowFullChatHistory(true)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Показать все ({chatMessages.length})
                </Button>
              </div>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {chatMessages.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Сообщений пока нет</p>
                ) : (
                  chatMessages
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, 10)
                    .map(msg => {
                      const user = users.find(u => u.id === msg.userId);
                      return (
                        <div key={msg.id} className="text-sm p-2 bg-gray-50 rounded">
                          <div className="font-medium">{user?.name || 'Неизвестный'}</div>
                          <div className="text-blue-600">👤: {msg.message}</div>
                          <div className="text-green-600">🤖: {msg.response}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(msg.timestamp).toLocaleString('ru-RU')}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Настройки профиля */}
      {showSettings && (
        <ProfileSettings onClose={() => setShowSettings(false)} />
      )}

      {/* Полная история чат-бота */}
      {showFullChatHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">💬 Полная история чат-бота</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowFullChatHistory(false)}
                >
                  <Icon name="X" className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                Всего диалогов: {chatMessages.length} | От пользователей: {new Set(chatMessages.map(m => m.userId)).size}
              </div>
            </CardHeader>
            <CardContent className="max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="space-y-3">
                {chatMessages.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Сообщений пока нет</p>
                ) : (
                  chatMessages
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map(msg => {
                      const messageUser = users.find(u => u.id === msg.userId);
                      return (
                        <div key={msg.id} className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                                {messageUser?.name?.charAt(0) || '?'}
                              </div>
                              <div>
                                <div className="font-medium">{messageUser?.name || 'Неизвестный пользователь'}</div>
                                <div className="text-xs text-gray-500">{messageUser?.email || 'Email неизвестен'}</div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(msg.timestamp).toLocaleString('ru-RU')}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="p-3 bg-white rounded border-l-4 border-blue-500">
                              <div className="text-sm text-gray-600 mb-1">👤 Вопрос пользователя:</div>
                              <div className="text-blue-800">{msg.message}</div>
                            </div>
                            
                            <div className="p-3 bg-white rounded border-l-4 border-green-500">
                              <div className="text-sm text-gray-600 mb-1">🤖 Ответ бота:</div>
                              <div className="text-green-800">{msg.response}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Техническое задание CRM */}
      {showCrmSpec && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Icon name="Rocket" className="w-6 h-6 text-purple-600" />
                Техническое задание CRM «Kinetic Control»
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowCrmSpec(false)}
              >
                <Icon name="X" className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="max-h-[calc(90vh-120px)] overflow-y-auto">
              <CrmSpecification />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Мониторинг пользователей */}
      {showUserMonitoring && (
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
                  onClick={() => setShowUserMonitoring(false)}
                >
                  <Icon name="X" className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Фильтры */}
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

                          {/* Действия пользователя */}
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

                          {/* Покупки пользователя */}
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
      )}
    </div>
  );
};

export default DirectorDashboard;