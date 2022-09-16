import React from 'react';
import { BootStrapResponse } from '../../@types/BootStrapResponse';
import { UDLResponse } from '../../@types/UDLResponse';
import { AppStrings, setOnScreenLanguage } from '../../config/strings';
import { duplex } from '../../modules/duplex';
import { deleteUserSettings, GLOBALS } from '../globals';
import { generateGUID } from '../guid';
import { updateStore } from '../helpers';


export const setGlobalData = (bootStrapResponse: BootStrapResponse) => {
    GLOBALS.bootstrapSelectors = bootStrapResponse;
    GLOBALS.store.rightsGroupIds = bootStrapResponse.RightsGroupIds;
    GLOBALS.store.accountID = GLOBALS.bootstrapSelectors.AccountId;
    console.log(bootStrapResponse);
    GLOBALS.enableRTL =
        GLOBALS.store.settings.display.onScreenLanguage.enableRTL;
    setOnScreenLanguage(GLOBALS.store.settings.display.onScreenLanguage.languageCode)
    console.log("GLOBALS", GLOBALS);
    updateStore(JSON.stringify(GLOBALS.store));

}


export const connectDuplex = () => {
    const GUID = generateGUID();
    const duplexEndpoint = `wss://ottapp-appgw-client-a.dev.mr.tv3cloud.com/S1/duplex/?sessionId=${GUID}`;
    duplex.initialize(duplexEndpoint);

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
            updateStore(JSON.stringify(GLOBALS.store))
            return false
        }
    } else {
        return false;
    }
}