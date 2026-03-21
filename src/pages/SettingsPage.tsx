import { User, Shield, Bell, Palette } from "lucide-react";

const SettingsPage = () => {
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
              <input defaultValue="Admin User" className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <input defaultValue="admin@eduplay.com" className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-sm" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary"><Shield className="h-5 w-5" /></div>
            <h3 className="font-semibold">Security</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Password</label>
              <input type="password" defaultValue="••••••••" className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-sm" />
            </div>
            <p className="text-xs text-muted-foreground">Two-factor authentication is enabled.</p>
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
            <p className="text-muted-foreground">Platform: <span className="font-medium text-foreground">EduPlay v1.0</span></p>
            <p className="text-muted-foreground">Total Classes: <span className="font-medium text-foreground">3</span></p>
            <p className="text-muted-foreground">Total Divisions: <span className="font-medium text-foreground">6</span></p>
            <p className="text-muted-foreground">Auth Method: <span className="font-medium text-foreground">Biometric (Fingerprint + Face)</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
