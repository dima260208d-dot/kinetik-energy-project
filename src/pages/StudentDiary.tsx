import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
      
      // Загрузка из реальных данных (пока пусто, будет заполняться тренером)
      setEntries([]);
      setPlans([]);
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

  const exportToPDF = async () => {
    const element = document.getElementById('diary-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('dnevnik-trenirovok.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
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
          <div className="flex gap-2">
            <Button 
              onClick={exportToPDF}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Icon name="Download" className="w-4 h-4" />
              Экспорт в PDF
            </Button>
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
      </div>

      <div id="diary-content">
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
    </div>
  );
}