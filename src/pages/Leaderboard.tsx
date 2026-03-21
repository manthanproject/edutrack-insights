import { useStudents } from "@/hooks/useStudents";
import { Trophy, Medal, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Leaderboard = () => {
  const { data: students = [], isLoading } = useStudents();
  const sorted = [...students].sort((a, b) => b.score - a.score);
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Leaderboard</h1>
        <p className="page-subtitle">Student rankings based on learning activity and achievements.</p>
      </div>

      {students.length === 0 ? (
        <div className="stat-card text-center py-12">
          <p className="text-muted-foreground">No students registered yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {top3.map((s, i) => {
              const colors = [
                { bg: "bg-warning/10", border: "border-warning/30", text: "text-warning", icon: Trophy },
                { bg: "bg-muted", border: "border-border", text: "text-muted-foreground", icon: Medal },
                { bg: "bg-warning/5", border: "border-warning/20", text: "text-warning/70", icon: Medal },
              ];
              const c = colors[i];
              const Icon = c.icon;
              return (
                <div key={s.id} className={`stat-card border ${c.border} relative overflow-hidden`}>
                  <div className={`absolute top-0 right-0 p-3 ${c.text} opacity-20`}>
                    <Icon className="h-16 w-16" />
                  </div>
                  <div className="relative">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mb-3 ${c.bg} ${c.text}`}>
                      <Star className="h-3 w-3" /> Rank #{i + 1}
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                        {s.avatar}
                      </div>
                      <div>
                        <p className="font-bold">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.class} · Div {s.division}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-bold text-primary" style={{ fontFamily: "'Space Grotesk'" }}>{s.score}</p>
                        <p className="text-[10px] text-muted-foreground">Stars</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk'" }}>{s.completedLevels}</p>
                        <p className="text-[10px] text-muted-foreground">Levels</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk'" }}>{s.rewards}</p>
                        <p className="text-[10px] text-muted-foreground">Rewards</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {rest.length > 0 && (
            <div className="bg-card rounded-xl border overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Stars</th>
                    <th>Levels</th>
                    <th>Rewards</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {rest.map((s, i) => (
                    <tr key={s.id}>
                      <td className="font-bold text-muted-foreground">#{i + 4}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                            {s.avatar}
                          </div>
                          <span className="font-medium text-sm">{s.name}</span>
                        </div>
                      </td>
                      <td className="text-sm">{s.class} · Div {s.division}</td>
                      <td className="text-sm font-semibold">{s.score}</td>
                      <td className="text-sm">{s.completedLevels}/{s.totalLevels}</td>
                      <td className="text-sm">{s.rewards}</td>
                      <td className="min-w-[100px]">
                        <Progress value={(s.completedLevels / s.totalLevels) * 100} className="h-2" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;
