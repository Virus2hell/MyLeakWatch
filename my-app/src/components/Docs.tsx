import React, { useEffect, useRef, useState } from 'react';

type Section = {
  id: string;
  title: string;
  items?: { id: string; title: string }[];
};

const SECTIONS: Section[] = [
  { id: 'intro', title: 'Introduction' },
  { id: 'features', title: 'Features' },
  {
    id: 'email-breach', title: 'Email Breach',
    items: [
      { id: 'email-how', title: 'How it happens' },
      { id: 'email-prevent', title: 'Prevention' },
      { id: 'email-after', title: 'After a breach' }
    ]
  },
  {
    id: 'password-breach', title: 'Password Breach',
    items: [
      { id: 'pwd-how', title: 'How it happens' },
      { id: 'pwd-prevent', title: 'Prevention' },
      { id: 'pwd-after', title: 'After a breach' }
    ]
  },
  {
    id: 'image-breach', title: 'Image Breach',
    items: [
      { id: 'img-how', title: 'How it happens' },
      { id: 'img-prevent', title: 'Prevention' },
      { id: 'img-after', title: 'After misuse' }
    ]
  },
  {
  id: 'aadhaar-breach', title: 'Aadhaar Breach',
  items: [
    { id: 'aadhaar-how', title: 'How it happens' },
    { id: 'aadhaar-prevent', title: 'Prevention' },
    { id: 'aadhaar-after', title: 'After a breach' }
  ]
},
  { id: 'prevention-checklist', title: 'Universal Prevention' },
  { id: 'after-checklist', title: 'After‑Breach Playbook' },
  { id: 'faq', title: 'FAQ' },
  { id: 'glossary', title: 'Glossary' },
  { id: 'helplines', title: 'Helplines' },
];

