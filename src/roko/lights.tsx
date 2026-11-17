/** `withLetter` marks lights that carry words: the drawing gains a small sealed envelope. */
type LightProps = { className?: string; withLetter?: boolean };

/** A sealed envelope centred on (0, 0) at its top edge; 16×11 units. */
function Envelope() {
  return (
    <g className="roko-letter-envelope">
      <rect x="-8" y="0" width="16" height="11" rx="1.2" fill="#fbf5e8" stroke="#d9c9aa" strokeWidth=".6" />
      <path d="M-7.6 .6 0 6.4 7.6 .6" fill="none" stroke="#c9b48f" strokeWidth=".9" strokeLinejoin="round" />
      <circle cx="0" cy="6.2" r="2.1" fill="#b8302a" />
    </g>
  );
}

export function CandleIcon({ className = "", withLetter = false }: LightProps) {
  return (
    <svg
      className={`roko-candle-icon ${withLetter ? "has-letter" : ""} ${className}`}
      viewBox="0 0 24 48"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse className="roko-candle-glow" cx="12" cy="12" rx="11" ry="12" />
      <g className="roko-candle-flame">
        <path d="M12 2c3.6 4.6 5 7.4 5 10.2A5 5 0 0 1 12 17a5 5 0 0 1-5-4.8C7 9.4 8.4 6.6 12 2Z" fill="#ffb93d" />
        <path d="M12 8c1.8 2.3 2.4 3.7 2.4 5a2.4 2.4 0 0 1-4.8 0c0-1.3.6-2.7 2.4-5Z" fill="#fff4c9" />
      </g>
      <path d="M12 16.5v3.5" stroke="#3b2a1d" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="6" y="20" width="12" height="26" rx="2" fill="#f8f1e4" />
      <path d="M6 23c2 1.6 4 .2 6 1.6s4-.2 6 1" stroke="#e4d6bd" strokeWidth="1.4" fill="none" />
      {withLetter && (
        // Leaning against the foot of the candle; drawn outside the viewBox on purpose.
        <g transform="translate(24 35) rotate(-14)">
          <Envelope />
        </g>
      )}
    </svg>
  );
}

export function LanternIcon({ className = "", withLetter = false }: LightProps) {
  return (
    <svg
      className={`roko-lantern-icon ${withLetter ? "has-letter" : ""} ${className}`}
      viewBox="0 0 40 54"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse className="roko-lantern-glow" cx="20" cy="26" rx="19" ry="24" />
      <rect x="11" y="3" width="18" height="5" rx="2" fill="#6b2f17" />
      <path d="M9 8h22c4 6 5 12 5 18s-1 12-5 18H9c-4-6-5-12-5-18S5 14 9 8Z" fill="#ff9940" />
      <path d="M14 8c-2 6-3 12-3 18s1 12 3 18M26 8c2 6 3 12 3 18s-1 12-3 18M20 8v36" stroke="#c4561f" strokeWidth="1.2" fill="none" opacity=".55" />
      <ellipse cx="20" cy="30" rx="8" ry="10" fill="#ffe08a" opacity=".85" />
      <rect x="12" y="44" width="16" height="4" rx="2" fill="#6b2f17" />
      {withLetter ? (
        // The letter hangs below the lantern on a longer string, outside the viewBox on purpose.
        <g className="roko-letter-hang">
          <path d="M20 48v9" stroke="#ffcb6b" strokeWidth="1.2" strokeLinecap="round" />
          <g transform="translate(20 56)">
            <Envelope />
          </g>
        </g>
      ) : (
        <path d="M20 48v4" stroke="#ffcb6b" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}
