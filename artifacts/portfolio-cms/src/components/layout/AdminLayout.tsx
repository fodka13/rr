import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Image as ImageIcon, FileText, Tags, MessageSquare, Users, LogOut, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout, checkPermission } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user) return <div className="min-h-screen bg-background flex items-center justify-center text-primary">جاري التحميل...</div>;

  const isEditor = checkPermission(["editor"]);
  const isModerator = checkPermission(["moderator"]);
  const isSuperAdmin = checkPermission(["super_admin"]);

  return (
    <div className="min-h-screen flex bg-background text-foreground" dir="rtl">
      <aside className="w-64 border-l border-border/40 bg-card/50 flex flex-col fixed inset-y-0 right-0 z-40">
        <div className="h-20 flex items-center justify-center border-b border-border/40 px-6">
          <Link href="/" className="text-xl font-black text-primary tracking-tighter flex items-center gap-2 hover:opacity-80">
            محمد الديزاين <span className="text-muted-foreground text-sm font-normal">الإدارة</span>
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <Link href="/admin" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location === "/admin" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <LayoutDashboard className="h-4 w-4" /> لوحة القيادة
          </Link>
          
          {isEditor && (
            <>
              <Link href="/admin/works" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.startsWith("/admin/works") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <ImageIcon className="h-4 w-4" /> الأعمال
              </Link>
              <Link href="/admin/blogs" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.startsWith("/admin/blogs") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <FileText className="h-4 w-4" /> المقالات
              </Link>
              <Link href="/admin/categories" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.startsWith("/admin/categories") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Tags className="h-4 w-4" /> التصنيفات
              </Link>
            </>
          )}

          {isModerator && (
            <Link href="/admin/comments" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.startsWith("/admin/comments") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <MessageSquare className="h-4 w-4" /> التعليقات
            </Link>
          )}

          {isSuperAdmin && (
            <Link href="/admin/users" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.startsWith("/admin/users") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Users className="h-4 w-4" /> المستخدمين
            </Link>
          )}
        </div>

        <div className="p-4 border-t border-border/40">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground" onClick={() => setLocation("/")}>
            <ArrowRight className="h-4 w-4" /> العودة للموقع
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 mt-2" onClick={logout}>
            <LogOut className="h-4 w-4" /> تسجيل خروج
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col pr-64">
        <header className="h-20 border-b border-border/40 flex items-center justify-between px-8 bg-background/95 backdrop-blur sticky top-0 z-30">
          <h2 className="text-xl font-bold">مرحباً، {user.displayName || user.username}</h2>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
