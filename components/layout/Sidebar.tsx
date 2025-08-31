import React from 'react';
import type { Page } from '../../App';
import { Icons } from '../ui/Icons';
import { motion } from 'framer-motion';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const navItems: { name: Page; icon: keyof typeof Icons }[] = [
  { name: 'Dashboard', icon: 'LayoutDashboard' },
  { name: 'Tasks', icon: 'CheckSquare' },
  { name: 'Pomodoro', icon: 'Timer' },
  { name: 'Habits', icon: 'CalendarCheck' },
  { name: 'Study Buddy', icon: 'BrainCircuit' },
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <aside className="w-16 md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-300">
      <div className="flex items-center justify-center md:justify-start h-16 px-4 border-b border-gray-200 dark:border-gray-800">
         <div className="flex items-center gap-2">
            <Icons.Zap className="h-8 w-8 text-primary" />
            <span className="hidden md:block text-xl font-bold text-gray-900 dark:text-white">Zenith</span>
         </div>
      </div>
      <nav className="flex-1 px-2 md:px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.name}
            name={item.name}
            icon={item.icon}
            isActive={activePage === item.name}
            onClick={() => setActivePage(item.name)}
          />
        ))}
      </nav>
       <div className="px-2 md:px-4 py-4 border-t border-gray-200 dark:border-gray-800">
         <NavItem name={'Settings'} icon="Settings" isActive={activePage === 'Settings'} onClick={() => setActivePage('Settings')} />
       </div>
    </aside>
  );
};

interface NavItemProps {
  name: Page;
  icon: keyof typeof Icons;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ name, icon, isActive, onClick }) => {
  const Icon = Icons[icon];
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center p-2 rounded-lg transition-colors relative ${
        isActive
          ? 'text-gray-900 dark:text-white'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isActive && (
        <motion.div
          layoutId="active-nav-item"
          className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-lg"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      <div className="relative flex items-center justify-center md:justify-start w-full gap-3">
        <Icon className="h-5 w-5" />
        <span className="hidden md:block text-sm font-medium">{name}</span>
      </div>
    </motion.button>
  );
};

export default Sidebar;