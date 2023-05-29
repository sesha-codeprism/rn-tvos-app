import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Animated, Text } from "react-native";

/**
 * A Functional component that returns default caret component
 * @returns {Text} component with caret content
 */
export const CaretDefaultComponent = () => {
  return <Text>_</Text>;
};

/**
 * A functional component to render a fake caret symbol in text fields
 * @param animatedStyle - Animated style of caret
 * @param CaretComponent - Component to render at caret
 * @returns {forwardRef} - A fake caret component
 */
export const FakeCaret = forwardRef(
  ({ animatedStyle = {}, CaretComponent = CaretDefaultComponent }, ref) => {
    const [visible, setVisible] = useState(true);
    const [animation, setAnimation] = useState();

    useImperativeHandle(ref, () => ({
      show: () => setVisible(true),
      hide: () => setVisible(false),
    }));

    const fadeAim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (visible) {
        setAnimation(
          Animated.loop(
            Animated.sequence([
              Animated.delay(150),
              Animated.timing(fadeAim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: false,
              }),
              Animated.delay(150),
            ])
          )
        );
      } else if (animation != null) {
        animation.stop();
        setAnimation(null);
      }
    }, [visible]);

    useEffect(() => {
      if (animation != null) {
        animation.start(() => fadeAim.setValue(0));
      }
    }, [animation]);
    return (
      <Animated.View
        style={[
          animatedStyle,
          {
            opacity: fadeAim,
          },
        ]}
      >
        <CaretComponent />
      </Animated.View>
    );
  }
);
