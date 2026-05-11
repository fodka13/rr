import { useState } from "react";
import { useListComments, useCreateComment, getListCommentsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { MessageSquare, Loader2, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface CommentSectionProps {
  targetType: "blog" | "work";
  targetId: number;
}

export function CommentSection({ targetType, targetId }: CommentSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const { data, isLoading } = useListComments(
    { targetType, targetId },
    { query: { enabled: !!targetId } as any }
  );

  const createMutation = useCreateComment();

  const comments = data?.comments || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createMutation.mutate(
      { data: { content: content.trim(), targetType, targetId } },
      {
        onSuccess: () => {
          setContent("");
          toast({ title: "تم إضافة التعليق بنجاح" });
          queryClient.invalidateQueries({
            queryKey: getListCommentsQueryKey({ targetType, targetId }),
          });
        },
        onError: () => {
          toast({ title: "حدث خطأ", description: "تعذّر إرسال التعليق", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="mt-12 pt-12 border-t border-border/40">
      <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-primary" />
        التعليقات
        {comments.length > 0 && (
          <span className="text-base font-normal text-muted-foreground">({comments.length})</span>
        )}
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shrink-0 mt-1">
              <span className="font-bold text-sm">
                {(user.displayName || user.username)?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
            <div className="flex-1 space-y-3">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="اكتب تعليقك هنا..."
                className="bg-card border-border/50 focus:border-primary resize-none min-h-[100px] text-base"
                dir="rtl"
                disabled={createMutation.isPending}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!content.trim() || createMutation.isPending}
                  className="gap-2"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  إرسال التعليق
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-6 bg-card border border-border/50 rounded-2xl text-center">
          <User className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4 font-medium">سجّل الدخول للمشاركة في النقاش</p>
          <Link href="/auth/login">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              تسجيل الدخول
            </Button>
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-2xl border border-border/30">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>لا توجد تعليقات بعد. كن أول من يعلّق!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                <span className="font-bold text-sm">
                  {(comment.author?.displayName || comment.author?.username)?.[0]?.toUpperCase() || "؟"}
                </span>
              </div>
              <div className="flex-1 bg-card border border-border/50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-foreground">
                    {comment.author?.displayName || comment.author?.username || "مجهول"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(comment.createdAt), "dd MMM yyyy", { locale: ar })}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
