"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { config } from "@/lib/config";
import { IconRoute, IconCpu, IconWifi, IconServerJars, IconPlayerProfile, IconSeedMap } from "@/components/ui/Icons";
import { SectionCard } from "@/components/ui/Card";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: "easeOut" },
});

function Badge({ method }: { method: "GET" | "POST" }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-mono font-semibold ${
      method === "GET" ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400"
    }`}>
      {method}
    </span>
  );
}

function EndpointCard({
  method, path, summary, detail, params, response,
}: {
  method: "GET" | "POST";
  path: string;
  summary: string;
  detail: string;
  params?: { name: string; type: string; required: boolean; desc: string }[];
  response: string;
}) {
  return (
    <SectionCard
      header={
        <div className="flex items-center gap-3">
          <Badge method={method} />
          <code className="text-sm text-white font-mono">{path}</code>
        </div>
      }
      bodyClassName="px-4 py-4 space-y-3"
    >
      <p className="text-sm font-medium text-white">{summary}</p>
      <p className="text-xs text-zinc-500 leading-relaxed">{detail}</p>
      {params && params.length > 0 && (
        <div className="space-y-1.5">
          {params.map((p) => (
            <div key={p.name} className="flex items-start gap-3 text-xs">
              <code className="text-emerald-400 font-mono shrink-0">{p.name}</code>
              <span className="text-zinc-600 shrink-0">{p.type}</span>
              {!p.required && <span className="text-zinc-700 shrink-0">optional</span>}
              <span className="text-zinc-500">{p.desc}</span>
            </div>
          ))}
        </div>
      )}
      <div className="rounded-lg bg-[#0a0a0d] border border-white/6 px-3 py-2">
        <p className="text-xs font-mono text-zinc-400 whitespace-pre-wrap">{response}</p>
      </div>
    </SectionCard>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <span className="text-emerald-400">{icon}</span>
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function DocsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12 max-w-3xl mx-auto">
      <motion.div {...fadeUp(0)}>

        <div className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("docs.badge")}
          </span>
          <h1 className="text-2xl font-bold text-white">{t("docs.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("docs.description")}</p>

          <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.02] px-4 py-2.5 w-fit">
            <span className="text-xs text-zinc-500">{t("docs.baseUrl")}:</span>
            <code className="text-xs text-emerald-400 font-mono">{config.apiUrl}</code>
          </div>
        </div>

        <div className="space-y-10">

          <motion.div {...fadeUp(0.05)}>
            <Section icon={<IconCpu />} title={t("docs.techStack")}>
              <p className="text-sm text-zinc-500 leading-relaxed">{t("docs.techDesc")}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { name: "Rust",              color: "border-orange-600/20 bg-orange-600/5 text-orange-400" },
                  { name: "Axum 0.7",          color: "border-zinc-500/20 bg-zinc-500/5 text-zinc-400" },
                  { name: "Tokio 1",           color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
                  { name: "Reqwest 0.12",      color: "border-blue-500/20 bg-blue-500/5 text-blue-400" },
                  { name: "Serde 1",           color: "border-purple-500/20 bg-purple-500/5 text-purple-400" },
                  { name: "Tower-HTTP 0.5",    color: "border-cyan-500/20 bg-cyan-500/5 text-cyan-400" },
                  { name: "Moka 0.12",         color: "border-yellow-500/20 bg-yellow-500/5 text-yellow-400" },
                  { name: "dotenvy 0.15",      color: "border-teal-500/20 bg-teal-500/5 text-teal-400" },
                ].map((tech) => (
                  <span
                    key={tech.name}
                    className={`rounded-md border px-3 py-1 text-xs font-medium ${tech.color}`}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </Section>
          </motion.div>

          <motion.div {...fadeUp(0.08)}>
            <Section icon={<IconRoute />} title={t("docs.envTitle")}>
              <SectionCard bodyClassName="p-0">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.07] text-zinc-500">
                      <th className="text-left px-4 py-2.5 font-medium">Variable</th>
                      <th className="text-left px-4 py-2.5 font-medium">{t("docs.envDefault")}</th>
                      <th className="text-left px-4 py-2.5 font-medium">{t("docs.description_col")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2.5 font-mono text-emerald-400">PORT</td>
                      <td className="px-4 py-2.5 font-mono text-zinc-400">4000</td>
                      <td className="px-4 py-2.5 text-zinc-500">{t("docs.envPort")}</td>
                    </tr>
                  </tbody>
                </table>
              </SectionCard>
            </Section>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <Section icon={<IconServerJars />} title={t("docs.sections.serverjars")}>
              <EndpointCard
                method="GET"
                path="/api/serverjars/versions"
                summary={t("docs.endpoints.versions.summary")}
                detail={t("docs.endpoints.versions.detail")}
                response={`{ "versions": ["1.21.4", "1.21.3", ...] }`}
              />
              <EndpointCard
                method="GET"
                path="/api/serverjars/paper/:version/builds"
                summary={t("docs.endpoints.paperBuilds.summary")}
                detail={t("docs.endpoints.paperBuilds.detail")}
                params={[{ name: ":version", type: "string", required: true, desc: t("docs.paramVersion") }]}
                response={`{ "builds": [{ "version": "1.21.4", "build": "232", "channel": "stable", "download_url": "..." }] }`}
              />
              <EndpointCard
                method="GET"
                path="/api/serverjars/paper/:version/latest"
                summary={t("docs.endpoints.paperLatest.summary")}
                detail={t("docs.endpoints.paperLatest.detail")}
                params={[{ name: ":version", type: "string", required: true, desc: t("docs.paramVersion") }]}
                response={`{ "version": "1.21.4", "build": "232", "channel": "stable", "download_url": "..." }`}
              />
              <EndpointCard
                method="GET"
                path="/api/serverjars/leaf/:version/builds"
                summary={t("docs.endpoints.leafBuilds.summary")}
                detail={t("docs.endpoints.leafBuilds.detail")}
                params={[{ name: ":version", type: "string", required: true, desc: t("docs.paramVersion") }]}
                response={`{ "builds": [{ "version": "1.21.4", "build": "525", "channel": "default", "download_url": "..." }] }`}
              />
            </Section>
          </motion.div>

          <motion.div {...fadeUp(0.13)}>
            <Section icon={<IconWifi />} title={t("docs.sections.mcping")}>
              <EndpointCard
                method="GET"
                path="/api/mcping?host=&port="
                summary={t("docs.endpoints.mcping.summary")}
                detail={t("docs.endpoints.mcping.detail")}
                params={[
                  { name: "host", type: "string", required: true, desc: t("docs.paramHost") },
                  { name: "port", type: "u16", required: false, desc: t("docs.paramPort") },
                ]}
                response={`{
  "online": true,
  "host": "play.example.com",
  "port": 25565,
  "version": "Paper 1.21.4",
  "protocol": 769,
  "software": "Paper",
  "description": "A Minecraft Server",
  "players_online": 12,
  "players_max": 100,
  "players": ["Steve", "Alex"],
  "favicon": "data:image/png;base64,...",
  "latency_ms": 42
}`}
              />
            </Section>
          </motion.div>

          <motion.div {...fadeUp(0.16)}>
            <Section icon={<IconPlayerProfile />} title={t("docs.sections.player")}>
              <EndpointCard
                method="GET"
                path="/api/player/:username"
                summary={t("docs.endpoints.player.summary")}
                detail={t("docs.endpoints.player.detail")}
                params={[{ name: ":username", type: "string", required: true, desc: t("docs.paramUsername") }]}
                response={`{
  "uuid": "069a79f444e94726a5befca90e38aaf5",
  "uuid_formatted": "069a79f4-44e9-4726-a5be-fca90e38aaf5",
  "username": "Notch",
  "skin_url": "http://textures.minecraft.net/texture/...",
  "cape_url": null,
  "skin_model": "classic",
  "avatar_url": "https://crafatar.com/avatars/...",
  "body_url": "https://crafatar.com/renders/body/..."
}`}
              />
            </Section>
          </motion.div>

          <motion.div {...fadeUp(0.19)}>
            <Section icon={<IconSeedMap />} title={t("docs.sections.seedmap")}>
              <EndpointCard
                method="GET"
                path="/api/seedmap/versions"
                summary={t("docs.endpoints.seedmapVersions.summary")}
                detail={t("docs.endpoints.seedmapVersions.detail")}
                response={`{ "versions": ["1.21", "1.20", "1.19", ...] }`}
              />
              <EndpointCard
                method="GET"
                path="/api/seedmap/tile?seed=&x=&z=&size=&version="
                summary={t("docs.endpoints.seedmapTile.summary")}
                detail={t("docs.endpoints.seedmapTile.detail")}
                params={[
                  { name: "seed",    type: "string", required: true,  desc: t("docs.paramSeed") },
                  { name: "x",       type: "i32",    required: false, desc: t("docs.paramX") },
                  { name: "z",       type: "i32",    required: false, desc: t("docs.paramZ") },
                  { name: "size",    type: "u32",    required: false, desc: t("docs.paramSize") },
                  { name: "version", type: "string", required: false, desc: t("docs.paramVersion") },
                ]}
                response={`<binary> — size×size × 2 bytes (i16 LE per biome ID)`}
              />
              <EndpointCard
                method="GET"
                path="/api/seedmap/structures?seed=&x=&z=&radius=&version="
                summary={t("docs.endpoints.seedmapStructures.summary")}
                detail={t("docs.endpoints.seedmapStructures.detail")}
                params={[
                  { name: "seed",    type: "string", required: true,  desc: t("docs.paramSeed") },
                  { name: "x",       type: "i32",    required: false, desc: t("docs.paramX") },
                  { name: "z",       type: "i32",    required: false, desc: t("docs.paramZ") },
                  { name: "radius",  type: "i32",    required: false, desc: t("docs.paramRadius") },
                  { name: "version", type: "string", required: false, desc: t("docs.paramVersion") },
                ]}
                response={`[
  { "kind": "village",  "label": "Village",  "color": "#4ade80", "x": 128,   "z": -256 },
  { "kind": "monument", "label": "Monument", "color": "#38bdf8", "x": 512,   "z": 768  },
  { "kind": "mansion",  "label": "Mansion",  "color": "#f87171", "x": -1024, "z": 320  }
]`}
              />
            </Section>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
