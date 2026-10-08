// Onwebsite company details shown on every demo site.
// Fill in `whatsapp` (digits only, with country code, e.g. "12125551234") to turn on the
// "Message us on WhatsApp" buttons. While it is empty the buttons fall back to plain text.
export const company = {
  name: "Onwebsite",
  tagline: "Websites for local restaurants & cafes",
  whatsapp: "9779713461523",
};

export function whatsappLink(message: string): string | null {
  if (!company.whatsapp) return null;
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}
