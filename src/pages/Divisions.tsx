import { useMemo, useState } from "react";
import { students as initialStudents, classes as initialClasses } from "@/data/mockData";
import { Users, TrendingUp, LayoutGrid, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DivisionEntry {
  className: string;
  division: string;
}

const Divisions = () => {
  const [filterClass, setFilterClass] = useState("all");

  const divisionList: DivisionEntry[] = useMemo(
    () =>
      initialClasses.flatMap((cls) =>
        cls.divisions.map((div) => ({ className: cls.name, division: div }))
      ),
    []
  );

  const filtered =
    filterClass === "all"
      ? divisionList
      : divisionList.filter((d) => d.className === filterClass);

  const totalStudentsCount = initialStudents.length;
  const totalDivisionsCount = divisionList.length;
  const avgScore =
    initialStudents.length > 0
      ? Math.round(initialStudents.reduce((a, s) => a + s.score, 0) / initialStudents.length)
      : 0;
  const avgRewards =
    initialStudents.length > 0
      ? Math.round(initialStudents.reduce((a, s) => a + s.rewards, 0) / initialStudents.length)
      : 0;

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Divisions</h1>
          <p className="page-subtitle">Fixed class-division structure with performance tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {initialClasses.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card !p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <LayoutGrid className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Divisions</p>
            <p className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk'" }}>
              {totalDivisionsCount}
            </p>
          </div>
        </div>
        <div className="stat-card !p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[hsl(var(--info))]/10">
            <Users className="h-4 w-4 text-[hsl(var(--info))]" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Students</p>
            <p className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk'" }}>
              {totalStudentsCount}
            </p>
          </div>
        </div>
        <div className="stat-card !p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[hsl(var(--success))]/10">
            <TrendingUp className="h-4 w-4 text-[hsl(var(--success))]" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Avg Score</p>
            <p className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk'" }}>
              {avgScore}
            </p>
          </div>
        </div>
        <div className="stat-card !p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[hsl(var(--warning))]/10">
            <Award className="h-4 w-4 text-[hsl(var(--warning))]" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Avg Rewards</p>
            <p className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk'" }}>
              {avgRewards}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((d) => {
          const divStudents = initialStudents.filter(
            (s) => s.class === d.className && s.division === d.division
          );
          const activeCount = divStudents.filter((s) => s.status === "active").length;
          const divisionAvgScore =
            divStudents.length > 0
              ? Math.round(divStudents.reduce((a, s) => a + s.score, 0) / divStudents.length)
              : 0;
          const avgCompletion =
            divStudents.length > 0
              ? Math.round(
                  divStudents.reduce(
                    (a, s) => a + (s.completedLevels / s.totalLevels) * 100,
                    0
                  ) / divStudents.length
                )
              : 0;

          return (
            <div key={`${d.className}-${d.division}`} className="stat-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <LayoutGrid className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold" style={{ fontFamily: "'Space Grotesk'" }}>
                    {d.className} - Div {d.division}
                  </h3>
                  <p className="text-xs text-muted-foreground">{divStudents.length} students enrolled</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk'" }}>
                    {divisionAvgScore}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Avg Score</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p
                    className="text-sm font-bold text-[hsl(var(--success))]"
                    style={{ fontFamily: "'Space Grotesk'" }}
                  >
                    {activeCount}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Active</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-sm font-bold text-primary" style={{ fontFamily: "'Space Grotesk'" }}>
                    {avgCompletion}%
                  </p>
                  <p className="text-[10px] text-muted-foreground">Progress</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Avg. Completion</span>
                  <span className="font-semibold">{avgCompletion}%</span>
                </div>
                <Progress value={avgCompletion} className="h-2" />
              </div>

              <div className="space-y-2">
                {divStudents.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-2.5 text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                      {s.avatar}
                    </div>
                    <span className="flex-1 truncate font-medium text-xs">{s.name}</span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                        s.status === "active" ? "bg-[hsl(var(--success))]" : "bg-muted-foreground"
                      }`}
                    />
                    <span className="text-xs text-muted-foreground font-medium">{s.score}</span>
                  </div>
                ))}
                {divStudents.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No students assigned</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Divisions;
