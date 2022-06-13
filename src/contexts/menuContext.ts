import React from "react";
import { createContext } from "react";

let value = true;

const setValue = (newValue: boolean) => {
    value = newValue;
}

export const MenuContext = React.createContext({
    language: "en",
    setLanguage: (val: string) => {
        console.log("Sending prop:", val)
    }
});



export const MenuProvider = MenuContext.Provider;

export const MenuConsumer = MenuContext.Consumer;
