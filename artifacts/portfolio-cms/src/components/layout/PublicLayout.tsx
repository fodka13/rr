import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "الرئيسية", active: location === "/" },
    { href: "/portfolio", label: "الأعمال", active: location.startsWith("/portfolio") },
    { href: "/blog", label: "المقالات", active: location.startsWith("/blog") },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" dir="rtl">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black text-primary tracking-tighter hover:opacity-80 transition-opacity" onClick={() => setMenuOpen(false)}>
            محمد الديزاين
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors hover:text-primary ${link.active ? "text-primary" : "text-muted-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {(user.role === "super_admin" || user.role === "admin" || user.role === "editor" || user.role === "moderator") && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      لوحة التحكم
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={logout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <LogOut className="w-4 h-4 ml-1" />
                  خروج
                </Button>
              </>
            ) : (
              <Link href="/auth/login">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  تسجيل الدخول
                </Button>
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="قائمة التنقل"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border/40 bg-card/95 backdrop-blur">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-base font-semibold transition-colors ${link.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border/40 mt-2 pt-3 flex flex-col gap-2">
                {user ? (
                  <>
                    {(user.role === "super_admin" || user.role === "admin" || user.role === "editor" || user.role === "moderator") && (
                      <Link href="/admin" onClick={() => setMenuOpen(false)}>
                        <Button variant="outline" className="w-full gap-2 justify-center">
                          <LayoutDashboard className="w-4 h-4" />
                          لوحة التحكم
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 justify-center"
                      onClick={() => { logout(); setMenuOpen(false); }}
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل خروج
                    </Button>
                  </>
                ) : (
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      تسجيل الدخول
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-border/40 py-12 bg-card mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© {new Date().getFullYear()} محمد الديزاين. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
