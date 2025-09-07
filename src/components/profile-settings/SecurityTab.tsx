import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const SecurityTab: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  return (
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
  );
};

export default SecurityTab;