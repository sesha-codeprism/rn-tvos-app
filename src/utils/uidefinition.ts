import { GenericObject } from "../@types/GenericObject";
import { getScaledWidth, getScaledHeight } from "./dimensions";

const memoizedUIDef: GenericObject = { compiledUIDef: null };
const componentDefinitionObject: GenericObject = {};

const xParams: GenericObject = {
  left: 1,
  right: 1,
  marginRight: 1,
  marginLeft: 1,
  marginHorizontal: 1,
  paddingLeft: 1,
  paddingRight: 1,
  paddingHorizontal: 1,
  width: 1,
};

const yParams: GenericObject = {
  height: 1,
  top: 1,
  bottom: 1,
  marginTop: 1,
  marginBottom: 1,
  fontSize: 1,
  lineHeight: 1,
  margin: 1,
  marginVertical: 1,
  padding: 1,
  paddingBottom: 1,
  paddingTop: 1,
  paddingVertical: 1,
};

export const scaleAttributes = <T extends { [key: string]: any }>(
  definition: T
): T => {
  const scaledStyle: T = {} as T;
  Object.keys(definition || {}).forEach((key) => {
    const value = definition[key];
    if (typeof value === "number" && xParams[key]) {
      (scaledStyle as any)[key] = getScaledWidth(value);
    } else if (typeof value === "number" && yParams[key]) {
      (scaledStyle as any)[key] = getScaledHeight(value);
    } else {
      if (Array.isArray(value)) {
        const valueList = [];
        for (const item of value) {
          valueList.push(scaleAttributes(item));
        }
        (scaledStyle as any)[key] = valueList;
      } else if (typeof value === "object" && value !== null) {
        (scaledStyle as any)[key] = scaleAttributes(value);
      } else {
        (scaledStyle as any)[key] = value;
      }
    }
  });
  return scaledStyle;
};

export const initUIDef = (): null | Record<string, unknown> => {
  if (memoizedUIDef.compiledUIDef) {
    return memoizedUIDef.compiledUIDef;
  }

  return memoizedUIDef.compiledUIDef;
};

const getComponentDefinition = (
  id: string,
  componentArray: GenericObject[]
): GenericObject => {
  const nestedComponents = id.split(".");
  const component = nestedComponents.shift();

  if (!component) {
    return componentArray;
  }

  const filteredStructure = componentArray.filter(
    (filteredComponent: GenericObject) => filteredComponent.id === component
  );

  const nextComponent = nestedComponents.join(".");
  if (
    !nextComponent ||
    !filteredStructure.length ||
    !filteredStructure[0].components
  ) {
    return filteredStructure;
  }

  return getComponentDefinition(nextComponent, filteredStructure[0].components);
};

export const getUIdef = (id: string): null | Record<string, unknown> => {
  if (!id || id === "") {
    return null;
  }

  if (!memoizedUIDef.compiledUIDef) {
    initUIDef();
  }

  if (componentDefinitionObject[id]) {
    return componentDefinitionObject[id];
  }

  componentDefinitionObject[id] = getComponentDefinition(
    id,
    memoizedUIDef.compiledUIDef.components
  )[0];
  return componentDefinitionObject[id];
};
