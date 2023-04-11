import React, { forwardRef, Ref, useContext, useEffect, useRef, useState } from "react";
import { DeviceEventEmitter, View } from "react-native";
import MFPopup from "../components/MFPopup";
import Settings from "../components/MFSideMenu/SettingsContainer";
import ConflictResolutionPanel from "../views/app/details_pages/details_panels/ConflictsContainer";
import { ConflictResolutionContext } from "../contexts/conflictResolutionContext";
import MFPinPopup from "../components/MFPinPopup";
import PlayerSubtitlePanel from "./VideoPlayer/VideoPlayerSidePanels/PlayerSubtitlePanel";
import PlayerQualityPanel from "./VideoPlayer/VideoPlayerSidePanels/PlayerQualityPanel";
import Purchase from "../components/MFSideMenu/PurchaseContainer";

export const Empty = (props: any) => {
  return <View style={{ height: 1, backgroundColor: "black" }}></View>;
};

const enum Routes {
  Empty,
  Settings,
  ConflictResolution,
  PlayerSubtitle,
  PlayerQuality,
  PurchaseOption,
  PurchaseInformation,
  PurchaseNetwork,
  Purchase,
  Popup,
  MFPinPopup
}
const ComponentLoader = {
  [Routes.Settings]: Settings,
  [Routes.ConflictResolution]: ConflictResolutionPanel,
  [Routes.Popup]: MFPopup,
  [Routes.MFPinPopup]: MFPinPopup,
  [Routes.PlayerSubtitle]: PlayerSubtitlePanel,
  [Routes.PlayerQuality]: PlayerQualityPanel,
  [Routes.Empty]: Empty,
  [Routes.Purchase]: Purchase,
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
  const openMFPinPopup = (props: any) => {
    //  add MFPinPopup to component stack
    componentStack.current?.push({ route: Routes.MFPinPopup, props: props });
    setComponentt(Routes.MFPinPopup);
  };
  const closeMFPinPopup = (params: any) => {
    // remove MFPinPopup from componnent stack
    componentStack.current?.pop();
    setComponentt(
      componentStack.current[componentStack?.current?.length - 1]?.route
    );
  };


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


  const openPurchase = (props: any) => {
    //  add to component stack
    componentStack.current?.push({ route: Routes.Purchase, props: props });
    setComponentt(Routes.Purchase);
  }

  const closePurchase = (params: any) => {
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    if (props && props?.onClose) {
      props?.onClose?.();
    }
    componentStack.current?.pop();
    setComponentt(
      componentStack.current[componentStack?.current?.length - 1]?.route
    );
  }

  

  const closeAll = () => {
    componentStack.current?.splice(1);
    setComponentt(Routes.Empty);
  }

  useEffect(() => {
    const openSettingsSubscription = DeviceEventEmitter.addListener("openSettings", openSettings);
    const closeSettingsSubscription = DeviceEventEmitter.addListener("closeSettings", closeSettings);
    const openPopupSubscription = DeviceEventEmitter.addListener("openPopup", openPopup);
    const closePopupSubscription = DeviceEventEmitter.addListener("closePopup", closePopup);
    const openConflictResolutionSubscription = DeviceEventEmitter.addListener("openConflictResolution", openConflict);
    const closeConflictResolutionSubscription = DeviceEventEmitter.addListener("closeConflictResolution", closeConflict);
    const openPlayerSubtitlePanelSubscription = DeviceEventEmitter.addListener("openPlayerSubtitlePanel", openPlayerSubtitle);
    const closePlayerSubtitlePanelSubscription = DeviceEventEmitter.addListener("closePlayerSubtitlePanel", closePlayerSubtitle);
    const openPlayerQualityPanelSubscription = DeviceEventEmitter.addListener("openPlayerQualityPanel", openPlayerQuality);
    const closePlayerQualityPanelSubscription = DeviceEventEmitter.addListener("closePlayerQualityPanel", closePlayerQuality);
    const openPurchaseSubscription = DeviceEventEmitter.addListener("openPurchase", openPurchase);
    const closeClosePurchaseSubscription = DeviceEventEmitter.addListener("closeClosePurchase", closePurchase);
    const closeAllSubscription = DeviceEventEmitter.addListener("closeAll", closeAll);
    const openPinVerificationPopupSubscription = DeviceEventEmitter.addListener("openPinVerificationPopup", openMFPinPopup);
    const closePinVerificationPopupSubscription = DeviceEventEmitter.addListener("closePinVerificationPopup", closeMFPinPopup);
    console.log('MFDrawersComponent mounted');
    return () => {
      console.log('MFDrawersComponent un mounted');
      openSettingsSubscription.remove();
      closeSettingsSubscription.remove();
      openPopupSubscription.remove();
      closePopupSubscription.remove();
      openConflictResolutionSubscription.remove();
      closeConflictResolutionSubscription.remove();
      openPlayerSubtitlePanelSubscription.remove();
      closePlayerSubtitlePanelSubscription.remove();
      openPlayerQualityPanelSubscription.remove();
      closePlayerQualityPanelSubscription.remove();
      openPurchaseSubscription.remove();
      closeClosePurchaseSubscription.remove();
      closeAllSubscription.remove();
      openPinVerificationPopupSubscription.remove();
      closePinVerificationPopupSubscription.remove();
    }
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
  } else if(currentComponent === Routes.Purchase) {
    const Component = ComponentLoader[Routes.Purchase];
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
  } else if(currentComponent === Routes.MFPinPopup){
    const Component = ComponentLoader[Routes.MFPinPopup];
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
