"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";

type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "wardrobe-ai-theme";
const options: { id: ThemePreference; label: string; description: string; icon: typeof Monitor }[] = [
  { id: "system", label: "Auto", description: "Follow your device", icon: Monitor },
  { id: "light", label: "Light", description: "Soft, bright surfaces", icon: Sun },
  { id: "dark", label: "Dark", description: "Graphite Studio Glass", icon: Moon },
];

function readPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // The site still follows the system preference when storage is blocked.
  }
  return "system";
}

function applyThemeColor(theme: ThemePreference) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
  document.documentElement.dataset.colorScheme = resolved;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = resolved === "dark" ? "#090b11" : "#f5f7fb";
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemePreference>("system");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preference = readPreference();
    document.documentElement.dataset.theme = preference;
    setTheme(preference);
  }, []);

  useEffect(() => {
    applyThemeColor(theme);
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyThemeColor("system");
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function chooseTheme(preference: ThemePreference) {
    document.documentElement.dataset.theme = preference;
    applyThemeColor(preference);
    try {
      window.localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Keep the selection active for this visit if storage is unavailable.
    }
    setTheme(preference);
    setOpen(false);
  }

  const current = options.find((option) => option.id === theme) ?? options[0];
  const CurrentIcon = current.icon;

  return (
    <div className="theme-switcher" ref={rootRef}>
      <button
        className="theme-switcher-trigger"
        type="button"
        aria-label={`Appearance: ${current.label}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        title={`Appearance: ${current.label}`}
      >
        <CurrentIcon size={17} aria-hidden="true" />
        <span className="theme-switcher-current">{current.label}</span>
      </button>
      {open && (
        <section className="theme-switcher-popover" role="dialog" aria-label="Choose appearance">
          <div className="theme-switcher-heading"><span><Palette size={15} /></span><div><strong>Appearance</strong><small>Make it feel like yours</small></div></div>
          <div className="theme-switcher-options" role="group" aria-label="Color theme">
            {options.map(({ id, label, description, icon: Icon }) => (
              <button key={id} className={`theme-switcher-option${theme === id ? " is-selected" : ""}`} type="button" aria-pressed={theme === id} onClick={() => chooseTheme(id)}>
                <span className="theme-option-icon"><Icon size={16} /></span>
                <span className="theme-option-copy"><strong>{label}</strong><small>{description}</small></span>
                {theme === id && <Check size={15} className="theme-option-check" />}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
