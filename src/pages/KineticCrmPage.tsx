import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import KineticCRM from '@/components/KineticCRM';

const KineticCrmPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Демо-учетные данные
  const demoCredentials = [
    { username: 'admin', password: 'admin123', role: 'Администратор' },
    { username: 'trainer', password: 'trainer123', role: 'Тренер' },
    { username: 'director', password: 'director123', role: 'Директор' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validCredential = demoCredentials.find(
      cred => cred.username === credentials.username && cred.password === credentials.password
    );

    if (validCredential) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Неверное имя пользователя или пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
  };

  if (isAuthenticated) {
    return (
      <div>
        <div className="bg-white border-b px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-200">
              🟢 Система активна
            </Badge>
            <span className="text-sm text-gray-600">
              Вошли как: <strong>{credentials.username}</strong>
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <Icon name="LogOut" className="w-4 h-4 mr-2" />
            Выйти
          </Button>
        </div>
        <KineticCRM />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Icon name="Rocket" className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kinetic Kids CRM</h1>
            <p className="text-gray-600">Система управления спортивным клубом</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Имя пользователя</label>
              <Input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Введите логин"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Пароль</label>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Введите пароль"
                className="mt-1"
              />
            </div>
            
            {loginError && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                {loginError}
              </div>
            )}
            
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Icon name="LogIn" className="w-4 h-4 mr-2" />
              Войти в систему
            </Button>
          </form>
          
          <div className="border-t pt-6">
            <Button
              onClick={() => window.open('https://kineticcontrol.poehali.dev', '_blank')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              size="lg"
            >
              <Icon name="ExternalLink" className="w-4 h-4 mr-2" />
              Перейти на сайт CRM
            </Button>
          </div>
          
          <div className="text-center">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              ✨ Полнофункциональная CRM-система
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KineticCrmPage;