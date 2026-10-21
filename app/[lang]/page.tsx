import { notFound } from "next/navigation";
import ContactCard from "@/components/ContactCard";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Survey from "@/components/Survey";
import { ArrowRight, Clipboard, Mail, Send, WhatsApp } from "@/components/icons";
import { getDictionary } from "@/lib/dictionary";
import {
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  MAIN_SITE_URL,
  TELEGRAM_URL,
  WHATSAPP_DISPLAY,
  WHATSAPP_DISPLAY_2,
  WHATSAPP_NUMBER_2,
  isLocale,
  whatsappUrl,
} from "@/lib/site";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const wa = whatsappUrl(t.contact.waText);

  return (
    <>
      <a href="#content" className="skip">
        {t.skip}
      </a>
      <div className="field" aria-hidden="true">
        <div className="field-l field-l1" />
        <div className="field-l field-l2" />
        <div className="field-l field-l3" />
        <div className="field-l field-l4" />
        <div className="field-wash" />
        <div className="field-grain" />
      </div>

      <div className="page">
        <Nav locale={lang} />

        <main id="content" tabIndex={-1}>
          {/* Hero */}
          <section className="hero" aria-labelledby="hero-title">
            <div className="wrap hero-grid">
              <div className="hero-copy">
                <span className="eyebrow">
                  <span className="tag">{t.hero.tag}</span> {t.hero.eyebrow}
                </span>
                <h1 id="hero-title" className="h-display">
                  {t.hero.titleA} <span className="ser">{t.hero.titleEm}</span> {t.hero.titleB}
                </h1>
                <p className="lead">{t.hero.lead}</p>
                <div className="actions">
                  <a className="cta" href="#survei">
                    {t.hero.start}
                    <span className="cta-dot" aria-hidden="true">
                      <ArrowRight size={16} />
                    </span>
                  </a>
                  <a className="ghost" href="#kontak">
                    {t.hero.contact}
                  </a>
                </div>
                <div className="hero-note">
                  <span className="chips" aria-hidden="true">
                    {t.hero.chips.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </span>
                  {t.hero.note}
                </div>
              </div>

              <div className="hero-side">
                <div className="task pglass">
                  <div className="task-h">
                    <span className="ic" aria-hidden="true">
                      <Clipboard size={22} />
                    </span>
                    <div>
                      <b>{t.hero.previewTitle}</b>
                      <small>{t.hero.previewSub}</small>
                    </div>
                  </div>
                  <ol>
                    {t.hero.previewSteps.map((s, i) => (
                      <li key={s} data-state={i === 0 ? "on" : undefined}>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="side-quote">
                  {t.hero.quote} <span className="ser">{t.hero.quoteEm}</span>.
                </p>
              </div>
            </div>
          </section>

          {/* Why */}
          <section id="kenapa" className="sec" aria-labelledby="why-title">
            <div className="wrap">
              <div className="sec-head sec-head-center rv">
                <span className="eyebrow">
                  <span className="tag">{t.why.tag}</span>
                </span>
                <h2 id="why-title" className="h2">
                  {t.why.titleA} <span className="ser">{t.why.titleEm}</span>.
                </h2>
                <p className="lead">{t.why.lead}</p>
              </div>
              <ol className="why-grid">
                {t.why.cards.map((c, i) => (
                  <li key={c.title} className="why-card pglass rv">
                    <div>
                      <span className="num tabular-nums">
                        {String(i + 1).padStart(2, "0")} / {String(t.why.cards.length).padStart(2, "0")}
                      </span>
                      <h3>{c.title}</h3>
                      <p>{c.body}</p>
                    </div>
                    <div className="flow" aria-hidden="true">
                      {c.viz.map((v, j) => (
                        <span key={v} style={j > 0 ? { marginLeft: 0 } : undefined}>
                          {v}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Survey */}
          <section id="survei" className="sec" aria-labelledby="survey-title">
            <div className="wrap">
              <div className="sec-head sec-head-center rv">
                <span className="eyebrow">
                  <span className="tag">{t.survey.tag}</span>
                </span>
                <h2 id="survey-title" className="h2">
                  {t.survey.titleA} <span className="ser">{t.survey.titleEm}</span> {t.survey.titleB}
                </h2>
                <p className="lead">{t.survey.lead}</p>
              </div>
              <Survey locale={lang} />
            </div>
          </section>

          {/* Contact */}
          <section id="kontak" className="sec" aria-labelledby="contact-title">
            <div className="wrap contact-layout">
              <div className="contact-copy rv">
                <span className="eyebrow">
                  <span className="tag">{t.contact.tag}</span>
                </span>
                <h2 id="contact-title" className="h2">
                  {t.contact.titleA} <span className="ser">{t.contact.titleEm}</span>
                  {t.contact.titleB}
                </h2>
                <p className="lead">{t.contact.lead}</p>
                <div className="contact-direct">
                  <a href={wa} target="_blank" rel="noopener noreferrer">
                    <WhatsApp size={16} /> {WHATSAPP_DISPLAY}
                  </a>
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                    <Send size={16} /> @aoseratech
                  </a>
                  <a href={`mailto:${CONTACT_EMAIL}`}>
                    <Mail size={16} /> {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
              <div className="rv">
                <ContactCard locale={lang} />
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="wrap">
            <div className="footer-grid">
              <div>
                <a className="brand" href={`/${lang}`}>
                  <i className="brand-mark" aria-hidden="true" />
                  aosera
                </a>
                <p>{t.footer.blurb}</p>
              </div>
              <div>
                <h4>aosera</h4>
                <ul>
                  <li>
                    <a href={`${MAIN_SITE_URL}/${lang}`} target="_blank" rel="noopener noreferrer">
                      {t.footer.mainSite}
                    </a>
                  </li>
                  <li>
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                      Instagram @aoseratech
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4>{t.footer.contact}</h4>
                <ul>
                  <li>
                    <a href={wa} target="_blank" rel="noopener noreferrer">
                      WhatsApp {WHATSAPP_DISPLAY}
                    </a>
                  </li>
                  <li>
                    <a href={whatsappUrl(t.contact.waText, WHATSAPP_NUMBER_2)} target="_blank" rel="noopener noreferrer">
                      WhatsApp {WHATSAPP_DISPLAY_2}
                    </a>
                  </li>
                  <li>
                    <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                      Telegram @aoseratech
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2026 aosera</span>
              <span>{t.footer.madeIn}</span>
            </div>
          </div>
        </footer>
      </div>
      <Reveal />
    </>
  );
}
