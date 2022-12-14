// @ts-nocheck

import { BootStrapResponse } from '../../@types/BootStrapResponse';
import { config } from '../../config/config';
import { setOnScreenLanguage } from '../../config/strings';
import { duplex } from '../../modules/duplex';
import { deleteUserSettings, GLOBALS, landingInfo } from '../globals';
import { generateGUID } from '../guid';
import { updateStore } from '../helpers';
import { addPrefixToUrl } from '../strings';
import { MFGlobalsConfig } from "../../../backend/configs/globals";


export const setGlobalData = (bootStrapResponse: BootStrapResponse) => {
    if(bootStrapResponse){
        const data = bootStrapResponse;
        GLOBALS.bootstrapSelectors = data;
        GLOBALS.store.rightsGroupIds = data?.RightsGroupIds;
        GLOBALS.store.accountID = GLOBALS.bootstrapSelectors?.AccountId;
        console.log(bootStrapResponse);
        GLOBALS.enableRTL =
            GLOBALS.store.settings.display.onScreenLanguage.enableRTL;
        setOnScreenLanguage(GLOBALS.store.settings.display.onScreenLanguage.languageCode)
    
        console.log("GLOBALS", GLOBALS);
        updateStore(GLOBALS.store);
    }
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