# Publishing a New Version

This guide covers the full flow from version bump to App Store / Play Store submission.

## Prerequisites

- On the `develop` branch with a clean working tree
- [GitHub CLI](https://cli.github.com/) (`gh`) installed and authenticated
- [EAS CLI](https://docs.expo.dev/eas/) installed (`npm install -g eas-cli`)
- Apple Developer account configured with EAS
- Google Play service account configured with EAS

## Step 1: Bump the Version

```bash
npm run new-version
```

This interactive script will:

1. Verify you are on `develop` with a clean working tree
2. Create a changeset (patch or minor bump + description)
3. Run `changeset version` to bump `package.json` and update `CHANGELOG.md`
4. Sync `app.json` — sets `version`, increments `versionCode` and `buildNumber`
5. Prompt you to edit `store/release-notes/en-US.txt` (max 500 chars)
6. Commit and push to `develop`
7. Open a PR from `develop` to `main`

## Step 2: Review and Merge the PR

1. Review the PR on GitHub (`develop` -> `main`)
2. Merge the PR

Merging into `main` triggers the **Release** workflow (`.github/workflows/release.yml`), which automatically:

1. Creates a git tag `vX.Y.Z`
2. Creates a GitHub Release with changelog and store release notes
3. Builds the Android AAB
4. Submits the AAB to Google Play (internal track)
5. Uploads the AAB to the GitHub Release

## Step 3: Build & Submit iOS

iOS builds and submissions are done manually from your machine:

```bash
eas build --platform ios --profile production
eas submit --platform ios --latest
```

> **Note:** `eas build` runs `expo prebuild` internally, so there is no need to regenerate native projects beforehand.

## App Store Assets

- **Screenshots**: Take manually in Simulator using `Cmd+S`. Use iPhone Pro Max for the 6.9" size — App Store Connect can reuse these for smaller sizes.
- **Release notes**: `store/release-notes/en-US.txt`
- **Full description**: `store/full-description.txt`
- **Store logo**: `store/assets/`

## Build Profiles

| Profile       | iOS                | Android     | Use Case          |
|---------------|--------------------|-------------|--------------------|
| `development` | Dev client         | Dev client  | Local development  |
| `preview`     | Internal (ad-hoc)  | APK         | Internal testing   |
| `production`  | App Store          | AAB         | Store submission   |

## Troubleshooting

- **Version mismatch in simulator**: Run `npx expo prebuild --clean` and rebuild.
- **Duplicate build number rejected**: The `new-version` script auto-increments `buildNumber`. If you need to manually fix it, update `ios.buildNumber` and `android.versionCode` in `app.json`, then run `npx expo prebuild --clean`.
- **EAS login expired**: Run `eas login` to re-authenticate.
