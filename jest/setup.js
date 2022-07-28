import "react-native-gesture-handler/jestSetup";

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("react-native-reanimated", () => {
  console.log("react-native-reanimated done ");
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

console.log("react-native/Libraries/Animated/NativeAnimatedHelper done ");

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
