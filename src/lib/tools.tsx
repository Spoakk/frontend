import {
  IconServerJars, IconTerminal, IconWifi, IconSparkle, IconText,
  IconNetherPortal, IconPlayerProfile, IconServerIcon, IconGiveCommand, IconSeedMap, IconMOTD,
} from "@/components/ui/Icons";

export interface ToolDef {
  key: string;
  href: string;
  icon: React.ReactNode;
}

export const TOOLS: ToolDef[] = [
  { key: "serverjars",    href: "/tools/serverjars",    icon: <IconServerJars /> },
  { key: "bat",           href: "/tools/bat",           icon: <IconTerminal /> },
  { key: "mcping",        href: "/tools/mcping",        icon: <IconWifi /> },
  { key: "minimessage",   href: "/tools/minimessage",   icon: <IconSparkle /> },
  { key: "smalltext",     href: "/tools/smalltext",     icon: <IconText /> },
  { key: "nethercoords",  href: "/tools/nethercoords",  icon: <IconNetherPortal /> },
  { key: "playerprofile", href: "/tools/playerprofile", icon: <IconPlayerProfile /> },
  { key: "servericon",    href: "/tools/servericon",    icon: <IconServerIcon /> },
  { key: "givecmd",       href: "/tools/givecmd",       icon: <IconGiveCommand /> },
  { key: "seedmap",       href: "/tools/seedmap",       icon: <IconSeedMap /> },
  { key: "motd",          href: "/tools/motd",          icon: <IconMOTD /> },
];

export const QUICK_LINK_KEYS = ["serverjars", "bat", "mcping", "minimessage"] as const;
