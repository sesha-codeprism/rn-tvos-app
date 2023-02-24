// @ts-nocheck

import { BootStrapResponse } from '../../@types/BootStrapResponse';
import { config } from '../../config/config';
import { setOnScreenLanguage } from '../../config/strings';
import { duplex } from '../../modules/duplex';
import { deleteUserSettings, GLOBALS } from '../globals';
import { generateGUID } from '../guid';
import { updateStore } from '../helpers';
import { addPrefixToUrl } from '../strings';
import { DefaultStore } from '../DiscoveryUtils';
import { NativeModules } from 'react-native';
import { getChannelMap, makeSlabUrl } from "../../utils/live/LiveUtils";
import { getChannelRights } from "../../../backend/live/live";



export const setGlobalData = (bootStrapResponse: BootStrapResponse) => {
    return new Promise((resolve, reject) => {
        if (bootStrapResponse) {
            const data = bootStrapResponse;
            GLOBALS.bootstrapSelectors = data;
            GLOBALS.store.rightsGroupIds = data?.RightsGroupIds;
            GLOBALS.store.accountID = GLOBALS.bootstrapSelectors?.AccountId;
            if (!GLOBALS.store.settings.display.onScreenLanguage.enableRTL) {
                GLOBALS.enableRTL =
                    GLOBALS.store.settings.display.onScreenLanguage.enableRTL;
            }
            if (GLOBALS.store.settings.display.onScreenLanguage.languageCode == "") {
                GLOBALS.store.settings.display.onScreenLanguage.languageCode = "en-US";
            }
            setOnScreenLanguage(GLOBALS.store.settings.display.onScreenLanguage.languageCode)
            GLOBALS.store.CurrentStoreID = DefaultStore.Id;
            console.log("GLOBALS", GLOBALS);
            updateStore(GLOBALS.store);
            resolve(GLOBALS.store);
        } else {
            reject("No Global data");
        }
    });
}

///  
/// To be called from application side to conect to duplex, only once
/// @param : onDuplexMessage, Applicationn side root new duplex message dispatcher/handler.
///
export const connectDuplex = (onDuplexMessage: (any) => void) => {
    const GUID = generateGUID();
    const duplexEndpoint = `${addPrefixToUrl(GLOBALS.bootstrapSelectors?.ServiceMap.Services.duplex, GLOBALS.bootstrapSelectors?.ServiceMap.Prefixes[config.prefixType])}?sessionId=${GUID}`;
    duplex.initialize(duplexEndpoint, null, onDuplexMessage);
}
/** 
 * Function to decide if user is logging in with same account 
 * If yes, carry over the settings.
 * Else remove out the settings
 * */
export const verifyAccountAndLogin = async () => {
    /** 
     * Perform checks only if @param GLOBALS.store.accountID is not null and undefined.
     * If @param GLOBALS.store.accountID matches with @param GLOBALS.bootstrapSelectors.AccountId, user logged in with same account.. Return true
     * Else clear out settings by resetting  @param GLOBALS.store.settings
     * Set value of @param GLOBALS.store.accountID to @param GLOBALS.bootstrapSelectors.AccountId, for future calculations
     */
    if (GLOBALS.store.accountID) {
        if (GLOBALS.store.accountID === GLOBALS.bootstrapSelectors?.AccountId) {
            return true;
        } else {
            GLOBALS.store = deleteUserSettings();
            //@ts-ignore
            GLOBALS.store.accountID = GLOBALS.bootstrapSelectors?.AccountId;
            updateStore(GLOBALS.store)
            return false
        }
    } else {
        return false;
    }
}

export const getBestSupportedLocaleID = (acceptLanguage: string): string | null => {
    // verify that you have loaded selectable locales from config.json

    if (!config.onScreenLanguage?.tracks) {
        return null;
    }
    const parsedLocalJson = config.onScreenLanguage.tracks;
    // if no languages to choose from, just return the first entry in config
    if (!acceptLanguage) {
        return parsedLocalJson[0];
    }

    // split into array of locale or locale/qvalue pairs
    const preferredLocales = acceptLanguage.split(",");
    const preferredArray: LocaleQValue[] = [];
    let i: number;
    for (i = 0; i < preferredLocales.length; i++) {
        const preferred = preferredLocales[i];
        if (preferred) {
            const localePair = {
                // separate item into array of locale/qvalue pairs
                locale: preferred.split(";")[0],
                // qvalue of 1.0 used if no value assigned
                qvalue: Number(preferred.split("=")[1] || 1.0),
            };
            preferredArray.push(localePair);
            // look for the hyphen and add an entry of just the two first characters
            if (-1 !== preferred.indexOf("-")) {
                preferredArray.push({
                    // use just the first two chars of the locale i.e. 'fr-FR' -> 'fr'
                    locale: preferred.substr(0, 2),
                    // set the qvalue to just below the language-LOCALE version
                    qvalue: localePair.qvalue - 0.01,
                });
            }
        }
    }

    // largest qvalue goes first
    preferredArray.sort((n1, n2) => n2.qvalue - n1.qvalue);

    for (i = 0; i < preferredArray.length; i++) {
        const preferredLocale: string = preferredArray[i].locale;

        // go through the array of selectable locales
        for (let j = 0; j < parsedLocalJson.length; j++) {
            const supportedLocale = parsedLocalJson[j];
            // matches both 'en-us' and 'en' to 'en-us'
            if (
                preferredLocale.toLowerCase() ===
                supportedLocale
                    .toLowerCase()
                    .substring(0, preferredLocale.length)
            ) {
                // return the full name of the matched locale
                return supportedLocale;
            }
        }
    }
    // if no match found, return first locale in the config.json
    return parsedLocalJson[0];
}

export const setLiveData = async () => {
    const promise1 = new Promise((resolve, reject) => {
        try {
            NativeModules.MKGuideBridgeManager.getCurrentSlots(
                true,
                (result: any) => {
                    const data = JSON.parse(result);
                    const finalData = data.map((element: CurrentSlotObject) => element);
                    GLOBALS.currentSlots = finalData;
                    resolve(finalData)
                }
            );
        } catch (e) {
            reject(e);
        }
    });
    const promise2 = new Promise((resolve, reject) => {
        try {
            NativeModules.MKGuideBridgeManager.getChannelMapInfo(async (result) => {
                console.log("coming inside getChannelMapInfo");
                console.log(result);
                const channelRights = await getChannelRights();
                const memoizedChannelMap = getChannelMap(
                    result,
                    channelRights?.data,
                    DefaultStore.Id,
                    "en-US"
                );
                GLOBALS.channelMap = memoizedChannelMap
                console.log("Set live data", GLOBALS);
            });
        } catch (e) {
            reject(e);
        }
    })
    return new Promise.all(promise1, promise2)
}

export const setNativeModuleData = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            NativeModules.MKGuideBridgeManager.setToken(GLOBALS.store?.accessToken);
            NativeModules.MKGuideBridgeManager.setRefreshToken(GLOBALS.store?.refreshToken);
            NativeModules.MKGuideBridgeManager.setChannelmapId(GLOBALS.bootstrapSelectors?.ChannelMapId);
            NativeModules.MKGuideBridgeManager.setEnvironment(GLOBALS.bootstrapSelectors?.ServiceMap.Services);
            NativeModules.MKGuideBridgeManager.setQualityforFilters(["HD", "SD", "4k"]);
            const channelRights = await getChannelRights();
            NativeModules.MKGuideBridgeManager.setchannelMapRights(channelRights?.data);
            resolve()
        } catch (e) {
            reject(e);

        }
    });
}   