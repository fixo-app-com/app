const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withModularHeaders(config) {
  return withDangerousMod(config, [
    "ios",
    (cfg) => {
      // Set use_frameworks with static linkage
      const propsPath = path.join(
        cfg.modRequest.platformProjectRoot,
        "Podfile.properties.json",
      );
      const props = JSON.parse(fs.readFileSync(propsPath, "utf8"));
      props["ios.useFrameworks"] = "static";
      fs.writeFileSync(propsPath, JSON.stringify(props, null, 2) + "\n");

      // Patch Podfile to allow non-modular includes in framework modules
      // This is required because @react-native-firebase imports React headers
      // which are non-modular, inside framework module builds
      const podfilePath = path.join(
        cfg.modRequest.platformProjectRoot,
        "Podfile",
      );
      let podfile = fs.readFileSync(podfilePath, "utf8");

      const patchCode = `
    # Allow non-modular includes for Firebase compatibility
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |build_config|
        build_config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
      end
    end`;

      podfile = podfile.replace(
        "react_native_post_install(",
        patchCode + "\n    react_native_post_install(",
      );

      fs.writeFileSync(podfilePath, podfile);

      return cfg;
    },
  ]);
};
