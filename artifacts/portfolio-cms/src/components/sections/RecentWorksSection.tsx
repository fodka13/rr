import { Link } from "wouter";
import { Work } from "@workspace/api-client-react";
import { FadeUp, StaggerList, StaggerItem } from "@/components/shared/Animate";
import { motion } from "framer-motion";

interface RecentWorksSectionProps {
  works: Work[];
}

export function RecentWorksSection({ works }: RecentWorksSectionProps) {
  return (
    <section className="py-32 bg-background border-t border-border/40">
      <div className="container mx-auto px-4">
        <FadeUp className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-black mb-4 text-foreground">أحدث الإبداعات</h3>
        </FadeUp>

        <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <StaggerItem key={work.id}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
                <Link
                  href={`/portfolio/${work.id}`}
                  className="group block overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={work.imageUrl}
                      alt={work.title}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {work.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{work.category?.name}</p>
                  </div>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerList>

        <FadeUp className="text-center mt-12">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-card border border-border hover:bg-muted font-bold transition-colors"
          >
            عرض المزيد
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
