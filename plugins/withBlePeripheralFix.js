const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo config plugin that patches react-native-ble-peripheral's build.gradle
 * to be compatible with modern Gradle (replace `compile` → `implementation`,
 * update SDK versions, remove deprecated support libraries).
 */
function withBlePeripheralFix(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const buildGradlePath = path.join(
        config.modRequest.projectRoot,
        'node_modules',
        'react-native-ble-peripheral',
        'android',
        'build.gradle',
      );

      if (!fs.existsSync(buildGradlePath)) {
        console.warn('[withBlePeripheralFix] build.gradle not found, skipping patch.');
        return config;
      }

      const patchedGradle = `
apply plugin: "com.android.library"

android {
    compileSdkVersion 34
    buildToolsVersion "34.0.0"

    defaultConfig {
        minSdkVersion 23
        targetSdkVersion 34
        versionCode 1
        versionName "1.0"
    }
}

dependencies {
    implementation fileTree(dir: "libs", include: ["*.jar"])
    implementation "com.facebook.react:react-native:+"
}
`.trim();

      fs.writeFileSync(buildGradlePath, patchedGradle, 'utf-8');
      console.log('[withBlePeripheralFix] Patched react-native-ble-peripheral build.gradle');

      return config;
    },
  ]);
}

module.exports = withBlePeripheralFix;
