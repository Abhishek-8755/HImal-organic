// Remounts on every navigation, so the CSS fade-in replays on each page.
// CSS (not JS) keeps the page visible before hydration.
export default function Template({ children }) {
  return <div className="page-fade">{children}</div>;
}
