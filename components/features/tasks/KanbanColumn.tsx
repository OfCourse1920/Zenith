

import React, { useState } from 'react';
import type { Column, Task, TaskStatus } from '../../../types';
import TaskCard from './TaskCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../../ui/Icons';
import Button from '../../ui/Button';
import AddTaskModal from './AddTaskModal';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, sourceColumnId: TaskStatus, index: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (destColumnId: TaskStatus, destIndex: number) => void;
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

const columnVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, tasks, onDragStart, onDragEnd, onDrop, onTaskClick, onTaskDelete }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        onDrop(column.id, tasks.length);
    };

    return (
        <>
            <motion.div 
                className="flex flex-col w-[80vw] sm:w-80 flex-shrink-0"
                variants={columnVariants}
            >
                <div className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-800 rounded-t-lg">
                    <h2 className="font-semibold text-gray-900 dark:text-white">{column.title}</h2>
                    <span className="text-sm font-medium bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-full px-2 py-0.5">
                        {tasks.length}
                    </span>
                </div>
                <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex-1 p-2 bg-gray-200/50 dark:bg-gray-800/50 rounded-b-lg space-y-3 transition-colors ${isDragOver ? 'bg-primary/10' : ''}`}
                    style={{minHeight: '200px'}}
                >
                    <AnimatePresence>
                        {tasks.map((task, index) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onDragStart={(e) => onDragStart(e, task.id, column.id, index)}
                                onDragEnd={onDragEnd}
                                onClick={() => onTaskClick(task)}
                                onDelete={() => onTaskDelete(task.id)}
                            />
                        ))}
                    </AnimatePresence>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setIsModalOpen(true)}>
                        <Icons.Plus className="w-4 h-4 mr-2" />
                        Add Task
                    </Button>
                </div>
            </motion.div>
            <AddTaskModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                columnId={column.id} 
            />
        </>
    );
};

export default KanbanColumn;