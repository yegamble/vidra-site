import Link from "next/link";
import { Lockup } from "./Lockup";

export function SiteHeader() {
  return (
    <header className="launch-header">
      <Link className="home-link" href="/" aria-label="Vidra home"><Lockup /></Link>
      <span className="launch-status"><span aria-hidden="true" />Coming soon</span>
    </header>
  );
}
