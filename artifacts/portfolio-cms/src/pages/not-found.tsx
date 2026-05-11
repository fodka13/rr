import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4" dir="rtl">
      <div className="text-[200px] font-black text-primary/20 leading-none select-none">٤٠٤</div>
      <h1 className="text-4xl font-bold text-foreground mt-4 mb-4">الصفحة غير موجودة</h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-md">
        يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
        العودة للرئيسية
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}
