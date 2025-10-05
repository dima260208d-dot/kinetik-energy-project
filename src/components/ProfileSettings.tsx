import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/ui/icon';
import ProfileTab from '@/components/profile-settings/ProfileTab';
import SecurityTab from '@/components/profile-settings/SecurityTab';
import SettingsTab from '@/components/profile-settings/SettingsTab';
import PrivacyTab from '@/components/profile-settings/PrivacyTab';

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
    const stored = localStorage.getItem('fitness_app_data');
    if (stored && user) {
      const data = JSON.parse(stored);
      const userData = data.users.find((u: any) => u.id === user.id);
      if (userData && userData.preferences) {
        setPreferences({ ...preferences, ...userData.preferences });
      }
    }
  }, [user]);

  const tabs = [
    { id: 'profile', name: 'Профиль', icon: 'User' },
    { id: 'security', name: 'Безопасность', icon: 'Shield' },
    { id: 'preferences', name: 'Настройки', icon: 'Settings' },
    { id: 'privacy', name: 'Приватность', icon: 'Eye' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab preferences={preferences} setPreferences={setPreferences} />;
      case 'security':
        return <SecurityTab />;
      case 'preferences':
        return <SettingsTab preferences={preferences} setPreferences={setPreferences} />;
      case 'privacy':
        return <PrivacyTab preferences={preferences} setPreferences={setPreferences} />;
      default:
        return null;
    }
  };

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
          {renderTabContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;