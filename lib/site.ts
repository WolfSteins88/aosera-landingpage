export const LOCALES = ["id", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const WHATSAPP_NUMBER = "628551899911";
export const WHATSAPP_DISPLAY = "0855 1899 911";
export const WHATSAPP_DISPLAY_2 = "081 916 600 666";
export const CONTACT_EMAIL = "aosera.ai@gmail.com";
export const TELEGRAM_URL = "https://t.me/aoseratech";
export const INSTAGRAM_URL = "https://www.instagram.com/aoseratech";
export const MAIN_SITE_URL = "https://aosera-website.vercel.app";

export function whatsappUrl(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
