import { Link } from "wouter";
import { Clock, Eye } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { motion } from "framer-motion";
import { Blog } from "@workspace/api-client-react";

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

export function BlogCard({ blog, featured = false }: BlogCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 32 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
      }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className={featured ? "md:col-span-2 lg:col-span-2" : ""}
    >
      <Link
        href={`/blog/${blog.id}`}
        className="group block overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all"
      >
        <div className={`relative w-full overflow-hidden ${featured ? "aspect-video md:aspect-[16/7]" : "aspect-video"}`}>
          <img
            src={blog.thumbnailUrl || "https://placehold.co/800x450/1a1a2e/00b4d8?text=Blog"}
            alt={blog.title}
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

          {blog.category && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded bg-primary text-primary-foreground text-xs font-bold shadow-lg">
              {blog.category.name}
            </div>
          )}
        </div>
        <div className={`p-6 ${featured ? "md:p-10" : ""}`}>
          <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium mb-3">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              {format(new Date(blog.publishedAt || blog.createdAt), "dd MMM yyyy", { locale: ar })}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-primary" />
              {blog.viewCount}
            </span>
          </div>
          <h3
            className={`${featured ? "text-3xl md:text-4xl mb-4 leading-tight" : "text-xl mb-3 leading-snug"} font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2`}
          >
            {blog.title}
          </h3>
          <p className={`text-muted-foreground ${featured ? "text-lg line-clamp-3" : "text-sm line-clamp-2"}`}>
            {blog.excerpt || "لا يوجد مقتطف..."}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
