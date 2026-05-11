import { Link } from "wouter";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Work } from "@workspace/api-client-react";

interface WorkCardProps {
  work: Work;
}

export function WorkCard({ work }: WorkCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 32 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
      }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        href={`/portfolio/${work.id}`}
        className="group block relative overflow-hidden rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors"
      >
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={work.imageUrl || "https://placehold.co/800x600/1a1a2e/00b4d8?text=Work"}
            alt={work.title}
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <h3 className="text-2xl font-bold text-white mb-2">{work.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-primary font-medium">{work.category?.name}</span>
            <div className="flex items-center gap-1 text-white/80 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-semibold">{work.likes}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
