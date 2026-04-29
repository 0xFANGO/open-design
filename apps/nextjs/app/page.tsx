export default function HomePage() {
  return (
    <main className="shell">
      <section className="panel">
        <p className="eyebrow">Open Design</p>
        <h1>Next.js desktop control plane is running.</h1>
        <p className="summary">
          This minimal app proves the new nextjs sidecar URL can be discovered
          by the Electron desktop runtime.
        </p>
        <dl className="facts">
          <div>
            <dt>Runtime</dt>
            <dd>apps/nextjs</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd data-testid="runtime-status">ready</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
