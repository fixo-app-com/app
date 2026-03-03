#!/bin/bash
set -e

BUMP="$1"

if [ -z "$BUMP" ]; then
  echo ""
  echo "Usage: npm run publish:ios --bump=<patch|minor|major|none>"
  echo ""
  echo "Arguments:"
  echo "  patch   Increment the patch version (e.g. 1.0.0 -> 1.0.1) — for bug fixes"
  echo "  minor   Increment the minor version (e.g. 1.0.0 -> 1.1.0) — for new features"
  echo "  major   Increment the major version (e.g. 1.0.0 -> 2.0.0) — for breaking changes"
  echo "  none    Skip version bump — rebuild and resubmit the current version"
  echo ""
  exit 1
fi

if [[ "$BUMP" != "patch" && "$BUMP" != "minor" && "$BUMP" != "major" && "$BUMP" != "none" ]]; then
  echo "Error: bump must be one of: patch, minor, major, none"
  exit 1
fi

echo "==> Running quality checks..."
npm run lint && npm run typecheck && npm run test

if [ "$BUMP" != "none" ]; then
  echo "==> Bumping version ($BUMP)..."
  npm version "$BUMP"
fi

echo "==> Pushing to origin..."
git push origin main --tags

echo "==> Building iOS locally..."
npm run build:ios

IPA_FILE=$(ls -t *.ipa 2>/dev/null | head -1)
if [ -z "$IPA_FILE" ]; then
  echo "Error: No .ipa file found after build"
  exit 1
fi

echo "==> Submitting $IPA_FILE to App Store..."
npm run submit:ios -- --path "$IPA_FILE"

echo "==> Done!"
