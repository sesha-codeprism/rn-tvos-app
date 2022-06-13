import { GLOBALS } from "../../src/utils/globals";
import { getStoresList } from "../discovery/discovery";

export interface CategoryTreesId {
    Culture: string;
    Value: string;
}


export interface Store {
    Id: string;
    Description: string;
    StoreType: string;
    IsAdult: boolean;
    CategoryTreesIds: CategoryTreesId[];
    IsDefault: boolean;
}

export const setDefaultAppStore = async () => {
    const STORE_TYPE = "HubsAndFeeds";
    const defaultMainStore = "HubsAndFeeds-Main";
    const bootstrapData = GLOBALS.bootstrapSelectors!;

    if (!bootstrapData || !bootstrapData.VersionSet) {
        // When user does not have any experience group, search for defaultMainStore
        // if  defaultMainStore exists return
        // else search for non adult, default and 'HubsAndFeeds' store and return
        const stores: Store[] | undefined = await getStoresList();
        if (!stores) {
            GLOBALS.storeID = defaultMainStore;
            return defaultMainStore;
        }

        const store = stores.filter(s => defaultMainStore === s.Id);
        if (store && store.length > 0) {
            console.log("returning default main store:", store[0].Id);
            GLOBALS.storeID = store[0].Id;
            return store[0].Id;
        }

        for (const store of stores) {
            if (
                store.IsDefault &&
                !store.IsAdult &&
                store.StoreType === STORE_TYPE
            ) {
                console.log("returning stores storeId:", store.Id);
                GLOBALS.storeID = store.Id;
                return store.Id;
            }
        }
    } else {
        for (const version of bootstrapData.VersionSet.Versions) {
            if (version.IsDefaultStore) {
                console.log(
                    "returning versionSet storeId: ",
                    version.StoreId
                );
                GLOBALS.storeID = version.storeID;
                return version.StoreId;
            }
        }
    }

    console.log("returning default main store id:", GLOBALS.storeID);
    return defaultMainStore;
}
