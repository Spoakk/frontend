export type VersionFormat = "nbt" | "components";

export function getFormat(version: string): VersionFormat {
  const parts = version.split(".").map(Number);
  const [, minor, patch = 0] = parts;
  if (minor > 20) return "components";
  if (minor === 20 && patch >= 5) return "components";
  return "nbt";
}

export interface EnchantEntry {
  id: string;
  label: string;
  maxLevel: number;
  applicable: string[];
}

export interface ItemEntry {
  id: string;
  label: string;
  category: string;
}

export const ENCHANTMENTS: EnchantEntry[] = [
  { id: "minecraft:sharpness",        label: "Sharpness",          maxLevel: 5,  applicable: ["sword","axe"] },
  { id: "minecraft:smite",            label: "Smite",              maxLevel: 5,  applicable: ["sword","axe"] },
  { id: "minecraft:bane_of_arthropods",label:"Bane of Arthropods", maxLevel: 5,  applicable: ["sword","axe"] },
  { id: "minecraft:knockback",        label: "Knockback",          maxLevel: 2,  applicable: ["sword"] },
  { id: "minecraft:fire_aspect",      label: "Fire Aspect",        maxLevel: 2,  applicable: ["sword"] },
  { id: "minecraft:looting",          label: "Looting",            maxLevel: 3,  applicable: ["sword"] },
  { id: "minecraft:sweeping_edge",    label: "Sweeping Edge",      maxLevel: 3,  applicable: ["sword"] },

  { id: "minecraft:power",            label: "Power",              maxLevel: 5,  applicable: ["bow"] },
  { id: "minecraft:punch",            label: "Punch",              maxLevel: 2,  applicable: ["bow"] },
  { id: "minecraft:flame",            label: "Flame",              maxLevel: 1,  applicable: ["bow"] },
  { id: "minecraft:infinity",         label: "Infinity",           maxLevel: 1,  applicable: ["bow"] },
  { id: "minecraft:multishot",        label: "Multishot",          maxLevel: 1,  applicable: ["crossbow"] },
  { id: "minecraft:quick_charge",     label: "Quick Charge",       maxLevel: 3,  applicable: ["crossbow"] },
  { id: "minecraft:piercing",         label: "Piercing",           maxLevel: 4,  applicable: ["crossbow"] },

  { id: "minecraft:efficiency",       label: "Efficiency",         maxLevel: 5,  applicable: ["pickaxe","axe","shovel","hoe","shears"] },
  { id: "minecraft:silk_touch",       label: "Silk Touch",         maxLevel: 1,  applicable: ["pickaxe","axe","shovel","hoe","shears"] },
  { id: "minecraft:fortune",          label: "Fortune",            maxLevel: 3,  applicable: ["pickaxe","axe","shovel","hoe"] },

  { id: "minecraft:protection",       label: "Protection",         maxLevel: 4,  applicable: ["helmet","chestplate","leggings","boots"] },
  { id: "minecraft:fire_protection",  label: "Fire Protection",    maxLevel: 4,  applicable: ["helmet","chestplate","leggings","boots"] },
  { id: "minecraft:blast_protection", label: "Blast Protection",   maxLevel: 4,  applicable: ["helmet","chestplate","leggings","boots"] },
  { id: "minecraft:projectile_protection",label:"Projectile Protection",maxLevel:4,applicable:["helmet","chestplate","leggings","boots"]},
  { id: "minecraft:thorns",           label: "Thorns",             maxLevel: 3,  applicable: ["helmet","chestplate","leggings","boots"] },
  { id: "minecraft:feather_falling",  label: "Feather Falling",    maxLevel: 4,  applicable: ["boots"] },
  { id: "minecraft:depth_strider",    label: "Depth Strider",      maxLevel: 3,  applicable: ["boots"] },
  { id: "minecraft:frost_walker",     label: "Frost Walker",       maxLevel: 2,  applicable: ["boots"] },
  { id: "minecraft:soul_speed",       label: "Soul Speed",         maxLevel: 3,  applicable: ["boots"] },
  { id: "minecraft:swift_sneak",      label: "Swift Sneak",        maxLevel: 3,  applicable: ["leggings"] },
  { id: "minecraft:respiration",      label: "Respiration",        maxLevel: 3,  applicable: ["helmet"] },
  { id: "minecraft:aqua_affinity",    label: "Aqua Affinity",      maxLevel: 1,  applicable: ["helmet"] },
  
  { id: "minecraft:unbreaking",       label: "Unbreaking",         maxLevel: 3,  applicable: ["sword","axe","pickaxe","shovel","hoe","bow","crossbow","helmet","chestplate","leggings","boots","fishing_rod","trident","shears","flint_and_steel","carrot_on_a_stick","warped_fungus_on_a_stick","elytra","shield","mace"] },
  { id: "minecraft:mending",          label: "Mending",            maxLevel: 1,  applicable: ["sword","axe","pickaxe","shovel","hoe","bow","crossbow","helmet","chestplate","leggings","boots","fishing_rod","trident","shears","flint_and_steel","carrot_on_a_stick","warped_fungus_on_a_stick","elytra","shield","mace"] },
  { id: "minecraft:curse_of_vanishing",label:"Curse of Vanishing", maxLevel: 1,  applicable: ["sword","axe","pickaxe","shovel","hoe","bow","crossbow","helmet","chestplate","leggings","boots","fishing_rod","trident","shears","flint_and_steel","elytra","shield","mace"] },
  { id: "minecraft:curse_of_binding", label: "Curse of Binding",   maxLevel: 1,  applicable: ["helmet","chestplate","leggings","boots","elytra"] },
  
  { id: "minecraft:loyalty",          label: "Loyalty",            maxLevel: 3,  applicable: ["trident"] },
  { id: "minecraft:impaling",         label: "Impaling",           maxLevel: 5,  applicable: ["trident"] },
  { id: "minecraft:riptide",          label: "Riptide",            maxLevel: 3,  applicable: ["trident"] },
  { id: "minecraft:channeling",       label: "Channeling",         maxLevel: 1,  applicable: ["trident"] },
  { id: "minecraft:luck_of_the_sea",  label: "Luck of the Sea",    maxLevel: 3,  applicable: ["fishing_rod"] },
  { id: "minecraft:lure",             label: "Lure",               maxLevel: 3,  applicable: ["fishing_rod"] },

  { id: "minecraft:density",          label: "Density",            maxLevel: 5,  applicable: ["mace"] },
  { id: "minecraft:breach",           label: "Breach",             maxLevel: 4,  applicable: ["mace"] },
  { id: "minecraft:wind_burst",       label: "Wind Burst",         maxLevel: 3,  applicable: ["mace"] },
];

