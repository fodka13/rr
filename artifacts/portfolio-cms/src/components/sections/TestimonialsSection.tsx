import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Comment } from "@workspace/api-client-react";
import { FadeUp, StaggerList } from "@/components/shared/Animate";

interface TestimonialsSectionProps {
  comments: Comment[];
}

export function TestimonialsSection({ comments }: TestimonialsSectionProps) {
  if (!comments || comments.length === 0) return null;

  return (
    <section className="py-32 bg-background border-t border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <FadeUp className="mb-16 text-center">
          <h3 className="text-4xl md:text-5xl font-black text-foreground">قالوا عنا</h3>
        </FadeUp>

        <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
              }}
              whileHover={{ y: -5, borderColor: "rgba(0,180,216,0.3)" }}
              transition={{ duration: 0.25 }}
              className="bg-card p-8 rounded-3xl border border-border/50 relative"
            >
              <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/10" />
              <p className="text-lg leading-relaxed text-muted-foreground mb-8 relative z-10">
                "{comment.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl border border-primary/30">
                  {comment.author?.displayName?.[0] || comment.author?.username?.[0] || "?"}
                </div>
                <div>
                  <div className="font-bold text-foreground">
                    {comment.author?.displayName || comment.author?.username || "مجهول"}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    عميل مميز
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
