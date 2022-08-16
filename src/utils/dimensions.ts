import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");
const normalizedWidth = width / 1920;
const normalizedHeight = height / 1080;

export function getScaledValue(value: number): number {
    return value * normalizedWidth;
}

export function getScaledWidth(value: number): number {
    return value * normalizedWidth;
}

export function getScaledHeight(value: number): number {
    return value * normalizedHeight;
}

// UI constants:
export const TopBarHeight = getScaledValue(120);
export const PagePadding = getScaledValue(100);

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const showcardWidth = getScaledValue(650);
export const showcardHeight = getScaledValue(590);
