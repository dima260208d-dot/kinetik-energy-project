import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Trainer, Student } from './PanelTypes';

interface PanelFiltersProps {
  searchQuery: string;
  selectedTrainer: string;
  selectedStudent: string;
  trainers: Trainer[];
  students: Student[];
  onSearchChange: (value: string) => void;
  onTrainerChange: (value: string) => void;
  onStudentChange: (value: string) => void;
}

const PanelFilters = ({
  searchQuery,
  selectedTrainer,
  selectedStudent,
  trainers,
  students,
  onSearchChange,
  onTrainerChange,
  onStudentChange
}: PanelFiltersProps) => {
  return (
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
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Тренер</label>
            <Select value={selectedTrainer} onValueChange={onTrainerChange}>
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
            <Select value={selectedStudent} onValueChange={onStudentChange}>
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
  );
};

export default PanelFilters;
