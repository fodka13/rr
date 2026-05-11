import { useListComments, useDeleteComment, useFeatureComment, getListCommentsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Comments() {
  const { data, isLoading } = useListComments();
  const deleteMutation = useDeleteComment();
  const featureMutation = useFeatureComment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا التعليق؟")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "تم الحذف بنجاح" });
          queryClient.invalidateQueries({ queryKey: getListCommentsQueryKey() });
        }
      });
    }
  };

  const handleToggleFeature = (id: number, current: boolean) => {
    featureMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: !current ? "تم التمييز" : "تم إلغاء التمييز" });
        queryClient.invalidateQueries({ queryKey: getListCommentsQueryKey() });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إدارة التعليقات</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.comments?.map((comment) => (
            <div key={comment.id} className={`p-6 rounded-xl border ${comment.isFeatured ? 'border-primary bg-primary/5' : 'border-border/50 bg-card'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="font-bold text-lg">{comment.author?.displayName || comment.author?.username || "مجهول"}</div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleToggleFeature(comment.id, comment.isFeatured)} 
                    className={`h-8 w-8 ${comment.isFeatured ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    <Star className={`w-4 h-4 ${comment.isFeatured ? 'fill-primary' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(comment.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground">{comment.content}</p>
            </div>
          ))}
          {data?.comments?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">لا يوجد تعليقات</div>
          )}
        </div>
      )}
    </div>
  );
}
