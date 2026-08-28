/**
 * The deployed topology, drawn. Every box is a container in the shipped compose
 * file and every port is the port it listens on. Brand colours only, flat fills,
 * no gradient. Connectors are orthogonal with rounded elbows; postgres and redis
 * sit in one shared-state group because vidra-core and vidra-search both use them.
 *
 * Mobile-first: below `md` a portrait variant with a top-to-bottom flow renders
 * instead of the wide one — nothing scrolls, nothing is cut off. Exactly one of
 * the two variants is in the accessibility tree at a time (the other is
 * display:none), the same contract as the comparison table.
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

function Markers({ suffix }: { suffix: string }) {
  return (
    <defs>
      <marker
        id={`arrow-${suffix}`}
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
        id={`arrow-cyan-${suffix}`}
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
  );
}

const DESC =
  "Viewers reach Caddy at the edge on port 443. Caddy routes to vidra-user, " +
  "the frontend on port 3000, and to vidra-core, the API on port 8080. " +
  "vidra-core calls vidra-search on port 8081, which is internal and not " +
  "exposed at the edge. vidra-core and vidra-search both use the shared " +
  "state: PostgreSQL on 5432 and Redis on 6379. vidra-core also writes media " +
  "to MinIO, S3-compatible object storage. All of those run on your server. " +
  "MinIO hands public media to IPFS, which has a public gateway tier and a " +
  "private swarm-keyed tier, and viewers fetch that media from gateways " +
  "rather than from your server.";

const LINE = { stroke: "#8FB4C9", strokeWidth: 1.5, fill: "none" } as const;
const CYAN = { stroke: "#22BDE3", strokeWidth: 1.5, fill: "none" } as const;

function WideDiagram() {
  return (
    <svg
      viewBox="0 0 1060 656"
      className="h-auto w-full font-sans"
      role="img"
      aria-labelledby="arch-title-w arch-desc-w"
      data-testid="arch-wide"
    >
      <title id="arch-title-w">Vidra deployment topology</title>
      <desc id="arch-desc-w">{DESC}</desc>
      <Markers suffix="w" />

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

      <Box x={920} y={488} w={124} h={84} title="IPFS" sub="public + private" />

      {/* Viewers to edge */}
      <path d="M160,250 H204" {...LINE} markerEnd="url(#arrow-w)" />

      {/* Edge fan-out: straight to the api, one rounded elbow up to the frontend */}
      <path d="M350,250 H394" {...LINE} markerEnd="url(#arrow-w)" />
      <path
        d="M280,214 V132 Q280,120 292,120 H394"
        {...LINE}
        markerEnd="url(#arrow-w)"
      />

      {/* api to search */}
      <path d="M545,282 V342" {...LINE} markerEnd="url(#arrow-w)" />

      {/* api and search both drop into the shared state */}
      <path d="M430,282 V458" {...LINE} markerEnd="url(#arrow-w)" />
      <path d="M615,412 V458" {...LINE} markerEnd="url(#arrow-w)" />

      {/* api to object storage: right, then one rounded elbow down */}
      <path
        d="M590,250 H798 Q810,250 810,262 V492"
        {...LINE}
        markerEnd="url(#arrow-w)"
      />

      {/* storage offload to IPFS */}
      <path d="M880,530 H914" {...CYAN} markerEnd="url(#arrow-cyan-w)" />

      {/* public media returns to viewers from gateways, not from your box */}
      <path
        d="M982,572 V618 Q982,630 970,630 H102 Q90,630 90,618 V288"
        {...CYAN}
        strokeDasharray="6 6"
        markerEnd="url(#arrow-cyan-w)"
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
  );
}

