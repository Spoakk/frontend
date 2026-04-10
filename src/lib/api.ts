import { config } from "./config";

export interface JarVersion {
  version: string;
  build: string;
  channel: string;
  download_url: string;
}

const base = config.apiUrl;

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 dakika
const MAX_CACHE_SIZE = 100;

async function getCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  cache.delete(key);
  const data = await fetcher();
  if (cache.size >= MAX_CACHE_SIZE) {
    cache.delete(cache.keys().next().value!);
  }
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${base}${path}`);
  if (!res.ok) {
    if (res.status === 429) {
      const error = await res.json().catch(() => ({ message: "Too many requests" }));
      throw new Error(error.message || "Rate limit exceeded. Please wait a moment.");
    }
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export interface ServerStatus {
  online: boolean;
  host: string;
  port: number;
  version: string | null;
  protocol: number | null;
  software: string | null;
  description: string | null;
  players_online: number | null;
  players_max: number | null;
  players: string[];
  favicon: string | null;
  latency_ms: number;
}

export interface PlayerProfile {
  uuid: string;
  uuid_formatted: string;
  username: string;
  skin_url: string | null;
  cape_url: string | null;
  skin_model: string;
  avatar_url: string;
  body_url: string;
}

export const api = {
  versions: () => getCached('versions', () => get<{ versions: string[] }>("/serverjars/versions")),
  paper: {
    builds: (version: string) => getCached(`paper-${version}`, () => get<{ builds: JarVersion[] }>(`/serverjars/paper/${version}/builds`)),
    latest: (version: string) => getCached(`paper-latest-${version}`, () => get<JarVersion>(`/serverjars/paper/${version}/latest`)),
  },
  leaf: {
    builds: (version: string) => getCached(`leaf-${version}`, () => get<{ builds: JarVersion[] }>(`/serverjars/leaf/${version}/builds`)),
  },
  mcping: (host: string, port?: number) =>
    get<ServerStatus>(`/mcping?host=${encodeURIComponent(host)}${port ? `&port=${port}` : ""}`),
  player: (username: string) => getCached(`player-${username}`, () => get<PlayerProfile>(`/player/${encodeURIComponent(username)}`)),
  seedmap: (seed: string, x: number, z: number, size: number, version: string) =>
    `${base}/seedmap?seed=${encodeURIComponent(seed)}&x=${x}&z=${z}&size=${size}&version=${encodeURIComponent(version)}`,
  seedmapStructures: (seed: string, x: number, z: number, radius: number, version: string) =>
    get<Array<{ kind: string; label: string; color: string; x: number; z: number }>>(
      `/seedmap/structures?seed=${encodeURIComponent(seed)}&x=${x}&z=${z}&radius=${radius}&version=${encodeURIComponent(version)}`
    ),
};
