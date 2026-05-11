import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Blog } from "@workspace/api-client-react";
import { FadeUp, StaggerList, StaggerItem } from "@/components/shared/Animate";

interface RecentBlogsSectionProps {
  blogs: Blog[];
}

export function RecentBlogsSection({ blogs }: RecentBlogsSectionProps) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="py-32 bg-card border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-16">
          <FadeUp>
            <h3 className="text-4xl md:text-5xl font-black mb-4 text-foreground">أحدث المقالات</h3>
            <p className="text-xl text-muted-foreground">أفكار ورؤى تصميمية</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline">
              كل المقالات <ArrowLeft className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>

        <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <StaggerItem key={blog.id}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
                <Link
                  href={`/blog/${blog.id}`}
                  className="group block overflow-hidden rounded-2xl bg-background border border-border/50 hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    {blog.thumbnailUrl && (
                      <img
                        src={blog.thumbnailUrl}
                        alt={blog.title}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {blog.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>
                  </div>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
