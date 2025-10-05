import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import DiaryView from '@/components/trainer/DiaryView';
import AddDiaryEntryDialog from '@/components/trainer/AddDiaryEntryDialog';
import AddLessonPlanDialog from '@/components/trainer/AddLessonPlanDialog';

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = localStorage.getItem('fitness_app_data');
      if (stored) {
        const data = JSON.parse(stored);
        const clients = (data.users || []).filter((u: any) => u.role === 'client');
        setStudents(clients.map((c: any) => ({ id: c.id, name: c.name, email: c.email })));
      }

      setGroups([
        { id: 1, name: 'Скейтборд начинающие', sport_type: 'skateboard' },
        { id: 2, name: 'Ролики продвинутые', sport_type: 'rollerblade' }
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleEntryCreated = () => {
    if (selectedStudent) {
      setSelectedStudent('');
      setTimeout(() => setSelectedStudent(selectedStudent), 0);
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

            <AddDiaryEntryDialog
              students={students}
              isOpen={isEntryDialogOpen}
              onOpenChange={setIsEntryDialogOpen}
              onEntryCreated={handleEntryCreated}
            />
          </div>

          {selectedStudent ? (
            <DiaryView studentId={selectedStudent} />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Icon name="BookOpen" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Выберите ученика для просмотра его дневника или создайте новую запись
                </p>
              </CardContent>
            </Card>
          )}
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

            <AddLessonPlanDialog
              groups={groups}
              isOpen={isPlanDialogOpen}
              onOpenChange={setIsPlanDialogOpen}
            />
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
