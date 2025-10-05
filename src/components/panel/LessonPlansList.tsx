import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { LessonPlan } from './PanelTypes';

interface LessonPlansListProps {
  plans: LessonPlan[];
}

const LessonPlansList = ({ plans }: LessonPlansListProps) => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: any }> = {
      planned: { label: 'Запланировано', variant: 'outline' },
      completed: { label: 'Завершено', variant: 'default' },
      cancelled: { label: 'Отменено', variant: 'destructive' }
    };
    const info = variants[status] || variants.planned;
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  if (plans.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Планов не найдено</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
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
      ))}
    </div>
  );
};

export default LessonPlansList;
