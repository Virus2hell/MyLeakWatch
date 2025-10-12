// Client-side crypto utilities: PBKDF2 + AES-GCM
// References: MDN Web Crypto deriveKey / AES-GCM patterns. [web:4][web:7]

export type EncryptedBlob = {
  algo: 'AES-GCM';
  ivB64: string;
  saltB64: string;
  ctB64: string;
  iterations: number;
};

const ITERATIONS = 300_000; // raise to 600k if perf allows [web:7]

function b64enc(bytes: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

function b64dec(b64: string): ArrayBuffer {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
}

async function getKeyMaterial(passphrase: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );
}

async function deriveDek(passphrase: string, salt: Uint8Array, iterations = ITERATIONS): Promise<CryptoKey> {
  const keyMaterial = await getKeyMaterial(passphrase);
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptSecret(passphrase: string, plaintext: string): Promise<EncryptedBlob> {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const dek = await deriveDek(passphrase, salt);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, dek, enc.encode(plaintext));
  return {
    algo: 'AES-GCM',
    ivB64: b64enc(iv.buffer),
    saltB64: b64enc(salt.buffer),
    ctB64: b64enc(ct),
    iterations: ITERATIONS,
  };
}

export async function decryptSecret(passphrase: string, blob: EncryptedBlob): Promise<string> {
  const dec = new TextDecoder();
  const iv = new Uint8Array(b64dec(blob.ivB64));
  const salt = new Uint8Array(b64dec(blob.saltB64));
  const dek = await deriveDek(passphrase, salt, blob.iterations);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, dek, b64dec(blob.ctB64));
  return dec.decode(pt);
}
