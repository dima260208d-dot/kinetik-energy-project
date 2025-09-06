import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface ProfileSettingsProps {
  onClose: () => void;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'rainbow';
  language: 'ru' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    showLastActivity: boolean;
  };
  dashboard: {
    compactView: boolean;
    showStats: boolean;
    defaultView: 'grid' | 'list';
  };
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Основные данные пользователя
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Настройки персонализации
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'rainbow',
    language: 'ru',
    notifications: {
      email: true,
      push: true,
      marketing: false
    },
    privacy: {
      showEmail: true,
      showPhone: false,
      showLastActivity: true
    },
    dashboard: {
      compactView: false,
      showStats: true,
      defaultView: 'grid'
    }
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'privacy'>('profile');

  useEffect(() => {
    // Загружаем настройки пользователя
    const stored = localStorage.getItem('fitness_app_data');
    if (stored && user) {
      const data = JSON.parse(stored);
      const userData = data.users.find((u: any) => u.id === user.id);
      if (userData) {
        setPhone(userData.phone || '');
        setBio(userData.bio || '');
        setAvatar(userData.avatar || '');
        if (userData.preferences) {
          setPreferences({ ...preferences, ...userData.preferences });
        }
      }
    }
  }, [user]);

  const saveProfile = () => {
    if (!user) return;

    const stored = localStorage.getItem('fitness_app_data');
    if (stored) {
      const data = JSON.parse(stored);
      const userIndex = data.users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        data.users[userIndex] = {
          ...data.users[userIndex],
          name,
          phone,
          bio,
          avatar,
          preferences,
          updatedAt: new Date()
        };
        
        localStorage.setItem('fitness_app_data', JSON.stringify(data));
        
        // Обновляем текущего пользователя
        const updatedUser = { ...user, name, phone, bio, avatar, preferences };
        localStorage.setItem('current_user', JSON.stringify(updatedUser));
        
        toast({
          title: "Профиль обновлен",
          description: "Ваши данные успешно сохранены"
        });
      }
    }
  };

  const changePassword = () => {
    if (!user || !currentPassword || !newPassword) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive"
      });
      return;
    }

    if (currentPassword !== user.password) {
      toast({
        title: "Ошибка",
        description: "Неверный текущий пароль",
        variant: "destructive"
      });
      return;
    }

    const stored = localStorage.getItem('fitness_app_data');
    if (stored) {
      const data = JSON.parse(stored);
      const userIndex = data.users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        data.users[userIndex].password = newPassword;
        localStorage.setItem('fitness_app_data', JSON.stringify(data));
        
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        toast({
          title: "Пароль изменен",
          description: "Пароль успешно обновлен"
        });
      }
    }
  };

  const avatarOptions = [
    '👤', '😊', '😎', '🤓', '😺', '🦁', '🐸', '🦄', '🚀', '⭐', '🎯', '🏆', '🎨', '🎸', '⚽', '🏀'
  ];

  const tabs = [
    { id: 'profile', name: 'Профиль', icon: 'User' },
    { id: 'security', name: 'Безопасность', icon: 'Shield' },
    { id: 'preferences', name: 'Настройки', icon: 'Settings' },
    { id: 'privacy', name: 'Приватность', icon: 'Eye' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Настройки профиля</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Табы */}
          <div className="flex gap-2 mt-4">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2"
              >
                <Icon name={tab.icon} className="w-4 h-4" />
                {tab.name}
              </Button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Профиль */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Аватар */}
              <div className="text-center">
                <div className="text-6xl mb-4">{avatar || '👤'}</div>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {avatarOptions.map(ava => (
                    <Button
                      key={ava}
                      variant={avatar === ava ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAvatar(ava)}
                      className="text-2xl p-2 h-12 w-12"
                    >
                      {ava}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Основные данные */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email нельзя изменить</p>
                </div>
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
                <div>
                  <Label>Роль</Label>
                  <div className="mt-2">
                    <Badge variant={user?.role === 'director' ? 'default' : user?.role === 'admin' ? 'secondary' : 'outline'}>
                      {user?.role === 'director' ? '👑 Директор' : user?.role === 'admin' ? '⚡ Админ' : '👤 Клиент'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">О себе</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Расскажите о себе..."
                  rows={4}
                />
              </div>

              <Button onClick={saveProfile} className="rainbow-button w-full">
                Сохранить профиль
              </Button>
            </div>
          )}

          {/* Безопасность */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="AlertTriangle" className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Смена пароля</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Используйте надежный пароль для защиты вашего аккаунта
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Текущий пароль</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Введите текущий пароль"
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">Новый пароль</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Введите новый пароль"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Повторите новый пароль"
                  />
                </div>
              </div>

              <Button onClick={changePassword} className="rainbow-button w-full">
                Изменить пароль
              </Button>
            </div>
          )}

          {/* Настройки */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Тема */}
              <div>
                <Label>Тема интерфейса</Label>
                <Select 
                  value={preferences.theme} 
                  onValueChange={(value: 'light' | 'dark' | 'rainbow') => 
                    setPreferences({...preferences, theme: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">🌞 Светлая</SelectItem>
                    <SelectItem value="dark">🌙 Темная</SelectItem>
                    <SelectItem value="rainbow">🌈 Радужная (по умолчанию)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Язык */}
              <div>
                <Label>Язык</Label>
                <Select 
                  value={preferences.language} 
                  onValueChange={(value: 'ru' | 'en') => 
                    setPreferences({...preferences, language: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Вид панели */}
              <div>
                <Label>Панель управления</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <span>Компактный вид</span>
                    <Switch
                      checked={preferences.dashboard.compactView}
                      onCheckedChange={(checked) => 
                        setPreferences({
                          ...preferences, 
                          dashboard: {...preferences.dashboard, compactView: checked}
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Показывать статистику</span>
                    <Switch
                      checked={preferences.dashboard.showStats}
                      onCheckedChange={(checked) => 
                        setPreferences({
                          ...preferences, 
                          dashboard: {...preferences.dashboard, showStats: checked}
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Уведомления */}
              <div>
                <Label>Уведомления</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <span>Email уведомления</span>
                    <Switch
                      checked={preferences.notifications.email}
                      onCheckedChange={(checked) => 
                        setPreferences({
                          ...preferences, 
                          notifications: {...preferences.notifications, email: checked}
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Push уведомления</span>
                    <Switch
                      checked={preferences.notifications.push}
                      onCheckedChange={(checked) => 
                        setPreferences({
                          ...preferences, 
                          notifications: {...preferences.notifications, push: checked}
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Маркетинговые рассылки</span>
                    <Switch
                      checked={preferences.notifications.marketing}
                      onCheckedChange={(checked) => 
                        setPreferences({
                          ...preferences, 
                          notifications: {...preferences.notifications, marketing: checked}
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={saveProfile} className="rainbow-button w-full">
                Сохранить настройки
              </Button>
            </div>
          )}

          {/* Приватность */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Shield" className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Настройки приватности</span>
                </div>
                <p className="text-sm text-blue-700">
                  Управляйте видимостью ваших данных для других пользователей
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Показывать email</span>
                    <p className="text-sm text-gray-500">Другие пользователи смогут видеть ваш email</p>
                  </div>
                  <Switch
                    checked={preferences.privacy.showEmail}
                    onCheckedChange={(checked) => 
                      setPreferences({
                        ...preferences, 
                        privacy: {...preferences.privacy, showEmail: checked}
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Показывать телефон</span>
                    <p className="text-sm text-gray-500">Другие пользователи смогут видеть ваш номер</p>
                  </div>
                  <Switch
                    checked={preferences.privacy.showPhone}
                    onCheckedChange={(checked) => 
                      setPreferences({
                        ...preferences, 
                        privacy: {...preferences.privacy, showPhone: checked}
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Показывать активность</span>
                    <p className="text-sm text-gray-500">Время последнего входа в систему</p>
                  </div>
                  <Switch
                    checked={preferences.privacy.showLastActivity}
                    onCheckedChange={(checked) => 
                      setPreferences({
                        ...preferences, 
                        privacy: {...preferences.privacy, showLastActivity: checked}
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={saveProfile} className="rainbow-button w-full">
                Сохранить настройки приватности
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;