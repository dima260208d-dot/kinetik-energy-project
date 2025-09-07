import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

interface NavigationProps {
  currentPage: 'home' | 'dashboard';
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, showSettings = true, onSettingsClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'director': return '👑';
      case 'admin': return '⚡';
      case 'client': return '👤';
      default: return '👤';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'director': return 'Директор';
      case 'admin': return 'Администратор';
      case 'client': return 'Клиент';
      default: return 'Пользователь';
    }
  };

  // Получаем сохраненные аккаунты
  const savedAccounts = JSON.parse(localStorage.getItem('saved_accounts') || '[]');
  const currentAccountId = localStorage.getItem('current_user_id');

  const switchAccount = (accountId: string) => {
    const stored = localStorage.getItem('fitness_app_data');
    if (stored) {
      const data = JSON.parse(stored);
      const targetUser = data.users.find((u: any) => u.id === accountId);
      if (targetUser) {
        localStorage.setItem('current_user', JSON.stringify(targetUser));
        localStorage.setItem('current_user_id', accountId);
        window.location.reload();
      }
    }
  };

  const addCurrentAccountToSaved = () => {
    if (user && !savedAccounts.find((acc: any) => acc.id === user.id)) {
      const newAccount = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null
      };
      const updatedAccounts = [...savedAccounts, newAccount];
      localStorage.setItem('saved_accounts', JSON.stringify(updatedAccounts));
      setShowAccountSwitcher(false);
    }
  };

  const removeAccount = (accountId: string) => {
    const updatedAccounts = savedAccounts.filter((acc: any) => acc.id !== accountId);
    localStorage.setItem('saved_accounts', JSON.stringify(updatedAccounts));
    
    // Если удаляем текущий аккаунт, выходим
    if (currentAccountId === accountId) {
      logout();
    } else {
      setShowAccountSwitcher(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Навигация */}
      {currentPage === 'dashboard' && (
        <Button 
          onClick={() => handleNavigation('/')} 
          variant="outline" 
          className="bg-white bg-opacity-90 text-purple-900 border-white shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 font-medium"
        >
          🏠 На сайт
        </Button>
      )}
      
      {currentPage === 'home' && user && (
        <Button 
          onClick={() => handleNavigation('/dashboard')} 
          className="rainbow-button"
        >
          📊 Кабинет
        </Button>
      )}

      {/* Переключение аккаунтов */}
      {user && (
        <DropdownMenu open={showAccountSwitcher} onOpenChange={setShowAccountSwitcher}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-white bg-opacity-90 text-purple-900 border-white shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium"
            >
              {getRoleIcon(user.role)} {user.name}
              <Icon name="ChevronDown" className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Аккаунты
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={addCurrentAccountToSaved}
                className="text-xs h-6"
              >
                + Сохранить текущий
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Текущий аккаунт */}
            <DropdownMenuItem className="p-3 bg-blue-50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    <div className="text-xs text-blue-600">{getRoleName(user.role)}</div>
                  </div>
                </div>
                <div className="text-green-600 text-sm">✓ Активен</div>
              </div>
            </DropdownMenuItem>
            
            {/* Сохраненные аккаунты */}
            {savedAccounts.map((account: any) => (
              account.id !== user.id && (
                <DropdownMenuItem key={account.id} className="p-3">
                  <div className="flex items-center justify-between w-full">
                    <div 
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => switchAccount(account.id)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm">
                        {getRoleIcon(account.role)}
                      </div>
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div className="text-xs text-gray-500">{account.email}</div>
                        <div className="text-xs text-purple-600">{getRoleName(account.role)}</div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAccount(account.id);
                      }}
                      className="text-red-500 h-6 w-6 p-0"
                    >
                      <Icon name="X" className="w-3 h-3" />
                    </Button>
                  </div>
                </DropdownMenuItem>
              )
            ))}
            
            {savedAccounts.length === 0 && (
              <DropdownMenuItem className="text-gray-500 text-center">
                Нет сохраненных аккаунтов
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            {/* Настройки */}
            {showSettings && onSettingsClick && (
              <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
                <Icon name="Settings" className="w-4 h-4 mr-2" />
                Настройки профиля
              </DropdownMenuItem>
            )}
            
            {/* Выход */}
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
              <Icon name="LogOut" className="w-4 h-4 mr-2" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default Navigation;