import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Student {
  id: number;
  name: string;
  email: string;
}

interface Group {
  id: number;
  name: string;
  sport_type: string;
}

export default function TrainerPanel() {
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);

  // Форма записи в дневнике
  const [entryForm, setEntryForm] = useState({
    student_id: '',
    entry_date: new Date().toISOString().split('T')[0],
    comment: '',
    homework: '',
    grade: '',
    attendance: 'present'
  });

  // Форма плана занятия
  const [planForm, setPlanForm] = useState({
    group_id: '',
    lesson_date: new Date().toISOString().split('T')[0],
    topic: '',
    description: '',
    goals: '',
    materials: '',
    status: 'planned'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // TODO: заменить на реальный API после деплоя
      setStudents([
        { id: 1, name: 'Иван Петров', email: 'ivan@example.com' },
        { id: 2, name: 'Мария Сидорова', email: 'maria@example.com' }
      ]);

      setGroups([
        { id: 1, name: 'Скейтборд начинающие', sport_type: 'skateboard' },
        { id: 2, name: 'Ролики продвинутые', sport_type: 'rollerblade' }
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleCreateEntry = async () => {
    try {
      // TODO: отправить на backend API
      console.log('Creating entry:', entryForm);
      
      setIsEntryDialogOpen(false);
      setEntryForm({
        student_id: '',
        entry_date: new Date().toISOString().split('T')[0],
        comment: '',
        homework: '',
        grade: '',
        attendance: 'present'
      });
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  };

  const handleCreatePlan = async () => {
    try {
      // TODO: отправить на backend API
      console.log('Creating plan:', planForm);
      
      setIsPlanDialogOpen(false);
      setPlanForm({
        group_id: '',
        lesson_date: new Date().toISOString().split('T')[0],
        topic: '',
        description: '',
        goals: '',
        materials: '',
        status: 'planned'
      });
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Панель тренера</h1>
        <p className="text-muted-foreground">Управляйте записями в дневниках и планируйте занятия</p>
      </div>

      <Tabs defaultValue="entries" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entries" className="flex items-center gap-2">
            <Icon name="BookOpen" size={18} />
            Записи в дневниках
          </TabsTrigger>
          <TabsTrigger value="planning" className="flex items-center gap-2">
            <Icon name="Calendar" size={18} />
            Планирование
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3 flex-1 max-w-md">
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите ученика" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={String(student.id)}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Icon name="Plus" size={18} />
                  Добавить запись
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Новая запись в дневнике</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Ученик</Label>
                    <Select
                      value={entryForm.student_id}
                      onValueChange={(value) => setEntryForm({ ...entryForm, student_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите ученика" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={String(student.id)}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Дата тренировки</Label>
                    <Input
                      type="date"
                      value={entryForm.entry_date}
                      onChange={(e) => setEntryForm({ ...entryForm, entry_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Посещаемость</Label>
                    <Select
                      value={entryForm.attendance}
                      onValueChange={(value) => setEntryForm({ ...entryForm, attendance: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Присутствовал</SelectItem>
                        <SelectItem value="absent">Отсутствовал</SelectItem>
                        <SelectItem value="late">Опоздал</SelectItem>
                        <SelectItem value="excused">По уважительной</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Оценка (необязательно)</Label>
                    <Input
                      placeholder="5, 4, 3..."
                      value={entryForm.grade}
                      onChange={(e) => setEntryForm({ ...entryForm, grade: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Комментарий о тренировке</Label>
                    <Textarea
                      placeholder="Опишите как прошла тренировка, что освоил ученик..."
                      value={entryForm.comment}
                      onChange={(e) => setEntryForm({ ...entryForm, comment: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Домашнее задание (необязательно)</Label>
                    <Textarea
                      placeholder="Что нужно практиковать дома..."
                      value={entryForm.homework}
                      onChange={(e) => setEntryForm({ ...entryForm, homework: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleCreateEntry} className="w-full">
                    Создать запись
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="BookOpen" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Выберите ученика или создайте новую запись
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3 flex-1 max-w-md">
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите группу" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={String(group.id)}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Icon name="Plus" size={18} />
                  Создать план
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Новый план занятия</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Группа</Label>
                    <Select
                      value={planForm.group_id}
                      onValueChange={(value) => setPlanForm({ ...planForm, group_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите группу" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={String(group.id)}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Дата занятия</Label>
                    <Input
                      type="date"
                      value={planForm.lesson_date}
                      onChange={(e) => setPlanForm({ ...planForm, lesson_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Тема занятия</Label>
                    <Input
                      placeholder="Например: Базовые трюки - Kickflip"
                      value={planForm.topic}
                      onChange={(e) => setPlanForm({ ...planForm, topic: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Описание</Label>
                    <Textarea
                      placeholder="Подробное описание занятия..."
                      value={planForm.description}
                      onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Цели занятия</Label>
                    <Textarea
                      placeholder="Что должны освоить ученики..."
                      value={planForm.goals}
                      onChange={(e) => setPlanForm({ ...planForm, goals: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Материалы и оборудование</Label>
                    <Textarea
                      placeholder="Список необходимого инвентаря..."
                      value={planForm.materials}
                      onChange={(e) => setPlanForm({ ...planForm, materials: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <Button onClick={handleCreatePlan} className="w-full">
                    Создать план
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Выберите группу или создайте новый план занятия
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
