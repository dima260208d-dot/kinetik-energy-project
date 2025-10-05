import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

  useEffect(() => {
    loadAllData();
  }, [selectedTrainer, selectedStudent]);

  const loadAllData = async () => {
    try {
      // TODO: заменить на реальный API
      setTrainers([
        { id: 1, name: 'Сергей Иванов', email: 'sergey@example.com' },
        { id: 2, name: 'Анна Петрова', email: 'anna@example.com' }
      ]);

      setStudents([
        { id: 1, name: 'Иван Петров', email: 'ivan@example.com' },
        { id: 2, name: 'Мария Сидорова', email: 'maria@example.com' }
      ]);

      setEntries([
        {
          id: 1,
          student_name: 'Иван Петров',
          trainer_name: 'Сергей Иванов',
          entry_date: '2024-10-03',
          comment: 'Отличная работа на тренировке!',
          homework: 'Практиковать олли 30 раз',
          grade: '5',
          attendance: 'present'
        }
      ]);

      setPlans([
        {
          id: 1,
          group_name: 'Скейтборд начинающие',
          trainer_name: 'Сергей Иванов',
          lesson_date: '2024-10-05',
          topic: 'Базовые трюки: Kickflip',
          status: 'planned'
        }
      ]);
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
                <CardTitle className="flex items-center gap-2">
                  <Icon name="GraduationCap" size={24} />
                  Тренеры ({trainers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trainers.map((trainer) => (
                  <div key={trainer.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{trainer.name}</p>
                      <p className="text-sm text-muted-foreground">{trainer.email}</p>
                    </div>
                    <Badge variant="outline">Тренер</Badge>
                  </div>
                ))}
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