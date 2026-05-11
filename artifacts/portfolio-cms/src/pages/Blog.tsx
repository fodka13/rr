import { useListBlogs, useListCategories, Category } from "@workspace/api-client-react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { BlogCard } from "@/components/shared/BlogCard";
import { FadeUp } from "@/components/shared/Animate";

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { data: categoriesData } = useListCategories({ type: "blog" });
  const { data: blogsData, isLoading } = useListBlogs({
    categoryId: activeCategory || undefined,
    published: true,
    limit: 20,
  });

  const categories = categoriesData || [];
  const blogs = blogsData?.blogs || [];

  return (
    <div className="min-h-screen bg-background pt-20 pb-20" dir="rtl">
      <div className="bg-card border-b border-border/40 py-16 mb-12">
        <FadeUp className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 uppercase tracking-tighter">المدونة</h1>
          <p className="text-xl text-muted-foreground font-medium">مقالات أسبوعية عن التصميم، الإستراتيجية، وبناء الهويات البصرية.</p>
        </FadeUp>
      </div>

      <div className="container mx-auto px-4">
        <FadeUp delay={0.05} className="flex flex-wrap justify-center gap-2 mb-12">
          <motion.button
            onClick={() => setActiveCategory(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
              activeCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
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
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
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
        ) : blogs.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            animate="show"
            key={activeCategory}
          >
            {blogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} featured={index === 0 && activeCategory === null} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-card rounded-2xl border border-border/50"
          >
            <p className="text-xl text-muted-foreground font-medium">لا توجد مقالات في هذا التصنيف حالياً.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
