import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, base, linea, bsc } from "@reown/appkit/networks";
import { config } from "@/lib/config"

if (!config.reownProjectId) {
  throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID is required");
}
export const projectId = config.reownProjectId;

export const networks = [mainnet, base, linea, bsc];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
