

import React from 'react';
import type { Task } from '../../../types';
import { motion } from 'framer-motion';
import { PRIORITY_STYLES, STATUS_STYLES } from '../../../constants';
import { Icons } from '../../ui/Icons';
import Button from '../../ui/Button';


interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  onDelete: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onDragEnd, onClick, onDelete }) => {
    const priority = PRIORITY_STYLES[task.priority];
    const status = STATUS_STYLES[task.status];
    const PriorityIcon = priority ? Icons[priority.icon as keyof typeof Icons] : null;

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    }

    // FIX: To avoid type conflicts between Framer Motion's Pan gesture handlers (onDragStart, etc.)
    // and React's native HTML5 drag-and-drop handlers, the draggable props and event listeners
    // are placed on a standard `div` inside the `motion.div`. The parent `motion.div` handles animations.
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            whileHover={{ scale: 1.03, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
            className="relative group"
        >
            <div
                draggable
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onClick={onClick}
                className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-grab hover:cursor-pointer border-l-4 ${status.color} transition-all duration-300`}
            >
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{task.title}</h3>
                {task.description && <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>}
                <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-3 text-xs mt-3">
                    <div className="flex items-center space-x-2">
                        {PriorityIcon && (
                            <div className={`flex items-center gap-1 ${priority.color}`}>
                                <PriorityIcon className="w-4 h-4" />
                                <span className="capitalize">{task.priority}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {task.tags.map(tag => (
                            <span key={tag} className="bg-primary/10 text-primary dark:bg-primary/20 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
             <Button 
                variant="ghost" 
                size="sm" 
                className="!absolute top-2 right-2 !p-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" 
                onClick={handleDeleteClick}
                aria-label="Delete task"
            >
                <Icons.Trash className="w-4 h-4"/>
            </Button>
        </motion.div>
    );
};

export default TaskCard;