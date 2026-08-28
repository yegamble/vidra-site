/**
 * The deployed topology, drawn. Every box is a container in the shipped compose
 * file and every port is the port it listens on. Brand colours only, flat fills,
 * no gradient.
 */

const BOX = { fill: "rgb(29 70 106 / 0.32)", stroke: "rgb(29 70 106 / 0.95)" };

function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  accent = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={BOX.fill}
        stroke={accent ? "#22BDE3" : BOX.stroke}
        strokeWidth={accent ? 1.5 : 1}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 - 4}
        textAnchor="middle"
        fill="#E6F6FA"
        fontSize="15"
        fontWeight="700"
      >
        {title}
      </text>
      <text
        x={x + w / 2}
        y={y + h / 2 + 16}
        textAnchor="middle"
        fill="#8FB4C9"
        fontSize="12"
      >
        {sub}
      </text>
    </g>
  );
}

export function ArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 960 470"
      className="h-auto w-full font-sans"
      role="img"
      aria-labelledby="arch-title arch-desc"
    >
      <title id="arch-title">Vidra deployment topology</title>
      <desc id="arch-desc">
        Viewers reach Caddy at the edge on port 443. Caddy routes to vidra-user,
        the frontend on port 3000, and to vidra-core, the API on port 8080.
        vidra-core calls vidra-search on port 8081, which is internal and not
        exposed at the edge. vidra-core also talks to PostgreSQL on 5432, Redis
        on 6379, and MinIO for S3-compatible object storage. All of those run on
        your server. MinIO hands public media to IPFS, which has a public gateway
        tier and a private swarm-keyed tier, and viewers fetch that media from
        gateways rather than from your server.
      </desc>

      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#8FB4C9" />
        </marker>
        <marker
          id="arrow-cyan"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#22BDE3" />
        </marker>
      </defs>

      {/* Your server */}
      <rect
        x="140"
        y="24"
        width="580"
        height="372"
        rx="16"
        fill="none"
        stroke="#1D466A"
        strokeWidth="1"
        strokeDasharray="6 6"
      />
      <text
        x="156"
        y="48"
        fill="#8FB4C9"
        fontSize="11"
        fontWeight="700"
        letterSpacing="1.5"
      >
        YOUR SERVER
      </text>

      <Box x={8} y={176} w={110} h={60} title="Viewers" sub="browser, app" />
      <Box x={172} y={170} w={126} h={72} title="Caddy" sub="edge · :443" accent />

      <Box x={350} y={80} w={214} h={60} title="vidra-user" sub="frontend · :3000" />
      <Box x={350} y={176} w={214} h={60} title="vidra-core" sub="api · :8080" />
      <Box
        x={350}
        y={272}
        w={214}
        h={60}
        title="vidra-search"
        sub="internal · :8081"
      />

      <Box x={596} y={64} w={112} h={52} title="postgres" sub=":5432" />
      <Box x={596} y={136} w={112} h={52} title="redis" sub=":6379" />
      <Box x={596} y={208} w={112} h={52} title="minio" sub="S3 storage" />

      <Box
        x={768}
        y={182}
        w={184}
        h={104}
        title="IPFS"
        sub="public + private tiers"
      />

      {/* Viewers to edge */}
      <path
        d="M118 206 H166"
        stroke="#8FB4C9"
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#arrow)"
      />

      {/* Edge fan-out */}
      <path
        d="M298 196 C 324 196, 324 110, 344 110"
        stroke="#8FB4C9"
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#arrow)"
      />
      <path
        d="M298 206 H344"
        stroke="#8FB4C9"
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#arrow)"
      />

      {/* api to search */}
      <path
        d="M457 236 V266"
        stroke="#8FB4C9"
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#arrow)"
      />

      {/* api to data */}
      <path
        d="M564 200 C 580 200, 580 90, 590 90"
        stroke="#8FB4C9"
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#arrow)"
      />
      <path
        d="M564 204 C 580 204, 580 162, 590 162"
        stroke="#8FB4C9"
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#arrow)"
      />
      <path
        d="M564 212 C 580 212, 580 234, 590 234"
        stroke="#8FB4C9"
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#arrow)"
      />

      {/* storage offload to IPFS */}
      <path
        d="M708 234 H762"
        stroke="#22BDE3"
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#arrow-cyan)"
      />

      {/* public media returns to viewers from gateways, not from your box */}
      <path
        d="M860 286 V436 H63 V242"
        stroke="#22BDE3"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        fill="none"
        markerEnd="url(#arrow-cyan)"
      />
      <text
        x="470"
        y="424"
        textAnchor="middle"
        fill="#22BDE3"
        fontSize="12"
        fontWeight="700"
      >
        public media, fetched from gateways
      </text>
    </svg>
  );
}
