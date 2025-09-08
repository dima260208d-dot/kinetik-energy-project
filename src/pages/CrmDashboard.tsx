import React from 'react';
import KineticCRM from '@/components/KineticCRM';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CrmDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Проверяем права доступа к CRM
  const hasAccessToCRM = user && ['director', 'admin', 'manager'].includes(user.role);

  if (!hasAccessToCRM) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Доступ ограничен</h1>
          <p className="text-gray-600 mb-6">
            У вас нет прав доступа к CRM системе. Обратитесь к администратору.
          </p>
          <Button onClick={() => navigate('/')}>
            На главную
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Верхняя панель навигации */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/files/424f8693-463c-4c9d-b5ac-863b4376608d.jpg" 
              alt="Kinetic Kids" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-xl font-bold text-gray-800">CRM Система</span>
          </div>
          <Navigation currentPage="dashboard" />
        </div>
      </div>

      {/* CRM компонент */}
      <KineticCRM />
    </div>
  );
};

export default CrmDashboard;