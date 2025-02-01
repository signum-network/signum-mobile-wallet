# signum-mobile-wallet

The new 🚀 Signum Mobile Wallet - Better than ever before 🤘

[![runs with Expo Go](https://img.shields.io/badge/Runs%20with%20Expo%20Go-000.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.dev/client)

## Development Tips

### How to start hacking

- `npm i` Install dependencies
- `npm run android` or `npm run ios` Start expo development client

### Create Development Builds without cache

- `npx expo run:android --no-build-cache`
- `npx expo run:ios --no-build-cache`

### What to do when new libraries are installed

Execute `npm run prebuild`

### Debugging tools

https://docs.infinite.red/reactotron/

### Android

- JDK 17
- Android gradle plugin: 8.1.1
- Gradle: 8.3

### Ios

- Xcode 15.2

### Node

See `.nvmrc` file

### NativeWind Troubleshooting

https://www.nativewind.dev/v4/guides/troubleshooting

### OS Support

#### Wallet will be available only on `Android` and `iOS`

https://docs.expo.dev/versions/latest/#support-for-android-and-ios-versions

### Builds

#### Create a build using the `preview` profile

`eas build -p android --profile preview`
This builds an `.apk` file to allow you to test the build app on any physical android device
