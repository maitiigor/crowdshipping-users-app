const { withProjectBuildGradle } = require("@expo/config-plugins");

module.exports = function withNotifee(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      const notifeeRepo = `maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }`;
      if (!config.modResults.contents.includes(notifeeRepo)) {
        config.modResults.contents = config.modResults.contents.replace(
          /maven \{ url 'https:\/\/www.jitpack.io' \}/,
          (match) => `${match}\n        ${notifeeRepo}`
        );
      }
    }
    return config;
  });
};
