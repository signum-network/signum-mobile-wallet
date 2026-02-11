# **Signum Mobile Wallet**

The new 🚀 **Signum Mobile Wallet** — fast, secure, and modern.

Built with **Expo**, **React Native**, and **Expo Dev Client**, targeting both **iOS** and **Android**.

---

## 🛠️ Development

The setup supports development on **Windows, macOS, and Linux**, with parallel testing on **iOS and Android** devices.

Windows 11 is fully supported. 
macOS additionally allows local iOS simulator builds.

**Expo Go App is not supported**, because of **native modules** dependencies (Quick Crypto library and Nitro modules). All local development and testing is done using the **Expo Dev Client**.

More details: [https://docs.expo.dev/develop/development-builds/introduction/](https://docs.expo.dev/develop/development-builds/introduction/)

---

This project supports **two local development workflows**, depending on your environment and use case.


### 📋 General Requirements

- **Node.js** (see `.nvmrc`)
- **npm**
- **Expo CLI**
- **EAS CLI**

---

**Prerequisite:** Dependencies must be installed once before using any development workflow:

```bash
npm install
```

---

### Option A: Expo Dev Client (recommended)

#### 1. Build the development client

Create an internal development build using EAS:

```bash
npm run build-dev
```

Install the generated build on your iOS and/or Android device.

> **Important (iOS):** The iPhone must be registered in **Expo / Apple Developer provisioning**:
>
> - The device UDID needs to be added to the Apple Developer account
> - The device must appear in Expo / EAS as an allowed device for development builds
> - Otherwise the dev client cannot be installed or launched on iOS

#### 2. Start the development server

Start the Metro bundler in Dev Client mode:

```bash
npm start
```

If you run into caching or bundling issues, use:

```bash
npm run start-clean
```

#### 3. Open the app

Open the app using the **Expo Dev Client** on your device. The app will connect to the running development server.

> **Note (Device setup):**
>
> - **iOS:** Make sure *Developer Mode* is enabled
>   - Settings → Privacy & Security → Developer Mode → ON
>   - Device restart required
> - **Android:** Enable *Developer options* and *USB debugging*
>   - Settings → About phone → tap *Build number* 7×
>   - Settings → Developer options → USB debugging

---

### Option B: Local native run (emulator / simulator)

This workflow is useful for quick local testing using emulators or simulators.

### 📋 Additional requirements (local native builds only)

- **JDK 17**
- **Android Gradle Plugin**: 8.1.1
- **Gradle**: 8.3
- **Android Studio**
- **Xcode** (macOS only, required for local iOS builds)


#### Start local native build

```bash
npm run android
# or
npm run ios
```

> Note: `npm run ios` requires macOS.

#### Start without build cache (optional)

```bash
npx expo run:android --no-build-cache
npx expo run:ios --no-build-cache
```

#### After installing new native libraries

```bash
npm run prebuild
```

#### SQLite migrations

Change the schema in `src/db/schema.ts` and run:

```bash
npx drizzle-kit migrate
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

## 🏗️ Build Profiles (EAS)

This project uses multiple EAS build profiles with different guarantees depending on the target environment.

| Profile     | Script                  | Description                                            |
| ----------- | ----------------------- | ------------------------------------------------------ |
| Development | `npm run build-dev`     | Internal dev client build, uncommitted changes allowed |
| Preview     | `npm run build-preview` | Preview build, clean git state required                |
| Production  | `npm run build-prod`    | Production build, clean git state required             |

---

## 🔢 Versioning & App Updates

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

### Deep Link Testing

Test dApp integration deep links:

```bash
# Test transaction signing (sign action)
npm run test-deeplink

# Test dApp connection (connect action)
npm run test-connect
```

See [Deep Link Testing Guide](./docs/DEEPLINK_TESTING.md) and [Connect dApp Flow](./docs/CONNECT_DAPP_FLOW.md) for details.

### Demo Web dApp

Test deep links in a real browser environment:

```bash
cd demo-dapp
npm install
npm run dev
# Vite will show local and network URLs
```

The demo dApp provides:
- ✅ Connect wallet flow (request public key)
- ✅ Send transaction flow (sign & broadcast)
- ✅ Network switching (Testnet/Mainnet)
- ✅ Activity logging
- ✅ No build required (pure HTML/JavaScript)

See [Demo dApp README](./demo-dapp/README.md) for detailed instructions.

---

## 🔐 Security

- Secure key storage via **expo-secure-store**  
- Optional biometric authentication  
- Automatic logout and inactivity protection  

---

## 📝 License

Apache License 2.0  
© 2026 Signum Network
