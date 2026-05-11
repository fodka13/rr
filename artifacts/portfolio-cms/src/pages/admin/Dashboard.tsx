import { useGetStats } from "@workspace/api-client-react";
import { Loader2, Users, Image as ImageIcon, FileText, Star, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">لوحة القيادة</h1>
        <p className="text-muted-foreground mt-2">نظرة عامة على إحصائيات الموقع.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">عدد الزوار</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.visitorCount || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">عدد الأعمال</CardTitle>
            <ImageIcon className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.worksCount || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">المقالات</CardTitle>
            <FileText className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.blogsCount || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">التعليقات المميزة</CardTitle>
            <Star className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.topClientsCount || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">الشركاء</CardTitle>
            <LinkIcon className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.partnersCount || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">التصنيفات</CardTitle>
            <Star className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.categoriesCount || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
