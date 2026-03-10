# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm start                    # Expo dev server (requires dev client, not Expo Go)
npm run ios:dev              # Clean prebuild + launch iOS simulator
npm run ios:build            # iOS Release build

# Quality
npm run lint                 # ESLint
npm run lint:fix             # ESLint auto-fix
npm run format               # Prettier format
npm run format:check         # Prettier check
npm run typecheck            # TypeScript type-check
npm run code:style           # All checks: lint + format:check + typecheck

# Testing
npm test                     # Jest (--forceExit --silent)
npm run test:watch           # Jest watch mode
npx jest path/to/file.test   # Run a single test file

# Release
npm run publish:ios --bump=patch|minor|major|none
```

## Architecture

**iOS-only** expense tracker: React Native 0.83 + Expo SDK 55, TypeScript strict, NativeWind 4 (Tailwind CSS).

### Entry & Provider Stack

`index.ts` → `App.tsx` wraps providers in this order: GestureHandlerRootView → SafeAreaProvider → I18nextProvider → ErrorBoundary → AuthProvider → SortPreferencesProvider → DataProvider → BottomSheetModalProvider → NavigationContainer → RootNavigator.

### Auth

Firebase Auth with email/password, Google Sign-In, and Apple Sign-In. `AuthContext` subscribes to `onAuthStateChanged`; conditional navigation shows auth stack (no user) or app stack (user present, with email verification check for email/password users).

### Data Layer

- `DataContext` subscribes to Firestore `categories` and `wallets` in real-time; expenses are fetched on-demand via `ensureExpenses()`
- **All monetary amounts stored in cents** (integers) — conversion helpers in `src/types/firestore.ts`
- Global `monthly`/`yearly` toggle (`viewMode`) in DataContext affects displayed amounts
- User settings (currency, monthlyIncome, emergencyMonthlySavings, language) persisted to Firestore

### Firestore Structure

```
users/{userId}/
  ├── categories/{categoryId}   — { name, icon, createdAt }
  ├── expenses/{expenseId}      — { categoryId, name, amountCents, billingFrequency, walletId, priority, notes, createdAt }
  ├── wallets/{walletId}        — { name, icon, createdAt }
  └── settings (document)       — { currency, monthlyIncomeCents, emergencyMonthlySavingCents, language }
```

### Navigation

React Navigation 7: bottom-tabs (Home, Categories, Wallets, Emergency, Settings) each with their own native-stack. Add/edit screens presented as modals with slide-from-bottom animation.

### Component Layers

- **`src/design-system/`** — Agnostic UI primitives (Button, Card, ChipGroup, Input, ScreenHeader, ScreenWrapper, etc.). No business logic. Barrel export via `index.ts`.
- **`src/components/`** — Domain-specific components (ExpenseCard, CategoryCard, WalletCard, ExpenseForm, etc.). Compose design-system pieces. Barrel export via `index.ts`.

### Styling

NativeWind 4 with `tailwind.config.ts` extending custom colors from `src/constants/colors.ts`. Accent color: `fixo-400` (#818cf8). Light theme: bg `gray-100` (#f9fafb), cards `white`.

### i18n

i18next with 5 languages (en, it, fr, de, es). Lazy-loaded bundles in `src/i18n/`. Language synced to Firestore user settings.

## Testing Conventions

- Tests co-located: `ScreenName/ScreenName.test.tsx`
- Firebase Auth + Firestore fully mocked in `src/test/setup.ts` (Object.assign pattern for static props on `jest.fn()`)
- Use `mockDataContextDefaults` and `mockAuthContextDefaults` from `src/test/mocks.ts` for stable mock references
- Test fixtures in `src/test/fixtures.ts`
- **Important**: Use module-level mock objects (not inline) as `useCallback` deps to prevent infinite re-render loops in async screens

## Key Conventions

- Screen files follow `src/screens/{auth,app}/ScreenName/ScreenName.tsx` pattern
- Services in `src/services/auth.ts` and `src/services/firestore.ts` — all Firebase interaction isolated here
- Custom hooks in `src/hooks/` (useExpenses, useEntityList, useSocialAuth, etc.)
- ESLint 9 flat config + Prettier (semicolons, double quotes, trailing commas)
- Cannot use Expo Go — native Firebase modules require dev client (`expo-dev-client`)
