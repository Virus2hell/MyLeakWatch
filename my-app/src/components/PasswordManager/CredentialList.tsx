import { useEffect, useState } from 'react';
import { VaultAPI, CredentialMeta } from './auth';
import OtpModal from './OtpModal';

export default function CredentialList({ master }: { master: string }) {
  const [items, setItems] = useState<CredentialMeta[]>([]);
  const [otpFor, setOtpFor] = useState<string | null>(null);

  async function load() {
    const { items } = await VaultAPI.list();
    setItems(items);
  }

  useEffect(() => { load(); }, []);

  async function onRequestOtp(id: string) {
    await VaultAPI.requestOtp(id);
    setOtpFor(id);
  }

  return (
    <div>
      {items.map(it => (
        <div key={it._id} className="row">
          <div>{it.site}</div>
          <div>{it.username}</div>
          <button onClick={() => onRequestOtp(it._id)}>View (OTP)</button>
        </div>
      ))}
      {otpFor && <OtpModal id={otpFor} master={master} onClose={()=>setOtpFor(null)} />}
    </div>
  );
}
