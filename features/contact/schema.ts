import { z } from "zod";

export const RESIDENCES = [
  "Maison Lac Clair",
  "Villa Pinède",
  "Domaine Belvedère",
  "Le Grand Refuge",
  "Open to recommendations",
] as const;

export const REGIONS = ["Valais", "Graubünden", "Bern", "Open to advice"] as const;

export const BUDGETS = [
  "€5M – €8M",
  "€8M – €12M",
  "€12M – €20M",
  "€20M+",
] as const;

export const TIMELINES = [
  "This season",
  "Within 6 months",
  "12 months +",
  "Exploring",
] as const;

export const REQUESTS = [
  "Private dossier",
  "Floor plans",
  "Private viewing",
  "Advisory call",
] as const;

export const CONTACT_METHODS = ["Email", "Phone", "WhatsApp"] as const;

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(80),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().max(32).optional().or(z.literal("")),
  contactMethod: z.enum(CONTACT_METHODS, { message: "How shall we reply?" }),
  residence: z.enum(RESIDENCES, { message: "Select a residence" }),
  region: z.enum(REGIONS, { message: "Select a region" }),
  budget: z.enum(BUDGETS, { message: "Select a budget range" }),
  timeline: z.enum(TIMELINES, { message: "Select a timeline" }),
  request: z.enum(REQUESTS, { message: "What shall we prepare?" }),
  message: z.string().max(1000).optional().or(z.literal("")),
  consent: z
    .boolean()
    .refine((v) => v === true, "Please accept the privacy terms"),
  /** Cloudflare Turnstile token — present only when the widget is enabled. */
  turnstileToken: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
