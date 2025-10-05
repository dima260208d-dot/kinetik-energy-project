import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface DiaryEntry {
  id: number;
  student_name: string;
  trainer_name: string;
  entry_date: string;
  comment: string;
  homework?: string;
  grade?: string;
  attendance: string;
}

interface LessonPlan {
  id: number;
  group_name: string;
  trainer_name: string;
  lesson_date: string;
  topic: string;
  status: string;
}

interface Trainer {
  id: number;
  name: string;
  email: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
}

export default function DirectorPanel() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAddTrainer, setShowAddTrainer] = useState(false);
  const [newTrainerEmail, setNewTrainerEmail] = useState('');
  const [newTrainerName, setNewTrainerName] = useState('');
  const [newTrainerPhone, setNewTrainerPhone] = useState('');
  const [newTrainerPassword, setNewTrainerPassword] = useState('');

  useEffect(() => {
    loadAllData();
  }, [selectedTrainer, selectedStudent]);

  const loadAllData = async () => {
    try {
      // Загружаем реальных пользователей из системы
      const stored = localStorage.getItem('fitness_app_data');
      if (stored) {
        const data = JSON.parse(stored);
        const allUsers = data.users || [];
        
        // Загружаем только реальных тренеров и клиентов
        const realTrainers = allUsers.filter((u: any) => u.role === 'trainer');
        const realClients = allUsers.filter((u: any) => u.role === 'client');
        
        setTrainers(realTrainers.map((t: any) => ({ id: t.id, name: t.name, email: t.email })));
        setStudents(realClients.map((c: any) => ({ id: c.id, name: c.name, email: c.email })));
      }

      // Пока нет записей - они будут создаваться тренерами
      setEntries([]);
      setPlans([]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesTrainer = selectedTrainer === 'all' || entry.trainer_name.includes(selectedTrainer);
    const matchesStudent = selectedStudent === 'all' || entry.student_name.includes(selectedStudent);
    const matchesSearch = searchQuery === '' || 
      entry.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.trainer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.comment.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTrainer && matchesStudent && matchesSearch;
  });

  const filteredPlans = plans.filter(plan => {
    const matchesTrainer = selectedTrainer === 'all' || plan.trainer_name.includes(selectedTrainer);
    const matchesSearch = searchQuery === '' ||
      plan.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.group_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTrainer && matchesSearch;
  });

  const getAttendanceBadge = (attendance: string) => {
    const variants: Record<string, { label: string; variant: any }> = {
      present: { label: 'Присутствовал', variant: 'default' },
      absent: { label: 'Отсутствовал', variant: 'destructive' },
      late: { label: 'Опоздал', variant: 'secondary' },
      excused: { label: 'По уважительной', variant: 'outline' }
    };
    const info = variants[attendance] || variants.present;
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: any }> = {
      planned: { label: 'Запланировано', variant: 'outline' },
      completed: { label: 'Завершено', variant: 'default' },
      cancelled: { label: 'Отменено', variant: 'destructive' }
    };
    const info = variants[status] || variants.planned;
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-gray-900">Панель директора</h1>
              <p className="text-gray-700">Контроль работы тренеров и успеваемости учеников</p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center gap-2 bg-white"
            >
              <Icon name="Home" className="w-4 h-4" />
              На сайт
            </Button>
          </div>
        </div>

      {/* Фильтры */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Поиск</label>
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск по имени, теме..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Тренер</label>
              <Select value={selectedTrainer} onValueChange={setSelectedTrainer}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все тренеры</SelectItem>
                  {trainers.map((trainer) => (
                    <SelectItem key={trainer.id} value={trainer.name}>
                      {trainer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ученик</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все ученики</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.name}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="entries" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="entries" className="flex items-center gap-2">
            <Icon name="BookOpen" size={18} />
            Дневники ({filteredEntries.length})
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Icon name="Calendar" size={18} />
            Планы занятий ({filteredPlans.length})
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Icon name="Users" size={18} />
            Персонал
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="mt-6 space-y-4">
          {filteredEntries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Icon name="BookOpen" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Записей не найдено</p>
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map((entry) => (
              <Card key={entry.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-1">
                        {entry.student_name}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        Тренер: {entry.trainer_name} • {new Date(entry.entry_date).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {getAttendanceBadge(entry.attendance)}
                      {entry.grade && (
                        <Badge variant="default" className="text-lg px-3">
                          {entry.grade}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold mb-1">Комментарий</p>
                    <p className="text-muted-foreground">{entry.comment}</p>
                  </div>
                  {entry.homework && (
                    <div>
                      <p className="text-sm font-semibold mb-1">Домашнее задание</p>
                      <p className="text-muted-foreground">{entry.homework}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="plans" className="mt-6 space-y-4">
          {filteredPlans.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Планов не найдено</p>
              </CardContent>
            </Card>
          ) : (
            filteredPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-1">{plan.topic}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {plan.group_name} • Тренер: {plan.trainer_name} • {new Date(plan.lesson_date).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                    {getStatusBadge(plan.status)}
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="staff" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
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
                      <Button onClick={() => {
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
                        loadAllData();
                        alert('Тренер успешно добавлен!');
                      }} size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500">
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
                  trainers.map((trainer) => (
                    <div key={trainer.id} className="flex items-center justify-between p-3 border rounded-lg bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg">
                          🎯
                        </div>
                        <div>
                          <p className="font-medium">{trainer.name}</p>
                          <p className="text-sm text-muted-foreground">{trainer.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline">Тренер</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Users" size={24} />
                  Ученики ({students.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                    <Badge variant="secondary">Ученик</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}