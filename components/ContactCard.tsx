"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { getDictionary } from "@/lib/dictionary";
import { CONTACT_EMAIL, TELEGRAM_URL, whatsappUrl, type Locale } from "@/lib/site";
import { ArrowRight, Check, Mail, MessageCircle, Send } from "./icons";

type Channel = "whatsapp" | "telegram" | "email";

const HANDLE = 84;
const PAD = 6;
const OPEN_AT = 0.9;

export default function ContactCard({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).contact;
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [drag, setDrag] = useState(0);
  const [snap, setSnap] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; max: number } | null>(null);

  const hrefFor = (c: Channel) => {
    if (c === "whatsapp") return whatsappUrl(t.waText);
    if (c === "telegram") return TELEGRAM_URL;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t.emailSubject)}`;
  };

  const open = () => {
    const href = hrefFor(channel);
    if (channel === "email") window.location.href = href;
    else window.open(href, "_blank", "noopener,noreferrer");
  };

  const reset = () => {
    setSnap(true);
    setDrag(0);
  };

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    const track = trackRef.current;
    if (!track) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setSnap(false);
    start.current = { x: e.clientX - drag, max: track.clientWidth - HANDLE - PAD * 2 };
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!start.current) return;
    const { x, max } = start.current;
    setDrag(Math.min(max, Math.max(0, e.clientX - x)));
  };

  const onPointerUp = () => {
    if (!start.current) return;
    const { max } = start.current;
    start.current = null;
    if (max > 0 && drag / max >= OPEN_AT) {
      setSnap(true);
      setDrag(max);
      open();
      window.setTimeout(reset, 600);
    } else {
      reset();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  const max = trackRef.current ? trackRef.current.clientWidth - HANDLE - PAD * 2 : 1;
  const progress = Math.min(1, drag / Math.max(1, max));

  const options: { id: Channel; Icon: typeof Send }[] = [
    { id: "whatsapp", Icon: MessageCircle },
    { id: "telegram", Icon: Send },
    { id: "email", Icon: Mail },
  ];

  return (
    <div className="contact-slide">
      <div className="contact-slide-panel pglass">
        <h3>{t.cardTitle}</h3>
        <p className="contact-slide-intro">{t.cardSub}</p>
        <div className="contact-slide-options" role="radiogroup" aria-label={t.cardTitle}>
          {options.map(({ id, Icon }) => (
            <label key={id} className="contact-slide-option">
              <input
                type="radio"
                name="contact-channel"
                value={id}
                checked={channel === id}
                onChange={() => setChannel(id)}
              />
              <span className="contact-slide-icon">
                <Icon size={24} />
              </span>
              <span>
                <span className="contact-slide-label">{t.options[id].label}</span>
                <span className="contact-slide-description">{t.options[id].desc}</span>
              </span>
              <span className="contact-slide-radio" aria-hidden="true">
                <Check size={16} strokeWidth={2.4} />
              </span>
            </label>
          ))}
        </div>
        <p className="contact-slide-note">{t.note}</p>
      </div>

      <div
        ref={trackRef}
        className="contact-slide-track"
        data-snap={snap ? "" : undefined}
        style={{ "--drag": `${drag}px`, "--p": progress } as CSSProperties}
      >
        <span className="contact-slide-fill" aria-hidden="true" />
        <span className="contact-slide-status" aria-hidden="true">
          {t.slide}
        </span>
        <button
          type="button"
          className="contact-slide-handle"
          aria-label={t.slideAria(t.options[channel].label)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={reset}
          onKeyDown={onKeyDown}
        >
          <ArrowRight size={24} />
        </button>
      </div>
      <p className="contact-slide-hint">{t.hint}</p>
    </div>
  );
}
