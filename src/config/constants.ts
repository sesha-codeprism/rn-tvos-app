//@ts-nocheck
import { UIDefinition } from "../@types/UIDefinition";
import { GLOBALS } from "../utils/globals";
const groups =
  "3570824%2C1%2C3%2C10%2C11%2C12%2C13%2C14%2C270%2C10685%2C2000347%2C4037302%2C4059042%2C4108036%2C4130048%2C4130049%2C4137558%2C4159196%2C4159197%2C4159198%2C4165138%2C4170685%2C4170687%2C4171666%2C4172342%2C4175344%2C4190802%2C4196614%2C4252769";
const pivots = "Language|en";
const lang = GLOBALS.store?.settings?.display?.onScreenLanguage?.languageCode || "fr-FR";

export { groups, pivots, lang };

export const appUIDefinition: UIDefinition = require("../config/uidefinition.json");
export const debounceTime = appUIDefinition?.config?.debounceTime ?? 500;
export const onscreenLanguageList = appUIDefinition.onscreenLanguage;
export const fossLicense = require("../config/fosslicense.json")
export const layout2x3 = "TwoByThree";
export const layoutMixed = "Mixed";
export const layout16x9 = "SixteenByNine";
