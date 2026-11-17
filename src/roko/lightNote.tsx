import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { hasWords, type Tribute } from "./tributes";

const noteMaxWidth = 260;
const noteOffset = 22;
const noteGap = 12;

export type ActiveLight = { id: string; below: boolean; shift: number };

export type LightNoteLabels = {
  formatDate: (iso: string) => string;
};

/** One shared note for every candle and lantern: hover or focus opens it, tapping elsewhere closes it. */
export function useLightNote() {
  const [active, setActive] = useState<ActiveLight | null>(null);

  useEffect(() => {
    if (!active) return;
    const close = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest("[data-light]")) setActive(null);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setActive(null);
    document.addEventListener("pointerdown", close);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const handlers = useCallback((id: string) => {
    const open = (event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
      const element = event.currentTarget;
      const scene = element.closest(".roko-scene")?.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      let shift = 0;
      if (scene) {
        // Keep the note (anchored 22px left of the light) inside the scene.
        const noteWidth = Math.min(noteMaxWidth, window.innerWidth * 0.72);
        const anchor = rect.left + rect.width / 2 - scene.left - noteOffset;
        const clamped = Math.min(Math.max(anchor, noteGap), scene.width - noteWidth - noteGap);
        shift = Math.round(clamped - anchor);
      }
      setActive({ id, below: scene ? rect.top - scene.top < scene.height * 0.35 : false, shift });
    };
    const close = () => setActive((current) => (current?.id === id ? null : current));
    return {
      "data-light": "",
      onMouseEnter: open,
      onFocus: open,
      onClick: open,
      onMouseLeave: close,
      onBlur: close,
    };
  }, []);

  return { active, handlers };
}

function LightNote({
  tribute,
  active,
  labels,
}: {
  tribute: Tribute;
  active: ActiveLight;
  labels: LightNoteLabels;
}) {
  const meta = [tribute.name.trim(), labels.formatDate(tribute.createdAt)].filter(Boolean).join(" · ");
  return (
    <span
      className={`roko-light-note ${active.below ? "is-below" : ""}`}
      style={{ "--note-shift": `${active.shift}px` } as CSSProperties}
      aria-hidden="true"
    >
      {hasWords(tribute) && <span className="roko-light-note-message">{tribute.message}</span>}
      <span className="roko-light-note-meta">{meta}</span>
    </span>
  );
}

type LightProps = {
  tribute: Tribute;
  prefix: string;
  className: string;
  style?: CSSProperties;
  labels: LightNoteLabels;
  active: ActiveLight | null;
  handlers: ReturnType<typeof useLightNote>["handlers"];
  children: ReactNode;
};

/** A candle or lantern; hovering, focusing or tapping it shows its message, name and date. */
export function Light({ tribute, prefix, className, style, labels, active, handlers, children }: LightProps) {
  const isActive = active?.id === tribute.id;
  const label = [prefix, tribute.name.trim(), tribute.message.trim(), labels.formatDate(tribute.createdAt)]
    .filter(Boolean)
    .map((part) => part.replace(/[.!?…]+$/u, ""))
    .join(". ");
  return (
    <button
      type="button"
      className={`${className} ${hasWords(tribute) ? "has-words" : ""} ${isActive ? "is-active" : ""}`}
      style={style}
      aria-label={label}
      {...handlers(tribute.id)}
    >
      {children}
      {isActive && active && <LightNote tribute={tribute} active={active} labels={labels} />}
    </button>
  );
}
