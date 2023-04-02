import React, { Ref, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import EASModal from "../components/EAS/EASModal";
import MFEventEmitter from "../utils/MFEventEmitter";

export const Empty = (props: any) => {
  return <View style={{ height: 1, backgroundColor: "black" }}></View>;
};

const enum EASRoutes {
  Empty,
  EASAlert,
}

const ComponentLoader = {
  [EASRoutes.Empty]: Empty,
  [EASRoutes.EASAlert]: EASModal,
};

interface MFDrawerContainer {}

const EASContainer = (props: MFDrawerContainer, ref: Ref<any>) => {
  const [currentComponent, setComponentt] = useState(EASRoutes.Empty);

  const componentStack = useRef([{ route: EASRoutes.Empty, props: {} }]);

  const openALert = (props: any) => {
    componentStack.current?.push({ route: EASRoutes.EASAlert, props: props });
    setComponentt(EASRoutes.EASAlert);
  };

  const closePopup = (params: any) => {
    console.log("Close popup triggered");
    componentStack.current?.pop();
    setComponentt(
      componentStack.current[componentStack?.current?.length - 1]?.route
    );
  };

  const closeAll = () => {
    componentStack.current?.splice(1);
    setComponentt(EASRoutes.Empty);
  };

  useEffect(() => {
    MFEventEmitter.on("EASReceived", openALert);
    MFEventEmitter.on("EASClose", closePopup);
    MFEventEmitter.on("closeAll", closeAll);
    console.log("MFDrawersComponent mounted");
    return () => {
      console.log("MFDrawersComponent un mounted");
    };
  }, []);

  if (currentComponent === EASRoutes.Empty) {
    const Component = ComponentLoader[EASRoutes.Empty];
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    //@ts-ignore
    return <Component {...props}>/</Component>;
  } else if (currentComponent === EASRoutes.EASAlert) {
    const Component = ComponentLoader[EASRoutes.EASAlert];
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    //@ts-ignore
    return <Component {...props}>/</Component>;
  } else {
    const Component = ComponentLoader[EASRoutes.Empty];
    const props =
      componentStack.current[componentStack?.current?.length - 1]?.props;
    //@ts-ignore
    return <Component {...props}>/</Component>;
  }
};

export default EASContainer;
