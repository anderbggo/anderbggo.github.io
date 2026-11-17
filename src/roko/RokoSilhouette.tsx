import { useEffect, useRef, useState } from "react";

type RokoSilhouetteProps = {
  label: string;
  phrases: readonly string[];
  wagging: boolean;
};

/** Roko seen from behind, sitting on the hill and looking up at the lanterns. */
export default function RokoSilhouette({ label, phrases, wagging }: RokoSilhouetteProps) {
  const [tilt, setTilt] = useState<"left" | "right" | null>(null);
  const [phrase, setPhrase] = useState<string | null>(null);
  const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const lastPhrase = useRef(-1);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleClick = () => {
    let next = Math.floor(Math.random() * phrases.length);
    if (next === lastPhrase.current) next = (next + 1) % phrases.length;
    lastPhrase.current = next;
    setPhrase(phrases[next]);
    setTilt((current) => (current === "left" ? "right" : "left"));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setPhrase(null);
      setTilt(null);
    }, 2200);
  };

  return (
    <div className={`roko-dog ${tilt ? `is-tilted-${tilt}` : ""} ${wagging || phrase ? "is-wagging" : ""}`}>
      {phrase && (
        <span className="roko-dog-bubble" role="status">
          {phrase}
        </span>
      )}
      <button type="button" className="roko-dog-button" onClick={handleClick} aria-label={label}>
        <svg viewBox="0 0 200 230" aria-hidden="true" focusable="false">
          <defs>
            <filter id="roko-sketch" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3">
                {!reducedMotion && (
                  <animate attributeName="seed" values="3;7;11" dur="0.5s" calcMode="discrete" repeatCount="indefinite" />
                )}
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" scale="3.2" />
            </filter>
          </defs>
          <ellipse cx="100" cy="222" rx="74" ry="7" fill="#000" opacity=".35" />
          <g filter="url(#roko-sketch)">
            <path className="roko-dog-tail" d="M136 206c22 8 44 2 54-18" />
            <path
              className="roko-dog-fur"
              d="M100 78c-28 0-46 40-48 80-2 38 14 56 48 56s50-18 48-56c-2-40-20-80-48-80Z"
            />
            <path className="roko-dog-shade" d="M60 184c6 18 22 28 38 28M140 184c-6 18-22 28-38 28M100 100c-2 34 0 70 0 98" />
            <ellipse className="roko-dog-fur" cx="70" cy="214" rx="17" ry="7" />
            <ellipse className="roko-dog-fur" cx="130" cy="214" rx="17" ry="7" />
            <path className="roko-dog-collar" d="M72 92c16 11 40 11 56 0l2 11c-18 12-42 12-60 0Z" />
            <g className="roko-dog-head">
              <ellipse className="roko-dog-fur" cx="100" cy="33" rx="13" ry="12" />
              <ellipse cx="100" cy="22" rx="6" ry="4" fill="#2b211a" />
              <ellipse className="roko-dog-fur" cx="100" cy="58" rx="32" ry="30" />
              <path className="roko-dog-ear" d="M72 48c-12 4-16 26-10 42 4 8 14 4 16-8 2-12 2-26-6-34Z" />
              <path className="roko-dog-ear" d="M128 48c12 4 16 26 10 42-4 8-14 4-16-8-2-12-2-26 6-34Z" />
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
}