function PortraitDiagram() {
  return (
    <svg
      viewBox="0 0 480 872"
      className="mx-auto h-auto w-full max-w-[480px] font-sans"
      role="img"
      aria-labelledby="arch-title-m arch-desc-m"
      data-testid="arch-mobile"
    >
      <title id="arch-title-m">Vidra deployment topology</title>
      <desc id="arch-desc-m">{DESC}</desc>
      <Markers suffix="m" />

      {/* Your server */}
      <rect
        x="18"
        y="100"
        width="452"
        height="648"
        rx="16"
        fill="none"
        stroke="#1D466A"
        strokeWidth="1"
        strokeDasharray="6 6"
      />
      <text
        x="36"
        y="130"
        fill="#8FB4C9"
        fontSize="11"
        fontWeight="700"
        letterSpacing="1.5"
      >
        YOUR SERVER
      </text>

      <Box x={154} y={16} w={160} h={60} title="Viewers" sub="browser, app" />
      <Box x={164} y={124} w={140} h={64} title="Caddy" sub="edge · :443" accent />

      <Box x={28} y={248} w={190} h={64} title="vidra-user" sub="frontend · :3000" />
      <Box x={250} y={248} w={190} h={64} title="vidra-core" sub="api · :8080" />
      <Box
        x={250}
        y={364}
        w={190}
        h={64}
        title="vidra-search"
        sub="internal · :8081"
      />

      {/* Shared state */}
      <rect
        x="28"
        y="480"
        width="418"
        height="132"
        rx="12"
        fill="none"
        stroke="#1D466A"
        strokeWidth="1"
      />
      <text
        x="44"
        y="506"
        fill="#8FB4C9"
        fontSize="11"
        fontWeight="700"
        letterSpacing="1.5"
      >
        SHARED STATE
      </text>
      <Box x={44} y={520} w={190} h={64} title="postgres" sub=":5432" />
      <Box x={250} y={520} w={180} h={64} title="redis" sub=":6379" />

      <Box x={250} y={668} w={190} h={64} title="minio" sub="S3 storage" />

      <Box x={139} y={770} w={190} h={72} title="IPFS" sub="public + private" />

      {/* Viewers down to the edge */}
      <path d="M234,76 V118" {...LINE} markerEnd="url(#arrow-m)" />

      {/* Edge fan-out: one elbow left to the frontend, one right to the api */}
      <path
        d="M164,168 H129 Q123,168 123,174 V242"
        {...LINE}
        markerEnd="url(#arrow-m)"
      />
      <path
        d="M304,168 H339 Q345,168 345,174 V242"
        {...LINE}
        markerEnd="url(#arrow-m)"
      />

      {/* api to search */}
      <path d="M345,312 V358" {...LINE} markerEnd="url(#arrow-m)" />

      {/* api and search both drop into the shared state; the api uses the
          gap between the columns */}
      <path
        d="M250,292 H240 Q234,292 234,298 V474"
        {...LINE}
        markerEnd="url(#arrow-m)"
      />
      <path d="M345,428 V474" {...LINE} markerEnd="url(#arrow-m)" />

      {/* api to object storage, down the right rail */}
      <path
        d="M440,280 H450 Q456,280 456,286 V694 Q456,700 450,700 H446"
        {...LINE}
        markerEnd="url(#arrow-m)"
      />

      {/* storage offload leaves the server for IPFS */}
      <path
        d="M345,732 V752 Q345,758 339,758 H240 Q234,758 234,764 V766"
        {...CYAN}
        markerEnd="url(#arrow-cyan-m)"
      />

      {/* public media returns to viewers from gateways, up the left margin */}
      <path
        d="M139,806 H16 Q10,806 10,800 V52 Q10,46 16,46 H148"
        {...CYAN}
        strokeDasharray="6 6"
        markerEnd="url(#arrow-cyan-m)"
      />
      <text
        x="234"
        y="864"
        textAnchor="middle"
        fill="#22BDE3"
        fontSize="13"
        fontWeight="700"
      >
        public media, fetched from gateways
      </text>
    </svg>
  );
}

export function ArchitectureDiagram() {
  return (
    <div>
      <div className="hidden md:block">
        <WideDiagram />
      </div>
      <div className="md:hidden">
        <PortraitDiagram />
      </div>
    </div>
  );
}
