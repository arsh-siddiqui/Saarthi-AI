"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="surface group flex flex-col gap-4 p-6 transition-shadow hover:shadow-elevated"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:gradient-brand group-hover:text-white">
        <Icon className="h-6 w-6" strokeWidth={2} />
      </span>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
    </motion.div>
  );
}
