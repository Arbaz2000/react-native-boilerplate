/**
 * src/config/tabs.config.ts
 *
 * Array-driven bottom tab bar configuration.
 *
 * To add or remove a tab → edit THIS array only.
 * The BottomTabNavigator reads this at runtime — no navigator rewrite needed.
 *
 * Slot layout (spec §2):
 *   0 → Home       (always present)
 *   1 → Dashboard  (always present)
 *   2 → [Slot 3]   — swap per client, e.g. "Explore" / "Orders"
 *   3 → [Slot 4]   — swap per client, e.g. "Chat" / "Bookings"
 *   4 → Settings   (always present)
 */

export type TabConfig = {
  /** Route name — must match a screen registered in BottomTabNavigator */
  name: string;
  /** Label shown in the tab bar */
  label: string;
  /** SF Symbol name (iOS) or Material icon name (Android) — or pass a component */
  icon: string;
};

export const TABS: TabConfig[] = [
  { name: 'Home',      label: 'Home',      icon: 'home'      },
  { name: 'Dashboard', label: 'Dashboard', icon: 'bar-chart' },
  { name: 'Explore',   label: 'Explore',   icon: 'compass'   }, // ← Slot 3: swap per client
  { name: 'Chat',      label: 'Chat',      icon: 'message'   }, // ← Slot 4: swap per client
  { name: 'Settings',  label: 'Settings',  icon: 'settings'  },
];
