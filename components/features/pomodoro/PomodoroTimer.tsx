import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTimer } from '../../../hooks/useTimer';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import { Icons } from '../../ui/Icons';
import { useAppStore } from '../../../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';

type SessionType = 'work' | 'shortBreak' | 'longBreak';

const sessionLabels: Record<SessionType, string> = {
  work: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

const PomodoroTimer: React.FC = () => {
  const { pomodoroSettings } = useAppStore();
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [sessionCount, setSessionCount] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const sessionDurations = useMemo(() => ({
    work: pomodoroSettings.work * 60,
    shortBreak: pomodoroSettings.shortBreak * 60,
    longBreak: pomodoroSettings.longBreak * 60,
  }), [pomodoroSettings]);

  const handleSessionComplete = useCallback(() => {
    if (sessionType === 'work') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      if (newCount % 4 === 0) {
        setSessionType('longBreak');
      } else {
        setSessionType('shortBreak');
      }
    } else {
      setSessionType('work');
    }
  }, [sessionType, sessionCount]);

  const { time, isActive, start, pause, reset } = useTimer({
    initialTime: sessionDurations[sessionType],
    onComplete: handleSessionComplete,
  });
  
  useEffect(() => {
    reset(sessionDurations[sessionType]);
  }, [sessionType, sessionDurations, reset]);

  const handleSetSessionType = (type: SessionType) => {
    setSessionType(type);
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  
  const progress = useMemo(() => {
    return (sessionDurations[sessionType] - time) / sessionDurations[sessionType];
  }, [time, sessionType, sessionDurations]);

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md relative transition-colors duration-300">
        <Button variant="ghost" className="absolute top-4 right-4 !p-2" onClick={() => setIsSettingsOpen(true)}>
            <Icons.Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Button>
        <div className="flex justify-center space-x-2 mb-8">
            {Object.keys(sessionLabels).map((type) => (
                <Button
                    key={type}
                    variant={sessionType === type ? 'primary' : 'secondary'}
                    onClick={() => handleSetSessionType(type as SessionType)}
                >
                    {sessionLabels[type as SessionType]}
                </Button>
            ))}
        </div>
        
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto mb-8">
            <svg className="w-full h-full" viewBox="0 0 250 250">
                <circle cx="125" cy="125" r={radius} strokeWidth="10" className="stroke-gray-200 dark:stroke-gray-700" fill="transparent" />
                <motion.circle
                    cx="125"
                    cy="125"
                    r={radius}
                    stroke="#6366f1"
                    strokeWidth="10"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 125 125)"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1 }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={time}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white tracking-tighter"
                    >
                       {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </motion.div>
                </AnimatePresence>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Session {sessionType === 'work' ? sessionCount + 1 : sessionCount}</p>
            </div>
        </div>

        <div className="flex justify-center space-x-4">
            {isActive ? (
                <Button onClick={pause} size="lg" variant="secondary">Pause</Button>
            ) : (
                <Button onClick={start} size="lg">Start</Button>
            )}
            <Button onClick={() => reset(sessionDurations[sessionType])} size="lg" variant="ghost">Reset</Button>
        </div>
      </div>
      <PomodoroSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};


const PomodoroSettingsModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { pomodoroSettings, updatePomodoroSettings } = useAppStore();
    const [settings, setSettings] = useState(pomodoroSettings);
    
    useEffect(() => {
        setSettings(pomodoroSettings);
    }, [pomodoroSettings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: Number(value) < 1 ? 1 : Number(value) }));
    };

    const handleSave = () => {
        updatePomodoroSettings(settings);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Pomodoro Settings">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="work" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Focus (minutes)</label>
                    <input type="number" name="work" id="work" value={settings.work} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-primary focus:border-primary"/>
                </div>
                 <div className="space-y-2">
                    <label htmlFor="shortBreak" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Short Break (minutes)</label>
                    <input type="number" name="shortBreak" id="shortBreak" value={settings.shortBreak} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-primary focus:border-primary"/>
                </div>
                 <div className="space-y-2">
                    <label htmlFor="longBreak" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Long Break (minutes)</label>
                    <input type="number" name="longBreak" id="longBreak" value={settings.longBreak} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-primary focus:border-primary"/>
                </div>
                <Button onClick={handleSave} className="w-full">Save Changes</Button>
            </div>
        </Modal>
    );
};

export default PomodoroTimer;