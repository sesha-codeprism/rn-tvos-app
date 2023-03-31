import React, { forwardRef, Ref, useContext, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import MFPopup from "../components/MFPopup";
import Settings from "../components/MFSideMenu/SettingsContainer";
import ConflictResolutionPanel from "../views/app/details_pages/details_panels/ConflictsContainer";
import MFEventEmitter from "../utils/MFEventEmitter";
import { ConflictResolutionContext } from "../contexts/conflictResolutionContext";
import PlayerSubtitlePanel from "./VideoPlayer/VideoPlayerSidePanels/PlayerSubtitlePanel";
import PlayerQualityPanel from "./VideoPlayer/VideoPlayerSidePanels/PlayerQualityPanel";

export const Empty = (props: any) => {
  return <View style={{ height: 1, backgroundColor: "black" }}></View>;
};

const enum Routes {
  Empty,
  Settings,
  ConflictResolution,
  PlayerSubtitle,
  PlayerQuality,
  Popup,
}
const ComponentLoader = {
  [Routes.Settings]: Settings,
  [Routes.ConflictResolution]: ConflictResolutionPanel,
  [Routes.Popup]: MFPopup,
  [Routes.PlayerSubtitle]: PlayerSubtitlePanel,
  [Routes.PlayerQuality]: PlayerQualityPanel,
  [Routes.Empty]: Empty,
};

interface MFDrawerContainer { }

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

  const openConflict = (props: any) => {
    //  add to component stack
    componentStack.current?.push({ route: Routes.ConflictResolution, props: props });
    setComponentt(Routes.ConflictResolution);
  }

  const closeConflict = (params: any) => {
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    if (props && props?.onClose) {
      props?.onClose?.();
    }
    componentStack.current = [{ route: Routes.Empty, props: {} }];
    setComponentt(Routes.Empty);
  }


  const openPlayerSubtitle = (props: any) => {
    //  add to component stack
    componentStack.current?.push({ route: Routes.PlayerSubtitle, props: props });
    setComponentt(Routes.PlayerSubtitle);
  }

  const closePlayerSubtitle = (params: any) => {
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    if (props && props?.onClose) {
      props?.onClose?.();
    }
    componentStack.current = [{ route: Routes.Empty, props: {} }];
    setComponentt(Routes.Empty);
  }

  const openPlayerQuality = (props: any) => {
    //  add to component stack
    componentStack.current?.push({ route: Routes.PlayerQuality, props: props });
    setComponentt(Routes.PlayerQuality);
  }

  const closePlayerQuality = (params: any) => {
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    if (props && props?.onClose) {
      props?.onClose?.();
    }
    componentStack.current = [{ route: Routes.Empty, props: {} }];
    setComponentt(Routes.Empty);
  }


  const closeAll = () => {
    componentStack.current?.splice(1);
    setComponentt(Routes.Empty);
  }

  useEffect(() => {
    MFEventEmitter.on("openSettings", openSettings);
    MFEventEmitter.on("closeSettings", closeSettings);
    MFEventEmitter.on("openPopup", openPopup);
    MFEventEmitter.on("closePopup", closePopup);
    MFEventEmitter.on("openConflictResolution", openConflict);
    MFEventEmitter.on("closeConflictResolution", closeConflict);
    MFEventEmitter.on("openPlayerSubtitlePanel", openPlayerSubtitle);
    MFEventEmitter.on("closePlayerSubtitlePanel", closePlayerSubtitle);
    MFEventEmitter.on("openPlayerQualityPanel", openPlayerQuality);
    MFEventEmitter.on("closePlayerQualityPanel", closePlayerQuality);
    MFEventEmitter.on("closeAll", closeAll);
    console.log('MFDrawersComponent mounted');
    return () => {
      console.log('MFDrawersComponent un mounted');
    }
  }, []);

  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>> rendering >>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
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
  } else if (currentComponent === Routes.ConflictResolution) {
    const Component = ComponentLoader[Routes.ConflictResolution];
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    //@ts-ignore
    return <Component {...props}>/</Component>;
  } else if (currentComponent === Routes.PlayerSubtitle) {
    const Component = ComponentLoader[Routes.PlayerSubtitle];
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    //@ts-ignore
    return <Component {...props}>/</Component>;
  } else if (currentComponent === Routes.PlayerQuality) {
    const Component = ComponentLoader[Routes.PlayerQuality];
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
