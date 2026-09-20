# App Name, Bundle ID & Per-Client Rebranding Strategy

## The core distinction

There are two different "names" in play, and conflating them is what makes this feel harder than it is:

1. **The template's own identity** — what this boilerplate repo is called while it lives as your reusable starting point / portfolio piece.
2. **Each client's app identity** — what it gets renamed to the moment you clone it to start real client work.

You don't need one system that runs both simultaneously (that's what product flavors are for — see the note at the end on why that's the *wrong* tool here). You need the template to be genuinely dumb and generic, and a fast, repeatable **rename step** for every new client project.

---

## 1. Naming the template itself

Since this is also a portfolio piece, treat it like a product with its own identity, not a placeholder:

- **App name:** `RNFreelanceBoilerplate` (or `RNStarter`, `Antigravity Mobile Kit` — you already use "Antigravity" as your personal design-system name, so `AntigravityRN` is worth considering if you want the portfolio brand to carry across web and mobile)
- **Bundle ID / package prefix:** `com.arbaz.rnboilerplate` (or `com.antigravity.rnboilerplate` if you go with the Antigravity branding)
- **iOS bundle ID:** `com.arbaz.rnboilerplate`
- **Android applicationId:** `com.arbaz.rnboilerplate`

This identity only matters for the demo build you show on your portfolio (TestFlight/internal APK link). It is never reused for a client — it exists so the repo has a real, runnable identity of its own before anyone renames it.

---

## 2. Per-client workflow: rename-on-clone, not build-time variants

Your instinct — "each time make a new build with a new name" — is correct, but do it as a **one-time rename right after cloning**, not something baked into runtime code. App name and bundle ID are compiled into native project files (Android `build.gradle`/`AndroidManifest.xml`, iOS `.pbxproj`/`Info.plist`); they are not values you can swap with an env variable at runtime the way you can swap an API URL.

**Recommended tool:** [`react-native-rename`](https://www.npmjs.com/package/react-native-rename) — handles both platforms in one command.

```bash
npx react-native-rename "ClientAppName" -b com.clientcompany.appname
```

This rewrites:
- Android: `applicationId`, `AndroidManifest.xml` labels, Java/Kotlin package folder structure
- iOS: `PRODUCT_BUNDLE_IDENTIFIER`, `Info.plist` display name, scheme name, Xcode target name

### What it does NOT do — your manual checklist after renaming

| Item | Why it breaks | Fix |
|---|---|---|
| Firebase config | `google-services.json` / `GoogleService-Info.plist` are tied to the old bundle ID/package name | Register a new Firebase app under the client's bundle ID, download fresh config files, replace them |
| Push notification certs (iOS) | APNs certs/keys are tied to the bundle ID | Re-generate APNs key/cert for the new bundle ID in Apple Developer portal |
| Deep link scheme / Universal Links | `linkingConfig.ts` and the associated domain's `apple-app-site-association` / `assetlinks.json` reference the old scheme/bundle ID | Update scheme in `linkingConfig.ts`, re-publish the association files if using a client domain |
| App icons / splash | Rename tool doesn't regenerate icon sets | Swap `react-native-bootsplash`/icon assets for the client's branding |
| `.env` files | Not touched by the rename tool (by design — these are your config layer, separate from native identity) | Update `API_BASE_URL`, keys, etc. per client as normal |
| Store listing metadata | Entirely separate from the codebase | New Play Console / App Store Connect entries per client app |

### Suggested repo workflow

1. Keep the boilerplate as its own git repo (or a GitHub **template repository**, which is the cleanest option — "Use this template" creates a fresh, unlinked repo per client with no shared git history to accidentally push into).
2. For each new client: create from template → `npx react-native-rename` → walk the checklist above → set up client-specific `.env.*` files → done.
3. Keep a single `RENAME_CHECKLIST.md` in the template repo root (essentially the table above) so future-you doesn't relearn this each time.

---

## 3. Why NOT product flavors / multi-target setup for this use case

Android build flavors and iOS schemes *can* produce multiple app IDs from one codebase, and it's tempting to reach for since it's the "proper" native-engineering answer. But that pattern is built for **one company shipping variants of the same app** (free/paid, dev/staging/prod, whitelabel apps that share 95% of the same business logic and update together). Your situation is different: each client project is a separate, independently-evolving, separately-shipped codebase. Bundling them as flavors of one repo would mean every client shares one git history and one release cadence — the opposite of what freelance client work needs. Rename-on-clone into separate repos is the right-sized solution here.

If you ever do build several small variant apps that truly share 95% of the same code and update together, that's the moment to revisit flavors — not before.
