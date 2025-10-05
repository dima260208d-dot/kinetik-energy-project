import React from 'react';
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

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'director': return '👑';
      case 'admin': return '⚡';
      case 'manager': return '🚀';
      case 'client': return '👤';
      default: return '👤';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'director': return 'Директор';
      case 'admin': return 'Администратор';
      case 'manager': return 'Менеджер';
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
    }
  };

  const removeAccount = (accountId: string) => {
    const updatedAccounts = savedAccounts.filter((acc: any) => acc.id !== accountId);
    localStorage.setItem('saved_accounts', JSON.stringify(updatedAccounts));
    
    // Если удаляем текущий аккаунт, выходим
    if (currentAccountId === accountId) {
      logout();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Единая навигационная кнопка */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-white bg-opacity-90 text-purple-900 border-white shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium"
            >
              {getRoleIcon(user.role)}
              <span className="hidden sm:inline">{user.name}</span>
              <Icon name="ChevronDown" className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72" align="end">
            <DropdownMenuLabel className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                {getRoleIcon(user.role)}
              </div>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">{getRoleName(user.role)}</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Навигационные ссылки */}
            {currentPage === 'dashboard' && (
              <DropdownMenuItem onClick={() => handleNavigation('/')} className="cursor-pointer">
                <Icon name="Home" className="w-4 h-4 mr-2" />
                На сайт
              </DropdownMenuItem>
            )}
            
            {currentPage === 'home' && (
              <DropdownMenuItem onClick={() => handleNavigation('/dashboard')} className="cursor-pointer">
                <Icon name="BarChart" className="w-4 h-4 mr-2" />
                Личный кабинет
              </DropdownMenuItem>
            )}
            
            {/* CRM для сотрудников */}
            {['director', 'admin', 'manager'].includes(user.role) && (
              <DropdownMenuItem onClick={() => handleNavigation('/crm')} className="cursor-pointer">
                <Icon name="Rocket" className="w-4 h-4 mr-2" />
                CRM Система
              </DropdownMenuItem>
            )}

            {/* Дневник тренировок для клиентов */}
            {user.role === 'client' && (
              <DropdownMenuItem onClick={() => handleNavigation('/diary')} className="cursor-pointer">
                <Icon name="BookOpen" className="w-4 h-4 mr-2" />
                Дневник тренировок
              </DropdownMenuItem>
            )}

            {/* Панель тренера */}
            {user.role === 'trainer' && (
              <>
                <DropdownMenuItem onClick={() => handleNavigation('/diary')} className="cursor-pointer">
                  <Icon name="BookOpen" className="w-4 h-4 mr-2" />
                  Дневник тренировок
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('/trainer')} className="cursor-pointer">
                  <Icon name="Dumbbell" className="w-4 h-4 mr-2" />
                  Панель тренера
                </DropdownMenuItem>
              </>
            )}

            {/* Дневник */}
            {user.role === 'director' && (
              <DropdownMenuItem onClick={() => handleNavigation('/director-panel')} className="cursor-pointer">
                <Icon name="Crown" className="w-4 h-4 mr-2" />
                Дневник
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            {/* Переключение аккаунтов */}
            <DropdownMenuLabel className="flex items-center justify-between">
              Аккаунты
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={addCurrentAccountToSaved}
                className="text-xs h-6"
              >
                + Сохранить
              </Button>
            </DropdownMenuLabel>
            
            {/* Сохраненные аккаунты */}
            {savedAccounts.map((account: any) => (
              account.id !== user.id && (
                <DropdownMenuItem key={account.id} className="p-3">
                  <div className="flex items-center justify-between w-full">
                    <div 
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => switchAccount(account.id)}
                    >
                      <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs">
                        {getRoleIcon(account.role)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{account.name}</div>
                        <div className="text-xs text-gray-500">{getRoleName(account.role)}</div>
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
              <DropdownMenuItem className="text-gray-500 text-center text-sm">
                Нет сохраненных аккаунтов
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            {/* Настройки и выход */}
            {showSettings && onSettingsClick && (
              <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
                <Icon name="Settings" className="w-4 h-4 mr-2" />
                Настройки профиля
              </DropdownMenuItem>
            )}
            
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