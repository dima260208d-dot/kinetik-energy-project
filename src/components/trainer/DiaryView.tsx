import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

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

interface DiaryViewProps {
  studentId: string;
}

export default function DiaryView({ studentId }: DiaryViewProps) {
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
