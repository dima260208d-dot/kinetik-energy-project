import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { User } from '@/types/auth';

interface TrainerManagementProps {
  users: User[];
  onAddTrainer: (email: string, name: string, phone: string, password: string) => void;
  onToggleUserStatus: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onViewUserDetails: (user: User) => void;
}

const TrainerManagement = ({ 
  users, 
  onAddTrainer, 
  onToggleUserStatus,
  onDeleteUser,
  onViewUserDetails
}: TrainerManagementProps) => {
  const [showAddTrainer, setShowAddTrainer] = useState(false);
  const [newTrainerEmail, setNewTrainerEmail] = useState('');
  const [newTrainerName, setNewTrainerName] = useState('');
  const [newTrainerPhone, setNewTrainerPhone] = useState('');
  const [newTrainerPassword, setNewTrainerPassword] = useState('');

  const handleAddTrainer = () => {
    onAddTrainer(newTrainerEmail, newTrainerName, newTrainerPhone, newTrainerPassword);
    setNewTrainerEmail('');
    setNewTrainerName('');
    setNewTrainerPhone('');
    setNewTrainerPassword('');
    setShowAddTrainer(false);
  };

  return (
    <Card className="rainbow-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>🎯 Тренеры</CardTitle>
          <Button 
            onClick={() => setShowAddTrainer(!showAddTrainer)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            size="sm"
          >
            + Добавить тренера
          </Button>
        </div>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {showAddTrainer && (
          <div className="mb-4 p-4 border rounded-lg bg-blue-50">
            <h4 className="font-semibold mb-3">Добавить тренера</h4>
            <div className="space-y-3">
              <div>
                <Label>Email *</Label>
                <Input
                  value={newTrainerEmail}
                  onChange={(e) => setNewTrainerEmail(e.target.value)}
                  placeholder="trainer@example.com"
                />
              </div>
              <div>
                <Label>Имя *</Label>
                <Input
                  value={newTrainerName}
                  onChange={(e) => setNewTrainerName(e.target.value)}
                  placeholder="Имя тренера"
                />
              </div>
              <div>
                <Label>Телефон</Label>
                <Input
                  value={newTrainerPhone}
                  onChange={(e) => setNewTrainerPhone(e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div>
                <Label>Пароль *</Label>
                <Input
                  value={newTrainerPassword}
                  onChange={(e) => setNewTrainerPassword(e.target.value)}
                  type="password"
                  placeholder="Пароль"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddTrainer} size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Добавить
                </Button>
                <Button 
                  onClick={() => setShowAddTrainer(false)}
                  size="sm" 
                  variant="outline"
                >
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {users.filter(u => u.role === 'trainer').length === 0 ? (
            <p className="text-gray-500 text-center py-4">Тренеров пока нет</p>
          ) : (
            users.filter(u => u.role === 'trainer').map(trainer => (
              <div 
                key={trainer.id} 
                className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 cursor-pointer transition-colors"
                onClick={() => onViewUserDetails(trainer)}
              >
                <div>
                  <div className="font-medium">{trainer.name}</div>
                  <div className="text-sm text-gray-600">{trainer.email}</div>
                  {trainer.phone && (
                    <div className="text-sm text-gray-600">{trainer.phone}</div>
                  )}
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">🎯 Тренер</Badge>
                    <Badge variant={trainer.isActive ? 'default' : 'destructive'}>
                      {trainer.isActive ? '✅ Активен' : '❌ Заблокирован'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant={trainer.isActive ? "outline" : "default"}
                    onClick={() => onToggleUserStatus(trainer.id)}
                  >
                    <Icon name={trainer.isActive ? "Ban" : "CheckCircle"} className="w-4 h-4 mr-1" />
                    {trainer.isActive ? 'Заблокировать' : 'Разблокировать'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteUser(trainer.id);
                    }}
                  >
                    <Icon name="X" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainerManagement;