# React Native Freelance Boilerplate — Architecture & Setup Guide

A modular, cross-platform (iOS + Android) React Native CLI starter built to spin up client work fast, and to double as a portfolio showcase piece. This document is the reference to hand to Antigravity IDE (or any AI coding tool) before writing a single line of code.

**Stack decisions locked in:**
- React Native **CLI** (bare workflow — full native control for client-specific native modules)
- TypeScript, strict mode
- React Navigation v7
- State: **Zustand** (local/UI state) + **RTK Query** (server state / caching / mutations) + **React Query** (secondary async data layer, e.g. non-Redux-owned fetches, background sync)
- React Native Reanimated 3 + Gesture Handler (animations)

---

## 1. App Flow

```
Cold start
   │
   ▼
 Splash Screen ── checks: auth token? app version status? first launch flag?
   │
   ├─ Force-update required ──► Update Required Modal (blocks app, links to store)
   │
   ├─ First launch (no token) ──► Welcome / Onboarding Carousel ──► Login / Signup ──► Home
   │
   └─ Returning + valid token ──► Home (skips Welcome + Auth entirely)

Home (Bottom Tab Navigator — 5 tabs, count configurable)
   ├─ Home
   ├─ Dashboard
   ├─ [Slot 3 — swappable per client, e.g. "Explore"/"Orders"]
   ├─ [Slot 4 — swappable per client, e.g. "Chat"/"Bookings"]
   └─ Me / Settings
```

Key design point: the **first-launch vs returning-user branch** lives in a single `AppNavigator` gate component driven by a persisted flag (`hasOnboarded`) + token presence — not scattered `if` checks across screens.

---

## 2. Folder Structure

```
rn-freelance-boilerplate/
├── android/
├── ios/
├── .env.development
├── .env.staging
├── .env.production
├── react-native-config.d.ts
├── app.json
├── index.js
├── metro.config.js
├── babel.config.js
├── tsconfig.json
│
└── src/
    ├── app/                          # App-level composition root
    │   ├── App.tsx
    │   ├── AppNavigator.tsx          # Auth/onboarding/version gating lives here
    │   ├── providers/                # All context/providers composed in one place
    │   │   ├── ReactQueryProvider.tsx
    │   │   ├── ReduxProvider.tsx
    │   │   ├── ThemeProvider.tsx
    │   │   └── index.tsx             # <AppProviders> wraps them all
    │   └── bootstrap/
    │       ├── initApp.ts            # Runs before render: config load, crash reporter init
    │       └── versionCheck.ts       # Calls remote config, decides force-update state
    │
    ├── navigation/
    │   ├── RootNavigator.tsx
    │   ├── AuthStack.tsx
    │   ├── OnboardingStack.tsx
    │   ├── BottomTabNavigator.tsx    # 5-tab config-driven, see tabs.config.ts
    │   ├── navigationRef.ts
    │   └── types.ts                  # Typed param lists for every stack
    │
    ├── screens/
    │   ├── splash/
    │   │   └── SplashScreen.tsx
    │   ├── onboarding/
    │   │   └── WelcomeScreen.tsx
    │   ├── auth/
    │   │   ├── LoginScreen.tsx
    │   │   └── SignupScreen.tsx
    │   ├── home/
    │   │   └── HomeScreen.tsx
    │   ├── dashboard/
    │   │   └── DashboardScreen.tsx
    │   ├── settings/
    │   │   └── SettingsScreen.tsx
    │   └── update-required/
    │       └── UpdateRequiredModal.tsx
    │
    ├── features/                     # Domain-sliced, each self-contained (screens optional here)
    │   ├── auth/
    │   │   ├── auth.slice.ts         # Zustand store: session, tokens, user
    │   │   ├── auth.api.ts           # RTK Query endpoints: login, signup, refresh
    │   │   └── auth.types.ts
    │   ├── permissions/
    │   │   ├── permission-registry.ts   # Single source of truth, all permissions default OFF
    │   │   ├── usePermission.ts         # Hook: request/check/status per permission
    │   │   └── PermissionGate.tsx       # Wraps UI that needs a permission first
    │   └── app-config/
    │       ├── remote-config.api.ts     # RTK Query: fetch min supported version, feature flags
    │       └── app-config.slice.ts
    │
    ├── store/
    │   ├── index.ts                  # configureStore, combines RTK Query + Zustand bridges
    │   ├── rootReducer.ts
    │   └── zustand/
    │       ├── useThemeStore.ts      # light/dark/system
    │       ├── useUIStore.ts         # global UI state (toasts, bottom sheets, loaders)
    │       └── useOnboardingStore.ts # hasOnboarded flag (persisted)
    │
    ├── services/
    │   ├── api/
    │   │   ├── apiClient.ts          # Axios/fetch instance, base URL from env
    │   │   ├── interceptors.ts       # Auth header injection, 401 refresh flow
    │   │   └── endpoints.ts
    │   ├── storage/
    │   │   ├── secureStorage.ts      # Keychain/Keystore wrapper — tokens, secrets
    │   │   └── asyncStorage.ts       # Non-sensitive persisted prefs
    │   ├── encryption/
    │   │   └── crypto.ts             # AES helpers, ready to wire up when backend needs it
    │   └── version/
    │       └── versionComparator.ts  # semver compare: installed vs. min-required
    │
    ├── theme/
    │   ├── tokens.ts                 # colors, spacing, radii, typography — light+dark maps
    │   ├── ThemeContext.tsx
    │   └── useAppTheme.ts
    │
    ├── components/
    │   ├── ui/                       # Buttons, Inputs, Cards, Sheets — dumb/presentational
    │   ├── layout/                   # SafeScreen, KeyboardAvoidingWrapper, TabBarIcon
    │   └── feedback/                 # Toasts, Skeletons, ErrorBoundary
    │
    ├── animations/
    │   └── transitions.ts            # Shared Reanimated presets (fade, slide, spring configs)
    │
    ├── config/
    │   ├── env.ts                    # Typed wrapper around react-native-config
    │   ├── tabs.config.ts            # Array-driven bottom tab definitions (add/remove tabs here)
    │   └── constants.ts
    │
    ├── hooks/                        # Cross-cutting hooks (useDebounce, useAppState, etc.)
    ├── utils/
    └── types/
        └── global.d.ts
```

