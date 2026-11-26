"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { PROFILE } from "@/lib/data";
import {
  CONTACT_LIMITS,
  CONTACT_TOPICS,
  validateContact,
  type ContactErrors,
  type ContactFields,
  type ContactTopic,
} from "@/lib/contact";
import { CheckIcon, CopyIcon, FileIcon, GitHubIcon, LinkedInIcon, SendIcon } from "../icons";
import { cn, EXTERNAL } from "@/lib/cn";

type Status = "idle" | "sending" | "sent" | "failed" | "offline" | "early";

const EMPTY: ContactFields = { name: "", email: "", topic: "role", message: "" };
const ORDER = ["name", "topic", "message", "email"] as const;

const INLINE =
  "min-w-0 rounded-lg border-0 border-b-2 bg-sky-50/70 px-2 py-0.5 font-semibold text-ink outline-none transition-colors placeholder:font-normal placeholder:text-muted/80 hover:bg-sky-100/60 focus:bg-sky-100/80";

function FieldError({ id, text }: { id: string; text?: string }) {
  return (
    <p
      id={id}
      className={cn(
        "mt-1 flex items-start gap-1.5 text-[14px] font-medium leading-snug text-bad-strong desk:text-[clamp(12.5px,1.65vh,17px)]",
        !text && "hidden"
      )}
    >
      <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-bad" aria-hidden="true" />
      {text}
    </p>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      <a
        href={href}
        {...EXTERNAL}
        aria-label={label}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-ink-2 transition-colors hover:bg-white/70 hover:text-accent-strong desk:h-[clamp(32px,4.8vh,44px)] desk:w-[clamp(32px,4.8vh,44px)]"
      >
        {children}
      </a>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-900/[0.08] bg-white px-2 py-1 text-[12px] font-medium text-ink shadow-[0_8px_22px_rgba(30,80,150,0.16)] group-focus-within:block group-hover:block"
      >
        {label}
      </span>
    </span>
  );
}

