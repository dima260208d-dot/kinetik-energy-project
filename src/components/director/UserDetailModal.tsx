import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { User } from '@/types/auth';

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailModal({ user, isOpen, onClose }: UserDetailModalProps) {
  if (!user) return null;

  const getRoleName = (role: string) => {
    switch (role) {
      case 'director': return '👑 Директор';
      case 'admin': return '⚡ Администратор';
      case 'trainer': return '💪 Тренер';
      case 'client': return '👤 Клиент';
      default: return role;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Icon name="User" size={28} />
            Информация о пользователе
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">ID</div>
              <div className="font-mono text-sm bg-gray-100 p-2 rounded">{user.id}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Роль</div>
              <Badge variant={user.role === 'director' ? 'default' : user.role === 'admin' ? 'secondary' : 'outline'}>
                {getRoleName(user.role)}
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Имя</div>
            <div className="text-lg font-medium">{user.name}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Email (Логин)</div>
            <div className="font-mono bg-gray-100 p-2 rounded">{user.email}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Пароль</div>
            <div className="font-mono bg-gray-100 p-2 rounded">{user.password}</div>
          </div>

          {user.phone && (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Телефон</div>
              <div className="font-mono bg-gray-100 p-2 rounded">{user.phone}</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Дата регистрации</div>
              <div className="text-sm">{new Date(user.createdAt).toLocaleString('ru-RU')}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Последняя активность</div>
              <div className="text-sm">{user.lastActivity ? new Date(user.lastActivity).toLocaleString('ru-RU') : 'Нет данных'}</div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Статус</div>
            <Badge variant={user.isActive ? 'default' : 'destructive'} className="text-base px-3 py-1">
              {user.isActive ? '✅ Активен' : '❌ Заблокирован'}
            </Badge>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose} variant="outline">
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
