import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Application, ChatMessage, Purchase, UserActivity, UserRole } from '@/types/auth';
import Icon from '@/components/ui/icon';
import Navigation from '@/components/Navigation';
import ProfileSettings from '@/components/ProfileSettings';

// Импорты новых компонентов
import StatsCards from '@/components/director/StatsCards';
import UserManagement from '@/components/director/UserManagement';
import ApplicationsSection from '@/components/director/ApplicationsSection';
import ActivityHistory from '@/components/director/ActivityHistory';
import ChatHistory from '@/components/director/ChatHistory';

const DirectorDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showFullChatHistory, setShowFullChatHistory] = useState(false);
  const [showCrmSpec, setShowCrmSpec] = useState(false);
  
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

  const addAdmin = (email: string, name: string, password: string) => {
    if (!email || !name || !password) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    if (users.find(u => u.email === email)) {
      toast({
        title: "Ошибка",
        description: "Пользователь с таким email уже существует",
        variant: "destructive"
      });
      return;
    }

    const newAdmin: User = {
      id: Date.now().toString(),
      email: email,
      password: password,
      name: name,
      role: 'admin',
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true
    };

    const updatedUsers = [...users, newAdmin];
    setUsers(updatedUsers);
    saveData(updatedUsers);

    const activity: UserActivity = {
      id: Date.now().toString(),
      userId: user?.id || '',
      action: 'create_admin',
      details: `Создан администратор: ${name} (${email})`,
      timestamp: new Date()
    };
    
    const updatedActivities = [...userActivities, activity];
    setUserActivities(updatedActivities);

    toast({
      title: "Успех",
      description: "Администратор добавлен"
    });
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
            <Navigation 
              currentPage="dashboard" 
              onSettingsClick={() => setShowSettings(true)}
            />
          </div>
        </div>

        {/* Статистика */}
        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Управление пользователями */}
          <UserManagement
            users={users}
            onAddAdmin={addAdmin}
            onToggleUserStatus={toggleUserStatus}
            onChangeUserRole={changeUserRole}
          />

          {/* Заявки */}
          <ApplicationsSection
            applications={applications}
            onApplicationAction={handleApplicationAction}
          />

          {/* История активности */}
          <ActivityHistory
            userActivities={userActivities}
            users={users}
          />

          {/* История чата */}
          <ChatHistory
            chatMessages={chatMessages}
            users={users}
            showFullChatHistory={showFullChatHistory}
            onShowFullChatHistory={() => setShowFullChatHistory(true)}
            onHideFullChatHistory={() => setShowFullChatHistory(false)}
            showCrmSpec={showCrmSpec}
            onShowCrmSpec={() => setShowCrmSpec(true)}
            onHideCrmSpec={() => setShowCrmSpec(false)}
          />
        </div>
      </div>

      {/* Настройки профиля */}
      {showSettings && (
        <ProfileSettings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default DirectorDashboard;