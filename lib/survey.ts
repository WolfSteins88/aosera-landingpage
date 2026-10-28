import type { Locale } from "./site";

type Text = Record<Locale, string>;

export type Option = { value: string; label: Text };

type Base = { id: string; label: Text; required?: boolean };

export type Question =
  | (Base & { kind: "single"; options: Option[]; otherValue?: string })
  | (Base & { kind: "multi"; options: Option[]; max: number; otherValue?: string })
  | (Base & { kind: "scale"; min: number; max: number })
  | (Base & { kind: "text"; multiline?: boolean; maxLength: number; placeholder?: Text })
  | (Base & { kind: "contact" });

export type Answers = Record<string, string | string[] | undefined>;

const o = (value: string, id: string, en: string): Option => ({ value, label: { id, en } });

export const STEPS: Question[][] = [
  [
    {
      id: "businessType",
      kind: "single",
      required: true,
      label: { id: "Apa jenis bisnis Anda?", en: "What kind of business do you run?" },
      options: [
        o("cafe", "Kedai kopi", "Coffee shop"),
        o("restaurant", "Restoran / warung", "Restaurant / eatery"),
        o("lodging", "Villa / hotel / homestay", "Villa / hotel / homestay"),
        o("retail", "Toko retail", "Retail shop"),
        o("services", "Jasa (salon, laundry, bengkel, dll.)", "Services (salon, laundry, repair, etc.)"),
        o("other", "Lainnya", "Other"),
      ],
      otherValue: "other",
    },
    {
      id: "teamSize",
      kind: "single",
      required: true,
      label: { id: "Berapa orang yang bekerja di bisnis Anda?", en: "How many people work in your business?" },
      options: [
        o("solo", "Saya sendiri", "Just me"),
        o("2-5", "2 sampai 5", "2 to 5"),
        o("6-20", "6 sampai 20", "6 to 20"),
        o("20+", "Lebih dari 20", "More than 20"),
      ],
    },
    {
      id: "location",
      kind: "text",
      maxLength: 80,
      label: { id: "Di kota / kabupaten mana bisnis Anda?", en: "Which city or regency is your business in?" },
      placeholder: { id: "Contoh: Denpasar", en: "e.g. Denpasar" },
    },
  ],
  [
    {
      id: "problems",
      kind: "multi",
      required: true,
      max: 3,
      label: { id: "Apa masalah terbesar bisnis Anda saat ini?", en: "What are the biggest problems in your business right now?" },
      options: [
        o("sales-stock", "Mencatat penjualan dan stok", "Tracking sales and stock"),
        o("bookkeeping", "Pembukuan dan laporan keuangan", "Bookkeeping and financial reports"),
        o("booking", "Reservasi / booking", "Reservations / bookings"),
        o("staff", "Mengelola karyawan dan jadwal", "Managing staff and shifts"),
        o("marketing", "Pemasaran dan promosi", "Marketing and promotion"),
        o("orders", "Pesanan lewat WhatsApp berantakan", "Messy orders over WhatsApp"),
        o("customers", "Data pelanggan dan pelanggan setia", "Customer data and loyalty"),
        o("other", "Lainnya", "Other"),
      ],
      otherValue: "other",
    },
    {
      id: "currentTool",
      kind: "single",
      required: true,
      label: { id: "Bagaimana Anda mengatasinya sekarang?", en: "How do you handle it today?" },
      options: [
        o("paper", "Buku / kertas", "Notebook / paper"),
        o("spreadsheet", "Excel / Google Sheets", "Excel / Google Sheets"),
        o("other-app", "Software atau sistem lain", "Other software or system"),
        o("none", "Belum ada cara khusus", "Nothing in particular yet"),
      ],
    },
    {
      id: "painLevel",
      kind: "scale",
      required: true,
      min: 1,
      max: 5,
      label: { id: "Seberapa mengganggu masalah tersebut?", en: "How much does this problem bother you?" },
    },
  ],
  [
    {
      id: "helpfulness",
      kind: "scale",
      required: true,
      min: 1,
      max: 5,
      label: {
        id: "Jika ada produk digital yang menyelesaikan masalah tersebut, seberapa membantu?",
        en: "If a digital product solved this problem, how helpful would it be?",
      },
    },
    {
      id: "budget",
      kind: "single",
      required: true,
      label: { id: "Berapa biaya bulanan yang menurut Anda wajar?", en: "What monthly price feels fair to you?" },
      options: [
        o("free", "Hanya mau yang gratis", "Free only"),
        o("<100k", "Di bawah Rp100 ribu", "Under Rp100k"),
        o("100-300k", "Rp100 sampai 300 ribu", "Rp100k to 300k"),
        o(">300k", "Di atas Rp300 ribu", "Over Rp300k"),
      ],
    },
    {
      id: "story",
      kind: "text",
      multiline: true,
      maxLength: 1000,
      label: { id: "Ceritakan masalah Anda lebih detail", en: "Tell us more about your problem" },
      placeholder: {
        id: "Contoh: stok sering selisih karena dicatat manual…",
        en: "e.g. stock counts are often off because we track them by hand…",
      },
    },
  ],
  [
    {
      id: "contact",
      kind: "contact",
      label: { id: "Boleh kami hubungi?", en: "May we contact you?" },
    },
  ],
];

export const CONTACT_FIELDS = {
  name: { label: { id: "Nama", en: "Name" }, maxLength: 80 },
  whatsapp: { label: { id: "Nomor WhatsApp", en: "WhatsApp number" }, maxLength: 20 },
  pilot: {
    label: {
      id: "Saya bersedia ikut uji coba gratis dan menerima ringkasan hasil survei",
      en: "I would like to join a free trial and receive a summary of the results",
    },
  },
} as const;

export const ALL_QUESTIONS = STEPS.flat();

/** Returns the ids of required questions in `step` that are not answered yet. */
export function missingInStep(step: Question[], answers: Answers): string[] {
  return step
    .filter((q) => {
      if (!q.required) return false;
      const value = answers[q.id];
      if (Array.isArray(value)) return value.length === 0;
      return !value;
    })
    .map((q) => q.id);
}
