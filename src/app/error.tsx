'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
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
            fontFamily: 'sans-serif',
          }}
        >
          <span style={{ fontSize: '4rem' }}>⚠️</span>
          <h2 style={{ fontSize: '2rem' }}>Something went wrong</h2>
          <p style={{ color: '#666' }}>
            {error.message ?? 'An unexpected error occurred.'}
          </p>
          <button
            onClick={reset}
            style={{
              background: '#e8593a',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
