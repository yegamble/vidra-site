import { MARKETING } from "@/lib/marketing";
import { StreamingIllustration } from "@/components/StreamingIllustration";

export default function Home() {
  return (
    <section className="launch-hero" aria-labelledby="launch-title">
      <div className="launch-copy">
        <p className="eyebrow">Vidra Beta</p>
        <h1 id="launch-title">A new home for streaming is taking shape.</h1>
        <p className="standfirst">{MARKETING.description}</p>
        <a className="waitlist-link" href={MARKETING.waitlist}>
          Join waitlist
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
            <path d="M7 17 17 7M7 7h10v10" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </a>
      </div>
      <StreamingIllustration />
    </section>
  );
}
