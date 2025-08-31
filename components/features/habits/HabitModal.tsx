import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { useAppStore } from '../../../store/useAppStore';
import type { Habit } from '../../../types';
import { HABIT_COLORS, HABIT_ICONS } from '../../../constants';
import { Icons } from '../../ui/Icons';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  habit: Habit | null;
}

const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, mode, habit }) => {
  const { addHabit, updateHabit } = useAppStore();
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [color, setColor] = useState(HABIT_COLORS[0]);
  const [icon, setIcon] = useState(HABIT_ICONS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && habit) {
        setName(habit.name);
        setFrequency(habit.frequency);
        setColor(habit.color);
        setIcon(habit.icon);
      } else {
        // Reset for 'add' mode
        setName('');
        setFrequency('daily');
        setColor(HABIT_COLORS[5]); // Default to blue
        setIcon(HABIT_ICONS[0]);
      }
      setError('');
    }
  }, [isOpen, mode, habit]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Habit name is required.');
      return;
    }
    setError('');

    if (mode === 'edit' && habit) {
      updateHabit(habit.id, { name, frequency, color, icon });
    } else {
      addHabit({ name, frequency, color, icon });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Add New Habit' : 'Edit Habit'}>
      <div className="space-y-6">
        <div>
          <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Habit Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="habit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full bg-gray-100 dark:bg-gray-700 border rounded-md p-2 focus:ring-primary focus:border-primary ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            placeholder="e.g., Read for 30 minutes"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {HABIT_COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full ${c} transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-gray-800' : ''}`} />
            ))}
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Icon
          </label>
           <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
             {HABIT_ICONS.map(iconName => {
               const IconComponent = Icons[iconName as keyof typeof Icons];
               return (
                 <button key={iconName} onClick={() => setIcon(iconName)} className={`flex items-center justify-center w-full aspect-square rounded-lg transition-colors ${icon === iconName ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    <IconComponent className="w-5 h-5" />
                 </button>
               );
             })}
           </div>
        </div>

        <div className="flex justify-end pt-2 space-x-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>{mode === 'add' ? 'Add Habit' : 'Save Changes'}</Button>
        </div>
      </div>
    </Modal>
  );
};

export default HabitModal;