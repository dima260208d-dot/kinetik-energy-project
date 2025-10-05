import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

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

interface PrivacyTabProps {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
}

const PrivacyTab: React.FC<PrivacyTabProps> = ({ preferences, setPreferences }) => {
  const { toast } = useToast();

  const savePrivacySettings = () => {
    toast({
      title: "Настройки приватности сохранены",
      description: "Ваши настройки приватности успешно обновлены"
    });
  };

  return (
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

      <Button onClick={savePrivacySettings} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full">
        Сохранить настройки приватности
      </Button>
    </div>
  );
};

export default PrivacyTab;