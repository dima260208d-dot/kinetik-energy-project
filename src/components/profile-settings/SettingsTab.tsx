import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface UserPreferences {
  theme: 'light' | 'dark' | 'colorful';
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

interface SettingsTabProps {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ preferences, setPreferences }) => {
  const { toast } = useToast();

  const saveSettings = () => {
    toast({
      title: "Настройки сохранены",
      description: "Ваши настройки успешно обновлены"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Тема интерфейса</Label>
        <Select 
          value={preferences.theme} 
          onValueChange={(value: 'light' | 'dark' | 'colorful') => 
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

      <Button onClick={saveSettings} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full">
        Сохранить настройки
      </Button>
    </div>
  );
};

export default SettingsTab;