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
  { id: 'prevention-checklist', title: 'Universal Prevention' },
  { id: 'after-checklist', title: 'After‑Breach Playbook' },
  { id: 'faq', title: 'FAQ' },
  { id: 'glossary', title: 'Glossary' }
];

export default function Docs() {
  const [active, setActive] = useState<string>('intro');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-doc-section="true"]')) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter(e => e.isIntersecting)
          .sort((a,b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop)[0];
        if (top) setActive((top.target as HTMLElement).id);
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 0.25] }
    );
    nodes.forEach(n => io.observe(n));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#','');
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const jump = (id: string) => {
    window.history.replaceState(null, '', `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="docs-page">
      <div className="docs-hero">
        <div className="docs-hero-inner">
          <h1>Docs</h1>
          <p>Understand breaches and protect your identity with MyLeakWatch.</p>
        </div>
      </div>

      <div className="docs-shell">
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

        <main className="docs-content" ref={contentRef}>
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
            <p>
              Email addresses leak when services suffer database compromises, misconfigured storage,
              phishing kits harvest logins, or third‑party vendors are breached and lists circulate.
            </p>
            <h3 id="email-prevent" data-doc-section="true" className="subhead">Prevention</h3>
            <ul>
              <li>Unique passwords per site; enable app‑based MFA.</li>
              <li>Use aliases for signups; avoid publishing your primary address.</li>
              <li>Be cautious with links/attachments and verify sender domains.</li>
            </ul>
            <h3 id="email-after" data-doc-section="true" className="subhead">After a breach</h3>
            <ul>
              <li>Change the site password and enable MFA; review sessions/devices.</li>
              <li>Hunt for breach‑related phishing; report spam and block.</li>
              <li>Monitor statements and identity alerts; consider credit freezes.</li>
            </ul>
          </Section>

          <Section id="password-breach" title="Password Breach">
            <h3 id="pwd-how" data-doc-section="true" className="subhead">How it happens</h3>
            <p>
              Passwords are exposed by database dumps (weak hashing), phishing, infostealers,
              or reuse that enables credential stuffing across sites.
            </p>
            <h3 id="pwd-prevent" data-doc-section="true" className="subhead">Prevention</h3>
            <ul>
              <li>Password manager + random passwords; zero reuse.</li>
              <li>MFA everywhere; prefer authenticator apps or security keys.</li>
              <li>Keep OS/browser updated; run reputable endpoint protection.</li>
            </ul>
            <h3 id="pwd-after" data-doc-section="true" className="subhead">After a breach</h3>
            <ul>
              <li>Rotate the password immediately; revoke tokens and sessions.</li>
              <li>Check the password via k‑anonymity; retire exposed ones permanently.</li>
              <li>Update recovery channels; remove stale backup factors.</li>
            </ul>
          </Section>

          <Section id="image-breach" title="Image Breach">
            <h3 id="img-how" data-doc-section="true" className="subhead">How it happens</h3>
            <p>
              Images leak via public profiles, scraped datasets, compromised albums, or reposts;
              search engines and forums can amplify distribution quickly.
            </p>
            <h3 id="img-prevent" data-doc-section="true" className="subhead">Prevention</h3>
            <ul>
              <li>Use privacy controls; strip EXIF; watermark sensitive media.</li>
              <li>Prefer expiring share links; avoid public posts for private photos.</li>
              <li>Run periodic reverse image checks for impersonation.</li>
            </ul>
            <h3 id="img-after" data-doc-section="true" className="subhead">After misuse</h3>
            <ul>
              <li>File takedowns (DMCA/right‑to‑be‑forgotten equivalents) where applicable.</li>
              <li>Report impersonation; keep evidence (URLs, timestamps, screenshots).</li>
              <li>For extortion/intimate imagery: contact authorities and support orgs.</li>
            </ul>
          </Section>

          <Section id="prevention-checklist" title="Universal Prevention">
            <ul>
              <li>Minimize shared data; rotate secrets on a fixed cadence.</li>
              <li>Device encryption, auto‑lock, and hardware‑bound backup keys.</li>
              <li>Segment email identities (primary, finance, shopping, throwaway).</li>
              <li>Quarterly audit of third‑party app permissions.</li>
            </ul>
          </Section>

          <Section id="after-checklist" title="After‑Breach Playbook">
            <ol>
              <li>Identify accounts; change credentials; invalidate sessions.</li>
              <li>Enable MFA; update recovery information.</li>
              <li>Scan devices; remove malicious extensions.</li>
              <li>Notify contacts if spam was sent from your address.</li>
              <li>Monitor statements; place credit freeze/fraud alerts if needed.</li>
            </ol>
          </Section>

          <Section id="faq" title="FAQ">
            <p><strong>Do you store passwords?</strong> No—range method only; no raw passwords stored or transmitted.</p>
            <p><strong>Are images stored?</strong> No—temporary processing, then deletion unless monitoring is enabled.</p>
            <p><strong>Why results differ?</strong> Provider coverage and freshness vary; we combine sources for breadth.</p>
          </Section>

          <Section id="glossary" title="Glossary">
            <ul>
              <li><strong>Credential stuffing:</strong> Reusing leaked credentials on other sites.</li>
              <li><strong>MFA:</strong> Multi‑factor authentication (app code or security key).</li>
              <li><strong>k‑anonymity (range):</strong> Checking only a SHA‑1 prefix for private exposure lookups.</li>
              <li><strong>pHash:</strong> Perceptual hash for near‑duplicate image detection.</li>
            </ul>
          </Section>
        </main>
      </div>
    </div>
  );
}

function Section({ id, title, children }: React.PropsWithChildren<{ id: string; title: string }>) {
  return (
    <section id={id} data-doc-section="true" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  );
}
