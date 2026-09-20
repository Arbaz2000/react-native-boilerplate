# Rename Checklist

Steps to re-brand this boilerplate for a new client project.

**Run first:**
```bash
# Renames JS/Java/ObjC references to the new app name
npx react-native-rename@latest "ClientAppName" -b com.client.appname
```

Then complete every item below manually — `react-native-rename` does not touch Firebase, certs, or deep links.

---

## 1. Bundle ID / applicationId

- [ ] **Android** — `android/app/build.gradle`: `namespace` + `applicationId`
- [ ] **iOS** — `ios/RNFreelanceBoilerplate.xcodeproj/project.pbxproj`: `PRODUCT_BUNDLE_IDENTIFIER` (both Debug + Release targets)
- [ ] **iOS** — `ios/RNFreelanceBoilerplate/Info.plist`: `CFBundleIdentifier` (if hardcoded)

## 2. Firebase

- [ ] Create a new Firebase project (or add an app to an existing project) under the new bundle ID
- [ ] Download new `google-services.json` → place in `android/app/`
- [ ] Download new `GoogleService-Info.plist` → place in `ios/RNFreelanceBoilerplate/`
- [ ] Update `REVERSE_CLIENT_ID` in `Info.plist` for Google Sign-In (if used)
- [ ] Re-register APN key or certificate in Firebase console under the new bundle ID

## 3. iOS APNs Push Certificate

- [ ] In Apple Developer portal, create a new APNs key (or cert) for the new bundle ID
- [ ] Upload the new key to Firebase > Project Settings > Cloud Messaging
- [ ] Update any third-party push service (OneSignal, etc.) with the new credentials

## 4. Deep Links

- [ ] `src/features/deep-linking/linkingConfig.ts` — update `DEEP_LINK_SCHEME`
- [ ] `android/app/src/main/AndroidManifest.xml` — update `<data android:scheme="..."/>`
- [ ] `ios/RNFreelanceBoilerplate/Info.plist` — update `CFBundleURLSchemes`
- [ ] If using Universal Links / App Links:
  - Re-publish `apple-app-site-association` on client domain with new bundle ID
  - Re-publish `assetlinks.json` on client domain with new `package_name`
  - Update `prefixes` array in `linkingConfig.ts`

## 5. App Icons & Splash

- [ ] Replace `assets/branding/icon-1024.png` with client icon
- [ ] Replace `assets/branding/splash-2732x2732.png` with client splash
- [ ] Re-run the asset generator (see `assets/branding/README.md` for commands)

## 6. Environment Variables

- [ ] `.env.development` — update `API_BASE_URL`, `REMOTE_CONFIG_URL`
- [ ] `.env.staging` — update all values
- [ ] `.env.production` — update all values
- [ ] Any CI/CD secret variables (GitHub Actions, Bitrise, etc.)

## 7. App Store / Play Console

- [ ] Create new iOS app in App Store Connect under the new bundle ID
- [ ] Create new Android app in Google Play Console under the new applicationId
- [ ] Set up new provisioning profiles (iOS) for the new bundle ID
- [ ] Update Fastlane / CI pipeline with new app identifiers

## 8. Smoke Test

- [ ] `npm run typecheck` — zero errors
- [ ] `npx react-native run-ios` — builds and launches
- [ ] `npx react-native run-android` — builds and launches
- [ ] Deep link: `xcrun simctl openurl booted <new-scheme>://` opens the app
- [ ] Push notification test (if applicable)
