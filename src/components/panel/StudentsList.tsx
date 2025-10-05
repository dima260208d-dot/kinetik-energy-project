import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Student } from './PanelTypes';

interface StudentsListProps {
  students: Student[];
}

const StudentsList = ({ students }: StudentsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Users" size={24} />
          Ученики ({students.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {students.map((student) => (
          <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-muted-foreground">{student.email}</p>
            </div>
            <Badge variant="secondary">Ученик</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StudentsList;
