// Every placeholder here is marked TODO. Replace them with the client's real details.

export const SITE = {
  name: "Himal Organic",
  tagline: "Pure organic food, straight from the Himalayas.",
  url: "https://example.com", // TODO: real domain
};

export const CONTACT = {
  phone: "+91 00000 00000", // TODO
  whatsapp: "910000000000", // TODO: digits only, with country code
  email: "hello@example.com", // TODO
  address: "TODO: Street, City, State, PIN", // TODO
  hours: "Mon to Sat, 9:00 am to 6:00 pm", // TODO
};

export const SOCIAL = {
  instagram: "#", // TODO
  facebook: "#", // TODO
  youtube: "#", // TODO
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/b2c", label: "B2C" },
  { href: "/b2b", label: "B2B" },
  { href: "/about", label: "About" },
  { href: "/certifications", label: "Certifications" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export const AUDIENCE_LINKS = [
  { href: "/b2c", label: "Home Buyer" },
  { href: "/b2b", label: "Business" },
];

export const CATEGORIES = [
  { slug: "vegetables", label: "Vegetables" },
  { slug: "grains", label: "Grains" },
  { slug: "cereals", label: "Cereals" },
  { slug: "pulses", label: "Pulses" },
  { slug: "dairy", label: "Dairy" },
  { slug: "spices", label: "Spices" },
  { slug: "snacks", label: "Snacks" },
  { slug: "wafers", label: "Wafers" },
];

export function categoryLabel(slug) {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
