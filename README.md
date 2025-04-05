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

### How to inspect SQLite File With Drizzle

- Start Development Client

- Open devtools menu from the terminal with "start" process and choose
  - `expo-drizzle-studio-plugin`

```cmd
shift + m
```

### App Updates

#### App Versioning for Expo Projects

If your app version is currently at `1.0.0`, then for Android and iOS, you’ll also need to set the **developer-facing build versions**. These values are typically incremented every time you publish a new build, regardless of whether the user-facing version changes.

#### Example of Versioning

- **`version`**: `"1.0.0"`  
  _Keep this as it is for now if you haven't made any user-visible changes._
- **`android.versionCode (integer)`**: `1`  
  _First build — increment this every time you build a new version for submission to the Play Store._

- **`ios.buildNumber (string)`**: `"1"`  
  _Same idea — increment for each build to be submitted to the App Store._

#### Example `app.json` or `app.config.js`

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

#### When Should You Change These?

- **Only update** `version` when there's a change visible to the user (like new features or UI changes).
- **Always update** `android.versionCode` and `ios.buildNumber` every time you submit a build to Google Play or the App Store, even if it's just a bug fix or internal change.
