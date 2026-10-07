export default function SectionHeading({ eyebrow, title, children, className = "", tone = "light" }) {
  const dark = tone === "dark";
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow && <p className={`eyebrow ${dark ? "text-turmeric" : ""}`}>{eyebrow}</p>}
      <h2 className={`mt-4 font-display text-h2 ${dark ? "text-cream" : "text-forest"}`}>{title}</h2>
      {children && <p className={`mt-5 text-lg ${dark ? "text-cream/80" : "text-ink/75"}`}>{children}</p>}
    </div>
  );
}