export default function Docs() {
  const [active, setActive] = useState<string>('intro');
  const ioRef = useRef<IntersectionObserver | null>(null);
  const isProgrammaticScroll = useRef(false);

  // Set up scroll spy
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll('[data-doc-section="true"], .subhead')
    ) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        if (visible[0]) setActive((visible[0].target as HTMLElement).id);
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0.25 }
    );

    targets.forEach(t => io.observe(t));
    ioRef.current = io;
    return () => io.disconnect();
  }, []);

  // Jump to hash on load
  useEffect(() => {
    const h = window.location.hash.replace('#', '');
    if (h) {
      const el = document.getElementById(h);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    isProgrammaticScroll.current = true;
    setActive(id);
    window.history.replaceState(null, '', `#${id}`);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { isProgrammaticScroll.current = false; }, 450);
  };

  return (
    <div className="docs-page">
      {/* Hero */}
      <div className="docs-hero">
        <div className="docs-hero-inner">
          <h1 className="text-3xl md:text-4xl font-extrabold">Docs</h1>
          <p>Understand breaches and protect your identity with MyLeakWatch.</p>
        </div>
      </div>

      {/* Body */}
      <div className="docs-shell">
        {/* Left nav */}
        <aside className="docs-nav" aria-label="Documentation navigation">
          <ul>
            {SECTIONS.map(sec => (
              <li key={sec.id}>
                <button
                  className={`nav-link ${active === sec.id ? 'active' : ''}`}
                  onClick={() => jump(sec.id)}
                >
                  {sec.title}
                </button>
                {sec.items && (
                  <ul className="nav-sub">
                    {sec.items.map(s => (
                      <li key={s.id}>
                        <button
                          className={`nav-sublink ${active === s.id ? 'active' : ''}`}
                          onClick={() => jump(s.id)}
                        >
                          {s.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <main className="docs-content">
          <Section id="intro" title="Introduction">
            <p>
              MyLeakWatch helps identify whether personal identifiers like email addresses or images
              appear in known data breaches or unauthorized locations online, and guides safe next steps.
            </p>
            <ul>
              <li>Check if an email appears in breach datasets with privacy‑first lookups.</li>
              <li>Evaluate password exposure using k‑anonymity without sending the password.</li>
              <li>Run reverse image checks to spot unauthorized reuse of photos/avatars.</li>
              <li>Get practical, prioritized actions to secure accounts and identities.</li>
            </ul>
          </Section>

          <Section id="features" title="Features">
            <ul>
              <li>Email breach lookups with caching and clear breach metadata.</li>
              <li>Password exposure check using SHA‑1 prefix (range method) with counts.</li>
              <li>Image reverse search via provider adapters (Bing Visual or TinEye).</li>
              <li>Local AI assistant for safe guidance; no plaintext secrets stored.</li>
              <li>Privacy by design with ephemeral processing and minimal logs.</li>
            </ul>
          </Section>

          <Section id="email-breach" title="Email Breach">
  <h3 id="email-how" data-doc-section="true" className="subhead">How it happens</h3>
  <ul>
    <li><strong>Phishing attacks:</strong> Fake emails trick users into entering credentials on malicious websites.</li>
    <li><strong>Credential stuffing:</strong> Attackers reuse leaked passwords from other breaches.</li>
    <li><strong>Database breaches:</strong> Company servers are hacked and user data is leaked.</li>
    <li><strong>Malware / infostealers:</strong> Installed via attachments or pirated software, stealing saved emails and passwords.</li>
    <li><strong>Email spoofing:</strong> Attackers impersonate your email to scam others.</li>
    <li><strong>Public WiFi attacks (MITM):</strong> Login data intercepted on insecure networks.</li>
  </ul>

  <h3 id="email-prevent" data-doc-section="true" className="subhead">Prevention</h3>
  <ul>
    <li>Use a unique password for every website.</li>
    <li>Enable Multi-Factor Authentication (MFA).</li>
    <li>Use a password manager for secure storage.</li>
    <li>Avoid clicking unknown links or attachments.</li>
    <li>Verify sender email domains carefully.</li>
    <li>Avoid logging into accounts on public WiFi.</li>
  </ul>

  <h3 id="email-after" data-doc-section="true" className="subhead">After a breach</h3>
  <ul>
    <li>Immediately change your password.</li>
    <li>Enable MFA on all accounts.</li>
    <li>Log out from all active sessions/devices.</li>
    <li>Check for suspicious emails sent from your account.</li>
    <li>Inform contacts if spam was sent from your email.</li>
    <li>Run antivirus scan on your device.</li>
  </ul>
</Section>

<Section id="password-breach" title="Password Breach">
  <h3 id="pwd-how" data-doc-section="true" className="subhead">How it happens</h3>
  <ul>
    <li>Weak or outdated hashing (MD5, plain text leaks).</li>
    <li>Password reuse across multiple websites.</li>
    <li>Phishing websites stealing login credentials.</li>
    <li>Keyloggers recording keystrokes.</li>
    <li>Brute force or dictionary attacks.</li>
  </ul>

  <h3 id="pwd-prevent" data-doc-section="true" className="subhead">Prevention</h3>
  <ul>
    <li>Use long, strong passwords (12–16+ characters).</li>
    <li>Use passphrases instead of simple passwords.</li>
    <li>Never reuse passwords across sites.</li>
    <li>Use a trusted password manager.</li>
    <li>Enable MFA for additional security.</li>
  </ul>

  <h3 id="pwd-after" data-doc-section="true" className="subhead">After a breach</h3>
  <ul>
    <li>Change the compromised password immediately.</li>
    <li>Update all accounts using the same password.</li>
    <li>Enable MFA on critical accounts.</li>
    <li>Check breach databases for exposure.</li>
    <li>Revoke active sessions and tokens.</li>
  </ul>
</Section>

<Section id="image-breach" title="Image Breach">
  <h3 id="img-how" data-doc-section="true" className="subhead">How it happens</h3>
  <ul>
    <li>Images scraped from public social media profiles.</li>
    <li>Cloud storage leaks or misconfigured sharing settings.</li>
    <li>Unauthorized reposting on forums or websites.</li>
    <li>Use in fake accounts or impersonation.</li>
    <li>Deepfake misuse using AI tools.</li>
  </ul>

  <h3 id="img-prevent" data-doc-section="true" className="subhead">Prevention</h3>
  <ul>
    <li>Keep profiles private where possible.</li>
    <li>Remove EXIF metadata before uploading images.</li>
    <li>Avoid sharing sensitive images online.</li>
    <li>Use watermarks for important media.</li>
    <li>Regularly search your images online.</li>
  </ul>

  <h3 id="img-after" data-doc-section="true" className="subhead">After misuse</h3>
  <ul>
    <li>Report impersonation to the platform.</li>
    <li>File DMCA takedown requests where applicable.</li>
    <li>Keep evidence (screenshots, URLs, timestamps).</li>
    <li>Report to cybercrime authorities.</li>
    <li>Seek legal help in serious cases.</li>
  </ul>
</Section>

<Section id="aadhaar-breach" title="Aadhaar Breach">
  <h3 id="aadhaar-how" data-doc-section="true" className="subhead">How it happens</h3>
  <ul>
    <li>Data leaks from banks, telecoms, or third-party vendors.</li>
    <li>Fake KYC calls asking for Aadhaar details.</li>
    <li>Uploading Aadhaar publicly (job sites, WhatsApp).</li>
    <li>Unauthorized eKYC leading to SIM or loan fraud.</li>
    <li>Sharing full Aadhaar copies without masking.</li>
  </ul>

  <h3 id="aadhaar-prevent" data-doc-section="true" className="subhead">Prevention</h3>
  <ul>
    <li>Use Masked Aadhaar instead of full copy.</li>
    <li>Lock Aadhaar biometrics via UIDAI website.</li>
    <li>Do not share Aadhaar casually online.</li>
    <li>Verify authenticity before submitting Aadhaar.</li>
    <li>Check Aadhaar authentication history regularly.</li>
  </ul>

  <h3 id="aadhaar-after" data-doc-section="true" className="subhead">After a breach</h3>
  <ul>
    <li>Lock your Aadhaar biometrics immediately.</li>
    <li>Download and use masked Aadhaar.</li>
    <li>Check UIDAI authentication logs.</li>
    <li>Report misuse on cybercrime portal.</li>
    <li>Inform banks/telecom providers if fraud occurs.</li>
  </ul>
</Section>

<Section id="prevention-checklist" title="Universal Prevention">
  <ul>
    <li>Use separate emails for banking, personal, and spam.</li>
    <li>Enable MFA on all important accounts.</li>
    <li>Keep devices updated and secure.</li>
    <li>Regularly audit connected apps and permissions.</li>
    <li>Avoid using pirated software or unknown downloads.</li>
  </ul>
</Section>

<Section id="after-checklist" title="After-Breach Playbook">
  <ol>
    <li>Identify affected accounts and data.</li>
    <li>Change passwords and enable MFA.</li>
    <li>Log out from all devices and sessions.</li>
    <li>Scan device for malware.</li>
    <li>Notify contacts if necessary.</li>
    <li>Monitor financial and email activity.</li>
    <li>Report serious cases to authorities.</li>
  </ol>
</Section>

<Section id="faq" title="FAQ">
  <p><strong>Can someone hack me with just my email?</strong> Not directly, but it increases phishing risk.</p>
  <p><strong>Is checking password safe?</strong> Yes, k-anonymity ensures your password is not exposed.</p>
  <p><strong>What is the biggest risk?</strong> Password reuse across multiple sites.</p>
</Section>

<Section id="glossary" title="Glossary">
  <ul>
    <li><strong>Phishing:</strong> Fake messages designed to steal sensitive information.</li>
    <li><strong>Credential Stuffing:</strong> Using leaked credentials on multiple websites.</li>
    <li><strong>MFA:</strong> Multi-Factor Authentication for extra security.</li>
    <li><strong>Infostealer:</strong> Malware that steals personal data.</li>
    <li><strong>Deepfake:</strong> AI-generated fake media.</li>
  </ul>
</Section>

<Section id="helplines" title="Emergency & Helplines (India)">
  <ul>
    <li><strong>Cyber Crime Helpline:</strong> 1930</li>
    <li><strong>Cyber Crime Portal:</strong> https://cybercrime.gov.in</li>
    <li><strong>UIDAI Helpline (Aadhaar):</strong> 1947</li>
    <li><strong>Police Emergency:</strong> 100</li>
    <li><strong>Women Helpline:</strong> 1091</li>
  </ul>
</Section>
        </main>
      </div>
    </div>
  );
}

function Section({ id, title, children }: React.PropsWithChildren<{ id: string; title: string }>) {
  return (
    <section
      id={id}
      data-doc-section="true"
      aria-labelledby={`${id}-title`}
      className="mb-10"
    >
      <h2
        id={`${id}-title`}
        className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3 docs-heading"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
