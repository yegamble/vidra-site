/** Decorative concept artwork, not a product capture or interactive player. */
export function StreamingIllustration() {
  return (
    <svg className="streaming-illustration" viewBox="0 0 760 650" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <filter id="scene-shadow" x="-30%" y="-30%" width="170%" height="180%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="signal-glow" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="bloom" />
          <feFlood floodColor="var(--brand-signal)" result="gold" />
          <feComposite in="gold" in2="bloom" operator="in" result="wideGlow" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.8" result="nearBlur" />
          <feComposite in="gold" in2="nearBlur" operator="in" result="nearGlow" />
          <feMerge><feMergeNode in="wideGlow" /><feMergeNode in="nearGlow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="floor-glow" x="-50%" y="-150%" width="200%" height="400%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="player-signal-glow" filterUnits="userSpaceOnUse" x="12" y="176" width="220" height="30">
          <feGaussianBlur stdDeviation="2" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <clipPath id="player-poster"><rect x="12" y="12" width="285" height="158" rx="4" /></clipPath>
        <linearGradient id="player-ground" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="var(--brand-ink)" />
          <stop offset="1" stopColor="var(--brand-black)" />
        </linearGradient>
        <linearGradient id="glass-ground" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="var(--brand-white)" stopOpacity="0.72" />
          <stop offset="1" stopColor="var(--brand-white)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <path d="m49 403 280-161 379 219-280 163Z" stroke="var(--brand-line)" strokeWidth="1.5" strokeDasharray="6 7" />
      <path d="m89 458 241-139 320 185-240 139Z" fill="var(--brand-surface)" opacity="0.45" />
      <path d="m162 446 200-109 254 154-198 113Z" fill="var(--brand-shadow)" filter="url(#scene-shadow)" />
      <g fill="var(--brand-signal)" opacity="0.45" filter="url(#floor-glow)">
        <ellipse cx="164" cy="510" rx="39" ry="12" />
        <ellipse cx="341" cy="616" rx="39" ry="12" />
        <ellipse cx="612" cy="574" rx="39" ry="12" />
        <ellipse cx="451" cy="545" rx="50" ry="16" />
      </g>
      <path d="M310 66v216M310 66l-147 85v237M310 66l151 87v233M516 135v213M516 135l134 77v236" stroke="var(--brand-line)" strokeWidth="1.5" strokeDasharray="6 7" />
      <g className="data-network" stroke="var(--brand-signal)" strokeLinecap="round" strokeLinejoin="round">
        {[
          "M164 510 234 550 310 506 387 560 451 523",
          "M341 616 421 570 381 547 451 507V523",
          "M612 574 551 609 478 567 451 582V523",
        ].map((d, index) => <g key={d}>
          <path className="data-wire-halo" d={d} strokeWidth="8" opacity="0.45" filter="url(#signal-glow)" />
          <path className="data-wire" d={d} strokeWidth="2.8" />
          <path className="data-packet" d={d} pathLength="1" strokeWidth="6" strokeDasharray="0.08 0.253333" strokeDashoffset="0.75" filter="url(#signal-glow)" style={{ animationDelay: `${-index * 0.65}s` }} />
          <path className="data-packet-head" d={d} pathLength="1" stroke="var(--brand-white)" strokeWidth="4.5" strokeDasharray="0.006 0.327333" strokeDashoffset="0.67" filter="url(#signal-glow)" style={{ animationDelay: `${-index * 0.65}s` }} />
        </g>)}
      </g>

      <g transform="matrix(1 .577 0 1 355 88)">
        <rect width="132" height="151" rx="5" fill="url(#glass-ground)" stroke="var(--brand-white)" strokeWidth="3" />
        <Thumbnail x={5} y={10} width={122} height={91} />
        <path d="M7 115h100M7 126h66M7 137h85" stroke="var(--brand-line)" strokeWidth="3" />
      </g>
      <g className="atproto-tag" transform="matrix(1 .577 0 1 468 64)">
        <rect width="230" height="86" rx="6" fill="url(#glass-ground)" stroke="var(--brand-white)" strokeWidth="2" />
        {/* The current official atproto.com header mark is the monospace at://. */}
        <text x="18" y="51" fill="var(--brand-black)" fontFamily="var(--brand-font-mono)" fontSize="24" fontWeight="800">at://</text>
        <text x="112" y="51" fill="var(--brand-ink)" fontFamily="var(--brand-font-sans)" fontSize="25" fontWeight="600">atproto</text>
      </g>

      <g transform="matrix(1 -.577 0 1 130 167)">
        <rect width="80" height="245" rx="5" fill="url(#glass-ground)" stroke="var(--brand-white)" strokeWidth="2" />
        <path d="M5 0 80 0 80 245 5 245" stroke="var(--brand-white)" opacity="0.5" />
      </g>
      <g transform="matrix(1 .577 0 1 132 173)">
        <rect width="65" height="235" rx="5" fill="url(#glass-ground)" stroke="var(--brand-white)" strokeWidth="2" />
        <g fill="var(--brand-ink)">
          <path d="m25 35 8-9 8 9v12h-6v-8h-4v8h-6Z" />
          <rect x="11" y="63" width="43" height="38" rx="4" fill="var(--brand-surface)" />
          <rect x="25" y="74" width="16" height="15" rx="1" />
          <path d="m31 78 6 4-6 4Z" fill="var(--brand-white)" />
          <path d="M25 119h6v7h-6Zm10 0h6v7h-6Zm-10 11h6v7h-6Zm10 0h6v7h-6Z" opacity="0.7" />
          <path d="M33 159c-10-9-17 6 0 15 17-9 10-24 0-15Z" opacity="0.55" />
          <circle cx="33" cy="199" r="8" opacity="0.4" />
          <circle cx="33" cy="199" r="3" fill="var(--brand-white)" />
        </g>
      </g>

      <g transform="matrix(1 .577 0 1 241 163)">
        <rect x="7" y="-5" width="309" height="239" rx="8" fill="var(--brand-slate)" />
        <rect width="309" height="239" rx="8" fill="url(#player-ground)" stroke="var(--brand-ink)" />
        <image href="/illustration/alpine-lake-poster.webp" x="12" y="12" width="285" height="158" preserveAspectRatio="xMidYMid slice" clipPath="url(#player-poster)" />
        <circle cx="150" cy="94" r="35" fill="var(--brand-ink)" fillOpacity="0.22" stroke="var(--brand-white)" strokeOpacity="0.5" />
        <path d="M125 70c0-5 3-7 7-5l40 24c4 2 4 6 0 8l-40 23c-4 2-7 0-7-5Z" fill="var(--brand-white)" />
        <path d="M23 190h191" stroke="var(--brand-slate)" strokeWidth="5" strokeLinecap="round" />
        <path className="video-signal" d="M23 190h48" stroke="var(--brand-signal)" strokeWidth="5" strokeLinecap="round" filter="url(#player-signal-glow)" />
        <circle cx="73" cy="190" r="6" fill="var(--brand-signal)" />
        <g stroke="var(--brand-white)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m245 186-7 5h-5v8h5l7 5Zm6 3c4 3 4 9 0 12m5-16c7 6 7 14 0 20M278 190v-5h6m8 0h5v5m0 11v5h-5m-8 0h-6v-5" />
        </g>
      </g>

      <g transform="matrix(1 .577 0 1 615 271)">
        <rect width="139" height="211" rx="4" fill="url(#glass-ground)" stroke="var(--brand-white)" strokeWidth="2" />
        {[15, 81, 147].map((y) => <g key={y}>
          <rect x="12" y={y} width="58" height="45" rx="2" fill="var(--brand-ink)" />
          <image href="/illustration/alpine-lake-poster.webp" x="12" y={y} width="58" height="45" preserveAspectRatio="xMidYMid slice" opacity="0.85" />
          <path d={`m37 ${y + 13} 15 9-15 9Z`} fill="var(--brand-white)" opacity="0.85" />
          <path d={`M81 ${y + 11}h45M81 ${y + 20}h39M81 ${y + 29}h29`} stroke="var(--brand-line)" strokeWidth="3" />
        </g>)}
      </g>

      <NetworkNode x={138} y={444} />
      <NetworkNode x={315} y={550} />
      <NetworkNode x={586} y={508} />
      <GoldenRelay x={222} y={520} />
      <GoldenRelay x={539} y={579} />
      <g className="data-receiver" filter="url(#signal-glow)">
        <circle cx="451" cy="523" r="10" stroke="var(--brand-signal)" strokeWidth="2" />
        <circle cx="451" cy="523" r="4" fill="var(--brand-white)" />
      </g>
    </svg>
  );
}

