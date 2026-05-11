import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Portfolio from "@/pages/Portfolio";
import PortfolioDetail from "@/pages/PortfolioDetail";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

import Dashboard from "@/pages/admin/Dashboard";
import Works from "@/pages/admin/Works";
import Blogs from "@/pages/admin/Blogs";
import Categories from "@/pages/admin/Categories";
import Comments from "@/pages/admin/Comments";
import Users from "@/pages/admin/Users";

const queryClient = new QueryClient();

const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } },
};

function Pages() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
      >
        <Switch>
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/register" component={Register} />

          <Route path="/admin/works" component={Works} />
          <Route path="/admin/blogs" component={Blogs} />
          <Route path="/admin/categories" component={Categories} />
          <Route path="/admin/comments" component={Comments} />
          <Route path="/admin/users" component={Users} />
          <Route path="/admin" component={Dashboard} />

          <Route path="/portfolio/:id" component={PortfolioDetail} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/blog/:id" component={BlogDetail} />
          <Route path="/blog" component={Blog} />
          <Route path="/" component={Home} />

          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function LayoutRouter() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");
  const isAuth = location.startsWith("/auth");

  if (isAdmin) {
    return <AdminLayout><Pages /></AdminLayout>;
  }
  return <PublicLayout><Pages /></PublicLayout>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <LayoutRouter />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
