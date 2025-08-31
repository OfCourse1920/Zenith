import React from 'react';
import Card from '../../ui/Card';
import { useAppStore } from '../../../store/useAppStore';
import { Icons } from '../../ui/Icons';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
    const { theme, setTheme } = useAppStore();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h2>
            <Card>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Appearance</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Customize the look and feel of the app.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Icons.Sun className="w-6 h-6 text-yellow-500" />
                            <button
                                onClick={toggleTheme}
                                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-300 dark:bg-gray-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                role="switch"
                                aria-checked={theme === 'dark'}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}
                                />
                            </button>
                            <Icons.Moon className="w-5 h-5 text-indigo-400" />
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default Settings;