function Envelope() {
  return (
    <svg viewBox="0 0 168 112" className="block h-auto w-[clamp(140px,24vh,240px)]" aria-hidden="true">
      <rect x="2" y="2" width="164" height="108" rx="12" fill="#ffffff" stroke="rgba(2,132,199,0.45)" strokeWidth="2" />
      <path d="M5 106 L70 58 M163 106 L98 58" fill="none" stroke="rgba(2,132,199,0.3)" strokeWidth="2" strokeLinecap="round" />
      <path
        className="envelope-flap"
        d="M5 6 L84 66 L163 6"
        fill="#e0f2fe"
        stroke="rgba(2,132,199,0.55)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactPage() {
  const [fields, setFields] = useState<ContactFields>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [again, setAgain] = useState(false);
  const [copied, setCopied] = useState(false);
  const shownAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const sentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useLayoutEffect(() => {
    const box = messageRef.current;
    if (!box) return;
    box.style.height = "auto";
    box.style.height = `${box.scrollHeight + 2}px`;
  }, [fields.message]);

  useEffect(() => {
    if (status !== "sent") return;
    const timer = window.setTimeout(() => sentRef.current?.focus({ preventScroll: true }), 1250);
    return () => window.clearTimeout(timer);
  }, [status]);

  const update =
    (key: keyof ContactFields) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setFields((current) => ({ ...current, [key]: key === "topic" ? (value as ContactTopic) : value }));
      if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
      if (status === "failed" || status === "offline" || status === "early") setStatus("idle");
    };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    const found = validateContact(fields);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = ORDER.find((key) => found[key]);
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    if (Date.now() - shownAt.current < CONTACT_LIMITS.minMillis) {
      setStatus("early");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, website: honeypot.current?.value ?? "", startedAt: shownAt.current }),
      });
      if (response.ok) {
        setStatus("sent");
        return;
      }
      const body = (await response.json().catch(() => null)) as { errors?: ContactErrors } | null;
      if (response.status === 400 && body?.errors && Object.keys(body.errors).length) {
        setErrors(body.errors);
        setStatus("idle");
        return;
      }
      setStatus(response.status === 503 ? "offline" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  const writeAnother = () => {
    setFields(EMPTY);
    setErrors({});
    setAgain(true);
    setStatus("idle");
    shownAt.current = Date.now();
    window.setTimeout(() => document.getElementById("contact-name")?.focus({ preventScroll: true }), 60);
  };

  const sent = status === "sent";
  const described = (key: keyof ContactFields) => (errors[key] ? `contact-${key}-error` : undefined);
  const lineTone = (key: keyof ContactFields) => (errors[key] ? "border-bad" : "border-accent/50 focus:border-accent");

  return (
    <section id="contact" data-page aria-labelledby="contact-title" className="page">
      <div className="page-inner gap-4 desk:gap-[clamp(10px,2.2vh,30px)]">
        <h2 id="contact-title" className="heading text-[40px] text-ink desk:text-[clamp(40px,7.4vh,104px)]">
          Write to me
        </h2>

        <div className="mt-1 flex flex-col gap-4 desk:mt-0 desk:min-h-0 desk:flex-1 desk:justify-center desk:gap-[clamp(10px,2.2vh,28px)]">
        <div
          data-tour-target
          className="glass mx-auto grid w-full max-w-[1040px] rounded-[28px] px-5 py-6 desk:min-h-0 desk:max-w-[clamp(860px,128vh,1400px)] desk:px-[clamp(20px,4.8vh,72px)] desk:py-[clamp(16px,3.8vh,56px)]"
        >
          <form
            noValidate
            onSubmit={submit}
            aria-labelledby="contact-title"
            inert={sent}
            className={cn(
              "flex min-h-0 flex-col text-[18px] leading-[1.7] text-ink-2 [grid-area:1/1] desk:text-[clamp(16px,2.6vh,29px)]",
              sent && "letter-folded",
              again && !sent && "letter-unfold"
            )}
          >
            <p className="font-semibold text-ink">Hi Arun,</p>

            <div className="mt-2 desk:mt-[clamp(4px,1vh,14px)]">
              <p>
                I&apos;m{" "}
                <label htmlFor="contact-name" className="sr-only">
                  Your name
                </label>
                <span className="inline-flex w-full items-baseline sm:w-auto">
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  placeholder="your name"
                  value={fields.name}
                  onChange={update("name")}
                  maxLength={CONTACT_LIMITS.nameMax + 20}
                  aria-invalid={!!errors.name}
                  aria-describedby={described("name")}
                  className={cn(INLINE, lineTone("name"), "min-w-0 flex-1 sm:w-[12ch] sm:flex-none")}
                />
                ,
                </span>{" "}
                and I&apos;m writing about{" "}
                <label htmlFor="contact-topic" className="sr-only">
                  What you&apos;re writing about
                </label>
                <span className="inline-flex w-full items-baseline sm:w-auto">
                <span className="relative inline-block min-w-0 flex-1 sm:flex-none">
                  <select
                    id="contact-topic"
                    name="topic"
                    value={fields.topic}
                    onChange={update("topic")}
                    aria-invalid={!!errors.topic}
                    aria-describedby={described("topic")}
                    className={cn(INLINE, lineTone("topic"), "w-full cursor-pointer appearance-none pr-7")}
                  >
                    {CONTACT_TOPICS.map((topic) => (
                      <option key={topic.value} value={topic.value}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-2 top-1/2 h-0 w-0 -translate-y-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-accent-strong"
                  />
                </span>
                .
                </span>
              </p>
              <FieldError id="contact-name-error" text={errors.name} />
              <FieldError id="contact-topic-error" text={errors.topic} />
            </div>

            <div className="mt-3 flex min-h-0 flex-col desk:mt-[clamp(6px,1.5vh,20px)]">
              <label htmlFor="contact-message" className="sr-only">
                Your message
              </label>
              <textarea
                id="contact-message"
                name="message"
                ref={messageRef}
                rows={3}
                placeholder="your message"
                value={fields.message}
                onChange={update("message")}
                maxLength={CONTACT_LIMITS.messageMax + 100}
                aria-invalid={!!errors.message}
                aria-describedby={described("message")}
                className={cn(
                  "block max-h-[40vh] min-h-[5.2em] w-full resize-none overflow-y-auto rounded-2xl border-2 bg-white/75 px-4 py-2.5 text-[17px] leading-relaxed text-ink outline-none transition-colors placeholder:text-muted/80 focus:bg-white desk:max-h-[clamp(96px,26vh,360px)] desk:min-h-[clamp(84px,13.5vh,180px)] desk:text-[clamp(15px,2.2vh,24px)]",
                  errors.message ? "border-bad" : "border-slate-900/[0.10] focus:border-accent"
                )}
              />
              <FieldError id="contact-message-error" text={errors.message} />
            </div>

            <div className="mt-3 desk:mt-[clamp(6px,1.5vh,20px)]">
              <p>
                You can reply to me at{" "}
                <label htmlFor="contact-email" className="sr-only">
                  Your email
                </label>
                <span className="inline-flex w-full items-baseline sm:w-auto">
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="your email"
                  value={fields.email}
                  onChange={update("email")}
                  maxLength={CONTACT_LIMITS.emailMax + 20}
                  aria-invalid={!!errors.email}
                  aria-describedby={described("email")}
                  className={cn(INLINE, lineTone("email"), "min-w-0 flex-1 sm:w-[20ch] sm:flex-none")}
                />
                .
                </span>
              </p>
              <FieldError id="contact-email-error" text={errors.email} />
            </div>

            <div className="sr-only" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input id="contact-website" ref={honeypot} name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 desk:mt-[clamp(8px,2vh,26px)]">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[16px] font-semibold text-white shadow-[0_10px_28px_rgba(2,132,199,0.3)] transition-colors hover:bg-accent-strong disabled:opacity-75 desk:py-[clamp(7px,1.3vh,14px)] desk:text-[clamp(14px,2vh,20px)]"
              >
                <SendIcon size={16} />
                {status === "sending" ? "Sending..." : "Send it"}
              </button>
              <p role="status" className="text-[15px] font-medium leading-snug desk:text-[clamp(13px,1.8vh,18px)]">
                {status === "failed" ? (
                  <span className="text-bad-strong">
                    Couldn&apos;t send right now. Email me at{" "}
                    <a href={`mailto:${PROFILE.email}`} className="underline underline-offset-2">
                      {PROFILE.email}
                    </a>
                    .
                  </span>
                ) : status === "offline" ? (
                  <span className="text-ink-2">
                    The form is offline right now. Email me at{" "}
                    <a href={`mailto:${PROFILE.email}`} className="font-semibold text-accent-strong underline underline-offset-2">
                      {PROFILE.email}
                    </a>
                    .
                  </span>
                ) : status === "early" ? (
                  <span className="text-ink-2">That was quick. Wait a moment, then send again.</span>
                ) : null}
              </p>
            </div>
          </form>

          <div
            className={cn(
              "flex flex-col items-center justify-center gap-3 text-center [grid-area:1/1] desk:gap-[clamp(8px,1.8vh,22px)]",
              !sent && "invisible"
            )}
            aria-hidden={!sent}
          >
            {sent ? (
              <>
                <div className="envelope-in relative">
                  <Envelope />
                  <span className="postmark-stamp absolute -right-7 -top-6 grid h-[76px] w-[76px] place-items-center rounded-full border-[3px] border-accent bg-white/40 text-[17px] font-extrabold text-accent-strong shadow-[inset_0_0_0_4px_rgba(255,255,255,0.7),inset_0_0_0_6px_rgba(2,132,199,0.5)] desk:h-[clamp(64px,10.5vh,112px)] desk:w-[clamp(64px,10.5vh,112px)] desk:text-[clamp(15px,2.3vh,24px)]">
                    Sent
                  </span>
                </div>
                <p
                  ref={sentRef}
                  tabIndex={-1}
                  role="status"
                  className="sent-text text-[18px] font-semibold text-ink outline-none desk:text-[clamp(16px,2.6vh,28px)]"
                >
                  Sent. I&apos;ll reply to your email.
                </p>
                <button
                  type="button"
                  onClick={writeAnother}
                  className="sent-text rounded-lg text-[15px] font-semibold text-accent-strong underline decoration-accent/40 underline-offset-4 hover:text-ink desk:text-[clamp(13px,1.9vh,19px)]"
                >
                  Write another
                </button>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[15px] desk:text-[clamp(13px,1.85vh,19px)]">
          <span className="relative inline-flex items-center gap-1.5">
            <span className="select-all font-semibold text-ink">{PROFILE.email}</span>
            <button
              type="button"
              aria-label="Copy email"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(PROFILE.email);
                  setCopied(true);
                } catch {}
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-ink-2 transition-colors hover:bg-white/70 hover:text-accent-strong desk:h-[clamp(32px,4.8vh,44px)] desk:w-[clamp(32px,4.8vh,44px)]"
            >
              {copied ? <CheckIcon size={16} className="text-good-strong" /> : <CopyIcon size={16} />}
            </button>
            <span
              role="status"
              className={cn(
                "pointer-events-none absolute bottom-[calc(100%+6px)] right-0 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-[12px] font-semibold text-white transition-opacity",
                copied ? "opacity-100" : "opacity-0"
              )}
            >
              {copied ? "Copied" : ""}
            </span>
          </span>
          <span className="h-5 w-px bg-slate-900/15" aria-hidden="true" />
          <span className="inline-flex items-center gap-1">
            <IconLink href={PROFILE.linkedin} label="LinkedIn">
              <LinkedInIcon size={18} />
            </IconLink>
            <IconLink href={PROFILE.github} label="GitHub">
              <GitHubIcon size={18} />
            </IconLink>
            <IconLink href={PROFILE.resume} label="Resume">
              <FileIcon size={18} />
            </IconLink>
          </span>
        </div>
        </div>

        <p className="text-center text-[13px] text-muted desk:text-[clamp(12px,1.55vh,15px)]">© 2026 Arun Kallam</p>
      </div>
    </section>
  );
}
