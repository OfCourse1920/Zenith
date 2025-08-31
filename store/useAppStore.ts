import { create } from 'zustand';
import { INITIAL_KANBAN_DATA, INITIAL_HABITS } from '../constants';
import type { KanbanData, Task, Habit, TaskStatus } from '../types';

interface PomodoroSettings {
  work: number; // minutes
  shortBreak: number; // minutes
  longBreak: number; // minutes
}

interface AppState {
  kanbanData: KanbanData;
  habits: Habit[];
  theme: 'dark' | 'light';
  pomodoroSettings: PomodoroSettings;
  setTheme: (theme: 'dark' | 'light') => void;
  updatePomodoroSettings: (settings: Partial<PomodoroSettings>) => void;
  moveTask: (draggableId: string, sourceColumnId: TaskStatus, destColumnId: TaskStatus, sourceIndex: number, destIndex: number) => void;
  addTask: (columnId: TaskStatus, task: Task) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  addHabit: (habitData: Omit<Habit, 'id' | 'streak' | 'completions'>) => void;
  updateHabit: (habitId: string, updatedHabit: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  kanbanData: INITIAL_KANBAN_DATA,
  habits: INITIAL_HABITS,
  theme: 'dark',
  pomodoroSettings: {
    work: 25,
    shortBreak: 5,
    longBreak: 15,
  },

  setTheme: (theme) => set({ theme }),

  updatePomodoroSettings: (settings) => set(state => ({
    pomodoroSettings: { ...state.pomodoroSettings, ...settings }
  })),

  moveTask: (draggableId, sourceColumnId, destColumnId, sourceIndex, destIndex) =>
    set((state) => {
      const sourceColumn = state.kanbanData.columns[sourceColumnId];
      const destColumn = state.kanbanData.columns[destColumnId];

      const newSourceTaskIds = Array.from(sourceColumn.taskIds);
      newSourceTaskIds.splice(sourceIndex, 1);

      if (sourceColumnId === destColumnId) {
        newSourceTaskIds.splice(destIndex, 0, draggableId);
        const newColumn = { ...sourceColumn, taskIds: newSourceTaskIds };
        return {
          kanbanData: {
            ...state.kanbanData,
            columns: {
              ...state.kanbanData.columns,
              [newColumn.id]: newColumn,
            },
            tasks: {
              ...state.kanbanData.tasks,
              [draggableId]: { ...state.kanbanData.tasks[draggableId], status: destColumnId }
            }
          },
        };
      } else {
        const newDestTaskIds = Array.from(destColumn.taskIds);
        newDestTaskIds.splice(destIndex, 0, draggableId);
        const newSourceColumn = { ...sourceColumn, taskIds: newSourceTaskIds };
        const newDestColumn = { ...destColumn, taskIds: newDestTaskIds };
        return {
          kanbanData: {
            ...state.kanbanData,
            columns: {
              ...state.kanbanData.columns,
              [newSourceColumn.id]: newSourceColumn,
              [newDestColumn.id]: newDestColumn,
            },
            tasks: {
              ...state.kanbanData.tasks,
              [draggableId]: { ...state.kanbanData.tasks[draggableId], status: destColumnId }
            }
          },
        };
      }
    }),
  
  addTask: (columnId, task) => set(state => {
    const newTasks = {...state.kanbanData.tasks, [task.id]: task };
    const column = state.kanbanData.columns[columnId];
    const newTaskIds = [...column.taskIds, task.id];
    const newColumn = {...column, taskIds: newTaskIds };

    return {
        kanbanData: {
            ...state.kanbanData,
            tasks: newTasks,
            columns: {
                ...state.kanbanData.columns,
                [columnId]: newColumn
            }
        }
    }
  }),

  updateTask: (taskId, updatedTask) => set(state => ({
    kanbanData: {
        ...state.kanbanData,
        tasks: {
            ...state.kanbanData.tasks,
            [taskId]: { ...state.kanbanData.tasks[taskId], ...updatedTask }
        }
    }
  })),
  
  deleteTask: (taskId) => set(state => {
    const taskToDelete = state.kanbanData.tasks[taskId];
    if (!taskToDelete) return state;

    const columnId = taskToDelete.status;
    const column = state.kanbanData.columns[columnId];

    // Remove task from tasks object
    const newTasks = { ...state.kanbanData.tasks };
    delete newTasks[taskId];

    // Remove taskId from column's taskIds array
    const newTaskIds = column.taskIds.filter(id => id !== taskId);
    const newColumn = { ...column, taskIds: newTaskIds };

    return {
        kanbanData: {
            ...state.kanbanData,
            tasks: newTasks,
            columns: {
                ...state.kanbanData.columns,
                [columnId]: newColumn,
            },
        },
    };
  }),

  toggleHabitCompletion: (habitId, date) => set(state => {
    const newHabits = state.habits.map(habit => {
        if (habit.id === habitId) {
            const newCompletions = habit.completions.includes(date)
                ? habit.completions.filter(c => c !== date)
                : [...habit.completions, date];
            return { ...habit, completions: newCompletions };
        }
        return habit;
    });
    return { habits: newHabits };
  }),

  addHabit: (habitData) => set(state => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${new Date().getTime()}`,
      streak: 0,
      completions: [],
    };
    return { habits: [...state.habits, newHabit] };
  }),

  updateHabit: (habitId, updatedHabit) => set(state => ({
    habits: state.habits.map(habit =>
      habit.id === habitId ? { ...habit, ...updatedHabit } : habit
    ),
  })),

  deleteHabit: (habitId) => set(state => ({
    habits: state.habits.filter(habit => habit.id !== habitId),
  })),
}));
