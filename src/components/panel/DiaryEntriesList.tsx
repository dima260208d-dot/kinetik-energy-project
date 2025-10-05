import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { DiaryEntry } from './PanelTypes';

interface DiaryEntriesListProps {
  entries: DiaryEntry[];
}

const DiaryEntriesList = ({ entries }: DiaryEntriesListProps) => {
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

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Icon name="BookOpen" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Записей не найдено</p>
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
      ))}
    </div>
  );
};

export default DiaryEntriesList;
