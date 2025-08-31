

import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { useAppStore } from '../../../store/useAppStore';
import type { Task, TaskStatus } from '../../../types';
import { motion } from 'framer-motion';
import EditTaskModal from './EditTaskModal';
import ConfirmationModal from '../../ui/ConfirmationModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const KanbanBoard: React.FC = () => {
  const { kanbanData, moveTask, deleteTask } = useAppStore();
  const [draggedItem, setDraggedItem] = React.useState<{ taskId: string; sourceColumnId: TaskStatus; sourceIndex: number } | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
  };
  
  const handleCloseEditModal = () => {
    setEditingTask(null);
  };
  
  const handleDeleteRequest = (taskId: string) => {
    const task = kanbanData.tasks[taskId];
    if (task) {
        setTaskToDelete(task);
    }
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string, sourceColumnId: TaskStatus, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedItem({ taskId, sourceColumnId, sourceIndex: index });
    // For a better visual cue
    setTimeout(() => {
        if (e.target instanceof HTMLElement) {
             e.target.style.opacity = '0.5';
        }
    }, 0);
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '1';
    }
    setDraggedItem(null);
  };

  const handleDrop = (destColumnId: TaskStatus, destIndex: number) => {
    if (!draggedItem) return;

    const { taskId, sourceColumnId, sourceIndex } = draggedItem;
    if (sourceColumnId === destColumnId && sourceIndex === destIndex) {
        return;
    }
    
    moveTask(taskId, sourceColumnId, destColumnId, sourceIndex, destIndex);
  };


  return (
    <>
      <motion.div 
        className="flex gap-4 sm:gap-6 h-full w-full overflow-x-auto pb-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {kanbanData.columnOrder.map((columnId) => {
          const column = kanbanData.columns[columnId];
          const tasks = column.taskIds.map((taskId) => kanbanData.tasks[taskId]);
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasks}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onTaskClick={handleTaskClick}
              onTaskDelete={handleDeleteRequest}
            />
          );
        })}
      </motion.div>
      <EditTaskModal
        isOpen={!!editingTask}
        onClose={handleCloseEditModal}
        task={editingTask}
      />
      <ConfirmationModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Task"
        confirmText="Delete"
      >
        <p>Are you sure you want to delete the task "<strong>{taskToDelete?.title}</strong>"?</p>
        <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
      </ConfirmationModal>
    </>
  );
};

export default KanbanBoard;