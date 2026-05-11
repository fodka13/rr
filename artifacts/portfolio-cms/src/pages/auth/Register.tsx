import { useState } from "react";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  
  const registerMutation = useRegister();
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) {
      toast({ title: "خطأ", description: "الرجاء تعبئة الحقول المطلوبة", variant: "destructive" });
      return;
    }

    registerMutation.mutate({ data: { username, email, password, displayName } }, {
      onSuccess: (res) => {
        login(res.token, res.user);
        toast({ title: "تم إنشاء الحساب", description: "مرحباً بك!" });
        setLocation("/");
      },
      onError: (err: any) => {
        toast({ title: "خطأ", description: err.message || "تعذر إنشاء الحساب", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowRight className="w-4 h-4" /> العودة للرئيسية
        </Link>
        <h2 className="text-center text-4xl font-black tracking-tight text-primary">حساب جديد</h2>
        <p className="mt-4 text-center text-muted-foreground font-medium">انضم لتتمكن من التفاعل والتعليق.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-10 px-4 shadow-2xl border border-border/50 sm:rounded-3xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم (إنجليزي)</Label>
              <Input 
                id="username" 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background border-border focus:border-primary text-left" 
                dir="ltr"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="displayName">الاسم الظاهر (اختياري)</Label>
              <Input 
                id="displayName" 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-background border-border focus:border-primary" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border focus:border-primary text-left" 
                dir="ltr"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border focus:border-primary text-left" 
                dir="ltr"
                required 
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 text-lg font-bold" 
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "إنشاء حساب"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
