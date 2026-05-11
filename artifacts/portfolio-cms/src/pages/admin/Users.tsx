import { useListUsers, useBanUser, useUnbanUser, getListUsersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Ban, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Users() {
  const { data, isLoading } = useListUsers();
  const banMutation = useBanUser();
  const unbanMutation = useUnbanUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleToggleBan = (id: number, isBanned: boolean) => {
    if (confirm(isBanned ? "هل تريد فك حظر هذا المستخدم؟" : "هل أنت متأكد من حظر هذا المستخدم؟")) {
      const mutation = isBanned ? unbanMutation : banMutation;
      mutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: isBanned ? "تم فك الحظر" : "تم الحظر" });
          queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
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
                <th className="px-6 py-4 font-semibold">المستخدم</th>
                <th className="px-6 py-4 font-semibold">البريد</th>
                <th className="px-6 py-4 font-semibold">الدور</th>
                <th className="px-6 py-4 font-semibold">تاريخ الانضمام</th>
                <th className="px-6 py-4 font-semibold w-[100px]">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data?.users?.map((user) => (
                <tr key={user.id} className={`hover:bg-muted/50 transition-colors ${user.isBanned ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 font-medium">{user.displayName || user.username}</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded bg-primary/20 text-primary text-xs font-bold">
                      {user.role === "super_admin" ? "مدير عام" : user.role === "admin" ? "مدير" : user.role === "editor" ? "محرر" : user.role === "moderator" ? "مشرف" : "مستخدم"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">
                    {format(new Date(user.createdAt), "dd MMM yyyy", { locale: ar })}
                  </td>
                  <td className="px-6 py-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleToggleBan(user.id, user.isBanned)} 
                      className={`h-8 w-8 ${user.isBanned ? 'text-primary hover:bg-primary/20' : 'text-destructive hover:bg-destructive/20'}`}
                      title={user.isBanned ? "فك الحظر" : "حظر"}
                    >
                      {user.isBanned ? <ShieldCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                    </Button>
                  </td>
                </tr>
              ))}
              {data?.users?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">لا يوجد مستخدمين</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
