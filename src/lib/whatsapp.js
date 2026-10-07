import { CONTACT } from "@/data/site";

// Builds a wa.me link with a neatly formatted, prefilled message.
export function buildWhatsAppLink({ name, phone, type, products, message } = {}) {
  const lines = ["Hello Himal Organic!"];
  if (message) lines.push("", message);

  const details = [];
  if (name) details.push(`Name: ${name}`);
  if (phone) details.push(`Phone: ${phone}`);
  if (type) details.push(`I am a: ${type}`);
  if (products?.length) details.push(`Products: ${products.join(", ")}`);
  if (details.length) lines.push("", ...details);

  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}

// For form submits. Call it directly inside the submit handler, or the browser blocks the new tab.
export function openWhatsApp(details) {
  window.open(buildWhatsAppLink(details), "_blank", "noopener,noreferrer");
}
