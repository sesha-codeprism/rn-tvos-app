import React, { forwardRef, Ref, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import MFPopup from "../components/MFPopup";
import Settings from "../components/MFSideMenu/SettingsContainer";
import MFEventEmitter from "../utils/MFEventEmitter";

export const Empty = (props: any) => {
  return <View style={{ height: 1, backgroundColor: "black" }}></View>;
};

const enum Routes {
  Empty,
  Settings,
  Popup,
}
const ComponentLoader = {
  [Routes.Settings]: Settings,
  [Routes.Popup]: MFPopup,
  [Routes.Empty]: Empty,
};

interface MFDrawerContainer {}

const DrawerContainer = (props: MFDrawerContainer, ref: Ref<any>) => {
  const [currentComponent, setComponentt] = useState(Routes.Empty);

  const componentStack = useRef([{ route: Routes.Empty, props: {} }]);

  const openSettings = (props: any) => {
    //  add to component stack
    componentStack.current?.push({ route: Routes.Settings, props: props });
    setComponentt(Routes.Settings);
  };

  const closeSettings = (params: any) => {
    // remove from componnent stack
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    if (props && props?.onClose) {
      props?.onClose?.();
    }
    componentStack.current?.pop();
    setComponentt(
      componentStack.current[componentStack?.current?.length - 1]?.route
    );
  };

  const openPopup = (props: any) => {
    //  add to component stack
    componentStack.current?.push({ route: Routes.Popup, props: props });
    setComponentt(Routes.Popup);
  };

  const closePopup = (params: any) => {
    // remove from componnent stack
    componentStack.current?.pop();
    setComponentt(
      componentStack.current[componentStack?.current?.length - 1]?.route
    );
  };

  useEffect(() => {
    MFEventEmitter.on("openSettings", openSettings);
    MFEventEmitter.on("closeSettings", closeSettings);
    MFEventEmitter.on("openPopup", openPopup);
    MFEventEmitter.on("closePopup", closePopup);
  }, []);

  if (currentComponent === Routes.Empty) {
    const Component = ComponentLoader[Routes.Empty];
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    //@ts-ignore
    return <Component {...props}>/</Component>;
  } else if (currentComponent === Routes.Settings) {
    const Component = ComponentLoader[Routes.Settings];
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    //@ts-ignore
    return <Component {...props}>/</Component>;
  } else if (currentComponent === Routes.Popup) {
    const Component = ComponentLoader[Routes.Popup];
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    //@ts-ignore
    return <Component {...props}>/</Component>;
  } else {
    const Component = ComponentLoader[Routes.Empty];
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    //@ts-ignore
    return <Component {...props}>/</Component>;
  }
};

export const MFDrawerContainer = DrawerContainer;
