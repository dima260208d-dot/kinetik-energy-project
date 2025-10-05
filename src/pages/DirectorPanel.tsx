import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import PanelFilters from '@/components/panel/PanelFilters';
import DiaryEntriesList from '@/components/panel/DiaryEntriesList';
import LessonPlansList from '@/components/panel/LessonPlansList';
import TrainersManagement from '@/components/panel/TrainersManagement';
import StudentsList from '@/components/panel/StudentsList';
import { DiaryEntry, LessonPlan, Trainer, Student } from '@/components/panel/PanelTypes';

export default function DirectorPanel() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAllData();
  }, [selectedTrainer, selectedStudent]);

  const loadAllData = async () => {
    try {
      const stored = localStorage.getItem('fitness_app_data');
      if (stored) {
        const data = JSON.parse(stored);
        const allUsers = data.users || [];
        
        const realTrainers = allUsers.filter((u: any) => u.role === 'trainer');
        const realClients = allUsers.filter((u: any) => u.role === 'client');
        
        setTrainers(realTrainers.map((t: any) => ({ id: t.id, name: t.name, email: t.email })));
        setStudents(realClients.map((c: any) => ({ id: c.id, name: c.name, email: c.email })));
      }

      setEntries([]);
      setPlans([]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesTrainer = selectedTrainer === 'all' || entry.trainer_name.includes(selectedTrainer);
    const matchesStudent = selectedStudent === 'all' || entry.student_name.includes(selectedStudent);
    const matchesSearch = searchQuery === '' || 
      entry.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.trainer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.comment.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTrainer && matchesStudent && matchesSearch;
  });

  const filteredPlans = plans.filter(plan => {
    const matchesTrainer = selectedTrainer === 'all' || plan.trainer_name.includes(selectedTrainer);
    const matchesSearch = searchQuery === '' ||
      plan.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.group_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTrainer && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-gray-900">Дневник</h1>
              <p className="text-gray-700">Просмотр записей тренеров и успеваемости учеников</p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center gap-2 bg-white"
            >
              <Icon name="Home" className="w-4 h-4" />
              На сайт
            </Button>
          </div>
        </div>

        <PanelFilters
          searchQuery={searchQuery}
          selectedTrainer={selectedTrainer}
          selectedStudent={selectedStudent}
          trainers={trainers}
          students={students}
          onSearchChange={setSearchQuery}
          onTrainerChange={setSelectedTrainer}
          onStudentChange={setSelectedStudent}
        />

        <Tabs defaultValue="entries" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="entries" className="flex items-center gap-2">
              <Icon name="BookOpen" size={18} />
              Дневники ({filteredEntries.length})
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Icon name="Calendar" size={18} />
              Планы занятий ({filteredPlans.length})
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Icon name="Users" size={18} />
              Персонал
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entries" className="mt-6">
            <DiaryEntriesList entries={filteredEntries} />
          </TabsContent>

          <TabsContent value="plans" className="mt-6">
            <LessonPlansList plans={filteredPlans} />
          </TabsContent>

          <TabsContent value="staff" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <TrainersManagement trainers={trainers} onReload={loadAllData} />
              <StudentsList students={students} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
