export interface Student {
  id: string;
  name: string;
  avatar: string;
  class: string;
  division: string;
  completedLevels: number;
  totalLevels: number;
  score: number;
  lastActive: string;
  status: "active" | "inactive";
  rewards: number;
  loginMethod: "fingerprint" | "face";
}

export interface ClassData {
  name: string;
  divisions: string[];
  studentCount: number;
  avgPerformance: number;
}

export const students: Student[] = [
  { id: "S001", name: "Aarav Sharma", avatar: "AS", class: "Class 1", division: "A", completedLevels: 18, totalLevels: 25, score: 920, lastActive: "2 min ago", status: "active", rewards: 12, loginMethod: "fingerprint" },
  { id: "S002", name: "Priya Patel", avatar: "PP", class: "Class 1", division: "A", completedLevels: 22, totalLevels: 25, score: 1150, lastActive: "5 min ago", status: "active", rewards: 18, loginMethod: "face" },
  { id: "S003", name: "Rohan Gupta", avatar: "RG", class: "Class 1", division: "B", completedLevels: 15, totalLevels: 25, score: 780, lastActive: "1 hr ago", status: "active", rewards: 9, loginMethod: "fingerprint" },
  { id: "S004", name: "Ananya Singh", avatar: "AS", class: "Class 1", division: "B", completedLevels: 20, totalLevels: 25, score: 1050, lastActive: "30 min ago", status: "active", rewards: 15, loginMethod: "face" },
  { id: "S005", name: "Vihaan Kumar", avatar: "VK", class: "Class 2", division: "A", completedLevels: 12, totalLevels: 25, score: 640, lastActive: "2 hr ago", status: "inactive", rewards: 6, loginMethod: "fingerprint" },
  { id: "S006", name: "Ishita Joshi", avatar: "IJ", class: "Class 2", division: "A", completedLevels: 24, totalLevels: 25, score: 1280, lastActive: "1 min ago", status: "active", rewards: 22, loginMethod: "face" },
  { id: "S007", name: "Arjun Reddy", avatar: "AR", class: "Class 2", division: "B", completedLevels: 10, totalLevels: 25, score: 520, lastActive: "1 day ago", status: "inactive", rewards: 4, loginMethod: "fingerprint" },
  { id: "S008", name: "Meera Nair", avatar: "MN", class: "Class 2", division: "B", completedLevels: 19, totalLevels: 25, score: 980, lastActive: "15 min ago", status: "active", rewards: 14, loginMethod: "face" },
  { id: "S009", name: "Kabir Malhotra", avatar: "KM", class: "Class 3", division: "A", completedLevels: 23, totalLevels: 25, score: 1200, lastActive: "3 min ago", status: "active", rewards: 20, loginMethod: "fingerprint" },
  { id: "S010", name: "Saanvi Rao", avatar: "SR", class: "Class 3", division: "A", completedLevels: 25, totalLevels: 25, score: 1350, lastActive: "Just now", status: "active", rewards: 25, loginMethod: "face" },
  { id: "S011", name: "Dhruv Verma", avatar: "DV", class: "Class 3", division: "B", completedLevels: 8, totalLevels: 25, score: 420, lastActive: "3 days ago", status: "inactive", rewards: 3, loginMethod: "fingerprint" },
  { id: "S012", name: "Aisha Khan", avatar: "AK", class: "Class 3", division: "B", completedLevels: 21, totalLevels: 25, score: 1100, lastActive: "10 min ago", status: "active", rewards: 17, loginMethod: "face" },
];

export const classes: ClassData[] = [
  { name: "Class 1", divisions: ["A", "B"], studentCount: 4, avgPerformance: 75 },
  { name: "Class 2", divisions: ["A", "B"], studentCount: 4, avgPerformance: 68 },
  { name: "Class 3", divisions: ["A", "B"], studentCount: 4, avgPerformance: 82 },
];

export const weeklyActivity = [
  { day: "Mon", logins: 38, completions: 12 },
  { day: "Tue", logins: 42, completions: 18 },
  { day: "Wed", logins: 35, completions: 10 },
  { day: "Thu", logins: 48, completions: 22 },
  { day: "Fri", logins: 52, completions: 28 },
  { day: "Sat", logins: 20, completions: 8 },
  { day: "Sun", logins: 15, completions: 5 },
];

export const classPerformance = [
  { name: "Class 1", divA: 78, divB: 72 },
  { name: "Class 2", divA: 85, divB: 62 },
  { name: "Class 3", divA: 90, divB: 74 },
];

export const topicCompletion = [
  { topic: "Mathematics", completed: 85 },
  { topic: "English", completed: 72 },
  { topic: "Science", completed: 68 },
  { topic: "Social Studies", completed: 55 },
  { topic: "Hindi", completed: 78 },
];
