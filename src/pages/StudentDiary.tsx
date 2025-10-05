import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  media?: Array<{
    media_type: string;
    media_url: string;
    thumbnail_url?: string;
    description?: string;
  }>;
}

interface LessonPlan {
  id: number;
  group_name: string;
  trainer_name: string;
  lesson_date: string;
  topic: string;
  description?: string;
  goals?: string;
  status: string;
}

export default function StudentDiary() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole] = useState('student'); // TODO: получать из auth context

  useEffect(() => {
    loadDiaryData();
  }, []);

  const loadDiaryData = async () => {
    setLoading(true);
    try {
      // TODO: заменить на реальный API endpoint после деплоя backend функции
      // const response = await fetch('/api/diary/entries', {
      //   headers: {
      //     'X-User-Id': '1',
      //     'X-Role': userRole
      //   }
      // });
      // const data = await response.json();
      // setEntries(data.entries);
      
      // Временные данные для демонстрации
      setEntries([
        {
          id: 1,
          student_name: 'Иван Петров',
          trainer_name: 'Сергей Иванов',
          entry_date: '2024-10-03',
          comment: 'Отличная работа на тренировке! Освоил новый трюк на скейте.',
          homework: 'Практиковать олли 30 раз в день',
          grade: '5',
          attendance: 'present',
          media: [
            {
              media_type: 'video',
              media_url: 'https://example.com/video.mp4',
              thumbnail_url: 'https://cdn.poehali.dev/files/424f8693-463c-4c9d-b5ac-863b4376608d.jpg',
              description: 'Первый успешный олли'
            }
          ]
        }
      ]);

      setPlans([
        {
          id: 1,
          group_name: 'Скейтборд начинающие',
          trainer_name: 'Сергей Иванов',
          lesson_date: '2024-10-05',
          topic: 'Базовые трюки: Kickflip',
          description: 'Изучение техники kickflip',
          goals: 'Освоить базовое движение',
          status: 'planned'
        }
      ]);
    } catch (error) {
      console.error('Error loading diary:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <Icon name="Loader2" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Дневник ученика</h1>
            <p className="text-muted-foreground">Просматривайте записи о тренировках, домашние задания и планы занятий</p>
          </div>
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Icon name="Home" className="w-4 h-4" />
            На сайт
          </Button>
        </div>
      </div>

      <Tabs defaultValue="entries" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entries" className="flex items-center gap-2">
            <Icon name="BookOpen" size={18} />
            Записи дневника
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Icon name="Calendar" size={18} />
            План занятий
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="mt-6 space-y-4">
          {entries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Icon name="BookOpen" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Пока нет записей в дневнике</p>
              </CardContent>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">
                        {new Date(entry.entry_date).toLocaleDateString('ru-RU', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </CardTitle>
                      <CardDescription>
                        Тренер: {entry.trainer_name}
                      </CardDescription>
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
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="MessageSquare" size={18} />
                      Комментарий тренера
                    </h4>
                    <p className="text-muted-foreground">{entry.comment}</p>
                  </div>

                  {entry.homework && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Icon name="ClipboardList" size={18} />
                        Домашнее задание
                      </h4>
                      <p className="text-muted-foreground">{entry.homework}</p>
                    </div>
                  )}

                  {entry.media && entry.media.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Icon name="Image" size={18} />
                        Фото и видео с тренировки
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {entry.media.map((media, idx) => (
                          <div key={idx} className="relative rounded-lg overflow-hidden group">
                            <img
                              src={media.thumbnail_url || media.media_url}
                              alt={media.description || 'Медиа с тренировки'}
                              className="w-full h-48 object-cover"
                            />
                            {media.media_type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Icon name="Play" size={48} className="text-white" />
                              </div>
                            )}
                            {media.description && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
                                {media.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="plans" className="mt-6 space-y-4">
          {plans.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Пока нет запланированных занятий</p>
              </CardContent>
            </Card>
          ) : (
            plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{plan.topic}</CardTitle>
                      <CardDescription>
                        {new Date(plan.lesson_date).toLocaleDateString('ru-RU', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })} • {plan.group_name}
                      </CardDescription>
                    </div>
                    {getStatusBadge(plan.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.description && (
                    <div>
                      <h4 className="font-semibold mb-1">Описание</h4>
                      <p className="text-muted-foreground">{plan.description}</p>
                    </div>
                  )}
                  {plan.goals && (
                    <div>
                      <h4 className="font-semibold mb-1">Цели занятия</h4>
                      <p className="text-muted-foreground">{plan.goals}</p>
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Тренер: {plan.trainer_name}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}