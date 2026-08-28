/**
 * The deployed topology, drawn. Every box is a container in the shipped compose
 * file and every port is the port it listens on. Brand colours only, flat fills,
 * no gradient. Connectors are orthogonal with rounded elbows; postgres and redis
 * sit in one shared-state group because vidra-core and vidra-search both use them.
 * On narrow screens the diagram keeps a minimum width and scrolls horizontally.
 */

const BOX = { fill: "rgb(29 70 106 / 0.32)", stroke: "rgb(29 70 106 / 0.95)" };
const LINE = { stroke: "#8FB4C9", strokeWidth: 1.5, fill: "none" } as const;
const CYAN = { stroke: "#22BDE3", strokeWidth: 1.5, fill: "none" } as const;

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
        fontSize="16"
        fontWeight="700"
      >
        {title}
      </text>
      <text
        x={x + w / 2}
        y={y + h / 2 + 17}
        textAnchor="middle"
        fill="#8FB4C9"
        fontSize="12.5"
      >
        {sub}
      </text>
    </g>
  );
}

export function ArchitectureDiagram() {
  return (
    <div
      className="overflow-x-auto"
      tabIndex={0}
      role="group"
      aria-label="Deployment topology diagram. Scrolls horizontally on narrow screens."
    >
      <svg
        viewBox="0 0 1060 656"
        className="h-auto w-full min-w-[820px] font-sans"
        role="img"
        aria-labelledby="arch-title arch-desc"
      >
        <title id="arch-title">Vidra deployment topology</title>
        <desc id="arch-desc">
          Viewers reach Caddy at the edge on port 443. Caddy routes to
          vidra-user, the frontend on port 3000, and to vidra-core, the API on
          port 8080. vidra-core calls vidra-search on port 8081, which is
          internal and not exposed at the edge. vidra-core and vidra-search
          both use the shared state: PostgreSQL on 5432 and Redis on 6379.
          vidra-core also writes media to MinIO, S3-compatible object storage.
          All of those run on your server. MinIO hands public media to IPFS,
          which has a public gateway tier and a private swarm-keyed tier, and
          viewers fetch that media from gateways rather than from your server.
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
          x="186"
          y="56"
          width="718"
          height="548"
          rx="16"
          fill="none"
          stroke="#1D466A"
          strokeWidth="1"
          strokeDasharray="6 6"
        />
        <text
          x="210"
          y="86"
          fill="#8FB4C9"
          fontSize="11"
          fontWeight="700"
          letterSpacing="1.5"
        >
          YOUR SERVER
        </text>

        <Box x={20} y={218} w={140} h={64} title="Viewers" sub="browser, app" />
        <Box x={210} y={214} w={140} h={72} title="Caddy" sub="edge · :443" accent />

        <Box x={400} y={88} w={190} h={64} title="vidra-user" sub="frontend · :3000" />
        <Box x={400} y={218} w={190} h={64} title="vidra-core" sub="api · :8080" />
        <Box
          x={520}
          y={348}
          w={190}
          h={64}
          title="vidra-search"
          sub="internal · :8081"
        />

        {/* Shared state: used by vidra-core and vidra-search */}
        <rect
          x="396"
          y="464"
          width="304"
          height="120"
          rx="12"
          fill="none"
          stroke="#1D466A"
          strokeWidth="1"
        />
        <text
          x="412"
          y="490"
          fill="#8FB4C9"
          fontSize="11"
          fontWeight="700"
          letterSpacing="1.5"
        >
          SHARED STATE
        </text>
        <Box x={412} y={502} w={130} h={64} title="postgres" sub=":5432" />
        <Box x={556} y={502} w={130} h={64} title="redis" sub=":6379" />

        <Box x={740} y={498} w={140} h={64} title="minio" sub="S3 storage" />

        <Box
          x={920}
          y={488}
          w={124}
          h={84}
          title="IPFS"
          sub="public + private"
        />

        {/* Viewers to edge */}
        <path d="M160,250 H204" {...LINE} markerEnd="url(#arrow)" />

        {/* Edge fan-out: straight to the api, one rounded elbow up to the frontend */}
        <path d="M350,250 H394" {...LINE} markerEnd="url(#arrow)" />
        <path
          d="M280,214 V132 Q280,120 292,120 H394"
          {...LINE}
          markerEnd="url(#arrow)"
        />

        {/* api to search */}
        <path d="M545,282 V342" {...LINE} markerEnd="url(#arrow)" />

        {/* api and search both drop into the shared state */}
        <path d="M430,282 V458" {...LINE} markerEnd="url(#arrow)" />
        <path d="M615,412 V458" {...LINE} markerEnd="url(#arrow)" />

        {/* api to object storage: right, then one rounded elbow down */}
        <path
          d="M590,250 H798 Q810,250 810,262 V492"
          {...LINE}
          markerEnd="url(#arrow)"
        />

        {/* storage offload to IPFS */}
        <path d="M880,530 H914" {...CYAN} markerEnd="url(#arrow-cyan)" />

        {/* public media returns to viewers from gateways, not from your box */}
        <path
          d="M982,572 V618 Q982,630 970,630 H102 Q90,630 90,618 V288"
          {...CYAN}
          strokeDasharray="6 6"
          markerEnd="url(#arrow-cyan)"
        />
        <text
          x="540"
          y="620"
          textAnchor="middle"
          fill="#22BDE3"
          fontSize="13"
          fontWeight="700"
        >
          public media, fetched from gateways
        </text>
      </svg>
    </div>
  );
}
