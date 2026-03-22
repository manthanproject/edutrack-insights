import { FormEvent, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.endsWith('@access.com')) {
      setError('Please use your authorized email (name@access.com).');
      return;
    }

    setBusy(true);
    const result = await login(email, password);
    setBusy(false);

    if (!result.ok) {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk'" }}>EduTrack Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">Teacher / Admin Dashboard</p>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-1">Welcome back</h2>
          <p className="text-xs text-muted-foreground mb-5">Sign in with your authorized credentials.</p>

          {error && <p className="text-sm text-destructive mb-4">{error}</p>}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@access.com"
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-[11px] text-muted-foreground text-center mt-4">
            Contact your administrator if you need access.
          </p>
        </div>
      </div>
    </div>
  );
}
