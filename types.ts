
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  tags: string[];
  subtasks: Subtask[];
}

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  color: string;
  icon: string;
  streak: number;
  completions: string[]; // Dates as ISO strings
}

export interface PomodoroSession {
  id: string;
  type: 'work' | 'shortBreak' | 'longBreak';
  duration: number; // in seconds
  completedAt: string; // Date as ISO string
  taskId?: string;
}

export interface Column {
    id: TaskStatus;
    title: string;
    taskIds: string[];
}

export interface KanbanData {
    tasks: Record<string, Task>;
    columns: Record<TaskStatus, Column>;
    columnOrder: TaskStatus[];
}
