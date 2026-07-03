"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { saveEnquiry } from "@/lib/enquiries";
import { useI18n } from "@/lib/i18n";
import {
  BUDGETS,
  CONTACT_METHODS,
  type ContactInput,
  REGIONS,
  REQUESTS,
  RESIDENCES,
  TIMELINES,
  contactSchema,
} from "./schema";
import { Turnstile } from "./turnstile";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * The enquiry — closer to instructing a private broker than filling in a
 * web form. Everything an advisor needs to prepare the right dossier:
 * residence, region, budget, horizon, and what to send first.
 */
export function ContactForm() {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [turnstileToken, setTurnstileToken] = useState<string>();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      consent: false,
      contactMethod: "Email",
    },
  });

  const residence = watch("residence");
  const region = watch("region");
  const budget = watch("budget");
  const timeline = watch("timeline");
  const request = watch("request");
  const contactMethod = watch("contactMethod");
  const consent = watch("consent");

  const onSubmit = async (data: ContactInput) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, turnstileToken }),
      });
      if (!res.ok) throw new Error("Request failed");
      saveEnquiry({
        kind: data.request === "Private viewing" ? "viewing" : "dossier",
        name: data.name,
        email: data.email,
        summary: `${data.request} · ${data.residence} · ${data.budget}`,
        details: {
          Region: data.region,
          Timeline: data.timeline,
          Contact: `${data.contactMethod}${data.phone ? ` · ${data.phone}` : ""}`,
          Message: data.message || "—",
        },
      });
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="glass-dark relative overflow-hidden rounded-2xl border border-cream/14 p-6 shadow-float sm:p-9">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[26rem] flex-col items-center justify-center text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-ink"
            >
              <Check className="h-7 w-7" />
            </motion.span>
            <h3 className="mt-6 font-serif text-3xl tracking-tight text-cream">
              {t.form.successTitle}
            </h3>
            <p className="mt-3 max-w-sm text-cream-dim">{t.form.successBody}</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-8 cursor-pointer text-sm font-medium text-gold-soft underline-offset-4 hover:underline"
            >
              {t.form.sendAnother}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 sm:gap-6"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <Field label={t.form.fullName} error={errors.name?.message}>
                <input
                  {...register("name")}
                  autoComplete="name"
                  placeholder={t.form.namePlaceholder}
                  className={inputCls(!!errors.name)}
                />
              </Field>
              <Field label={t.form.email} error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  className={inputCls(!!errors.email)}
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <Field label={t.form.phone} error={errors.phone?.message}>
                <input
                  {...register("phone")}
                  type="tel"
                  autoComplete="tel"
                  placeholder="+41 …"
                  className={inputCls(!!errors.phone)}
                />
              </Field>
              <ChipField
                label={t.form.replyBy}
                options={CONTACT_METHODS}
                value={contactMethod}
                error={errors.contactMethod?.message}
                onSelect={(v) => setValue("contactMethod", v, { shouldValidate: true })}
              />
            </div>

            <ChipField
              label={t.form.residence}
              options={RESIDENCES}
              value={residence}
              error={errors.residence?.message}
              onSelect={(v) => setValue("residence", v, { shouldValidate: true })}
            />
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <ChipField
                label={t.form.region}
                options={REGIONS}
                value={region}
                error={errors.region?.message}
                onSelect={(v) => setValue("region", v, { shouldValidate: true })}
              />
              <ChipField
                label={t.form.timeline}
                options={TIMELINES}
                value={timeline}
                error={errors.timeline?.message}
                onSelect={(v) => setValue("timeline", v, { shouldValidate: true })}
              />
            </div>
            <ChipField
              label={t.form.budget}
              options={BUDGETS}
              value={budget}
              error={errors.budget?.message}
              onSelect={(v) => setValue("budget", v, { shouldValidate: true })}
            />
            <ChipField
              label={t.form.request}
              options={REQUESTS}
              value={request}
              error={errors.request?.message}
              onSelect={(v) => setValue("request", v, { shouldValidate: true })}
            />

            <Field label={t.form.message} error={errors.message?.message}>
              <textarea
                {...register("message")}
                rows={3}
                placeholder={t.form.messagePlaceholder}
                className={cn(inputCls(!!errors.message), "resize-none")}
              />
            </Field>

            {/* consent */}
            <div className="flex flex-col gap-1.5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) =>
                    setValue("consent", e.target.checked, { shouldValidate: true })
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-cream/30 bg-cream/[0.06] transition-colors duration-300 checked:border-gold checked:bg-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                />
                <span className="text-xs leading-relaxed text-cream-faint">
                  {t.form.consentA}{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-soft underline-offset-2 hover:underline"
                  >
                    {t.form.consentLink}
                  </a>{" "}
                  {t.form.consentMid}{" "}
                  <a
                    href="/consent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-soft underline-offset-2 hover:underline"
                  >
                    {t.form.consentLink2}
                  </a>
                  {t.form.consentB}
                </span>
              </label>
              <FieldError error={errors.consent?.message} />
            </div>

            <Turnstile onToken={setTurnstileToken} />

            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold-soft"
                >
                  {t.form.errorBody}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={status === "submitting"}
              className="w-full"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {t.form.sending}
                </>
              ) : (
                <>
                  {t.form.submit} <ArrowUpRight className="h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-center text-xs text-cream-faint">{t.form.note}</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    "w-full rounded-lg border bg-cream/[0.06] px-4 py-3 text-sm text-cream transition-colors duration-300 placeholder:text-cream-faint/70 focus:outline-none focus:ring-2 focus:ring-gold/50",
    hasError ? "border-gold/60" : "border-cream/15 focus:border-gold/50",
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-cream-faint">
        {label}
      </span>
      {children}
      <FieldError error={error} />
    </label>
  );
}

function ChipField<T extends string>({
  label,
  options,
  value,
  error,
  onSelect,
}: {
  label: string;
  options: readonly T[];
  value: T | undefined;
  error?: string;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-cream-faint">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className={cn(
                "cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.84rem] transition-all duration-300 sm:px-4 sm:py-2",
                active
                  ? "border-gold bg-gold text-ink shadow-soft"
                  : "border-cream/15 bg-cream/[0.04] text-cream-dim hover:border-gold/50 hover:text-cream",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <FieldError error={error} />
    </div>
  );
}

function FieldError({ error }: { error?: string }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-xs text-gold-soft"
        >
          {error}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
