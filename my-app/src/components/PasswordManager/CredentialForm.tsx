import { useState } from 'react';
import { encryptSecret } from './cryptoClient';
import { VaultAPI } from './auth';

export default function CredentialForm({ master }: { master: string }) {
  const [site, setSite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const encrypted = await encryptSecret(master, password);
      await VaultAPI.create({ site, username, note, encrypted });
      setSite(''); setUsername(''); setPassword(''); setNote('');
      alert('Saved');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input value={site} onChange={e=>setSite(e.target.value)} placeholder="Site URL" required />
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username/email" required />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
      <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Note (optional)" />
      <button disabled={busy} type="submit">Add</button>
    </form>
  );
}
