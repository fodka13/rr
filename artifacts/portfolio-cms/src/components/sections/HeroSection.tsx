import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const phrases = [
  "علامات تجارية",
  "مقالات اسبوعية",
  "تصميم مواقع",
  "بناء استراتيجية",
];

const ease = [0.25, 0.1, 0.25, 1] as const;

export function HeroSection() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setPhraseIndex((current) => (current + 1) % phrases.length);
        setIsFading(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center relative px-4 overflow-hidden">
      <motion.div
        className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
      />

      <div className="text-center z-10 space-y-8 max-w-5xl mx-auto">
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-black text-foreground tracking-tighter leading-tight drop-shadow-sm"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          محمد الديزاين
        </motion.h1>

        <motion.div
          className="h-[80px] md:h-[120px] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <h2
            className={`text-4xl md:text-6xl lg:text-7xl font-bold text-primary transition-all duration-500 ${
              isFading ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
            }`}
          >
            {phrases[phraseIndex]}
          </h2>
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease }}
        >
          نصنع هويات بصرية تعيش طويلاً، وتصاميم تروي قصة علامتك التجارية بثقة وإبداع.
        </motion.p>

        <motion.div
          className="pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease }}
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,180,216,0.3)]"
          >
            استكشف الأعمال
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
