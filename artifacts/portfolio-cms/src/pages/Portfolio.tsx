import { useListWorks, useListCategories, Category } from "@workspace/api-client-react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkCard } from "@/components/shared/WorkCard";
import { FadeUp } from "@/components/shared/Animate";

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { data: categoriesData } = useListCategories({ type: "work" });
  const { data: worksData, isLoading } = useListWorks({
    categoryId: activeCategory || undefined,
    limit: 50,
  });

  const categories = categoriesData || [];
  const works = worksData?.works || [];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20" dir="rtl">
      <div className="container mx-auto px-4">
        <FadeUp className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-primary mb-6">معرض الأعمال</h1>
          <p className="text-xl text-muted-foreground">نستعرض هنا بعضاً من أفضل أعمالنا في مجالات التصميم المختلفة.</p>
        </FadeUp>

        <FadeUp delay={0.1} className="flex flex-wrap justify-center gap-3 mb-12">
          <motion.button
            onClick={() => setActiveCategory(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className={`px-6 py-2.5 rounded-full font-bold transition-all ${
              activeCategory === null
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,180,216,0.3)]"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            الكل
          </motion.button>
          {categories.map((cat: Category) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`px-6 py-2.5 rounded-full font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,180,216,0.3)]"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </FadeUp>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : works.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            animate="show"
            key={activeCategory}
          >
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-muted-foreground bg-card rounded-2xl border border-border/50"
          >
            <p className="text-xl">لا توجد أعمال في هذا التصنيف حالياً.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