function NetworkNode({ x, y }: { x: number; y: number }) {
  return <g className="network-node" transform={`translate(${x + 26} ${y + 66}) scale(1.25) translate(-26 -66)`} stroke="var(--brand-signal)" strokeWidth="1.8" strokeLinejoin="round">
    <path d="m0 15 26-15 26 15-26 15Z" fill="var(--brand-slate)" />
    <path d="M0 15v36l26 15V30Z" fill="var(--brand-ink)" />
    <path d="m26 30 26-15v36L26 66Z" fill="var(--brand-black)" />
    <path d="m35 39 10-6m-10 18 10-6" strokeWidth="2" strokeLinecap="round" />
    <path d="m8 31 11 12-11 2Z" fill="var(--brand-signal)" stroke="none" />
    <path d="m18 14 8-5 8 5-8 5Z" fill="none" strokeWidth="1" />
    <path d="m0 51 26 15 26-15M26 30v36" fill="none" strokeWidth="2.5" filter="url(#signal-glow)" />
    <circle cx="26" cy="66" r="3.5" fill="var(--brand-white)" filter="url(#signal-glow)" />
  </g>;
}

function GoldenRelay({ x, y }: { x: number; y: number }) {
  return <g className="network-relay" transform={`translate(${x} ${y})`} stroke="var(--brand-white)" strokeWidth="1" strokeLinejoin="round" filter="url(#signal-glow)">
    <path d="m0 7 12-7 12 7-12 7Z" fill="var(--brand-signal)" fillOpacity="0.6" />
    <path d="M0 7v16l12 7V14Zm12 7 12-7v16l-12 7Z" fill="var(--brand-signal)" fillOpacity="0.8" />
  </g>;
}

function Thumbnail({ x, y, width, height, variant = 0 }: { x: number; y: number; width: number; height: number; variant?: number }) {
  return <svg x={x} y={y} width={width} height={height} viewBox="0 0 120 90" preserveAspectRatio="none" overflow="hidden">
    <image href="/illustration/alpine-lake-poster.webp" width="120" height="90" preserveAspectRatio={variant ? "xMaxYMid slice" : "xMinYMid slice"} />
  </svg>;
}
