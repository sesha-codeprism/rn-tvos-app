import React, { Ref, useEffect, useRef, useState } from "react";
import { Dimensions, Modal, StyleSheet, View } from "react-native";

import MFPopup from "../components/MFPopup";
import MFEventEmitter from "../utils/MFEventEmitter";
import EpisodeRecordOptions from "./app/details_pages/details_panels/EpsiodeRecordOptions";
import MoreInfoPanel from "./app/details_pages/details_panels/MoreInfoPanel";
import DetailsContainer from "./DetailsModal";

export const Empty = (props: any) => {
  return <View style={{ height: 1, backgroundColor: "black" }}></View>;
};

const enum Routes {
  Empty,
  Popup,
  MoreInfo,
  EpisodeRecordOptions,
}
const ComponentLoader = {
  [Routes.Empty]: Empty,
  [Routes.Popup]: MFPopup,
  [Routes.MoreInfo]: MoreInfoPanel,
  [Routes.EpisodeRecordOptions]: EpisodeRecordOptions,
};

const MFDetailsDrawerContainer = (props: any, ref: Ref<any>) => {
  const [currentComponent, setComponentt] = useState(Routes.Empty);

  const componentStack = useRef([{ route: Routes.Empty, props: {} }]);

  const openEpisodeRecordOptions = (props: any) => {
    componentStack.current?.push({
      route: Routes.EpisodeRecordOptions,
      props: props,
    });
    setComponentt(Routes.EpisodeRecordOptions);
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

  const openMoreInfo = (props: any) => {
    componentStack.current?.push({ route: Routes.MoreInfo, props: props });
    setComponentt(Routes.MoreInfo);
  };

  const closeModal = (params: any) => {
    console.log("Closing off the modal");
    // remove from componnent stack
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    //@ts-ignore
    if (props && props?.onClose) {
      //@ts-ignore
      props?.onClose?.();
    }
    componentStack.current?.pop();
    setComponentt(
      componentStack.current[componentStack?.current?.length - 1]?.route
    );
  };

  useEffect(() => {
    MFEventEmitter.on("openMoreInfo", openMoreInfo);
    MFEventEmitter.on("openPopup", openPopup);
    MFEventEmitter.on("closePopup", closePopup);
    MFEventEmitter.on("closeModal", closeModal);
    MFEventEmitter.on("openEpisodeRecordOptions", openEpisodeRecordOptions);
  }, []);

  if (currentComponent === Routes.Empty) {
    const Component = ComponentLoader[Routes.Empty];
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    //@ts-ignore
    return <Component {...props}>/</Component>;
  } else if (currentComponent === Routes.MoreInfo) {
    console.log("Running this..");
    const Component = ComponentLoader[Routes.MoreInfo];
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    console.log("props", props, componentStack.current);
    //@ts-ignore
    return (
      <DetailsContainer>
        {/* <Component {...props}></Component> */}
      </DetailsContainer>
    );
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

export default MFDetailsDrawerContainer;
