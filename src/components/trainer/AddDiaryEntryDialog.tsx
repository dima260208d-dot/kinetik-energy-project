import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Student {
  id: number;
  name: string;
  email: string;
}

interface AddDiaryEntryDialogProps {
  students: Student[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEntryCreated: () => void;
}

export default function AddDiaryEntryDialog({ 
  students, 
  isOpen, 
  onOpenChange,
  onEntryCreated 
}: AddDiaryEntryDialogProps) {
  const [entryForm, setEntryForm] = useState({
    student_id: '',
    entry_date: new Date().toISOString().split('T')[0],
    comment: '',
    homework: '',
    grade: '',
    attendance: 'present'
  });

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<{url: string, type: string, file: File}[]>([]);

  const handleCreateEntry = async () => {
    if (!entryForm.student_id) {
      alert('Пожалуйста, выберите ученика');
      return;
    }

    if (!entryForm.comment.trim()) {
      alert('Пожалуйста, добавьте комментарий о тренировке');
      return;
    }

    try {
      const stored = localStorage.getItem('fitness_app_data');
      const data = stored ? JSON.parse(stored) : { users: [], diary_entries: [] };
      
      if (!data.diary_entries) {
        data.diary_entries = [];
      }

      const currentUser = localStorage.getItem('current_user');
      const trainer = currentUser ? JSON.parse(currentUser) : null;
      const student = students.find(s => String(s.id) === entryForm.student_id);
      
      const newEntry = {
        id: Date.now(),
        student_id: entryForm.student_id,
        student_name: student?.name || 'Неизвестный ученик',
        trainer_name: trainer?.name || 'Тренер',
        entry_date: entryForm.entry_date,
        comment: entryForm.comment,
        homework: entryForm.homework || '',
        grade: entryForm.grade || '',
        attendance: entryForm.attendance,
        media: mediaPreviews.map(m => ({
          url: m.url,
          type: m.type
        }))
      };

      data.diary_entries.push(newEntry);
      localStorage.setItem('fitness_app_data', JSON.stringify(data));
      
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
      
      onOpenChange(false);
      alert('✅ Запись успешно добавлена в дневник!');
      
      setTimeout(() => {
        onEntryCreated();
      }, 100);
    } catch (error) {
      console.error('Error creating entry:', error);
      alert('❌ Ошибка при сохранении записи');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
}