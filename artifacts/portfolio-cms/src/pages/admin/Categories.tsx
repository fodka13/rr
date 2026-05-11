import { useState } from "react";
import {
  useListCategories, useCreateCategory, useDeleteCategory,
  getListCategoriesQueryKey, Category
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";

interface CategoryForm {
  name: string;
  slug: string;
  type: "work" | "blog" | "all";
}

const EMPTY_FORM: CategoryForm = { name: "", slug: "", type: "work" };

function toSlug(text: string) {
  return text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/gi, "")
    .toLowerCase()
    .slice(0, 60);
}

export default function Categories() {
  const { data, isLoading } = useListCategories();
  const createMutation = useCreateCategory();
  const deleteMutation = useDeleteCategory();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);

  const categories: Category[] = Array.isArray(data) ? data : [];

  const handleNameChange = (name: string) => {
    setForm(f => ({
      ...f,
      name,
      slug: f.slug === toSlug(f.name) || f.slug === "" ? toSlug(name) : f.slug,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      toast({ title: "الرجاء إدخال الاسم والرابط", variant: "destructive" });
      return;
    }
    createMutation.mutate(
      { data: { name: form.name.trim(), slug: form.slug.trim(), type: form.type } },
      {
        onSuccess: () => {
          toast({ title: "تم إضافة التصنيف بنجاح" });
          queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
          setDialogOpen(false);
          setForm(EMPTY_FORM);
        },
        onError: () => toast({ title: "حدث خطأ", variant: "destructive" }),
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا التصنيف؟")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "تم الحذف بنجاح" });
          queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
        },
        onError: () => toast({ title: "حدث خطأ في الحذف", variant: "destructive" }),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إدارة التصنيفات</h1>
        <Button className="gap-2" onClick={() => { setForm(EMPTY_FORM); setDialogOpen(true); }}>
          <Plus className="w-4 h-4" /> تصنيف جديد
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-muted border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-semibold">الاسم</th>
                <th className="px-6 py-4 font-semibold">الرابط</th>
                <th className="px-6 py-4 font-semibold">النوع</th>
                <th className="px-6 py-4 font-semibold w-[80px]">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{cat.name}</td>
                  <td className="px-6 py-4 text-muted-foreground text-sm font-mono" dir="ltr">{cat.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      cat.type === "work" ? "bg-primary/20 text-primary" :
                      cat.type === "blog" ? "bg-purple-500/20 text-purple-400" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {cat.type === "work" ? "أعمال" : cat.type === "blog" ? "مقالات" : "عام"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive" disabled={deleteMutation.isPending}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-muted-foreground">
                    <Tags className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    لا يوجد تصنيفات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border/50" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">إضافة تصنيف جديد</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">الاسم *</Label>
              <Input id="cat-name" value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="مثال: الشعارات" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-slug">الرابط المختصر *</Label>
              <Input id="cat-slug" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="logos" dir="ltr" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-type">النوع *</Label>
              <select
                id="cat-type"
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as "work" | "blog" | "all" }))}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm"
              >
                <option value="work">أعمال</option>
                <option value="blog">مقالات</option>
                <option value="all">عام</option>
              </select>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={createMutation.isPending}>إلغاء</Button>
              <Button type="submit" disabled={createMutation.isPending} className="gap-2">
                {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                إضافة التصنيف
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
