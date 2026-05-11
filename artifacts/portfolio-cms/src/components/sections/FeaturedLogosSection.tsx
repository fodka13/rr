import { motion } from "framer-motion";
import { Work } from "@workspace/api-client-react";
import { FadeUp, StaggerList } from "@/components/shared/Animate";

interface FeaturedLogosSectionProps {
  logos: Work[];
}

export function FeaturedLogosSection({ logos }: FeaturedLogosSectionProps) {
  if (!logos || logos.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <FadeUp>
          <h3 className="text-center text-sm font-bold text-muted-foreground tracking-widest uppercase mb-10">
            شركاء النجاح
          </h3>
        </FadeUp>

        <StaggerList
          fast
          className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
        >
          {logos.map((logo) => (
            <motion.div
              key={logo.id}
              className="w-32 h-32 flex items-center justify-center"
              variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4 } } }}
              whileHover={{ scale: 1.1 }}
            >
              <img src={logo.imageUrl} alt={logo.title} className="max-w-full max-h-full object-contain" />
            </motion.div>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
