

import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { useAppStore } from '../../../store/useAppStore';
import type { Task, TaskPriority } from '../../../types';
import { PRIORITY_STYLES } from '../../../constants';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const updateTask = useAppStore(state => state.updateTask);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      // Ensure dueDate is in YYYY-MM-DD format for the input
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
      setError('');
    }
  }, [task, isOpen]);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!task) return;

    setError('');

    const updatedTaskData: Partial<Task> = {
      title,
      description,
      priority,
      dueDate: dueDate || undefined,
    };

    updateTask(task.id, updatedTaskData);
    onClose();
  };

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Task`}>
      <div className="space-y-4">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full bg-gray-100 dark:bg-gray-700 border rounded-md p-2 focus:ring-primary focus:border-primary ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            placeholder="e.g., Finish project proposal"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
        <div>
          <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="edit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-primary focus:border-primary"
            rows={3}
            placeholder="Add more details about the task..."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              id="edit-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-primary focus:border-primary capitalize"
            >
              {Object.keys(PRIORITY_STYLES).map(p => (
                <option key={p} value={p} className="capitalize">{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="edit-dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="edit-dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2 space-x-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditTaskModal;