import { useStudents, useTopicCompletion } from "@/hooks/useStudents";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend,
} from "recharts";

const COLORS = [
  "hsl(168, 80%, 36%)",
  "hsl(262, 60%, 58%)",
  "hsl(38, 92%, 50%)",
  "hsl(200, 80%, 50%)",
  "hsl(340, 75%, 55%)",
];

const Analytics = () => {
  const { data: students = [], isLoading } = useStudents();
  const { data: topicCompletion = [] } = useTopicCompletion();

  const classDistribution = [
    { name: "Class 1", value: students.filter(s => s.class === "Class 1").length },
    { name: "Class 2", value: students.filter(s => s.class === "Class 2").length },
    { name: "Class 3", value: students.filter(s => s.class === "Class 3").length },
  ];

  const engagementData = [
    { name: "Active", value: students.filter(s => s.status === "active").length, fill: "hsl(168, 80%, 36%)" },
    { name: "Inactive", value: students.filter(s => s.status === "inactive").length, fill: "hsl(220, 13%, 91%)" },
  ];

  const classNames = ["Class 1", "Class 2", "Class 3"];
  const classPerformance = classNames.map(cls => {
    const divA = students.filter(s => s.class === cls && s.division === "A");
    const divB = students.filter(s => s.class === cls && s.division === "B");
    const avgA = divA.length > 0 ? Math.round(divA.reduce((a, s) => a + (s.completedLevels / s.totalLevels) * 100, 0) / divA.length) : 0;
    const avgB = divB.length > 0 ? Math.round(divB.reduce((a, s) => a + (s.completedLevels / s.totalLevels) * 100, 0) / divB.length) : 0;
    return { name: cls, divA: avgA, divB: avgB };
  });

  const needsImprovement = students.filter(s => (s.completedLevels / s.totalLevels) < 0.5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Deep insights into platform performance and student engagement.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Student Distribution by Class</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={classDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                {classDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Topic Completion Rates</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topicCompletion} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <YAxis type="category" dataKey="topic" width={120} tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
              <Tooltip />
              <Bar dataKey="completed" fill="hsl(168, 80%, 36%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Student Engagement</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" data={engagementData} startAngle={180} endAngle={0}>
              <RadialBar dataKey="value" cornerRadius={8} />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-xs">Active ({engagementData[0].value})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-border" />
              <span className="text-xs">Inactive ({engagementData[1].value})</span>
            </div>
          </div>
        </div>

        <div className="stat-card lg:col-span-2">
          <h3 className="text-sm font-semibold mb-4">Class vs Division Performance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={classPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <Tooltip />
              <Bar dataKey="divA" name="Division A" fill="hsl(200, 80%, 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="divB" name="Division B" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="stat-card">
        <h3 className="text-sm font-semibold mb-4">Students Needing Improvement</h3>
        {needsImprovement.length === 0 ? (
          <p className="text-sm text-muted-foreground">All students are above 50% completion!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {needsImprovement.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <div className="h-8 w-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-xs font-semibold">
                  {s.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.class} · Div {s.division} · {s.completedLevels}/{s.totalLevels} levels</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
