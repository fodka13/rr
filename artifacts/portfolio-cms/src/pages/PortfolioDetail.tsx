import { useGetWork, useLikeWork, getGetWorkQueryKey, WorkMediaItem } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Heart, ArrowRight, Loader2, Calendar, Tag, FolderOpen } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CommentSection } from "@/components/shared/CommentSection";
import { ImageGallery } from "@/components/shared/ImageGallery";
import { FadeUp } from "@/components/shared/Animate";

export default function PortfolioDetail() {
  const { id } = useParams();
  const workId = parseInt(id || "0", 10);
  const queryClient = useQueryClient();

  const { data: work, isLoading } = useGetWork(workId, {
    query: { enabled: !!workId } as any,
  });

  const likeMutation = useLikeWork();

  const handleLike = () => {
    if (!work) return;
    likeMutation.mutate({ id: workId }, {
      onSuccess: (res) => {
        queryClient.setQueryData(getGetWorkQueryKey(workId), (old: any) =>
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

  if (!work) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-destructive mb-4">العمل غير موجود</h1>
          <Link href="/portfolio" className="text-primary hover:underline">العودة للمعرض</Link>
        </div>
      </div>
    );
  }

  const mediaItems = (work.images || []) as WorkMediaItem[];

  return (
    <div className="bg-background min-h-screen" dir="rtl">
      <motion.div
        className="relative w-full bg-muted overflow-hidden"
        style={{ maxHeight: "85vh" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={work.imageUrl || "https://placehold.co/1920x1080/0a1628/00b4d8?text=Work"}
          alt={work.title}
          className="w-full h-full object-cover"
          style={{ maxHeight: "85vh" }}
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        <div className="absolute bottom-0 right-0 left-0 p-8 md:p-12">
          <FadeUp>
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 font-medium">
              <Link href="/" className="hover:text-foreground transition-colors">الرئيسية</Link>
              <span>/</span>
              <Link href="/portfolio" className="hover:text-foreground transition-colors">الأعمال</Link>
              <span>/</span>
              <span className="text-foreground">{work.title}</span>
            </nav>

            {work.category && (
              <span className="inline-block mb-4 px-4 py-1.5 rounded bg-primary/20 text-primary font-bold text-sm backdrop-blur-md border border-primary/20">
                {work.category.name}
              </span>
            )}

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
              {work.title}
            </h1>
          </FadeUp>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 max-w-5xl pt-16 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          <FadeUp className="lg:col-span-2">
            <h2 className="text-2xl font-black text-foreground mb-6 pb-4 border-b border-border/40">
              عن المشروع
            </h2>
            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed">
              {work.description ? (
                work.description.split("\n").map((paragraph, i) => {
                  if (!paragraph.trim()) return <br key={i} />;
                  return <p key={i} className="mb-5 text-lg">{paragraph}</p>;
                })
              ) : (
                <p className="text-lg text-muted-foreground/60 italic">لا يوجد وصف متاح لهذا العمل.</p>
              )}
            </div>
          </FadeUp>

          <FadeUp delay={0.15} className="space-y-6">
            <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-black text-foreground pb-3 border-b border-border/40">
                تفاصيل المشروع
              </h3>

              {work.category && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <FolderOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-1">التصنيف</p>
                    <p className="font-bold text-foreground">{work.category.name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-1">التاريخ</p>
                  <p className="font-bold text-foreground">
                    {format(new Date(work.createdAt), "MMMM yyyy", { locale: ar })}
                  </p>
                </div>
              </div>

              {work.tags && work.tags.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Tag className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-2">الخدمات</p>
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map((tag, idx) => (
                        <motion.span
                          key={idx}
                          className="px-3 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-semibold"
                          initial={{ opacity: 0, scale: 0.85 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05, duration: 0.3 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-border/40">
                <motion.button
                  onClick={handleLike}
                  disabled={likeMutation.isPending}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-muted hover:bg-muted/80 border border-border transition-colors"
                >
                  <Heart className={`w-5 h-5 ${likeMutation.isPending ? "text-muted-foreground" : "text-destructive fill-destructive/20"}`} />
                  <span className="font-bold text-lg">{work.likes}</span>
                  <span className="text-muted-foreground text-sm">إعجاب</span>
                </motion.button>
              </div>
            </div>

            <Link
              href="/portfolio"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              العودة لمعرض الأعمال
            </Link>
          </FadeUp>
        </div>

        <ImageGallery images={mediaItems} />

        <div className="mt-20 pt-12 border-t border-border/40">
          <CommentSection targetType="work" targetId={work.id} />
        </div>
      </div>
    </div>
  );
}
