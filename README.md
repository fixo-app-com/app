# Fixo

A personal iOS app to track and manage fixed monthly expenses. Know exactly how much you spend each month, broken down by category and bank account.

## What it does

Fixo helps you map all your recurring monthly expenses (rent, subscriptions, insurance, etc.) and gives you a clear overview of:

- **Total fixed expenses** per month
- **Breakdown by category** (e.g. Housing, Transport, Subscriptions)
- **Breakdown by bank account** (e.g. which account pays what)

This is not a daily expense tracker — it focuses exclusively on predictable, recurring costs.

## Tech Stack

| Component | Technology |
|---|---|
| Framework | React Native + Expo (SDK 55) |
| Language | TypeScript |
| Styling | NativeWind (Tailwind CSS for React Native) |
| Auth | Firebase Auth (Google OAuth + Apple Sign-In + Email/Password) |
| Database | Firestore |
| Testing | Jest + React Native Testing Library |
| Linting | ESLint 9 + Prettier |
| Build | EAS Build (local) |
| CI | GitHub Actions |
| Platform | iOS only |

## Project Structure

```
src/
├── components/
│   └── ComponentName/
│       ├── ComponentName.tsx
│       └── ComponentName.test.tsx
└── test/
    └── setup.ts
```

Each component lives in its own folder with a colocated test file.

## Scripts

### Development

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server (requires dev client) |
| `npm run ios` | Launch on iOS simulator |
| `npm run ios:build` | Clean prebuild + launch on iOS simulator |

### Quality

| Command | Description |
|---|---|
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | TypeScript type checking |

### Release

To publish a new version to the App Store:

```bash
npm run publish:ios --bump=<type>
```

This runs the full pipeline: lint → typecheck → test → version bump → git push → local build → App Store submit.

Bump types:

| Type | Description |
|---|---|
| `patch` | Bug fixes (e.g. 1.0.0 → 1.0.1) |
| `minor` | New features (e.g. 1.0.0 → 1.1.0) |
| `major` | Breaking changes (e.g. 1.0.0 → 2.0.0) |
| `none` | Skip bump — rebuild and resubmit current version |

## Setup

```bash
npm install
npx expo prebuild --clean
npm run ios
```

Requires Xcode and a dev client build (Expo Go is not supported due to native Firebase modules).
