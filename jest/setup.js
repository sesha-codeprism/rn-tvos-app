import "react-native-gesture-handler/jestSetup";
import mockRNDeviceInfo from "react-native-device-info/jest/react-native-device-info-mock"; // or use require

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock("react-native-device-info", () => mockRNDeviceInfo);