import { useGetBlog, useLikeBlog, getGetBlogQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Heart, ArrowRight, Loader2, Clock, Eye, User } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CommentSection } from "@/components/shared/CommentSection";
import { FadeUp, ScaleIn } from "@/components/shared/Animate";

export default function BlogDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const blogId = parseInt(id || "0", 10);

  const { data: blog, isLoading } = useGetBlog(blogId, {
    query: { enabled: !!blogId && !isNaN(blogId) } as any,
  });

  const likeMutation = useLikeBlog();

  const handleLike = () => {
    if (!blog) return;
    likeMutation.mutate({ id: blog.id }, {
      onSuccess: (res) => {
        queryClient.setQueryData(getGetBlogQueryKey(blog.id), (old: any) =>
          old ? { ...old, likes: res.likes } : old
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!blog || isNaN(blogId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-destructive mb-4">المقال غير موجود</h1>
          <Link href="/blog" className="text-primary hover:underline">العودة للمدونة</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-24" dir="rtl">
      <div className="relative w-full h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-muted"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <img
            src={blog.thumbnailUrl || "https://placehold.co/1920x1080/1a1a2e/00b4d8?text=Blog"}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10 pb-12 max-w-4xl">
          <FadeUp>
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-bold transition-colors">
              <ArrowRight className="w-5 h-5" />
              العودة للمدونة
            </Link>

            {blog.category && (
              <div className="mb-4">
                <span className="px-4 py-1.5 rounded bg-primary/20 text-primary font-bold text-sm backdrop-blur-md border border-primary/20">
                  {blog.category.name}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-foreground leading-tight mb-6">{blog.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium">
              {blog.author && (
                <span className="flex items-center gap-2 text-foreground">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                    <User className="w-5 h-5" />
                  </div>
                  {blog.author.displayName || blog.author.username}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {format(new Date(blog.publishedAt || blog.createdAt), "dd MMMM yyyy", { locale: ar })}
              </span>
              <span className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                {blog.viewCount} مشاهدة
              </span>
            </div>
          </FadeUp>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl mt-12">
        <ScaleIn>
          <div className="bg-card border border-border/50 rounded-3xl p-8 md:p-12 shadow-xl mb-4">
            {blog.excerpt && (
              <FadeUp>
                <p className="text-2xl text-primary font-medium leading-relaxed mb-10 pb-10 border-b border-border/40">
                  {blog.excerpt}
                </p>
              </FadeUp>
            )}

            <FadeUp delay={0.1}>
              <div className="prose prose-invert prose-lg md:prose-xl max-w-none text-foreground leading-loose">
                {blog.content.split("\n").map((paragraph, i) => {
                  if (!paragraph.trim()) return <br key={i} />;
                  if (paragraph.startsWith("# ")) return <h1 key={i} className="text-4xl font-bold mt-10 mb-6 text-primary">{paragraph.replace("# ", "")}</h1>;
                  if (paragraph.startsWith("## ")) return <h2 key={i} className="text-3xl font-bold mt-10 mb-4 text-white">{paragraph.replace("## ", "")}</h2>;
                  return <p key={i} className="mb-6">{paragraph}</p>;
                })}
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="mt-16 pt-8 border-t border-border/40 flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">هل أعجبك المقال؟</h3>
                <motion.button
                  onClick={handleLike}
                  disabled={likeMutation.isPending}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-6 py-3 rounded-full bg-background border border-border hover:bg-muted transition-colors"
                >
                  <Heart className={`w-6 h-6 ${likeMutation.isPending ? "text-muted" : "text-destructive fill-destructive/20"}`} />
                  <span className="font-bold text-xl">{blog.likes}</span>
                </motion.button>
              </div>
            </FadeUp>

            <CommentSection targetType="blog" targetId={blog.id} />
          </div>
        </ScaleIn>
      </div>
    </div>
  );
}
