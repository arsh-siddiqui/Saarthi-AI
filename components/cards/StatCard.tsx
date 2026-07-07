"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
  delay?: number;
}

import { memo } from "react";

export default memo(function StatCard({ value, label, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="surface flex flex-col items-center px-6 py-5 text-center"
    >
      <span className="font-display text-3xl font-semibold gradient-text">
        {value}
      </span>
      <span className="mt-1 text-sm text-muted">{label}</span>
    </motion.div>
  );
});
