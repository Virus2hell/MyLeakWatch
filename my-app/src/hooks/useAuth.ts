import { useEffect, useState } from 'react';
import { AuthAPI } from '../components/PasswordManager/auth';

export function useAuth() {
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthAPI.getMe()
      .then(r => setUser(r.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, setUser };
}
