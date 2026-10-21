"use client";

import { LOCALES, whatsappUrl, type Locale } from "@/lib/site";
import { getDictionary } from "@/lib/dictionary";
import { useRef, useState } from "react";
import { MessageCircle, Moon, Plus, Sun } from "./icons";

function isDarkNow() {
  const set = document.documentElement.dataset.theme;
  if (set) return set === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function Nav({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [phase, setPhase] = useState<"idle" | "start" | "end">("idle");
  const timer = useRef<number | undefined>(undefined);

  // Mirrors aosera-website's "Hubungi kami" pill: avatars slide in with a plus, then merge and reveal the label.
  const enter = () => {
    window.clearTimeout(timer.current);
    setPhase("start");
    timer.current = window.setTimeout(() => setPhase("end"), 520);
  };
  const leave = () => {
    window.clearTimeout(timer.current);
    setPhase("idle");
  };
  const toggleTheme = () => {
    const next = isDarkNow() ? "light" : "dark";
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    // Picking the device's own theme clears the override, so it keeps following the device.
    try {
      if ((next === "dark") === systemDark) {
        delete document.documentElement.dataset.theme;
        localStorage.removeItem("theme");
      } else {
        document.documentElement.dataset.theme = next;
        localStorage.setItem("theme", next);
      }
    } catch {
      document.documentElement.dataset.theme = next;
    }
  };

  return (
    <header className="navwrap">
      <nav className="nav pglass" aria-label={t.nav.label}>
        <a className="brand" href={`/${locale}`} aria-label={t.nav.home}>
          <i className="brand-mark" aria-hidden="true" />
          aosera
        </a>
        <div className="navlinks">
          <a href="#survei">{t.nav.survey}</a>
          <a href="#kenapa">{t.nav.why}</a>
          <a href="#kontak">{t.nav.contact}</a>
        </div>
        <div className="nav-tools">
          <ul className="lang" aria-label={t.nav.language}>
            {LOCALES.map((l) => (
              <li key={l}>
                <a href={`/${l}`} hrefLang={l} lang={l} aria-current={l === locale ? "true" : undefined}>
                  {l.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
          <button type="button" className="theme-btn" onClick={toggleTheme} aria-label={`${t.nav.themeToDark} / ${t.nav.themeToLight}`}>
            <Sun className="sun" size={18} />
            <Moon className="moon" size={18} />
          </button>
          <a
            className="git"
            data-phase={phase}
            href={whatsappUrl(t.contact.waText)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.ctaAria}
            onPointerEnter={(e) => e.pointerType === "mouse" && enter()}
            onPointerLeave={leave}
            onFocus={enter}
            onBlur={leave}
          >
            <span className="git-size" aria-hidden="true">
              {t.nav.cta}
            </span>
            <span className="git-def" aria-hidden="true">
              {t.nav.ctaShort}
            </span>
            <span className="git-act" aria-hidden="true">
              <span className="git-cl">
                <span className="git-av" />
                <span className="git-plus">
                  <Plus size={14} strokeWidth={2.4} />
                </span>
                <span className="git-you">{t.nav.you}</span>
              </span>
              <span className="git-hv">{t.nav.cta}</span>
            </span>
            <span className="git-ic" aria-hidden="true">
              <MessageCircle size={18} strokeWidth={1.9} />
            </span>
          </a>
        </div>
      </nav>
    </header>
  );
}
