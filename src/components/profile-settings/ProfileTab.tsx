import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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

interface ProfileTabProps {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ preferences, setPreferences }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('fitness_app_data');
    if (stored && user) {
      const data = JSON.parse(stored);
      const userData = data.users.find((u: any) => u.id === user.id);
      if (userData) {
        setPhone(userData.phone || '');
        setBio(userData.bio || '');
        setAvatar(userData.avatar || '');
        setAvatarPreview(userData.avatarPhoto || '');
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
          avatarPhoto: avatarPreview,
          preferences,
          updatedAt: new Date()
        };
        
        localStorage.setItem('fitness_app_data', JSON.stringify(data));
        
        const updatedUser = { ...user, name, phone, bio, avatar, avatarPhoto: avatarPreview, preferences };
        localStorage.setItem('current_user', JSON.stringify(updatedUser));
        
        toast({
          title: "Профиль обновлен",
          description: "Ваши данные успешно сохранены"
        });
      }
    }
  };

  const avatarOptions = [
    '👤', '😊', '😎', '🤓', '😺', '🦁', '🐸', '🦄', '🚀', '⭐', '🎯', '🏆', '🎨', '🎸', '⚽', '🏀'
  ];

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
        setAvatar(''); // Очистить эмодзи аватар
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        {avatarPreview ? (
          <div className="mb-4 flex justify-center">
            <div className="relative w-32 h-32">
              <img 
                src={avatarPreview} 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover border-4 border-gray-200"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 rounded-full h-8 w-8 p-0"
                onClick={() => {
                  setAvatarPreview('');
                  setAvatarFile(null);
                }}
              >
                ×
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-6xl mb-4">{avatar || '👤'}</div>
        )}
        
        <div className="mb-4">
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarFileChange}
          />
          <Label htmlFor="avatar-upload" className="cursor-pointer">
            <Button type="button" variant="outline" size="sm" asChild>
              <span>📷 Загрузить фото</span>
            </Button>
          </Label>
        </div>
        
        {!avatarPreview && (
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
        )}
      </div>

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
  );
};

export default ProfileTab;