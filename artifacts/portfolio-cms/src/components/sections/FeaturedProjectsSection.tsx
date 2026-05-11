import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Work } from "@workspace/api-client-react";
import { FadeUp, StaggerList } from "@/components/shared/Animate";

interface FeaturedProjectsSectionProps {
  projects: Work[];
}

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-32 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-16">
          <FadeUp>
            <h3 className="text-4xl md:text-5xl font-black mb-4 text-foreground">أعمال مميزة</h3>
            <p className="text-xl text-muted-foreground">مشاريع نعتز بها</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link href="/portfolio" className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline">
              كل الأعمال <ArrowLeft className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>

        <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((work) => (
            <motion.div
              key={work.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
              }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <Link
                href={`/portfolio/${work.id}`}
                className="group block relative overflow-hidden rounded-3xl bg-background border border-border/50"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="text-3xl font-bold text-white mb-2">{work.title}</h4>
                  <p className="text-primary font-medium">{work.category?.name}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
