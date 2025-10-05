import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Application, ChatMessage, Purchase, UserActivity, UserRole } from '@/types/auth';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Navigation from '@/components/Navigation';
import ProfileSettings from '@/components/ProfileSettings';
import StatsCards from '@/components/director/StatsCards';
import UserManagement from '@/components/director/UserManagement';
import TrainerManagement from '@/components/director/TrainerManagement';
import ApplicationsList from '@/components/director/ApplicationsList';
import ActivityHistory from '@/components/director/ActivityHistory';
import ChatHistory from '@/components/director/ChatHistory';
import FullChatHistoryModal from '@/components/director/FullChatHistoryModal';
import UserMonitoringModal from '@/components/director/UserMonitoringModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CrmSpecification from '@/components/CrmSpecification';

const DirectorDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showFullChatHistory, setShowFullChatHistory] = useState(false);
  const [showCrmSpec, setShowCrmSpec] = useState(false);
  const [showUserMonitoring, setShowUserMonitoring] = useState(false);
  
  const { user } = useAuth();
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
      email,
      password,
      name,
      role: 'admin',
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true
    };

    const updatedUsers = [...users, newAdmin];
    setUsers(updatedUsers);
    saveData(updatedUsers);

    toast({
      title: "Успех",
      description: "Администратор добавлен"
    });
  };

  const addTrainer = (email: string, name: string, phone: string, password: string) => {
    if (!email || !name || !password) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
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

    const newTrainer: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
      phone,
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
      action: 'create_trainer',
      details: `Создан тренер: ${name} (${email})`,
      timestamp: new Date()
    };
    
    const updatedActivities = [...userActivities, activity];
    setUserActivities(updatedActivities);

    toast({
      title: "Успех",
      description: "Тренер добавлен"
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

  const deleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    if (!confirm(`Вы уверены, что хотите удалить ${userToDelete.role === 'trainer' ? 'тренера' : 'администратора'} ${userToDelete.name}? Это действие нельзя отменить.`)) {
      return;
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    saveData(updatedUsers);

    toast({
      title: "Удалено",
      description: `${userToDelete.role === 'trainer' ? 'Тренер' : 'Администратор'} ${userToDelete.name} удалён`
    });
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

        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserManagement
            users={users}
            onAddAdmin={addAdmin}
            onToggleUserStatus={toggleUserStatus}
            onChangeUserRole={changeUserRole}
            onDeleteUser={deleteUser}
          />

          <TrainerManagement
            users={users}
            onAddTrainer={addTrainer}
            onToggleUserStatus={toggleUserStatus}
            onDeleteUser={deleteUser}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 mt-8">
          <ApplicationsList
            applications={applications}
            onApplicationAction={handleApplicationAction}
          />

          <ActivityHistory
            userActivities={userActivities}
            users={users}
          />

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

      {showSettings && (
        <ProfileSettings onClose={() => setShowSettings(false)} />
      )}

      {showFullChatHistory && (
        <FullChatHistoryModal
          chatMessages={chatMessages}
          users={users}
          onClose={() => setShowFullChatHistory(false)}
        />
      )}

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

      {showUserMonitoring && (
        <UserMonitoringModal
          users={users}
          purchases={purchases}
          userActivities={userActivities}
          onClose={() => setShowUserMonitoring(false)}
        />
      )}
    </div>
  );
};

export default DirectorDashboard;
