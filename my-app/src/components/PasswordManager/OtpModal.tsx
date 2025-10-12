import { useState } from 'react';
import { VaultAPI } from './auth';
import { decryptSecret } from './cryptoClient';

export default function OtpModal({
  id, master, onClose
}: { id: string; master: string; onClose: () => void }) {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function verify() {
    setBusy(true);
    try {
      const { item } = await VaultAPI.verifyOtp(id, code);
      const plaintext = await decryptSecret(master, item.encrypted!);
      setResult(plaintext);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal">
      {!result ? (
        <>
          <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter 6-digit OTP" />
          <button disabled={busy} onClick={verify}>Verify</button>
          <button onClick={onClose}>Close</button>
        </>
      ) : (
        <>
          <div className="font-mono">Password: {result}</div>
          <button onClick={onClose}>Close</button>
        </>
      )}
    </div>
  );
}
