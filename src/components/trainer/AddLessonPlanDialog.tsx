import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Group {
  id: number;
  name: string;
  sport_type: string;
}

interface AddLessonPlanDialogProps {
  groups: Group[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddLessonPlanDialog({ 
  groups, 
  isOpen, 
  onOpenChange 
}: AddLessonPlanDialogProps) {
  const [planForm, setPlanForm] = useState({
    group_id: '',
    lesson_date: new Date().toISOString().split('T')[0],
    topic: '',
    description: '',
    goals: '',
    materials: '',
    status: 'planned'
  });

  const handleCreatePlan = async () => {
    try {
      console.log('Creating plan:', planForm);
      
      onOpenChange(false);
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
}
