
import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/features/dashboard/Dashboard';
import KanbanBoard from './components/features/tasks/KanbanBoard';
import PomodoroTimer from './components/features/pomodoro/PomodoroTimer';
import HabitTracker from './components/features/habits/HabitTracker';
import StudyBuddy from './components/features/studybuddy/StudyBuddy';
import Settings from './components/features/settings/Settings';
import { useAppStore } from './store/useAppStore';
// FIX: Import Transition type from framer-motion to resolve type error.
import { motion, AnimatePresence, Transition } from 'framer-motion';

export type Page = 'Dashboard' | 'Tasks' | 'Pomodoro' | 'Habits' | 'Study Buddy' | 'Settings';

const pageComponents: Record<Page, React.ComponentType> = {
  Dashboard: Dashboard,
  Tasks: KanbanBoard,
  Pomodoro: PomodoroTimer,
  Habits: HabitTracker,
  'Study Buddy': StudyBuddy,
  'Settings': Settings,
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

// FIX: Explicitly define the type for pageTransition to satisfy Framer Motion's Transition type requirements.
const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

export default function App() {
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const theme = useAppStore(state => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  const CurrentPage = pageComponents[activePage];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-300">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={activePage} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="h-full"
            >
              <CurrentPage />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}