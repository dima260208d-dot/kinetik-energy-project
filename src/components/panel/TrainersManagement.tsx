import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Trainer } from './PanelTypes';

interface TrainersManagementProps {
  trainers: Trainer[];
  onReload: () => void;
}

const TrainersManagement = ({ trainers, onReload }: TrainersManagementProps) => {
  const [showAddTrainer, setShowAddTrainer] = useState(false);
  const [newTrainerEmail, setNewTrainerEmail] = useState('');
  const [newTrainerName, setNewTrainerName] = useState('');
  const [newTrainerPhone, setNewTrainerPhone] = useState('');
  const [newTrainerPassword, setNewTrainerPassword] = useState('');

  const handleAddTrainer = () => {
    if (!newTrainerEmail || !newTrainerName || !newTrainerPassword) {
      alert('Заполните обязательные поля');
      return;
    }
    
    const stored = localStorage.getItem('fitness_app_data');
    const data = stored ? JSON.parse(stored) : { users: [] };
    
    const emailExists = data.users.some((u: any) => u.email === newTrainerEmail);
    if (emailExists) {
      alert('Пользователь с таким email уже существует');
      return;
    }
    
    const newTrainer = {
      id: Date.now(),
      email: newTrainerEmail,
      name: newTrainerName,
      phone: newTrainerPhone,
      password: newTrainerPassword,
      role: 'trainer',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    data.users.push(newTrainer);
    localStorage.setItem('fitness_app_data', JSON.stringify(data));
    
    setNewTrainerEmail('');
    setNewTrainerName('');
    setNewTrainerPhone('');
    setNewTrainerPassword('');
    setShowAddTrainer(false);
    onReload();
    alert('Тренер успешно добавлен!');
  };

  const toggleTrainerStatus = (trainerId: number) => {
    const stored = localStorage.getItem('fitness_app_data');
    const data = stored ? JSON.parse(stored) : { users: [] };
    const userIndex = data.users.findIndex((u: any) => u.id === trainerId);
    
    if (userIndex !== -1) {
      data.users[userIndex].isActive = !data.users[userIndex].isActive;
      localStorage.setItem('fitness_app_data', JSON.stringify(data));
      onReload();
      alert(data.users[userIndex].isActive ? 'Тренер разблокирован' : 'Тренер заблокирован');
    }
  };

  const deleteTrainer = (trainerId: number, trainerName: string) => {
    if (confirm(`Вы уверены, что хотите удалить тренера ${trainerName}? Это действие нельзя отменить.`)) {
      const stored = localStorage.getItem('fitness_app_data');
      const data = stored ? JSON.parse(stored) : { users: [] };
      data.users = data.users.filter((u: any) => u.id !== trainerId);
      localStorage.setItem('fitness_app_data', JSON.stringify(data));
      onReload();
      alert('Тренер удалён');
    }
  };

  const getTrainerStatus = (trainerId: number): boolean => {
    const stored = localStorage.getItem('fitness_app_data');
    const data = stored ? JSON.parse(stored) : { users: [] };
    const trainerData = data.users.find((u: any) => u.id === trainerId);
    return trainerData?.isActive !== false;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon name="GraduationCap" size={24} />
            Управление тренерами ({trainers.length})
          </CardTitle>
          <Button
            onClick={() => setShowAddTrainer(!showAddTrainer)}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          >
            <Icon name="Plus" className="w-4 h-4 mr-2" />
            Добавить тренера
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {showAddTrainer && (
          <div className="mb-6 p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Icon name="UserPlus" className="w-4 h-4" />
              Добавить нового тренера
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Email *</Label>
                <Input
                  value={newTrainerEmail}
                  onChange={(e) => setNewTrainerEmail(e.target.value)}
                  placeholder="email@example.com"
                  type="email"
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
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddTrainer} size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500">
                <Icon name="Check" className="w-4 h-4 mr-2" />
                Добавить
              </Button>
              <Button 
                onClick={() => setShowAddTrainer(false)}
                size="sm" 
                variant="outline"
              >
                <Icon name="X" className="w-4 h-4 mr-2" />
                Отмена
              </Button>
            </div>
          </div>
        )}
        
        {trainers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            <Icon name="UserX" className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            Тренеров пока нет. Добавьте первого тренера!
          </p>
        ) : (
          trainers.map((trainer) => {
            const isActive = getTrainerStatus(trainer.id);
            
            return (
              <div key={trainer.id} className="flex items-center justify-between p-3 border rounded-lg bg-white hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg">
                    🎯
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{trainer.name}</p>
                      {!isActive && (
                        <Badge variant="destructive" className="text-xs">Заблокирован</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{trainer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={isActive ? "outline" : "default"}
                    onClick={() => toggleTrainerStatus(trainer.id)}
                  >
                    <Icon name={isActive ? "Ban" : "CheckCircle"} className="w-4 h-4 mr-1" />
                    {isActive ? 'Заблокировать' : 'Разблокировать'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteTrainer(trainer.id, trainer.name)}
                  >
                    <Icon name="Trash2" className="w-4 h-4 mr-1" />
                    Удалить
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default TrainersManagement;