**Why this shape:** `features/` isolates anything with real business logic (auth, permissions, remote config) so a client-specific feature can be dropped in or ripped out without touching navigation or theming. `screens/` stays thin — composition only.

---

## 3. Permissions — Default-Off Registry Pattern

Every permission is declared once, defaults to **not requested / not granted**, and is requested only at the point of use (never all at launch):

```
permission-registry.ts
  ├─ CAMERA:    { status: 'undetermined', rationale: '...' }
  ├─ LOCATION:  { status: 'undetermined', rationale: '...' }
  ├─ CONTACTS:  { status: 'undetermined', rationale: '...' }
  ├─ STORAGE:   { status: 'undetermined', rationale: '...' }
  └─ NOTIFICATIONS: { status: 'undetermined', rationale: '...' }
```

`usePermission('LOCATION')` returns `{ status, request(), openSettings() }`. `<PermissionGate permission="CAMERA">` wraps any screen/component that needs it, showing a rationale UI before the native prompt fires. Nothing is auto-requested on app boot — this keeps you compliant with Play Store/App Store review policies out of the box, and each client build just toggles which permissions are actually wired into the manifest/plist.

---

## 4. Dark Mode / Light Mode

- `theme/tokens.ts` exports two token maps (`lightTheme`, `darkTheme`) — colors, spacing, radius, font scale.
- `useThemeStore` (Zustand, persisted) holds `'light' | 'dark' | 'system'`.
- `ThemeProvider` resolves `'system'` via `useColorScheme()` and feeds resolved tokens down via context.
- All `components/ui/*` consume tokens only — zero hardcoded colors, so a new client theme is a token-file swap, not a rewrite.

---

## 5. Version Control / Force-Update Flow

