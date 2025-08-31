import React from 'react';
import GreetingWidget from './GreetingWidget';
import StatsWidget from './StatsWidget';
import Card from '../../ui/Card';
import { useAppStore } from '../../../store/useAppStore';
import { Icons } from '../../ui/Icons';
import { motion } from 'framer-motion';
// FIX: Import the Task type to resolve type inference issues.
import type { Task } from '../../../types';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const Dashboard: React.FC = () => {
    const tasks = useAppStore(state => state.kanbanData.tasks);
    const habits = useAppStore(state => state.habits);
    // FIX: Cast Object.values(tasks) to Task[] to ensure `upcomingTasks` is correctly typed. This resolves downstream errors where properties were being accessed on an `unknown` type.
    const upcomingTasks = (Object.values(tasks) as Task[]).filter(t => t.status !== 'completed').slice(0, 3);

    return (
        <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="lg:col-span-3" variants={itemVariants}>
                <GreetingWidget />
            </motion.div>
            
            <motion.div className="lg:col-span-2" variants={itemVariants}>
                <StatsWidget />
            </motion.div>
            
            <motion.div variants={itemVariants}>
                <Card className="h-full">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Tasks</h3>
                        <div className="space-y-4">
                            {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
                                <div key={task.id} className="flex items-start p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                    <Icons.CheckSquare className="w-5 h-5 mt-1 text-primary"/>
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-800 dark:text-gray-100">{task.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{task.description}</p>
                                    </div>
                                </div>
                            )) : <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming tasks. Great job!</p>}
                        </div>
                    </div>
                </Card>
            </motion.div>

            <motion.div className="lg:col-span-3" variants={itemVariants}>
                <Card>
                     <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Habits</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {habits.map(habit => (
                                <div key={habit.id} className={`p-4 rounded-lg flex flex-col items-center justify-center text-center ${habit.color} text-white`}>
                                    <p className="font-bold">{habit.name}</p>
                                    <p className="text-2xl font-black mt-1">{habit.streak}</p>
                                    <p className="text-xs opacity-80">day streak</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;