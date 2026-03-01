import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        textAlign: 'center',
        padding: '40px',
      }}
    >
      <span style={{ fontSize: '5rem' }}>🌊</span>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: 'var(--ocean)' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
        Looks like this wave already broke. Let&apos;s head back to shore.
      </p>
      <Link href="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  );
}
