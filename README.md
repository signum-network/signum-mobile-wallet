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

## 🎨 Styling (Tailwind / NativeWind)

The project uses **NativeWind v4** for Tailwind-style utility classes.

### Useful Links
- Docs: https://www.nativewind.dev/
- Troubleshooting: https://www.nativewind.dev/docs/getting-started/troubleshooting

### Notes
- Write Tailwind classes directly in your React components  
- Fully compatible with Expo-managed workflow  
- Prebuild required when adding new native modules  
- Restart the app after editing `tailwind.config.js`

---

## 🧰 Debugging Tools

### Reactotron
Useful for logging, network, Redux, async storage, and performance insights.  
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
| **preview** | Internal test builds (APK / ad-hoc iOS) | For QA & testers |
| **production** | Store releases | For Google Play & App Store |

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

Correct versioning is essential for publishing builds to **Google Play** and the **Apple App Store**.

Expo uses:

- **version** → what the user sees  
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

These *must* be incremented **every time** you submit a build — even if the user-facing version stays the same.

### Android
```json
"android": {
  "versionCode": 1
}
```
- Must be an **integer**
- Must always increase: `1 → 2 → 3 → ...`

### iOS
```json
"ios": {
  "buildNumber": "1"
}
```
- Must be a **string**
- Increases the same way: `"1" → "2" → "3"`

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

### ✔️ Update **version**
Only when something changes for the user.

### ✔️ Update **versionCode** and **buildNumber**
Every upload to:

- Google Play  
- App Store Connect  


---

## 🧪 Testing

- **Preview builds** for internal QA  
- **Development builds** for debugging and feature work  
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
