import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/50 rounded-lg shadow-lg shadow-gray-400/10 dark:shadow-black/20 overflow-hidden transition-colors duration-300 ${className}`}
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.06)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;