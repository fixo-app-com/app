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
| Auth | Firebase Auth (Google OAuth + Email/Password) |
| Database | Firestore |
| Testing | Jest + React Native Testing Library |
| Linting | ESLint 9 + Prettier |
| Build | EAS Build (Expo) |
| CI/CD | GitHub Actions |
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

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run ios` | Launch on iOS simulator |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | TypeScript type checking |

## Setup

```bash
npm install
npm start
```

Scan the QR code with Expo Go on your iPhone, or run `npm run ios` to use the iOS simulator (requires Xcode).
