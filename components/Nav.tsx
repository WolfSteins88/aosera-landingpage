"use client";

import { LOCALES, whatsappUrl, type Locale } from "@/lib/site";
import { getDictionary } from "@/lib/dictionary";
import { Moon, Sun, WhatsApp } from "./icons";

function isDarkNow() {
  const set = document.documentElement.dataset.theme;
  if (set) return set === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function Nav({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
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
          <a className="nav-cta" href={whatsappUrl(t.contact.waText)} target="_blank" rel="noopener noreferrer" aria-label={t.nav.cta}>
            <span className="long">{t.nav.cta}</span>
            <span className="short">{t.nav.ctaShort}</span>
            <i aria-hidden="true">
              <WhatsApp size={15} />
            </i>
          </a>
        </div>
      </nav>
    </header>
  );
}
