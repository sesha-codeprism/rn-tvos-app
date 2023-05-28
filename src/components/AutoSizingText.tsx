import * as React from "react";
import {
  Animated,
  ScrollView,
  View,
  LayoutChangeEvent,
  Text,
} from "react-native";
import { getScaledValue } from "../utils/dimensions";

/** Props for Auto-scrolling text component */
export interface Props {
  /** Style Object */
  style?: {
    /** Style for the text */
    textStyle?: { [key: string]: any };
    /** Style for the container rendering the text */
    containerStyle?: { [key: string]: any };
  };
  /** View padding to be added at the end of the text string */
  endPadding?: number;
  /** Duration of scrolling animation in ms */
  duration?: number;
  /** Delay of animation in ms */
  delay?: number;
  /** Does the text scroll left to right */
  isLeftToRight?: boolean;
  /** Does the text scroll top to bottom */
  isTopToBottom?: boolean;
  /** Is text horizontal? Defaults to true when @param {isLeftToRight}  is true*/
  isHorizontal?: boolean;
  /** Text label to auto scroll */
  value: string;
}

/**
 * A functional component that renders an auto -scrolling text view.
 * Text auto scrolls after specified delay (if any) and scrolls in specified direction
 * @param {Props} props - The props required Auto scrolling text view
 * @returns {JSX.Element} - The rendered Auto scrolling text view
 */
const AutoScrollingText = ({
  style,
  endPadding = getScaledValue(100),
  duration,
  delay = 3000,
  isLeftToRight = false,
  isTopToBottom = false,
  value = "",
  isHorizontal = false,
}: Props) => {
  const containerWidth = React.useRef(0);
  const containerHeight = React.useRef(0);

  const contentWidth = React.useRef(0);
  const contentHeight = React.useRef(0);

  const [isAutoScrolling, setIsAutoScrolling] = React.useState(false);
  const [dividerWidth, setDividerWidth] = React.useState(endPadding);

  const [scrollViewWidth, setScrollViewWidth] = React.useState(0);
  const [scrollViewHeigth, setScrollViewHeight] = React.useState(0);

  const [textWidth, setTextWidth] = React.useState(0);
  const [textHeight, setTextHeight] = React.useState(0);

  const offsetX = React.useRef(new Animated.Value(0));
  const offsetY = React.useRef(new Animated.Value(0));

  let contentRef: any;

  const measureScrollView = (event: LayoutChangeEvent) => {
    if (!contentRef) return;
    const { width, x, y, height } = event.nativeEvent.layout;

    if (isHorizontal) {
      const newContainerWidth = width;
      setScrollViewWidth(width);

      if (containerWidth.current === newContainerWidth) return;

      containerWidth.current = newContainerWidth;
      handleHorizontalAnimation(width, x);
    } else {
      const newContainerHeight = height;
      setScrollViewHeight(height);

      if (containerHeight.current === newContainerHeight) return;

      containerHeight.current = newContainerHeight;
      handleVerticalAnimation(height, y);
    }
  };

  const handleHorizontalAnimation = (newContentWidth: number, fx: number) => {
    if (!newContentWidth) {
      setIsAutoScrolling(false);
      return;
    }

    if (contentWidth.current === newContentWidth) return;
    contentWidth.current = newContentWidth;
    let newDividerWidth = endPadding;
    if (contentWidth.current < containerWidth.current) {
      if (endPadding < containerWidth.current - contentWidth.current) {
        newDividerWidth = containerWidth.current - contentWidth.current;
      }
    }
    setDividerWidth(newDividerWidth);
    setIsAutoScrolling(true);

    if (isLeftToRight) {
      offsetX.current.setValue(-(newContentWidth + newDividerWidth));
    }

    Animated.loop(
      Animated.timing(offsetX.current, {
        toValue: isLeftToRight
          ? fx
          : -(contentWidth.current + fx + newDividerWidth),
        duration: duration || 50 * contentWidth.current,
        delay,
        useNativeDriver: true,
      })
    ).start();
  };

  const handleVerticalAnimation = (newContentHeight: number, fy: number) => {
    if (!newContentHeight) {
      setIsAutoScrolling(false);
      return;
    }

    if (contentHeight.current === newContentHeight) return;
    contentHeight.current = newContentHeight;
    let newDividerHeight = endPadding;
    if (contentHeight.current < containerHeight.current) {
      if (endPadding < containerHeight.current - contentHeight.current) {
        newDividerHeight = containerHeight.current - contentHeight.current;
      }
    }
    setDividerWidth(newDividerHeight);
    setIsAutoScrolling(true);

    if (isTopToBottom) {
      offsetY.current.setValue(-(newContentHeight + newDividerHeight));
    }

    Animated.loop(
      Animated.timing(offsetY.current, {
        toValue: isTopToBottom
          ? fy
          : -(contentHeight.current + fy + newDividerHeight),
        duration: duration || 50 * contentHeight.current,
        delay,
        useNativeDriver: true,
      })
    ).start();
  };

  const measureTextcontent = (event: LayoutChangeEvent) => {
    const { width, x, height, y } = event.nativeEvent.layout;
    setTextWidth(width);
    setTextHeight(height);
    if (isHorizontal) {
      if (!containerWidth.current || width === contentWidth.current) return;

      offsetX.current.stopAnimation();
      offsetX.current.setValue(0);
      offsetX.current.setOffset(0);

      handleHorizontalAnimation(width, x);
    } else {
      if (!containerHeight.current || height === contentHeight.current) return;

      offsetY.current.stopAnimation();
      offsetY.current.setValue(0);
      offsetY.current.setOffset(0);

      handleVerticalAnimation(height, y);
    }
  };

  const textView = (
    <Text
      style={style?.textStyle}
      onLayout={measureTextcontent}
      ref={(ref: any) => (contentRef = ref)}
    >
      {value}
    </Text>
  );

  return (
    <View style={style?.containerStyle}>
      {isHorizontal ? (
        <ScrollView
          horizontal={true}
          bounces={false}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          onLayout={measureScrollView}
        >
          {scrollViewWidth <= textWidth ? (
            <Animated.View
              style={{
                flexDirection: "row",
                transform: [{ translateX: offsetX.current }],
              }}
            >
              {isAutoScrolling && textView}
              {isAutoScrolling && <View style={{ width: dividerWidth }} />}
              {textView}
            </Animated.View>
          ) : (
            textView
          )}
        </ScrollView>
      ) : (
        <ScrollView
          bounces={false}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          onLayout={measureScrollView}
        >
          {scrollViewHeigth <= textHeight ? (
            <Animated.View
              style={{
                transform: [{ translateY: offsetY.current }],
              }}
            >
              {isAutoScrolling && textView}
              {isAutoScrolling && <View style={{ height: dividerWidth }} />}
              {textView}
            </Animated.View>
          ) : (
            textView
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default AutoScrollingText;
