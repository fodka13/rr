import { useState, useRef } from "react";
import {
  useListWorks, useCreateWork, useUpdateWork, useDeleteWork,
  useListCategories, getListWorksQueryKey, Category, Work, WorkMediaItem
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Loader2, Plus, Trash2, Edit, Star, Image as ImageIcon, X,
  Upload, Video, FileImage, GripVertical, ChevronUp, ChevronDown, Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";

interface WorkForm {
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  categoryId: string;
  tags: string;
  isFeatured: boolean;
  isFeaturedLogo: boolean;
  images: WorkMediaItem[];
}

const EMPTY_FORM: WorkForm = {
  title: "",
  description: "",
  imageUrl: "",
  thumbnailUrl: "",
  categoryId: "",
  tags: "",
  isFeatured: false,
  isFeaturedLogo: false,
  images: [],
};

function workToForm(work: Work): WorkForm {
  return {
    title: work.title,
    description: work.description || "",
    imageUrl: work.imageUrl || "",
    thumbnailUrl: work.thumbnailUrl || "",
    categoryId: work.categoryId ? String(work.categoryId) : "",
    tags: (work.tags || []).join(", "),
    isFeatured: work.isFeatured || false,
    isFeaturedLogo: work.isFeaturedLogo || false,
    images: (work.images || []) as WorkMediaItem[],
  };
}

async function uploadFile(file: File): Promise<string> {
  const res = await fetch("/api/storage/uploads/request-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type || "application/octet-stream" }),
  });
  if (!res.ok) throw new Error("فشل في الحصول على رابط الرفع");
  const { uploadURL, objectPath } = await res.json();
  const uploadRes = await fetch(uploadURL, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "application/octet-stream" },
  });
  if (!uploadRes.ok) throw new Error("فشل في رفع الملف");
  return `/api/storage${objectPath}`;
}

function MediaItemEditor({
  item,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  item: WorkMediaItem;
  index: number;
  total: number;
  onChange: (updated: WorkMediaItem) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const isVideo = item.type === "video" || item.url.match(/\.(mp4|webm|ogg|mov)$/i);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const type = file.type.startsWith("video/") ? "video" : "image";
      const url = await uploadFile(file);
      onChange({ ...item, url, type });
    } catch (err) {
      toast({ title: "خطأ في الرفع", description: (err as Error).message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-background border border-border/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
          وسيط {index + 1}
        </span>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onMoveUp} disabled={index === 0}
            className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button type="button" onClick={onMoveDown} disabled={index === total - 1}
            className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded">
            <ChevronDown className="w-4 h-4" />
          </button>
          <select
            value={item.type}
            onChange={e => onChange({ ...item, type: e.target.value as "image" | "video" })}
            className="text-xs h-7 px-2 rounded border border-border bg-muted text-foreground"
          >
            <option value="image">صورة</option>
            <option value="video">فيديو</option>
          </select>
          <button type="button" onClick={onRemove}
            className="p-1 text-muted-foreground hover:text-destructive rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setUrlMode(false)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-bold transition-colors ${!urlMode ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          <Upload className="w-3.5 h-3.5" /> رفع ملف
        </button>
        <button
          type="button"
          onClick={() => setUrlMode(true)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-bold transition-colors ${urlMode ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          <LinkIcon className="w-3.5 h-3.5" /> رابط URL
        </button>
      </div>

      {urlMode ? (
        <Input
          value={item.url}
          onChange={e => onChange({ ...item, url: e.target.value })}
          placeholder="https://..."
          dir="ltr"
          className="text-sm"
        />
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept={item.type === "video" ? "video/*" : "image/*,video/*"}
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary rounded-lg p-4 transition-colors text-muted-foreground hover:text-foreground"
          >
            {uploading ? (
              <><Loader2 className="w-6 h-6 animate-spin text-primary" /><span className="text-sm">جاري الرفع...</span></>
            ) : item.url ? (
              <><FileImage className="w-5 h-5 text-primary" /><span className="text-xs text-primary font-bold">تم الرفع — انقر للتغيير</span></>
            ) : (
              <>
                {item.type === "video" ? <Video className="w-8 h-8" /> : <FileImage className="w-8 h-8" />}
                <span className="text-sm font-medium">انقر لاختيار {item.type === "video" ? "فيديو" : "صورة"}</span>
                <span className="text-xs">PNG, JPG, WebP, MP4, WebM</span>
              </>
            )}
          </button>
        </>
      )}

      {item.url && !uploading && (
        <div className="w-full rounded-lg overflow-hidden bg-muted max-h-40">
          {isVideo ? (
            <video src={item.url} className="w-full max-h-40 object-contain" muted />
          ) : (
            <img src={item.url} alt="" className="w-full max-h-40 object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
          )}
        </div>
      )}

      <div>
        <Input
          value={item.caption}
          onChange={e => onChange({ ...item, caption: e.target.value })}
          placeholder="تعليق أو وصف لهذا الوسيط..."
          className="text-sm"
        />
      </div>
    </div>
  );
}

function MediaGalleryEditor({
  items,
  onChange,
}: {
  items: WorkMediaItem[];
  onChange: (items: WorkMediaItem[]) => void;
}) {
  const addItem = (type: "image" | "video" = "image") => {
    onChange([...items, { url: "", caption: "", type }]);
  };

  const updateItem = (idx: number, updated: WorkMediaItem) => {
    const next = [...items];
    next[idx] = updated;
    onChange(next);
  };

  const removeItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...items];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  };

  const moveDown = (idx: number) => {
    if (idx === items.length - 1) return;
    const next = [...items];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <MediaItemEditor
            key={idx}
            item={item}
            index={idx}
            total={items.length}
            onChange={updated => updateItem(idx, updated)}
            onRemove={() => removeItem(idx)}
            onMoveUp={() => moveUp(idx)}
            onMoveDown={() => moveDown(idx)}
          />
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl border-2 border-dashed border-border/50">
            <FileImage className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">أضف صوراً وفيديوهات لعرضها في صفحة المشروع</p>
            <p className="text-xs mt-1 text-muted-foreground">يُنصح بإضافة 10 وسائط على الأقل للمشاريع الكاملة</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => addItem("image")} className="flex-1 gap-2 text-sm">
          <FileImage className="w-4 h-4" /> إضافة صورة
        </Button>
        <Button type="button" variant="outline" onClick={() => addItem("video")} className="flex-1 gap-2 text-sm">
          <Video className="w-4 h-4" /> إضافة فيديو
        </Button>
      </div>

      {items.length > 0 && items.length < 10 && (
        <p className="text-xs text-amber-500 text-center font-medium">
          لديك {items.length} وسائط — يُنصح بإضافة {10 - items.length} أخرى على الأقل لعرض أفضل
        </p>
      )}
      {items.length >= 10 && (
        <p className="text-xs text-green-500 text-center font-medium">
          ✓ {items.length} وسائط — عرض متكامل
        </p>
      )}
    </div>
  );
}

