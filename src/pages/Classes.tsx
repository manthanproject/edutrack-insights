import { useStudents } from "@/hooks/useStudents";
import { Progress } from "@/components/ui/progress";
import { Users, GraduationCap, BarChart3 } from "lucide-react";

const Classes = () => {
  const { data: students = [], isLoading } = useStudents();

  const classNames = ["Class 1", "Class 2", "Class 3"];
  const classList = classNames.map(name => {
    const classStudents = students.filter(s => s.class === name);
    const avgPerformance = classStudents.length > 0
      ? Math.round(classStudents.reduce((a, s) => a + (s.completedLevels / s.totalLevels) * 100, 0) / classStudents.length)
      : 0;
    return {
      name,
      divisions: ["A", "B"],
      studentCount: classStudents.length,
      avgPerformance,
    };
  });

  const totalStudents = students.length;
  const overallAvg = classList.length > 0 ? Math.round(classList.reduce((a, c) => a + c.avgPerformance, 0) / classList.length) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading classes...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Classes</h1>
          <p className="page-subtitle">Fixed classes and divisions. View class performance only.</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="stat-card !p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Classes</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk'" }}>{classList.length}</p>
          </div>
        </div>
        <div className="stat-card !p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[hsl(var(--info))]/10">
            <Users className="h-5 w-5 text-[hsl(var(--info))]" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Students</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk'" }}>{totalStudents}</p>
          </div>
        </div>
        <div className="stat-card !p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[hsl(var(--success))]/10">
            <BarChart3 className="h-5 w-5 text-[hsl(var(--success))]" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Avg Performance</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk'" }}>{overallAvg}%</p>
          </div>
        </div>
      </div>

      {/* Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classList.map(cls => {
          const classStudents = students.filter(s => s.class === cls.name);
          const activeCount = classStudents.filter(s => s.status === "active").length;
          return (
            <div key={cls.name} className="stat-card group relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk'" }}>{cls.name}</h3>
                  <p className="text-xs text-muted-foreground">{cls.divisions.length} Divisions</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center p-2.5 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk'" }}>{cls.studentCount}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Students</p>
                </div>
                <div className="text-center p-2.5 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold text-[hsl(var(--success))]" style={{ fontFamily: "'Space Grotesk'" }}>{activeCount}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Active</p>
                </div>
                <div className="text-center p-2.5 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold text-primary" style={{ fontFamily: "'Space Grotesk'" }}>{cls.avgPerformance}%</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Avg</p>
                </div>
              </div>

              <div className="space-y-3">
                {cls.divisions.map(div => {
                  const divStudents = classStudents.filter(s => s.division === div);
                  const avgProgress = divStudents.length > 0
                    ? Math.round(divStudents.reduce((a, s) => a + (s.completedLevels / s.totalLevels) * 100, 0) / divStudents.length)
                    : 0;
                  return (
                    <div key={div} className="p-3 rounded-lg border bg-background/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Division {div}</span>
                        <span className="text-xs text-muted-foreground">{divStudents.length} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={avgProgress} className="h-2 flex-1" />
                        <span className="text-xs font-semibold w-8 text-right">{avgProgress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Classes;
