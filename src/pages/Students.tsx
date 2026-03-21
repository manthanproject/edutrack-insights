import { useStudents } from "@/hooks/useStudents";
import { Search, Trash2, Fingerprint, ScanFace } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Student } from "@/data/mockData";
import { useQueryClient } from "@tanstack/react-query";

const Students = () => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const { data: students = [], isLoading } = useStudents();
  const queryClient = useQueryClient();

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchClass = classFilter === "all" || s.class === classFilter;
    return matchSearch && matchClass;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    // Delete from Supabase auth (cascades to profiles, progress, etc.)
    const { error } = await supabase.from('student_profiles').delete().eq('id', deleteTarget.id);
    if (error) {
      toast.error(`Failed to remove: ${error.message}`);
    } else {
      toast.success(`${deleteTarget.name} removed`);
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
    setDeleteTarget(null);
  };

  const classOptions = ["Class 1", "Class 2", "Class 3"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading students...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">Monitor students. Admin can only remove student records.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classOptions.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="stat-card !p-4">
          <p className="text-xs text-muted-foreground font-medium">Total</p>
          <p className="text-2xl font-bold mt-1" style={{ fontFamily: "'Space Grotesk'" }}>{students.length}</p>
        </div>
        <div className="stat-card !p-4">
          <p className="text-xs text-muted-foreground font-medium">Active</p>
          <p className="text-2xl font-bold mt-1 text-[hsl(var(--success))]" style={{ fontFamily: "'Space Grotesk'" }}>
            {students.filter(s => s.status === "active").length}
          </p>
        </div>
        <div className="stat-card !p-4">
          <p className="text-xs text-muted-foreground font-medium">Inactive</p>
          <p className="text-2xl font-bold mt-1 text-muted-foreground" style={{ fontFamily: "'Space Grotesk'" }}>
            {students.filter(s => s.status === "inactive").length}
          </p>
        </div>
        <div className="stat-card !p-4">
          <p className="text-xs text-muted-foreground font-medium">Avg Stars</p>
          <p className="text-2xl font-bold mt-1 text-primary" style={{ fontFamily: "'Space Grotesk'" }}>
            {students.length > 0 ? Math.round(students.reduce((a, s) => a + s.score, 0) / students.length) : 0}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Division</th>
                <th>Progress</th>
                <th>Stars</th>
                <th>Login</th>
                <th>Status</th>
                <th>Last Active</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-muted-foreground">
                    No students found
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {s.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{s.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{s.class}</td>
                    <td className="text-sm">Div {s.division}</td>
                    <td>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={(s.completedLevels / s.totalLevels) * 100} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{s.completedLevels}/{s.totalLevels}</span>
                      </div>
                    </td>
                    <td className="text-sm font-semibold">{s.score}</td>
                    <td>
                      {s.loginMethod === "fingerprint" ? (
                        <Fingerprint className="h-4 w-4 text-primary" />
                      ) : (
                        <ScanFace className="h-4 w-4 text-[hsl(var(--info))]" />
                      )}
                    </td>
                    <td>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.status === "active" ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" : "bg-muted text-muted-foreground"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.status === "active" ? "bg-[hsl(var(--success))]" : "bg-muted-foreground"}`} />
                        {s.status}
                      </span>
                    </td>
                    <td className="text-sm text-muted-foreground">{s.lastActive}</td>
                    <td className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(s)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Student</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove <span className="font-semibold text-foreground">{deleteTarget?.name}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