function CoverImageUploader({
  url,
  onChange,
}: {
  url: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const uploaded = await uploadFile(file);
      onChange(uploaded);
    } catch (err) {
      toast({ title: "خطأ في الرفع", description: (err as Error).message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setUrlMode(false)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-bold transition-colors ${!urlMode ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          <Upload className="w-3.5 h-3.5" /> رفع ملف
        </button>
        <button
          type="button"
          onClick={() => setUrlMode(true)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-bold transition-colors ${urlMode ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          <LinkIcon className="w-3.5 h-3.5" /> رابط URL
        </button>
      </div>

      {urlMode ? (
        <Input
          value={url}
          onChange={e => onChange(e.target.value)}
          placeholder="https://..."
          dir="ltr"
          required
        />
      ) : (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary rounded-lg p-6 transition-colors"
          >
            {uploading ? (
              <><Loader2 className="w-8 h-8 animate-spin text-primary" /><span>جاري الرفع...</span></>
            ) : url ? (
              <><FileImage className="w-6 h-6 text-primary" /><span className="text-sm text-primary font-bold">تم الرفع — انقر للتغيير</span></>
            ) : (
              <><FileImage className="w-10 h-10 text-muted-foreground" /><span className="text-sm font-medium text-muted-foreground">انقر لرفع صورة الغلاف *</span></>
            )}
          </button>
        </>
      )}

      {url && (
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
          <img src={url} alt="preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
        </div>
      )}
    </div>
  );
}

export default function Works() {
  const { data, isLoading } = useListWorks({ limit: 100 });
  const { data: categoriesData } = useListCategories({ type: "work" });
  const createMutation = useCreateWork();
  const updateMutation = useUpdateWork();
  const deleteMutation = useDeleteWork();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [form, setForm] = useState<WorkForm>(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState<"basic" | "gallery">("basic");

  const categories: Category[] = Array.isArray(categoriesData) ? categoriesData : [];
  const works = data?.works || [];

  const openCreate = () => {
    setEditingWork(null);
    setForm(EMPTY_FORM);
    setActiveTab("basic");
    setDialogOpen(true);
  };

  const openEdit = (work: Work) => {
    setEditingWork(work);
    setForm(workToForm(work));
    setActiveTab("basic");
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.imageUrl.trim()) {
      toast({ title: "الرجاء إدخال العنوان وصورة الغلاف", variant: "destructive" });
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      imageUrl: form.imageUrl.trim(),
      thumbnailUrl: form.thumbnailUrl.trim() || form.imageUrl.trim(),
      images: form.images.filter(m => m.url.trim()),
      categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : undefined,
      isFeatured: form.isFeatured,
      isFeaturedLogo: form.isFeaturedLogo,
    };

    if (editingWork) {
      updateMutation.mutate({ id: editingWork.id, data: payload }, {
        onSuccess: () => {
          toast({ title: "تم تحديث العمل بنجاح" });
          queryClient.invalidateQueries({ queryKey: getListWorksQueryKey() });
          setDialogOpen(false);
        },
        onError: () => toast({ title: "حدث خطأ", variant: "destructive" }),
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "تم إضافة العمل بنجاح" });
          queryClient.invalidateQueries({ queryKey: getListWorksQueryKey() });
          setDialogOpen(false);
        },
        onError: () => toast({ title: "حدث خطأ", variant: "destructive" }),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا العمل؟")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "تم الحذف بنجاح" });
          queryClient.invalidateQueries({ queryKey: getListWorksQueryKey() });
        },
        onError: () => toast({ title: "حدث خطأ في الحذف", variant: "destructive" }),
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const mediaCount = form.images.filter(m => m.url.trim()).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إدارة الأعمال</h1>
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="w-4 h-4" /> إضافة عمل جديد
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <div key={work.id} className="bg-card border border-border/50 rounded-xl overflow-hidden group">
              <div className="aspect-video relative bg-muted">
                {work.imageUrl ? (
                  <img src={work.imageUrl} className="w-full h-full object-cover" alt={work.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {work.isFeatured && (
                    <span className="px-2 py-0.5 rounded bg-primary/90 text-primary-foreground text-xs font-bold">مميز</span>
                  )}
                  {work.isFeaturedLogo && (
                    <span className="px-2 py-0.5 rounded bg-yellow-500/90 text-yellow-950 text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" /> شعار
                    </span>
                  )}
                </div>
                {work.images && (work.images as WorkMediaItem[]).filter(m => m.url).length > 0 && (
                  <div className="absolute bottom-2 left-2 bg-black/60 rounded-full px-2 py-0.5 text-white text-xs flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {(work.images as WorkMediaItem[]).filter(m => m.url).length} وسائط
                  </div>
                )}
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <h3 className="font-bold truncate">{work.title}</h3>
                  <p className="text-sm text-muted-foreground">{work.category?.name || "بدون تصنيف"}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(work)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(work.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive" disabled={deleteMutation.isPending}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {works.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>لا توجد أعمال بعد. أضف عملاً جديداً!</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border/50 max-h-[92vh] overflow-hidden flex flex-col" dir="rtl">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-xl font-bold">
              {editingWork ? "تعديل العمل" : "إضافة عمل جديد"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex gap-1 border-b border-border/40 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`px-4 py-2 text-sm font-bold transition-colors border-b-2 -mb-px ${activeTab === "basic" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              المعلومات الأساسية
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("gallery")}
              className={`px-4 py-2 text-sm font-bold transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${activeTab === "gallery" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              المعرض الإعلامي
              {mediaCount > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${mediaCount >= 10 ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {mediaCount}
                </span>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto">
              {activeTab === "basic" && (
                <div className="space-y-4 p-1 pt-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="w-title">العنوان *</Label>
                    <Input id="w-title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="اسم العمل" required />
                  </div>

                  <div className="space-y-1.5">
                    <Label>صورة الغلاف الرئيسية *</Label>
                    <CoverImageUploader
                      url={form.imageUrl}
                      onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="w-cat">التصنيف</Label>
                    <select
                      id="w-cat"
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
                    <Label htmlFor="w-desc">قصة المشروع والوصف</Label>
                    <Textarea
                      id="w-desc"
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="اكتب قصة المشروع، التحديات، والنتائج المحققة..."
                      className="min-h-[140px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="w-tags">الوسوم (مفصولة بفواصل)</Label>
                    <Input id="w-tags" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="هوية بصرية, شعار, تغليف" />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="w-4 h-4 accent-primary" />
                      <span className="text-sm font-medium">عمل مميز</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isFeaturedLogo} onChange={e => setForm(f => ({ ...f, isFeaturedLogo: e.target.checked }))} className="w-4 h-4 accent-primary" />
                      <span className="text-sm font-medium">شعار في الصفحة الرئيسية</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "gallery" && (
                <div className="space-y-4 p-1 pt-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm text-primary">
                    <strong>نصيحة:</strong> أضف 10 وسائط على الأقل — صور وفيديوهات توضح مراحل العمل، الشعار، الألوان، والتطبيقات. أضف وصفاً لكل وسيط لتوضيح السياق.
                  </div>
                  <MediaGalleryEditor
                    items={form.images}
                    onChange={images => setForm(f => ({ ...f, images }))}
                  />
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 pt-3 border-t border-border/40 shrink-0">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isSaving}>إلغاء</Button>
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingWork ? "حفظ التعديلات" : "إضافة العمل"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
