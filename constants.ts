import type { KanbanData, Habit } from './types';

export const INITIAL_KANBAN_DATA: KanbanData = {
  tasks: {
    'task-1': { id: 'task-1', title: 'Finish React component library', description: 'Build reusable UI components for the project.', status: 'in-progress', priority: 'high', tags: ['dev', 'ui'], subtasks: [{id: 'sub-1', title: 'Button component', isCompleted: true}]},
    'task-2': { id: 'task-2', title: 'Write documentation for API', description: 'Document all endpoints and usage examples.', status: 'todo', priority: 'medium', tags: ['docs'], subtasks: [] },
    'task-3': { id: 'task-3', title: 'Design the new dashboard layout', description: 'Create mockups and prototypes in Figma.', status: 'todo', priority: 'high', tags: ['design', 'ux'], subtasks: [] },
    'task-4': { id: 'task-4', title: 'Deploy staging server', description: 'Set up the CI/CD pipeline.', status: 'completed', priority: 'urgent', tags: ['devops'], subtasks: [] },
    'task-5': { id: 'task-5', title: 'Research state management libraries', description: 'Evaluate Zustand, Redux, and others.', status: 'in-progress', priority: 'low', tags: ['research'], subtasks: [] },
    'task-6': { id: 'task-6', title: 'Review PR from team member', description: 'Check code quality and provide feedback.', status: 'in-progress', priority: 'medium', tags: ['code-review'], subtasks: [] },
    'task-7': { id: 'task-7', title: 'Prepare for sprint planning', description: 'Outline tasks for the next two weeks.', status: 'todo', priority: 'high', tags: ['planning'], subtasks: [] },
  },
  columns: {
    'todo': { id: 'todo', title: 'To Do', taskIds: ['task-2', 'task-3', 'task-7'] },
    'in-progress': { id: 'in-progress', title: 'In Progress', taskIds: ['task-1', 'task-5', 'task-6'] },
    'completed': { id: 'completed', title: 'Completed', taskIds: ['task-4'] },
  },
  columnOrder: ['todo', 'in-progress', 'completed'],
};

export const INITIAL_HABITS: Habit[] = [
    { id: 'habit-1', name: 'Read for 30 mins', frequency: 'daily', color: 'bg-blue-500', icon: 'BookOpen', streak: 12, completions: ['2024-07-20T10:00:00Z', '2024-07-21T10:00:00Z', '2024-07-22T10:00:00Z'] },
    { id: 'habit-2', name: 'Morning workout', frequency: 'daily', color: 'bg-green-500', icon: 'Dumbbell', streak: 5, completions: ['2024-07-22T10:00:00Z'] },
    { id: 'habit-3', name: 'Drink 8 glasses of water', frequency: 'daily', color: 'bg-sky-400', icon: 'GlassWater', streak: 25, completions: ['2024-07-21T10:00:00Z', '2024-07-22T10:00:00Z'] },
    { id: 'habit-4', name: 'Review flashcards', frequency: 'daily', color: 'bg-yellow-500', icon: 'BrainCircuit', streak: 2, completions: [] },
];

export const PRIORITY_STYLES: Record<string, { icon: string; color: string }> = {
    low: { icon: 'ChevronDown', color: 'text-gray-400' },
    medium: { icon: 'Minus', color: 'text-yellow-500' },
    high: { icon: 'ChevronUp', color: 'text-orange-500' },
    urgent: { icon: 'Flame', color: 'text-red-500' },
};

export const STATUS_STYLES: Record<string, { color: string, name: string }> = {
    todo: { color: 'border-l-blue-500', name: 'To Do' },
    'in-progress': { color: 'border-l-yellow-500', name: 'In Progress' },
    completed: { color: 'border-l-green-500', name: 'Completed' },
}

export const MOTIVATIONAL_QUOTES = [
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "The expert in anything was once a beginner.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Believe you can and you're halfway there.",
  "Well done is better than well said."
];

export const HABIT_COLORS = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-teal-500',
    'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
];

export const HABIT_ICONS = [
    'BookOpen', 'Dumbbell', 'GlassWater', 'BrainCircuit', 'Zap', 'Timer'
];