1. On splash, `versionCheck.ts` calls a remote-config endpoint (RTK Query) returning `{ minSupportedVersion, latestVersion, storeUrl }`.
2. `versionComparator.ts` compares it against the installed build version (`react-native-device-info`).
3. If installed < `minSupportedVersion` → app routes straight to `UpdateRequiredModal` (non-dismissible), which deep-links to the Play Store / App Store listing.
4. If installed < `latestVersion` but ≥ `minSupportedVersion` → optional, dismissible "update available" banner instead of a hard block.
5. Version identifiers (e.g. `1.1.0`) are tagged at build time via `app.json`/native build config, so tying a server-side "deprecated" flag to a specific shipped build is just an admin-panel entry — no app code changes needed to deprecate a version later.

---

## 6. Environment Variables & Config Versioning

- `react-native-config` for `.env.development` / `.env.staging` / `.env.production` — API base URLs, feature flags, public keys.
- `config/env.ts` wraps `Config` from `react-native-config` in a typed object so nothing reads `process.env`-style strings directly in feature code.
- Secrets that must never sit in `.env` (API secrets, encryption keys) go through `services/storage/secureStorage.ts` (Keychain/Keystore), fetched from backend after auth, never bundled.
- `services/encryption/crypto.ts` is a stub-but-ready AES wrapper — plug in a real key exchange when a client's backend needs encrypted payloads, without touching the rest of the app.

---

## 7. State Management Layering

| Layer | Tool | Owns |
|---|---|---|
| Local/UI state | **Zustand** | theme, onboarding flag, toasts/sheets, ephemeral form state |
| Server state (primary) | **RTK Query** | auth, remote config, anything with caching/invalidation/mutations tied to Redux devtools |
| Server state (secondary/async) | **React Query** | one-off fetches, polling, data not worth wiring into the Redux store (e.g. a client-specific feature bolted on later) |

Rule of thumb documented in-repo: if it needs global cache invalidation tied to app-wide auth state → RTK Query. If it's a standalone feature's data fetching, dropped in independently → React Query. Never both for the same endpoint.

---

## 8. Animations (Reanimated + Xcode note)

- Centralize shared animation configs in `animations/transitions.ts` (spring configs, shared fade/slide presets) so screen transitions stay consistent.
- Pin `react-native-reanimated` and `react-native-gesture-handler` versions together in `package.json` — these two are the most common source of the Xcode/Pod version mismatch pain on RN upgrades. Document the paired version numbers in the README each time you upgrade, and re-run `pod install` immediately after any bump.
- New Architecture (Fabric/TurboModules) readiness is called out separately in the README's "Upgrade Checklist" since Reanimated 3.x behavior differs slightly under it.

---

## 9. Modularity / Upgrade Strategy

- Every top-level `src/` folder gets its own tiny `README.md` stating its one job — keeps the repo self-documenting as a portfolio artifact.
- No screen imports another screen's internals directly — cross-feature communication goes through `store/` or `services/`.
- `config/tabs.config.ts` is the single array that drives the bottom tab bar — adding/removing a tab (your "5 tabs, could be more or less") is a one-line config change, not a navigator rewrite.
- Dependency versions pinned exactly (no `^`/`~`) in `package.json`, with a documented `UPGRADE.md` checklist for bumping React Native, Reanimated, and Navigation together as a group rather than piecemeal.

---

## 10. Getting Started Checklist (once you start building)

- [ ] `npx react-native init` (bare CLI, TypeScript template)
- [ ] Wire up `react-native-config` + three env files
- [ ] Build `theme/tokens.ts` (light + dark) before any UI component
- [ ] Scaffold `AppNavigator` gating logic (splash → version check → onboarding/auth → home)
- [ ] Build `permission-registry.ts` with all permissions defaulted off
- [ ] Set up `store/index.ts` (RTK Query) + first Zustand store (`useThemeStore`)
- [ ] Add `UpdateRequiredModal` + `versionComparator` stub (point at a mock config endpoint initially)
- [ ] Pin and test Reanimated + Gesture Handler versions on both platforms
- [ ] Write per-folder `README.md` stubs
- [ ] Tag this as v1.0.0 boilerplate release once the skeleton screens render end-to-end

---

*This is the planning/reference doc only — no implementation code yet, per your request.*
