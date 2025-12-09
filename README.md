# **Signum Mobile Wallet**

The new 🚀 **Signum Mobile Wallet** — fast, secure, and modern.

Built with **Expo**, **React Native**, and **Expo Dev Client**, targeting both **iOS** and **Android**.

---

## 📦 Requirements

- **Node**: see `.nvmrc`  
- **JDK 17**  
- **Android Gradle Plugin**: 8.1.1  
- **Gradle**: 8.3  
- **Xcode**: only required for *local* iOS builds — not needed when using **EAS Build**

---

## 🚀 Development

### Install dependencies
```bash
npm install
```

### Start development client
```bash
npm run android
# or
npm run ios
```

### Start without build cache
```bash
npx expo run:android --no-build-cache
npx expo run:ios --no-build-cache
```

### After installing new native libraries
```bash
npm run prebuild
```

---

## 🎨 Styling (Design Tokens + NativeWind)

The project uses a **unified design-token system** for all colors and theming, combined with **NativeWind v4** for layout utilities.

### 🔑 Key Concepts

- No Tailwind color classes like `bg-white`, `text-gray-500`, or `dark:bg-black`
- All colors are defined centrally in:  
  `src/theme/tokens.ts`
- Each design theme (e.g. `defaultLight`, `defaultDark`, `midnight`, `solarized`, `sunrise`, `bubblegum`) provides a full token set:
  - `background`
  - `surface` / `surfaceElevated`
  - `border`
  - `text` / `textMuted`
  - `primary` / `primarySoft`
  - `success`
  - `error`
- Components access design tokens using:

```ts
import { useAppTheme } from "@/hooks/useAppTheme";

const { tokens, isDarkMode, themeDesign } = useAppTheme();
```

- All UI elements (Navigation, TabBar, Buttons, Cards, Inputs, Forms, Alerts, Screens) render based on these tokens.

### 🧩 NativeWind Usage

NativeWind is used for **layout utilities** such as:

- Flexbox (`flex`, `items-center`, `justify-between`)
- Spacing (`px-4`, `py-2`, `gap-4`)
- Sizing (`w-full`, `h-12`)
- Borders & radius (`rounded-lg`, `rounded-full`)
- Interaction (`active:opacity-80`)

But **not** for colors.  
All color styling must come from the token system.

### 🌈 Theme Design System

- Users can switch design themes under **Settings → App Design**
- On first app launch, the system light/dark mode determines the initial theme:
  - Light system → `defaultLight`
  - Dark system → `defaultDark`
- After that, theme selection is persistent and user-controlled
- Themes are completely independent of system light/dark mode

### 📚 Useful Links

- NativeWind Docs: https://www.nativewind.dev/  
- Theme Tokens: `src/theme/tokens.ts`  
- Theme Hook: `src/hooks/useAppTheme.ts`

---

## 🧰 Debugging Tools

### Reactotron
Useful for logging, network monitoring, async storage inspection, and performance insights.  
https://docs.infinite.red/reactotron/

### Inspect SQLite (Drizzle ORM)
1. Start the development client  
2. Open Expo DevTools → press **Shift + M**  
3. Select **expo-drizzle-studio-plugin**

---

## 🌐 Supported Platforms
- **Android**  
- **iOS**

---

## 🏗️ Build Profiles (EAS)

The project uses **EAS Build** with the following profiles:

| Profile | Purpose | Notes |
|---------|---------|-------|
| **development** | Dev Client builds | Debugging, Reactotron, Drizzle Studio |
| **preview** | Internal test builds (APK / ad-hoc iOS) | QA & testing |
| **production** | Store releases | Google Play & App Store |

### Commands
```bash
# Development build
eas build -p android --profile development

# Preview build (APK)
eas build -p android --profile preview

# Production build
eas build -p android --profile production
eas build -p ios --profile production
```

---

# 🔢 Versioning & App Updates

Correct versioning is essential for publishing builds to **Google Play** and **App Store Connect**.

Expo uses:

- **version** → user-visible version  
- **android.versionCode** → required by Google Play  
- **ios.buildNumber** → required by App Store Connect  

---

## User-Facing Version

```json
"version": "1.0.0"
```

Update only when the user will notice changes:

- new features  
- UI changes  
- meaningful bug fixes  
- performance improvements  

---

## Store Build Numbers

These *must* be incremented **every time** you submit a build.

### Android
```json
"android": {
  "versionCode": 1
}
```
- Must be an integer  
- Must always increase  

### iOS
```json
"ios": {
  "buildNumber": "1"
}
```
- Must be a string  
- Must always increase  

---

## Example (`app.json`)

```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    },
    "ios": {
      "buildNumber": "1"
    }
  }
}
```

---

## When Should You Update?

### ✔️ `version`
When something changes for the user.

### ✔️ `versionCode` and `buildNumber`
Every time you upload a build to Google Play or App Store Connect.

---

## 🧪 Testing

- **Preview builds** for internal QA  
- **Development builds** for debugging  
- **Production builds** for store submissions  

---

## 🔐 Security

- Secure key storage via **expo-secure-store**  
- Optional biometric authentication  
- Automatic logout and inactivity protection  

---

## 📝 License

Apache License 2.0  
© 2025 Signum Network
