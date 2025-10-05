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

interface DiaryEntry {
  id: number;
  student_id: string;
  student_name: string;
  trainer_name: string;
  entry_date: string;
  comment: string;
  homework?: string;
  grade?: string;
  attendance: string;
  media?: { url: string; type: string }[];
}

function DiaryView({ studentId }: { studentId: string }) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    loadEntries();
  }, [studentId]);

  const loadEntries = () => {
    const stored = localStorage.getItem('fitness_app_data');
    if (stored) {
      const data = JSON.parse(stored);
      const studentEntries = (data.diary_entries || []).filter(
        (e: DiaryEntry) => String(e.student_id) === studentId
      );
      setEntries(studentEntries.sort((a: DiaryEntry, b: DiaryEntry) => 
        new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
      ));
    }
  };

  const getAttendanceBadge = (attendance: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'destructive' | 'outline' | 'secondary' }> = {
      present: { label: '✅ Присутствовал', variant: 'default' },
      absent: { label: '❌ Отсутствовал', variant: 'destructive' },
      late: { label: '⏰ Опоздал', variant: 'secondary' },
      excused: { label: '📝 Уважительная', variant: 'outline' }
    };
    const info = variants[attendance] || variants.present;
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">У этого ученика пока нет записей в дневнике</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{entry.student_name}</CardTitle>
                <CardDescription>
                  {new Date(entry.entry_date).toLocaleDateString('ru-RU', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {getAttendanceBadge(entry.attendance)}
                {entry.grade && <Badge variant="outline">Оценка: {entry.grade}</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {entry.comment && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="MessageSquare" size={16} />
                  Комментарий тренера
                </h4>
                <p className="text-sm text-muted-foreground">{entry.comment}</p>
              </div>
            )}

            {entry.media && entry.media.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="Image" size={16} />
                  Фото и видео
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {entry.media.map((media, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden">
                      {media.type === 'video' ? (
                        <video src={media.url} controls className="w-full h-32 object-cover" />
                      ) : (
                        <img src={media.url} alt="Media" className="w-full h-32 object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {entry.homework && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="BookMarked" size={16} />
                  Домашнее задание
                </h4>
                <p className="text-sm text-muted-foreground">{entry.homework}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
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

  // Медиа файлы для загрузки
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<{url: string, type: string, file: File}[]>([]);

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
      // Загружаем реальных учеников из системы
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

  const handleCreateEntry = async () => {
    try {
      const stored = localStorage.getItem('fitness_app_data');
      const data = stored ? JSON.parse(stored) : { diary_entries: [] };
      
      if (!data.diary_entries) {
        data.diary_entries = [];
      }

      const student = students.find(s => String(s.id) === entryForm.student_id);
      
      const newEntry = {
        id: Date.now(),
        student_id: entryForm.student_id,
        student_name: student?.name || 'Неизвестный ученик',
        trainer_name: 'Тренер',
        entry_date: entryForm.entry_date,
        comment: entryForm.comment,
        homework: entryForm.homework,
        grade: entryForm.grade,
        attendance: entryForm.attendance,
        media: mediaPreviews.map(m => ({
          url: m.url,
          type: m.type
        }))
      };

      data.diary_entries.push(newEntry);
      localStorage.setItem('fitness_app_data', JSON.stringify(data));
      
      setIsEntryDialogOpen(false);
      setEntryForm({
        student_id: '',
        entry_date: new Date().toISOString().split('T')[0],
        comment: '',
        homework: '',
        grade: '',
        attendance: 'present'
      });
      setMediaPreviews([]);
      setMediaFiles([]);
      
      alert('Запись добавлена в дневник!');
    } catch (error) {
      console.error('Error creating entry:', error);
      alert('Ошибка при сохранении записи');
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
                    <Label>Фото и видео с тренировки</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                      <input
                        type="file"
                        id="media-upload"
                        multiple
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setMediaFiles([...mediaFiles, ...files]);
                          
                          files.forEach(file => {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setMediaPreviews(prev => [...prev, {
                                url: event.target?.result as string,
                                type: file.type.startsWith('video') ? 'video' : 'image',
                                file: file
                              }]);
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                      />
                      <label htmlFor="media-upload" className="cursor-pointer">
                        <Icon name="Upload" size={32} className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-1">Перетащите файлы сюда или нажмите для выбора</p>
                        <p className="text-xs text-muted-foreground">Поддерживаются фото и видео</p>
                      </label>
                    </div>

                    {mediaPreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        {mediaPreviews.map((preview, idx) => (
                          <div key={idx} className="relative rounded-lg overflow-hidden group">
                            {preview.type === 'video' ? (
                              <div className="relative">
                                <video src={preview.url} className="w-full h-24 object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <Icon name="Play" size={24} className="text-white" />
                                </div>
                              </div>
                            ) : (
                              <img src={preview.url} alt="Preview" className="w-full h-24 object-cover" />
                            )}
                            <button
                              onClick={() => {
                                setMediaPreviews(mediaPreviews.filter((_, i) => i !== idx));
                                setMediaFiles(mediaFiles.filter((_, i) => i !== idx));
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Icon name="X" size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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