
# Signum Mobile Wallet

The new 🚀 **Signum Mobile Wallet** — fast, secure, modern.

This project is built with **Expo**, **React Native**, and **Expo Dev Client**, and is available for **iOS** and **Android**.

---

## 📦 Requirements

- **Node**: see `.nvmrc`
- **JDK 17**
- **Android Gradle Plugin**: 8.1.1
- **Gradle**: 8.3
- **Xcode**: (only required for local iOS builds – not needed when using EAS Build)

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

The project uses **NativeWind v4** for Tailwind-style styling in React Native.

### Useful Links
- NativeWind Docs: https://www.nativewind.dev/
- Troubleshooting Guide: https://www.nativewind.dev/docs/getting-started/troubleshooting

### Key Notes
- Uses Tailwind classes directly in components
- Fully compatible with Expo + React Native
- Requires prebuild for new native dependencies
- Ensure tailwind.config.js changes are followed by app reload

---

## 🧰 Debugging Tools

### Reactotron
https://docs.infinite.red/reactotron/

### Inspect SQLite (Drizzle ORM)
1. Start development client
2. Open Expo devtools → Shift + M
3. Select expo-drizzle-studio-plugin

---

## 🌐 Supported Platforms
- **Android**
- **iOS**

---

## 🏗️ Building the App

### Profiles
- **development** – dev client
- **preview** – APK test builds
- **production** – Store releases

### Development Build
```bash
eas build -p android --profile development
```

### Preview Build (APK)
```bash
eas build -p android --profile preview
```

### Production Build
```bash
eas build -p android --profile production
eas build -p ios --profile production
```

---

## 🔢 Versioning (Local)

```json
{
  "expo": {
    "version": "1.2.0",
    "android": { "versionCode": 2 },
    "ios": { "buildNumber": "2" }
  }
}
```

---

## 📂 EAS Configuration
(As in canvas)

---

## 🧪 Testing
- Use preview builds for QA.
- Use development builds for debugging.
- Use production builds for releases.

---

## 🔐 Security
- expo-secure-store for encrypted key storage.
- Biometric authentication support.

---

## 📝 License
Apache License 2.0
© 2025 Signum Network
