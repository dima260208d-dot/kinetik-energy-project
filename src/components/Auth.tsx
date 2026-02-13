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
  const [age, setAge] = useState('');
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
          toast({ title: "Ошибка входа", description: "Неверный email или пароль", variant: "destructive" });
        }
      } else {
        if (name.length < 2) {
          toast({ title: "Ошибка регистрации", description: "Имя должно содержать минимум 2 символа", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        if (!age || parseInt(age) < 3 || parseInt(age) > 99) {
          toast({ title: "Ошибка регистрации", description: "Укажите возраст (от 3 до 99 лет)", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        
        success = await register(email, password, name, parseInt(age));
        if (!success) {
          toast({ title: "Ошибка регистрации", description: "Пользователь с таким email уже существует", variant: "destructive" });
        }
      }

      if (success) {
        toast({
          title: isLogin ? "Добро пожаловать!" : "Регистрация успешна!",
          description: isLogin ? "Вы успешно вошли в систему" : "Добро пожаловать в наш клуб!",
        });
        onClose?.();
      }
    } catch {
      toast({ title: "Ошибка", description: "Что-то пошло не так. Попробуйте еще раз.", variant: "destructive" });
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
              {isLogin ? 'Вход' : 'Регистрация'}
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
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Введите ваше имя"
                    required={!isLogin}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Возраст</Label>
                  <Input
                    id="age"
                    type="number"
                    min="3"
                    max="99"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Сколько вам лет?"
                    required={!isLogin}
                  />
                </div>
              </>
            )}
            
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
                  {isLogin ? 'Вход...' : 'Регистрация...'}
                </div>
              ) : (
                isLogin ? 'Войти' : 'Зарегистрироваться'
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
                setName('');
                setAge('');
              }}
              className="text-sm"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
