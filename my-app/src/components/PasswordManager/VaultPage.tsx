import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import CredentialForm from './CredentialForm';
import CredentialList from './CredentialList';
import { AuthAPI } from './auth';

export default function VaultPage() {
  const { user, loading } = useAuth();
  const [master, setMaster] = useState<string>('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (master.length >= 8) setReady(true);
    else setReady(false);
  }, [master]);

  if (loading) return <div>Loading…</div>;
  if (!user) {
    return (
      <div className="p-6">
        <h2>Sign in to continue</h2>
        <a href={AuthAPI.googleLoginUrl()} className="btn">Sign in with Google</a>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2>Vault</h2>
      <p>Enter master password (used only on this device for encryption/decryption):</p>
      <input type="password" value={master} onChange={e=>setMaster(e.target.value)} placeholder="Master password (min 8)" />
      {ready && (
        <>
          <CredentialForm master={master} />
          <hr />
          <CredentialList master={master} />
        </>
      )}
    </div>
  );
}