export const ITEM_CATEGORIES: Record<string, string> = {
  sword: "Sword",
  axe: "Axe",
  pickaxe: "Pickaxe",
  shovel: "Shovel",
  hoe: "Hoe",
  bow: "Bow",
  crossbow: "Crossbow",
  trident: "Trident",
  mace: "Mace",
  helmet: "Helmet",
  chestplate: "Chestplate",
  leggings: "Leggings",
  boots: "Boots",
  elytra: "Elytra",
  shield: "Shield",
  fishing_rod: "Fishing Rod",
  shears: "Shears",
  flint_and_steel: "Flint and Steel",
};

export const ITEMS_BY_CATEGORY: Record<string, ItemEntry[]> = {
  sword: [
    { id: "wooden_sword",   label: "Wooden Sword",   category: "sword" },
    { id: "stone_sword",    label: "Stone Sword",    category: "sword" },
    { id: "iron_sword",     label: "Iron Sword",     category: "sword" },
    { id: "golden_sword",   label: "Golden Sword",   category: "sword" },
    { id: "diamond_sword",  label: "Diamond Sword",  category: "sword" },
    { id: "netherite_sword",label: "Netherite Sword",category: "sword" },
  ],
  axe: [
    { id: "wooden_axe",    label: "Wooden Axe",    category: "axe" },
    { id: "stone_axe",     label: "Stone Axe",     category: "axe" },
    { id: "iron_axe",      label: "Iron Axe",      category: "axe" },
    { id: "golden_axe",    label: "Golden Axe",    category: "axe" },
    { id: "diamond_axe",   label: "Diamond Axe",   category: "axe" },
    { id: "netherite_axe", label: "Netherite Axe", category: "axe" },
  ],
  pickaxe: [
    { id: "wooden_pickaxe",    label: "Wooden Pickaxe",    category: "pickaxe" },
    { id: "stone_pickaxe",     label: "Stone Pickaxe",     category: "pickaxe" },
    { id: "iron_pickaxe",      label: "Iron Pickaxe",      category: "pickaxe" },
    { id: "golden_pickaxe",    label: "Golden Pickaxe",    category: "pickaxe" },
    { id: "diamond_pickaxe",   label: "Diamond Pickaxe",   category: "pickaxe" },
    { id: "netherite_pickaxe", label: "Netherite Pickaxe", category: "pickaxe" },
  ],
  shovel: [
    { id: "wooden_shovel",    label: "Wooden Shovel",    category: "shovel" },
    { id: "stone_shovel",     label: "Stone Shovel",     category: "shovel" },
    { id: "iron_shovel",      label: "Iron Shovel",      category: "shovel" },
    { id: "golden_shovel",    label: "Golden Shovel",    category: "shovel" },
    { id: "diamond_shovel",   label: "Diamond Shovel",   category: "shovel" },
    { id: "netherite_shovel", label: "Netherite Shovel", category: "shovel" },
  ],
  hoe: [
    { id: "wooden_hoe",    label: "Wooden Hoe",    category: "hoe" },
    { id: "stone_hoe",     label: "Stone Hoe",     category: "hoe" },
    { id: "iron_hoe",      label: "Iron Hoe",      category: "hoe" },
    { id: "golden_hoe",    label: "Golden Hoe",    category: "hoe" },
    { id: "diamond_hoe",   label: "Diamond Hoe",   category: "hoe" },
    { id: "netherite_hoe", label: "Netherite Hoe", category: "hoe" },
  ],
  bow:      [{ id: "bow",      label: "Bow",      category: "bow" }],
  crossbow: [{ id: "crossbow", label: "Crossbow", category: "crossbow" }],
  trident:  [{ id: "trident",  label: "Trident",  category: "trident" }],
  mace:     [{ id: "mace",     label: "Mace",     category: "mace" }],
  helmet: [
    { id: "leather_helmet",    label: "Leather Helmet",    category: "helmet" },
    { id: "chainmail_helmet",  label: "Chainmail Helmet",  category: "helmet" },
    { id: "iron_helmet",       label: "Iron Helmet",       category: "helmet" },
    { id: "golden_helmet",     label: "Golden Helmet",     category: "helmet" },
    { id: "diamond_helmet",    label: "Diamond Helmet",    category: "helmet" },
    { id: "netherite_helmet",  label: "Netherite Helmet",  category: "helmet" },
    { id: "turtle_helmet",     label: "Turtle Helmet",     category: "helmet" },
  ],
  chestplate: [
    { id: "leather_chestplate",   label: "Leather Chestplate",   category: "chestplate" },
    { id: "chainmail_chestplate", label: "Chainmail Chestplate", category: "chestplate" },
    { id: "iron_chestplate",      label: "Iron Chestplate",      category: "chestplate" },
    { id: "golden_chestplate",    label: "Golden Chestplate",    category: "chestplate" },
    { id: "diamond_chestplate",   label: "Diamond Chestplate",   category: "chestplate" },
    { id: "netherite_chestplate", label: "Netherite Chestplate", category: "chestplate" },
    { id: "elytra",               label: "Elytra",               category: "chestplate" },
  ],
  leggings: [
    { id: "leather_leggings",   label: "Leather Leggings",   category: "leggings" },
    { id: "chainmail_leggings", label: "Chainmail Leggings", category: "leggings" },
    { id: "iron_leggings",      label: "Iron Leggings",      category: "leggings" },
    { id: "golden_leggings",    label: "Golden Leggings",    category: "leggings" },
    { id: "diamond_leggings",   label: "Diamond Leggings",   category: "leggings" },
    { id: "netherite_leggings", label: "Netherite Leggings", category: "leggings" },
  ],
  boots: [
    { id: "leather_boots",   label: "Leather Boots",   category: "boots" },
    { id: "chainmail_boots", label: "Chainmail Boots", category: "boots" },
    { id: "iron_boots",      label: "Iron Boots",      category: "boots" },
    { id: "golden_boots",    label: "Golden Boots",    category: "boots" },
    { id: "diamond_boots",   label: "Diamond Boots",   category: "boots" },
    { id: "netherite_boots", label: "Netherite Boots", category: "boots" },
  ],
  elytra:         [{ id: "elytra",           label: "Elytra",           category: "elytra" }],
  shield:         [{ id: "shield",           label: "Shield",           category: "shield" }],
  fishing_rod:    [{ id: "fishing_rod",      label: "Fishing Rod",      category: "fishing_rod" }],
  shears:         [{ id: "shears",           label: "Shears",           category: "shears" }],
  flint_and_steel:[{ id: "flint_and_steel",  label: "Flint and Steel",  category: "flint_and_steel" }],
};

