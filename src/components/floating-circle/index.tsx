'use client';
/*----Next---*/
import React from 'react';

/*----Framer Motion---*/
import { motion } from 'framer-motion';

type TProps = {
  size: string;
  color: string;
  left: string;
  top: string;
  delay: number;
};

const FloatingCircle: React.FC<TProps> = ({ size, color, left, top, delay }) => {
  return (
    <motion.div
      className={`${size} ${color} absolute rounded-full opacity-20 blur-lg `}
      style={{ left, top }}
      animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
      transition={{ repeat: Infinity, duration: 15, delay }}
    ></motion.div>
  );
};

export default FloatingCircle;
