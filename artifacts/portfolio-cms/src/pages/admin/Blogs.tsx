import { useState } from "react";
import {
  useListBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog,
  useListCategories, getListBlogsQueryKey, Blog, Category
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, Edit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";

interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  categoryId: string;
  isPublished: boolean;
}

const EMPTY_FORM: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  thumbnailUrl: "",
  categoryId: "",
  isPublished: false,
};

function blogToForm(blog: Blog): BlogForm {
  return {
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt || "",
    content: blog.content,
    thumbnailUrl: blog.thumbnailUrl || "",
    categoryId: blog.categoryId ? String(blog.categoryId) : "",
    isPublished: blog.isPublished || false,
  };
}

function toSlug(text: string) {
  return text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/gi, "")
    .toLowerCase()
    .slice(0, 80);
}

export default function Blogs() {
  const { data, isLoading } = useListBlogs({ limit: 100 });
  const { data: categoriesData } = useListCategories({ type: "blog" });
  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();
  const deleteMutation = useDeleteBlog();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [form, setForm] = useState<BlogForm>(EMPTY_FORM);

  const categories: Category[] = Array.isArray(categoriesData) ? categoriesData : [];
  const blogs = data?.blogs || [];

  const openCreate = () => {
    setEditingBlog(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setForm(blogToForm(blog));
    setDialogOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setForm(f => ({
      ...f,
      title,
      slug: f.slug === toSlug(f.title) || f.slug === "" ? toSlug(title) : f.slug,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      toast({ title: "الرجاء إدخال العنوان والمحتوى", variant: "destructive" });
      return;
    }

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim() || undefined,
      content: form.content.trim(),
      thumbnailUrl: form.thumbnailUrl.trim() || undefined,
      categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
      isPublished: form.isPublished,
    };

    if (editingBlog) {
      updateMutation.mutate({ id: editingBlog.id, data: payload }, {
        onSuccess: () => {
          toast({ title: "تم تحديث المقال بنجاح" });
          queryClient.invalidateQueries({ queryKey: getListBlogsQueryKey() });
          setDialogOpen(false);
        },
        onError: () => toast({ title: "حدث خطأ", variant: "destructive" }),
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "تم إضافة المقال بنجاح" });
          queryClient.invalidateQueries({ queryKey: getListBlogsQueryKey() });
          setDialogOpen(false);
        },
        onError: () => toast({ title: "حدث خطأ", variant: "destructive" }),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "تم الحذف بنجاح" });
          queryClient.invalidateQueries({ queryKey: getListBlogsQueryKey() });
        },
        onError: () => toast({ title: "حدث خطأ في الحذف", variant: "destructive" }),
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إدارة المقالات</h1>
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="w-4 h-4" /> مقال جديد
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
                <th className="px-6 py-4 font-semibold">العنوان</th>
                <th className="px-6 py-4 font-semibold hidden md:table-cell">التصنيف</th>
                <th className="px-6 py-4 font-semibold">الحالة</th>
                <th className="px-6 py-4 font-semibold hidden md:table-cell">التاريخ</th>
                <th className="px-6 py-4 font-semibold w-[100px]">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium max-w-[220px] truncate">{blog.title}</td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{blog.category?.name || "-"}</td>
                  <td className="px-6 py-4">
                    {blog.isPublished ? (
                      <span className="px-2.5 py-1 rounded bg-primary/20 text-primary text-xs font-bold">منشور</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-muted text-muted-foreground text-xs font-bold">مسودة</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm hidden md:table-cell">
                    {format(new Date(blog.createdAt), "dd MMM yyyy", { locale: ar })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(blog)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(blog.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive" disabled={deleteMutation.isPending}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    لا توجد مقالات بعد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border/50 max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingBlog ? "تعديل المقال" : "مقال جديد"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="b-title">العنوان *</Label>
              <Input id="b-title" value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="عنوان المقال" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="b-slug">الرابط المختصر *</Label>
              <Input id="b-slug" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="article-slug" dir="ltr" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="b-thumb">رابط الصورة المصغرة</Label>
              <Input id="b-thumb" value={form.thumbnailUrl} onChange={e => setForm(f => ({ ...f, thumbnailUrl: e.target.value }))} placeholder="https://..." dir="ltr" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="b-cat">التصنيف</Label>
              <select
                id="b-cat"
                value={form.categoryId}
                onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm"
              >
                <option value="">بدون تصنيف</option>
                {categories.map(cat => (
                  <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="b-excerpt">المقتطف</Label>
              <Textarea id="b-excerpt" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="وصف مختصر..." className="min-h-[80px]" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="b-content">المحتوى *</Label>
              <Textarea id="b-content" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="محتوى المقال كاملاً..." className="min-h-[200px]" required />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <span className="text-sm font-medium">نشر المقال فوراً</span>
            </label>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isSaving}>إلغاء</Button>
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingBlog ? "حفظ التعديلات" : "نشر المقال"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