export interface SelectedEnchant {
  id: string;
  level: number;
}

export function buildGiveCommand(
  player: string,
  itemId: string,
  enchants: SelectedEnchant[],
  customName: string,
  count: number,
  format: VersionFormat,
): string {
  const p = player || "@p";
  const c = Math.max(1, count);

  if (enchants.length === 0 && !customName) {
    return `/give ${p} minecraft:${itemId} ${c}`;
  }

  if (format === "nbt") {
    // 1.20.4 >
    const parts: string[] = [];

    if (enchants.length > 0) {
      const enchList = enchants
        .map((e) => `{id:"${e.id}",lvl:${e.level}s}`)
        .join(",");
      parts.push(`Enchantments:[${enchList}]`);
    }

    if (customName) {
      const escaped = customName.replace(/"/g, '\\"');
      parts.push(`display:{Name:'{"text":"${escaped}","italic":false}'}`);
    }

    const nbt = parts.length > 0 ? `{${parts.join(",")}}` : "";
    return `/give ${p} minecraft:${itemId}${nbt} ${c}`;
  } else {
    // 1.20.4 <
    const components: string[] = [];

    if (enchants.length > 0) {
      const levels = enchants
        .map((e) => `"${e.id}":${e.level}`)
        .join(",");
      components.push(`enchantments={levels:{${levels}}}`);
    }

    if (customName) {
      const escaped = customName.replace(/"/g, '\\"');
      components.push(`custom_name='{"text":"${escaped}","italic":false}'`);
    }

    const comp = components.length > 0 ? `[${components.join(",")}]` : "";
    return `/give ${p} minecraft:${itemId}${comp} ${c}`;
  }
}
