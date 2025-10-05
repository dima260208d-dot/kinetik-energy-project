export interface DiaryEntry {
  id: number;
  student_name: string;
  trainer_name: string;
  entry_date: string;
  comment: string;
  homework?: string;
  grade?: string;
  attendance: string;
}

export interface LessonPlan {
  id: number;
  group_name: string;
  trainer_name: string;
  lesson_date: string;
  topic: string;
  status: string;
}

export interface Trainer {
  id: number;
  name: string;
  email: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
}
