import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Student } from '@/data/mockData';

interface ProfileRow {
  id: string;
  name: string;
  class: string;
  division: string;
  roll_no: number;
  avatar: string;
  email: string;
  biometric_credential_id: string | null;
}

interface ProgressRow {
  user_id: string;
  completed_stations: string[];
  stars: number;
  current_island: string | null;
  current_station: number;
  earned_rewards: string[];
  updated_at: string;
}

interface LoginRow {
  user_id: string;
  login_at: string;
}

interface ActivityRow {
  user_id: string;
  station_id: string;
  island_id: string;
  game_type: string;
  stars_earned: number;
  completed_at: string;
}

const TOTAL_STATIONS = 15; // 5 stations x 3 islands

function getTimeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

async function fetchStudents(): Promise<Student[]> {
  // Fetch all data in parallel
  const [profilesRes, progressRes, loginsRes] = await Promise.all([
    supabase.from('student_profiles').select('*'),
    supabase.from('game_progress').select('*'),
    supabase.from('login_history').select('user_id, login_at').order('login_at', { ascending: false }),
  ]);

  const profiles: ProfileRow[] = profilesRes.data || [];
  const progressList: ProgressRow[] = progressRes.data || [];
  const logins: LoginRow[] = loginsRes.data || [];

  // Build lookup maps
  const progressMap = new Map<string, ProgressRow>();
  for (const p of progressList) {
    progressMap.set(p.user_id, p);
  }

  // Get last login per user
  const lastLoginMap = new Map<string, string>();
  for (const l of logins) {
    if (!lastLoginMap.has(l.user_id)) {
      lastLoginMap.set(l.user_id, l.login_at);
    }
  }

  return profiles.map((profile): Student => {
    const progress = progressMap.get(profile.id);
    const lastLogin = lastLoginMap.get(profile.id);
    const completedLevels = progress?.completed_stations?.length || 0;
    const stars = progress?.stars || 0;
    const rewards = progress?.earned_rewards?.length || 0;
    const lastActive = getTimeAgo(lastLogin || progress?.updated_at || null);

    // Determine active status: active if last login within 1 hour
    const lastTime = lastLogin || progress?.updated_at;
    const isActive = lastTime ? (Date.now() - new Date(lastTime).getTime()) < 3600000 : false;

    // Generate avatar initials from name
    const nameParts = profile.name.split(' ');
    const avatar = nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : profile.name.slice(0, 2).toUpperCase();

    return {
      id: profile.id,
      name: profile.name,
      avatar,
      class: profile.class,
      division: profile.division,
      completedLevels,
      totalLevels: TOTAL_STATIONS,
      score: stars,
      lastActive,
      status: isActive ? 'active' : 'inactive',
      rewards,
      loginMethod: profile.biometric_credential_id ? 'fingerprint' : 'face',
    };
  });
}

export interface WeeklyActivityDay {
  day: string;
  logins: number;
  completions: number;
}

async function fetchWeeklyActivity(): Promise<WeeklyActivityDay[]> {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [loginsRes, activityRes] = await Promise.all([
    supabase.from('login_history').select('login_at').gte('login_at', weekAgo),
    supabase.from('station_activity').select('completed_at').gte('completed_at', weekAgo),
  ]);

  const loginsByDay = new Map<string, number>();
  const completionsByDay = new Map<string, number>();

  for (const d of days) {
    loginsByDay.set(d, 0);
    completionsByDay.set(d, 0);
  }

  for (const l of (loginsRes.data || [])) {
    const day = days[new Date(l.login_at).getDay()];
    loginsByDay.set(day, (loginsByDay.get(day) || 0) + 1);
  }

  for (const a of (activityRes.data || [])) {
    const day = days[new Date(a.completed_at).getDay()];
    completionsByDay.set(day, (completionsByDay.get(day) || 0) + 1);
  }

  // Return Mon-Sun order
  const ordered = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return ordered.map(day => ({
    day,
    logins: loginsByDay.get(day) || 0,
    completions: completionsByDay.get(day) || 0,
  }));
}

async function fetchTopicCompletion(): Promise<{ topic: string; completed: number }[]> {
  const [profilesRes, progressRes] = await Promise.all([
    supabase.from('student_profiles').select('id'),
    supabase.from('game_progress').select('user_id, completed_stations'),
  ]);

  const totalStudents = profilesRes.data?.length || 1;
  const progressList: ProgressRow[] = progressRes.data || [];

  // Map islands to topic names
  const islandTopics: Record<string, { name: string; stations: string[] }> = {
    alphabet: { name: 'English / Reading', stations: ['abc', 'def', 'ghi', 'jkl', 'alphabet-review'] },
    numbers: { name: 'Mathematics', stations: ['num-1-3', 'num-4-6', 'num-7-9', 'num-10', 'number-review'] },
    animals: { name: 'EVS / Discovery', stations: ['farm', 'jungle', 'birds', 'sea', 'animal-sounds'] },
  };

  return Object.values(islandTopics).map(topic => {
    let totalCompleted = 0;
    for (const p of progressList) {
      const completed = (p.completed_stations || []).filter(s => topic.stations.includes(s)).length;
      totalCompleted += completed;
    }
    const maxPossible = totalStudents * topic.stations.length;
    const percentage = maxPossible > 0 ? Math.round((totalCompleted / maxPossible) * 100) : 0;
    return { topic: topic.name, completed: percentage };
  });
}

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
    refetchInterval: 30000, // refresh every 30 seconds
  });
}

export function useWeeklyActivity() {
  return useQuery({
    queryKey: ['weeklyActivity'],
    queryFn: fetchWeeklyActivity,
    refetchInterval: 60000,
  });
}

export function useTopicCompletion() {
  return useQuery({
    queryKey: ['topicCompletion'],
    queryFn: fetchTopicCompletion,
    refetchInterval: 60000,
  });
}
