const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Expo config plugin that configures the iOS Podfile for Firebase compatibility.
 *
 * use_frameworks! :linkage => :static is set via expo-build-properties
 * (ios.useFrameworks: "static"), and React Native is built from source
 * (ios.buildReactNativeFromSource: "true") to be compatible with frameworks.
 *
 * This plugin adds:
 * - $RNFirebaseAsStaticFramework = true
 * - gRPC pods with modular_headers disabled (avoids module map conflicts)
 * - CLANG_ENABLE_EXPLICIT_MODULES = NO (fixes Xcode 16+ gRPC crash)
 * - CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES = YES
 */
function withFirebaseIOS(config) {
  return withDangerousMod(config, [
    "ios",
    (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
      let podfile = fs.readFileSync(podfilePath, "utf8");

      // 1. Add $RNFirebaseAsStaticFramework = true at the top
      if (!podfile.includes("$RNFirebaseAsStaticFramework")) {
        podfile = podfile.replace(
          /^(require .+autolinking.+\n)/m,
          "$1$RNFirebaseAsStaticFramework = true\n"
        );
      }

      // 2. Disable modular headers for gRPC pods (avoid module map conflicts)
      const grpcPods = [
        "  pod 'gRPC-Core', :modular_headers => false",
        "  pod 'gRPC-C++', :modular_headers => false",
        "  pod 'BoringSSL-GRPC', :modular_headers => false",
      ].join("\n");

      if (!podfile.includes("gRPC-Core")) {
        podfile = podfile.replace(
          /(use_expo_modules!\n)/,
          `$1\n${grpcPods}\n`
        );
      }

      // 3. Add build settings in post_install (before react_native_post_install)
      if (!podfile.includes("CLANG_ENABLE_EXPLICIT_MODULES")) {
        const buildSettings = `
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |build_config|
        build_config.build_settings['CLANG_ENABLE_EXPLICIT_MODULES'] = 'NO'
        build_config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
      end
    end`;

        podfile = podfile.replace(
          /(post_install do \|installer\|\n)/,
          `$1${buildSettings}\n`
        );
      }

      fs.writeFileSync(podfilePath, podfile);
      return config;
    },
  ]);
}

module.exports = withFirebaseIOS;
