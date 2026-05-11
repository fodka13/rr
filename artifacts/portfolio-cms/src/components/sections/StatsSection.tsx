import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StaggerList, StaggerItem, FadeUp } from "@/components/shared/Animate";

function AnimatedCounter({ end, label }: { end: number; label: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 bg-card rounded-2xl border border-border/50 shadow-2xl relative overflow-hidden group"
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,180,216,0.12)" }}
      transition={{ duration: 0.25 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="text-5xl md:text-7xl font-black text-primary mb-4 tracking-tighter relative z-10">
        +{count}
      </span>
      <span className="text-lg md:text-xl font-medium text-muted-foreground relative z-10">{label}</span>
    </motion.div>
  );
}

interface StatsSectionProps {
  visitorCount: number;
  worksCount: number;
  topClientsCount: number;
  partnersCount: number;
}

export function StatsSection({ visitorCount, worksCount, topClientsCount, partnersCount }: StatsSectionProps) {
  return (
    <section className="py-24 bg-card relative z-20 border-y border-border/40">
      <div className="container mx-auto px-4">
        <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StaggerItem><AnimatedCounter end={visitorCount} label="عدد الزوار" /></StaggerItem>
          <StaggerItem><AnimatedCounter end={worksCount} label="عدد الأعمال" /></StaggerItem>
          <StaggerItem><AnimatedCounter end={topClientsCount} label="عملاء مميزين" /></StaggerItem>
          <StaggerItem><AnimatedCounter end={partnersCount} label="شركاء نجاح" /></StaggerItem>
        </StaggerList>
      </div>
    </section>
  );
}
