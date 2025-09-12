import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface AuthProps {
  onClose?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(email, password);
        if (!success) {
          toast({
            title: "Ошибка входа",
            description: "Неверный email или пароль",
            variant: "destructive"
          });
        }
      } else {
        if (name.length < 2) {
          toast({
            title: "Ошибка регистрации",
            description: "Имя должно содержать минимум 2 символа",
            variant: "destructive"
          });
          return;
        }
        
        success = await register(email, password, name);
        if (!success) {
          toast({
            title: "Ошибка регистрации",
            description: "Пользователь с таким email уже существует",
            variant: "destructive"
          });
        }
      }

      if (success) {
        toast({
          title: isLogin ? "Добро пожаловать!" : "Регистрация успешна!",
          description: isLogin ? "Вы успешно вошли в систему" : "Добро пожаловать в наш клуб!",
        });
        onClose?.();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Что-то пошло не так. Попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Вход в систему
            </CardTitle>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите email"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full rainbow-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Вход...
                </div>
              ) : (
                'Войти'
              )}
            </Button>
          </form>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Info" className="w-4 h-4 text-yellow-600 mt-0.5" />
              <p className="text-xs text-yellow-800">
                <strong>Примечание:</strong> Новые аккаунты создаются только директором клуба. Обратитесь к администрации для получения доступа.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;