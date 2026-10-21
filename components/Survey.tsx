"use client";

import { useState, type FormEvent } from "react";
import { getDictionary, type Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/site";
import { CONTACT_FIELDS, STEPS, missingInStep, type Answers, type Question } from "@/lib/survey";
import { ArrowLeft, ArrowRight, Check } from "./icons";

type Status = "idle" | "sending" | "error" | "done";

export default function Survey({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).survey;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [pilot, setPilot] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  const total = STEPS.length;
  const isLast = step === total - 1;

  const set = (id: string, value: string | string[]) => {
    setAnswers((a) => ({ ...a, [id]: value }));
    setMissing((m) => m.filter((x) => x !== id));
  };

  const scrollToTop = () => document.getElementById("survei")?.scrollIntoView({ behavior: "smooth" });

  const next = () => {
    const gaps = missingInStep(STEPS[step], answers);
    setMissing(gaps);
    if (gaps.length) return;
    setStep((s) => s + 1);
    scrollToTop();
  };

  const back = () => {
    setMissing([]);
    setStep((s) => Math.max(0, s - 1));
    scrollToTop();
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLast) return next();
    const website = (new FormData(e.currentTarget).get("website") as string) ?? "";
    setStatus("sending");
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, pilot, lang: locale, website }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
      scrollToTop();
    } catch {
      setStatus("error");
    }
  };

  const restart = () => {
    setAnswers({});
    setPilot(false);
    setStep(0);
    setStatus("idle");
  };

  if (status === "done") {
    return (
      <div className="survey pglass">
        <div className="thanks" role="status">
          <span className="thanks-ic">
            <Check size={30} strokeWidth={2.2} />
          </span>
          <h3>{t.thanksTitle}</h3>
          <p>{t.thanksBody}</p>
          <a className="cta" href="#kontak">
            {t.thanksCta}
            <span className="cta-dot" aria-hidden="true">
              <ArrowRight size={16} />
            </span>
          </a>
          <button type="button" className="link-btn" onClick={restart}>
            {t.again}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="survey pglass" onSubmit={submit} noValidate>
      <div className="survey-top">
        <span className="tabular-nums">{t.stepOf(step + 1, total)}</span>
        <b>{t.stepNames[step]}</b>
      </div>
      <div className="progress" aria-hidden="true">
        {STEPS.map((_, i) => (
          <i key={i} data-done={i <= step ? "" : undefined} />
        ))}
      </div>

      <div className="step" key={step}>
        {STEPS[step].map((q) => (
          <QuestionField
            key={q.id}
            q={q}
            locale={locale}
            t={t}
            answers={answers}
            set={set}
            pilot={pilot}
            setPilot={setPilot}
            missing={missing.includes(q.id)}
          />
        ))}
      </div>

      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {missing.length > 0 && (
        <p className="form-msg" role="alert">
          {t.required}
        </p>
      )}
      {status === "error" && (
        <p className="form-msg" role="alert">
          {t.error}
        </p>
      )}

      <div className="survey-nav">
        {step > 0 ? (
          <button type="button" className="ghost" onClick={back}>
            <ArrowLeft size={16} />
            {t.back}
          </button>
        ) : (
          <span className="spacer" />
        )}
        <button type="submit" className="cta" disabled={status === "sending"}>
          {isLast ? (status === "sending" ? t.sending : t.submit) : t.next}
          <span className="cta-dot" aria-hidden="true">
            <ArrowRight size={16} />
          </span>
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  q: Question;
  locale: Locale;
  t: Dictionary["survey"];
  answers: Answers;
  set: (id: string, value: string | string[]) => void;
  pilot: boolean;
  setPilot: (v: boolean) => void;
  missing: boolean;
};

function QuestionField({ q, locale, t, answers, set, pilot, setPilot, missing }: FieldProps) {
  const value = answers[q.id];
  const optional = !q.required && q.kind !== "contact" && <span className="hint">({t.optional})</span>;

  if (q.kind === "single" || q.kind === "multi") {
    const picked = q.kind === "multi" ? ((value as string[] | undefined) ?? []) : [];
    const full = q.kind === "multi" && picked.length >= q.max;
    const otherOn = q.otherValue && (q.kind === "multi" ? picked.includes(q.otherValue) : value === q.otherValue);
    return (
      <fieldset className="q" data-missing={missing ? "" : undefined}>
        <legend>
          {q.label[locale]}
          {q.kind === "multi" && <span className="hint">{t.pickUpTo(q.max)}</span>}
          {optional}
        </legend>
        <div className="opts">
          {q.options.map((opt) => {
            const checked = q.kind === "multi" ? picked.includes(opt.value) : value === opt.value;
            return (
              <label key={opt.value} className="opt">
                <input
                  type={q.kind === "multi" ? "checkbox" : "radio"}
                  name={q.id}
                  value={opt.value}
                  checked={checked}
                  disabled={q.kind === "multi" && full && !checked}
                  onChange={() => {
                    if (q.kind === "single") return set(q.id, opt.value);
                    set(q.id, checked ? picked.filter((v) => v !== opt.value) : [...picked, opt.value]);
                  }}
                />
                <span>{opt.label[locale]}</span>
              </label>
            );
          })}
        </div>
        {otherOn && (
          <input
            className="input other"
            type="text"
            maxLength={120}
            placeholder={t.otherPlaceholder}
            aria-label={`${q.label[locale]}: ${t.otherPlaceholder}`}
            value={(answers[`${q.id}Other`] as string) ?? ""}
            onChange={(e) => set(`${q.id}Other`, e.target.value)}
          />
        )}
      </fieldset>
    );
  }

  if (q.kind === "scale") {
    const nums = Array.from({ length: q.max - q.min + 1 }, (_, i) => String(q.min + i));
    return (
      <fieldset className="q" data-missing={missing ? "" : undefined}>
        <legend>{q.label[locale]}</legend>
        <div className="scale">
          {nums.map((n) => (
            <label key={n} className="opt">
              <input type="radio" name={q.id} value={n} checked={value === n} onChange={() => set(q.id, n)} />
              <span>{n}</span>
            </label>
          ))}
        </div>
        <div className="scale-labels" aria-hidden="true">
          <span>{t.scaleLow}</span>
          <span>{t.scaleHigh}</span>
        </div>
      </fieldset>
    );
  }

  if (q.kind === "text") {
    const common = {
      id: q.id,
      className: "input",
      maxLength: q.maxLength,
      placeholder: q.placeholder?.[locale],
      value: (value as string) ?? "",
    };
    return (
      <div className="q">
        <label htmlFor={q.id}>
          {q.label[locale]}
          {optional}
        </label>
        {q.multiline ? (
          <textarea {...common} onChange={(e) => set(q.id, e.target.value)} />
        ) : (
          <input type="text" {...common} onChange={(e) => set(q.id, e.target.value)} />
        )}
      </div>
    );
  }

  return (
    <fieldset className="q">
      <legend>
        {q.label[locale]}
        <span className="hint">({t.optional})</span>
      </legend>
      <div className="contact-grid">
        <div>
          <label className="field-label" htmlFor="name">
            {CONTACT_FIELDS.name.label[locale]}
          </label>
          <input
            id="name"
            className="input"
            type="text"
            autoComplete="name"
            maxLength={CONTACT_FIELDS.name.maxLength}
            value={(answers.name as string) ?? ""}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="whatsapp">
            {CONTACT_FIELDS.whatsapp.label[locale]}
          </label>
          <input
            id="whatsapp"
            className="input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="08xx xxxx xxxx"
            maxLength={CONTACT_FIELDS.whatsapp.maxLength}
            value={(answers.whatsapp as string) ?? ""}
            onChange={(e) => set("whatsapp", e.target.value)}
          />
        </div>
      </div>
      <label className="check">
        <input type="checkbox" checked={pilot} onChange={(e) => setPilot(e.target.checked)} />
        <span>{CONTACT_FIELDS.pilot.label[locale]}</span>
      </label>
    </fieldset>
  );
}
