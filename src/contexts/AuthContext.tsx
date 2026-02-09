import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, UserActivity, ChatMessage, Purchase, Application } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Симуляция базы данных
const STORAGE_KEY = 'fitness_app_data';

interface AppData {
  users: User[];
  chatMessages: ChatMessage[];
  purchases: Purchase[];
  applications: Application[];
  userActivities: UserActivity[];
}

const getStoredData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Инициализация с пользователями по умолчанию
  const initialData: AppData = {
    users: [
      {
        id: 'director-1',
        email: 'dima260208@bk.ru',
        password: 'Sempay666',
        name: 'Дмитрий Болотин',
        role: 'director',
        createdAt: new Date(),
        lastActivity: new Date(),
        isActive: true
      },

    ],
    chatMessages: [],
    purchases: [],
    applications: [],
    userActivities: []
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
};

const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const data = getStoredData();
    const foundUser = data.users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Обновляем последнюю активность
      foundUser.lastActivity = new Date();
      
      // Записываем активность
      const activity: UserActivity = {
        id: Date.now().toString(),
        userId: foundUser.id,
        action: 'login',
        details: 'Вход в систему',
        timestamp: new Date()
      };
      data.userActivities.push(activity);
      
      saveData(data);
      setUser(foundUser);
      localStorage.setItem('current_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    const data = getStoredData();
    
    // Проверяем, есть ли уже пользователь с таким email
    if (data.users.find(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role: 'client', // Обычная регистрация только для клиентов
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true
    };

    data.users.push(newUser);
    
    // Записываем активность
    const activity: UserActivity = {
      id: Date.now().toString(),
      userId: newUser.id,
      action: 'register',
      details: 'Регистрация в системе',
      timestamp: new Date()
    };
    data.userActivities.push(activity);
    
    saveData(data);
    setUser(newUser);
    localStorage.setItem('current_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    if (user) {
      const data = getStoredData();
      const activity: UserActivity = {
        id: Date.now().toString(),
        userId: user.id,
        action: 'logout',
        details: 'Выход из системы',
        timestamp: new Date()
      };
      data.userActivities.push(activity);
      saveData(data);
    }
    
    setUser(null);
    localStorage.removeItem('current_user');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};