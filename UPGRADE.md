# React Native Freelance Boilerplate — Upgrade Guide

This guide details the exact procedure for safely bumping major framework versions across React Native, React Navigation, Redux/TanStack, and native dependencies.

---

## 1. Upgrade Philosophy: Bundle Upgrades Together

In production React Native development, dependencies must **never be updated piecemeal**. A version bump to React Native often cascades into React Navigation, native screen containers, and Babel/Metro configurations.

Always update dependencies as a coordinated **cohesive group**:

```
Core Triad:
[React Native CLI & Engine] ──► [Navigation & Screens] ──► [Native Keychains/Storage]
```

---

## 2. Pinned Version Discipline

All dependencies in `package.json` are **strictly pinned** without `^` or `~`.
When upgrading, explicitly specify the exact target version with `--save-exact`:

```bash
npm install --save-exact <package>@<version>
npm install --save-dev --save-exact <package>@<version>
```

---

## 3. Step-by-Step Upgrade Checklist

### Step 1: Consult the React Native Upgrade Helper
Before touching code, compare your current version (`0.87.1`) against the target version:
- 🌐 [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)

Pay special attention to changes in:
- `android/build.gradle` and `android/app/build.gradle`
- `android/gradle/wrapper/gradle-wrapper.properties`
- `ios/Podfile`

### Step 2: Clean the Build Cache
Before starting upgrades, flush all local and native caches:

```bash
# 1. Clean Node modules & lockfile (if doing major bump)
rm -rf node_modules package-lock.json

# 2. Clean Android build artifacts
cd android && ./gradlew clean && cd ..

# 3. Clean iOS build artifacts and CocoaPods (on macOS)
cd ios && rm -rf Pods Podfile.lock && cd ..

# 4. Clean Metro cache
npx react-native start --reset-cache
```

### Step 3: Upgrade Packages via npm
Install the coordinated packages using `--save-exact`:

```bash
# Example: Upgrading Core
npm install --save-exact react@<version> react-native@<version>

# Example: Upgrading Navigation
npm install --save-exact @react-navigation/native@<version> \
  @react-navigation/native-stack@<version> \
  @react-navigation/bottom-tabs@<version> \
  react-native-screens@<version> \
  react-native-safe-area-context@<version>

# Example: Upgrading Dev Dependencies & Types
npm install --save-dev --save-exact @types/react@<version> typescript@<version>
```

### Step 4: Sync iOS Pods
```bash
cd ios
pod install --repo-update
cd ..
```

### Step 5: Verify Type Checking & Test Suites
Run the automated verification suite:

```bash
# 1. TypeScript Strict Typecheck
npm run typecheck

# 2. Jest Unit Tests
npm test

# 3. Linter
npm run lint
```

### Step 6: Native Smoke Testing
Run the debug builds on connected devices or emulators:

```bash
# Android verification
npm run android

# iOS verification (macOS)
npm run ios
```

---

## 4. Current Baseline Compatibility Matrix (v1.0.0)

| Layer | Package | Current Pinned Version | Notes |
|---|---|---|---|
| **Engine** | `react-native` | `0.87.1` | React 19.2.3, New Architecture ready |
| **Runtime** | `react` | `19.2.3` | Matches React Native 0.87.1 |
| **Navigation** | `@react-navigation/native` | `7.4.1` | React Navigation v7 |
| **Native Screens** | `react-native-screens` | `4.28.0` | Configured with `onCreate(null)` in `MainActivity.kt` |
| **Safe Area** | `react-native-safe-area-context` | `5.10.0` | Composed in `<AppProviders>` |
| **State** | `@reduxjs/toolkit` | `2.12.0` | RTK Query server state |
| **Local State** | `zustand` | `5.0.5` | Memory & AsyncStorage slices |
| **Secure Secrets** | `react-native-keychain` | `10.0.0` | Hardware KeyStore & Keychain |
| **Mock Server** | `msw` | `2.15.0` | Mock Service Worker for tests & review |
