
import React, { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import Card from '../../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import type { Habit } from '../../../types';
import Button from '../../ui/Button';
import { Icons } from '../../ui/Icons';
import HabitModal from './HabitModal';
import ConfirmationModal from '../../ui/ConfirmationModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};


const HabitTracker: React.FC = () => {
    const habits = useAppStore(state => state.habits);
    const deleteHabit = useAppStore(state => state.deleteHabit);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
    const [habitToDeleteId, setHabitToDeleteId] = useState<string | null>(null);

    const handleAdd = () => {
        setModalMode('add');
        setSelectedHabit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (habit: Habit) => {
        setModalMode('edit');
        setSelectedHabit(habit);
        setIsModalOpen(true);
    };

    const handleDeleteRequest = (habitId: string) => {
        setHabitToDeleteId(habitId);
    };

    const confirmDelete = () => {
        if (habitToDeleteId) {
            deleteHabit(habitToDeleteId);
            setHabitToDeleteId(null);
        }
    };

    const habitForModal = habitToDeleteId ? habits.find(h => h.id === habitToDeleteId) : null;

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Habit Tracker</h2>
                <Button onClick={handleAdd}>
                    <Icons.Plus className="w-4 h-4 mr-2"/>
                    Add New Habit
                </Button>
            </div>
            <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {habits.map(habit => (
                        <motion.div 
                            key={habit.id} 
                            variants={itemVariants}
                            exit="exit"
                            layout
                        >
                            <HabitCard 
                                habit={habit} 
                                onEdit={() => handleEdit(habit)} 
                                onDelete={() => handleDeleteRequest(habit.id)} 
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
                {habits.length === 0 && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <p>No habits yet. Click "Add New Habit" to get started!</p>
                        </div>
                    </motion.div>
                )}
            </motion.div>
            <HabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
                habit={selectedHabit}
            />
            <ConfirmationModal
                isOpen={!!habitToDeleteId}
                onClose={() => setHabitToDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Habit"
                confirmText="Delete"
            >
                <p>Are you sure you want to delete the habit "<strong>{habitForModal?.name}</strong>"?</p>
                <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
            </ConfirmationModal>
        </>
    );
};

interface HabitCardProps {
    habit: Habit;
    onEdit: () => void;
    onDelete: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onDelete }) => {
    const toggleHabitCompletion = useAppStore(state => state.toggleHabitCompletion);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    const completionsSet = new Set(habit.completions.map(c => new Date(c).toDateString()));

    const handleDayClick = (day: number) => {
        const date = new Date(today.getFullYear(), today.getMonth(), day);
        if (date > today) return; // Prevent marking future dates
        toggleHabitCompletion(habit.id, date.toISOString());
    };
    
    const monthName = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();

    const HabitIcon = Icons[habit.icon as keyof typeof Icons] || Icons.Zap;

    return (
        <Card>
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                         <div className={`${habit.color} p-3 rounded-lg text-white`}>
                           <HabitIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{habit.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak: {habit.streak} days</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="!p-2" onClick={onEdit}>
                            <Icons.Edit className="w-5 h-5"/>
                        </Button>
                        <Button variant="ghost" size="sm" className="!p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" onClick={onDelete}>
                            <Icons.Trash className="w-5 h-5"/>
                        </Button>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{monthName} {year}</h4>
                    </div>
                    <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-xs text-center text-gray-500 dark:text-gray-400 mb-2">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const date = new Date(today.getFullYear(), today.getMonth(), day);
                            const isCompleted = completionsSet.has(date.toDateString());
                            const isCurrentDay = today.toDateString() === date.toDateString();
                            const isFuture = date > today;

                            return (
                                <motion.button
                                    key={day}
                                    onClick={() => handleDayClick(day)}
                                    className={`w-full aspect-square rounded-full flex items-center justify-center text-xs font-semibold
                                        ${isCompleted ? `${habit.color} text-white` : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
                                        ${isCurrentDay && !isCompleted ? 'ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-gray-800' : ''}
                                        ${isFuture ? 'opacity-50 cursor-not-allowed' : 'hover:ring-2 hover:ring-primary'}
                                        transition-all`}
                                    whileHover={!isFuture ? { scale: 1.1 } : {}}
                                    whileTap={!isFuture ? { scale: 0.9 } : {}}
                                    title={date.toDateString()}
                                    disabled={isFuture}
                                >
                                    {day}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default HabitTracker;