// @ts-nocheck
import { StringsObject } from "../@types/strings";
const enUS = require("../i18n/en-US/strings.json");
const frCA = require("../i18n/fr-CA/strings.json");
const enCA = require("../i18n/en-CA/strings.json");
const esCL = require('../i18n/es-CL/strings.json');
const huHU = require('../i18n/hu-HU/strings.json');
const arQA = require('../i18n/ar-QA/strings.json');
import mkIcons from "../config/MKIcons/";



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

export const getFontIcon = (iconKey: keyof typeof mkIcons): string => {
    // Source: MK-IconCodes.json
    const iconCode =
        (AppStrings.str_locale_id &&
            (mkIcons as any)[AppStrings?.str_locale_id][iconKey]) ||
        (mkIcons as any)["common"][iconKey];
    return String.fromCharCode(Number('0xe03D'));
};
export { AppStrings };

