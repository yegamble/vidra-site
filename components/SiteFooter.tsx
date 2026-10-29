import { MARKETING } from "@/lib/marketing";

export function SiteFooter() {
  return (
    <footer className="launch-footer">
      <p>© {new Date().getFullYear()} Vidra Technologies LLC</p>
      <a href={`mailto:${MARKETING.email}`}>{MARKETING.email}</a>
    </footer>
  );
}
