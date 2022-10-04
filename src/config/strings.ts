// @ts-nocheck
import { StringsObject } from "../@types/strings";
const enUS = require("../i18n/en-US/strings.json");
const frCA = require("../i18n/fr-CA/strings.json");
const enCA = require("../i18n/en-CA/strings.json");
const esCL = require('../i18n/es-CL/strings.json');
const huHU = require('../i18n/hu-HU/strings.json');
const arQA = require('../i18n/ar-QA/strings.json');



export const stringLocales = {
    "en-CA": enCA,
    "en-US": enUS,
    "fr-CA": frCA,
    "es-CL": esCL,
    "hu-HU": huHU,
    "ar-QA": arQA,

}

let AppStrings: StringsObject = enUS

export const setOnScreenLanguage = (onScreenLanguage: any) => {
    //@ts=ignore
    AppStrings = stringLocales[onScreenLanguage]
    console.log("AppStrings", AppStrings);
}
export { AppStrings };
