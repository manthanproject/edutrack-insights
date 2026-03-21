import { Users, UserCheck, BookOpen, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useStudents, useWeeklyActivity } from "@/hooks/useStudents";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";

const Dashboard = () => {
  const { data: students = [], isLoading } = useStudents();
  const { data: weeklyActivity = [] } = useWeeklyActivity();

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "active").length;
  const avgScore = totalStudents > 0 ? Math.round(students.reduce((a, s) => a + s.score, 0) / totalStudents) : 0;
  const avgCompletion = totalStudents > 0 ? Math.round(
    students.reduce((a, s) => a + (s.completedLevels / s.totalLevels) * 100, 0) / totalStudents
  ) : 0;

  // Compute class performance by division from real data
  const classNames = ["Class 1", "Class 2", "Class 3"];
  const classPerformance = classNames.map(cls => {
    const divA = students.filter(s => s.class === cls && s.division === "A");
    const divB = students.filter(s => s.class === cls && s.division === "B");
    const avgA = divA.length > 0 ? Math.round(divA.reduce((a, s) => a + (s.completedLevels / s.totalLevels) * 100, 0) / divA.length) : 0;
    const avgB = divB.length > 0 ? Math.round(divB.reduce((a, s) => a + (s.completedLevels / s.totalLevels) * 100, 0) / divB.length) : 0;
    return { name: cls, divA: avgA, divB: avgB };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back, Admin. Here's your platform overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Students" value={totalStudents} icon={Users} trend={{ value: `${totalStudents} registered`, positive: true }} />
        <StatCard label="Active Now" value={activeStudents} icon={UserCheck} color="text-success" trend={{ value: totalStudents > 0 ? `${Math.round((activeStudents / totalStudents) * 100)}% active` : "0%", positive: true }} />
        <StatCard label="Avg. Stars" value={avgScore} icon={TrendingUp} color="text-info" />
        <StatCard label="Avg. Completion" value={`${avgCompletion}%`} icon={BookOpen} color="text-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weeklyActivity}>
              <defs>
                <linearGradient id="loginGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(168, 80%, 36%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(168, 80%, 36%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <Tooltip />
              <Area type="monotone" dataKey="logins" stroke="hsl(168, 80%, 36%)" fill="url(#loginGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="completions" stroke="hsl(262, 60%, 58%)" fill="hsl(262, 60%, 58%)" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Class Performance by Division</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={classPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <Tooltip />
              <Bar dataKey="divA" name="Division A" fill="hsl(168, 80%, 36%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="divB" name="Division B" fill="hsl(262, 60%, 58%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {students.length === 0 ? (
              <p className="text-sm text-muted-foreground">No students registered yet.</p>
            ) : (
              [...students].sort((a, b) => {
                if (a.status === "active" && b.status !== "active") return -1;
                if (a.status !== "active" && b.status === "active") return 1;
                return 0;
              }).slice(0, 5).map(s => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                    {s.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.class} · Div {s.division}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{s.lastActive}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Top Performers</h3>
          <div className="space-y-3">
            {students.length === 0 ? (
              <p className="text-sm text-muted-foreground">No students registered yet.</p>
            ) : (
              [...students].sort((a, b) => b.score - a.score).slice(0, 5).map((s, i) => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? "bg-warning text-warning-foreground" : i === 1 ? "bg-muted text-muted-foreground" : i === 2 ? "bg-warning/60 text-warning-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.completedLevels}/{s.totalLevels} levels</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{s.score} stars</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
