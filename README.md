# Fixo

A personal iOS app to track and manage fixed monthly expenses. Know exactly how much you spend each month, broken down by category and bank account.

## What it does

Fixo helps you map all your recurring monthly expenses (rent, subscriptions, insurance, etc.) and gives you a clear overview of:

- **Total fixed expenses** per month
- **Breakdown by category** (e.g. Housing, Transport, Subscriptions)
- **Breakdown by wallet/bank account** (e.g. which account pays what)
- **Emergency fund** tracking

This is not a daily expense tracker — it focuses exclusively on predictable, recurring costs.

## Tech Stack

| Component  | Technology                                                    |
| ---------- | ------------------------------------------------------------- |
| Framework  | React Native 0.83 + Expo SDK 55                               |
| Language   | TypeScript (strict)                                           |
| Styling    | NativeWind 4 (Tailwind CSS for React Native)                  |
| Auth       | Firebase Auth (Google OAuth + Apple Sign-In + Email/Password) |
| Database   | Cloud Firestore (real-time sync)                              |
| Monitoring | Firebase Crashlytics                                          |
| Navigation | React Navigation 7 (native-stack + bottom-tabs)               |
| i18n       | i18next + react-i18next                                       |
| Animations | React Native Reanimated 4 + Gesture Handler                   |
| Testing    | Jest + React Native Testing Library                           |
| Linting    | ESLint 9 (flat config) + Prettier                             |
| Build      | EAS Build (local)                                             |
| Platform   | iOS only                                                      |

## Scripts

### Development

| Command             | Description                                 |
| ------------------- | ------------------------------------------- |
| `npm start`         | Start Expo dev server (requires dev client) |
| `npm run ios:dev`   | Clean prebuild + launch on iOS simulator    |
| `npm run ios:build` | Run iOS build in Release configuration      |

### Quality

| Command                | Description                         |
| ---------------------- | ----------------------------------- |
| `npm run lint`         | Run ESLint                          |
| `npm run lint:fix`     | Auto-fix ESLint issues              |
| `npm run format`       | Format code with Prettier           |
| `npm run format:check` | Check formatting without modifying  |
| `npm run typecheck`    | TypeScript type checking            |
| `npm run code:style`   | Run lint + format check + typecheck |
| `npm test`             | Run tests                           |
| `npm run test:watch`   | Run tests in watch mode             |

### Release

To publish a new version to the App Store:

```bash
npm run publish:ios --bump=<type>
```

This runs the full pipeline: code style checks → tests → version bump → git push → local build → App Store submit.

Bump types:

| Type    | Description                                      |
| ------- | ------------------------------------------------ |
| `patch` | Bug fixes (e.g. 1.0.0 → 1.0.1)                   |
| `minor` | New features (e.g. 1.0.0 → 1.1.0)                |
| `major` | Breaking changes (e.g. 1.0.0 → 2.0.0)            |
| `none`  | Skip bump — rebuild and resubmit current version |

## Prerequisites

- **Node.js** 20+
- **Xcode** (latest stable) with iOS simulator
- **CocoaPods** — `sudo gem install cocoapods`
- **Fastlane** — `brew install fastlane` (required for local EAS builds)
- **EAS CLI** — `npm install -g eas-cli`
- **Expo account** — logged in via `eas login`
- **GoogleService-Info.plist** — download from Firebase Console and place in the project root (git-ignored)

> Expo Go is **not** supported — the app requires a dev client build due to native Firebase modules.

## Setup

```bash
npm install

# First time: prebuild + compile + install on iOS simulator
npm run ios:dev

# Subsequent runs: just start Metro (dev client already installed)
npm start
```
