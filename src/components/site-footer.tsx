export function SiteFooter() {
  return (
    <footer className="border-t border-line/70">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-7 text-xs leading-6 text-muted sm:flex-row sm:px-8">
        <span>© {new Date().getFullYear()} Next-Crypto · Built for clarity.</span>
        <span>Not financial advice. Market data integration is not yet active.</span>
      </div>
    </footer>
  );
}
