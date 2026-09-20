# assets/branding/

This folder is the **single source of truth for all visual identity assets**.

When cloning for a new client, replace everything in this folder — you should not need to touch the platform `android/` or `ios/` directories to swap branding.

## Contents

| File / Folder | Purpose |
|---|---|
| `icon-1024.png` | Master app icon (1024×1024, no transparency, no rounded corners — platforms handle masking) |
| `splash-2732x2732.png` | Splash / launch image at maximum resolution |
| `icon-android-foreground.png` | Adaptive icon foreground layer (Android 8+) |
| `icon-android-background.png` | Adaptive icon background layer (Android 8+) |

## Generating platform assets

Use **[react-native-bootsplash](https://github.com/zoontek/react-native-bootsplash)** for the splash screen and its asset generator:

```bash
npx react-native generate-bootsplash assets/branding/splash-2732x2732.png \
  --background-color="#FFFFFF" \
  --logo-width=300 \
  --assets-output=assets/bootsplash
```

Use **[react-native-make](https://github.com/bamlab/react-native-make)** or Android Studio / Xcode asset catalogs to generate icon sizes from `icon-1024.png`.

## Rules

- **Do not** put final sized icons here (e.g. `ic_launcher_48x48.png`) — those belong in native directories and are generated.
- **Do** commit your source-of-truth master files here (the 1024px icon, the hi-res splash).
- Replace these placeholders before your first production build.
