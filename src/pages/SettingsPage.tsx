import { User, Shield, Bell, Palette, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your admin account and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary"><User className="h-5 w-5" /></div>
            <h3 className="font-semibold">Profile</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Full Name</label>
              <p className="mt-1 px-3 py-2 rounded-lg border bg-background text-sm">{admin?.name || '-'}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <p className="mt-1 px-3 py-2 rounded-lg border bg-background text-sm">{admin?.email || '-'}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Role</label>
              <p className="mt-1 px-3 py-2 rounded-lg border bg-background text-sm capitalize">{admin?.role || '-'}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary"><Shield className="h-5 w-5" /></div>
            <h3 className="font-semibold">Security</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Authentication is managed via Supabase Auth with email/password.</p>
            <p className="text-xs text-muted-foreground">Session is automatically maintained across visits.</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary"><Bell className="h-5 w-5" /></div>
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="space-y-3">
            {["Email alerts for low engagement", "Daily activity summary", "New student registrations"].map((item) => (
              <label key={item} className="flex items-center gap-3 text-sm cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary" />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary"><Palette className="h-5 w-5" /></div>
            <h3 className="font-semibold">Platform</h3>
          </div>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">Platform: <span className="font-medium text-foreground">EduTrack Insights v1.0</span></p>
            <p className="text-muted-foreground">Total Classes: <span className="font-medium text-foreground">3</span></p>
            <p className="text-muted-foreground">Total Divisions: <span className="font-medium text-foreground">6</span></p>
            <p className="text-muted-foreground">Backend: <span className="font-medium text-foreground">Supabase</span></p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button variant="destructive" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
