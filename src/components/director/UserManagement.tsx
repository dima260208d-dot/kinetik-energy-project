import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { User, UserRole } from '@/types/auth';
import UserDetailModal from './UserDetailModal';

interface UserManagementProps {
  users: User[];
  onAddAdmin: (email: string, name: string, password: string) => void;
  onToggleUserStatus: (userId: string) => void;
  onChangeUserRole: (userId: string, newRole: UserRole) => void;
  onDeleteUser: (userId: string) => void;
  onViewUserDetails: (user: User) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  onAddAdmin, 
  onToggleUserStatus, 
  onChangeUserRole,
  onDeleteUser,
  onViewUserDetails 
}) => {
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  const handleAddAdmin = () => {
    onAddAdmin(newAdminEmail, newAdminName, newAdminPassword);
    setShowAddAdmin(false);
    setNewAdminEmail('');
    setNewAdminName('');
    setNewAdminPassword('');
  };

  return (
    <Card className="rainbow-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>👥 Пользователи</CardTitle>
          <Button 
            onClick={() => setShowAddAdmin(!showAddAdmin)}
            className="rainbow-button"
            size="sm"
          >
            + Добавить админа
          </Button>
        </div>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {showAddAdmin && (
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-semibold mb-3">Добавить администратора</h4>
            <div className="space-y-3">
              <div>
                <Label>Email</Label>
                <Input
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label>Имя</Label>
                <Input
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Имя администратора"
                />
              </div>
              <div>
                <Label>Пароль</Label>
                <Input
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  type="password"
                  placeholder="Пароль"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddAdmin} size="sm" className="rainbow-button">
                  Добавить
                </Button>
                <Button 
                  onClick={() => setShowAddAdmin(false)}
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
          {users.filter(u => u.role !== 'trainer').map(u => (
            <div 
              key={u.id} 
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onViewUserDetails(u)}
            >
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
                <div className="flex gap-2 mt-1">
                  <Badge variant={u.role === 'director' ? 'default' : u.role === 'admin' ? 'secondary' : 'outline'}>
                    {u.role === 'director' ? '👑 Директор' : u.role === 'admin' ? '⚡ Админ' : '👤 Клиент'}
                  </Badge>
                  <Badge variant={u.isActive ? 'default' : 'destructive'}>
                    {u.isActive ? '✅ Активен' : '❌ Заблокирован'}
                  </Badge>
                </div>
              </div>
              {u.role !== 'director' && (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  {u.role !== 'admin' && (
                    <Select value={u.role} onValueChange={(role: UserRole) => onChangeUserRole(u.id, role)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Клиент</SelectItem>
                        <SelectItem value="admin">Админ</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <Button
                    size="sm"
                    variant={u.isActive ? "outline" : "default"}
                    onClick={() => onToggleUserStatus(u.id)}
                  >
                    <Icon name={u.isActive ? "Ban" : "CheckCircle"} className="w-4 h-4 mr-1" />
                    {u.isActive ? 'Блок' : 'Разблок'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteUser(u.id);
                    }}
                  >
                    <Icon name="X" className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;