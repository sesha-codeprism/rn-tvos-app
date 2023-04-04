import { GLOBALS } from "./globals";

const pconConfig = GLOBALS.store?.settings.parentalControll;
export const ADULT_STORE = "adult_store";
export const ADULT_STORE_REQUIRE_PIN = "adult_store_pin";
export const ADULT_CONTENT = "adult_content";
export const isAdultStoreBlock = () => {
  let adultStoreConfig =
    pconConfig && pconConfig?.adultLock ? pconConfig?.adultLock : {};
  if (adultStoreConfig[ADULT_STORE_REQUIRE_PIN]) {
    return true;
  } else {
    return false;
  }
};
export const isAdultContentBlock = () => {
  let adultStoreConfig =
    pconConfig && pconConfig?.adultLock ? pconConfig?.adultLock : {};
  if (adultStoreConfig[ADULT_CONTENT]) {
    return true;
  } else {
    return false;
  }
};

export const isPconBlocked = (playInfo: any, locale?: any) => {
  // Schedule.Ratings
  const pconRatingConfigs =
    GLOBALS.store?.settings.parentalControll.contentLock || {};
  console.log(
    "playInfo inside isPconBlocked",
    playInfo,
    pconRatingConfigs,
    GLOBALS.store?.settings.parentalControll.contentLock
  );
  const ratings = playInfo && playInfo.Ratings ? playInfo.Ratings : [];
  const isRated = Array.isArray(ratings) && ratings.length;
  let isLocked: boolean = false;
  const ratingProviders = Object.keys(pconRatingConfigs);
  console.log("isPconBlocked data", ratings, isRated, ratingProviders);
  if (ratingProviders.length && ratings.length && isRated) {
    for (let i = 0; i < ratings.length; i++) {
      let ratingObj = ratings[i];
      if (ratingProviders.indexOf(ratingObj.System.toUpperCase()) > -1) {
        const ratedList: any[] =
          pconRatingConfigs[ratingObj.System.toUpperCase()];
        if (ratedList.length) {
          const ratedVal = ratedList.find(
            (item, index) => item.title === ratingObj.Value
          );
          if (ratedVal) {
            isLocked = true;
          } else {
            isLocked = false;
          }
        } else {
          isLocked = false;
        }
      } else {
        isLocked = false;
      }
    }
  } else {
    isLocked = isUnratedContentLocked();
  }
  console.log("islocked val before return", isLocked);
  return isLocked;
};

export const isPurchaseLocked = () => {
  const purchaseLockConfig =
    pconConfig && pconConfig?.purchaseLock ? pconConfig?.purchaseLock : {};
  if (purchaseLockConfig["locked"]) {
    return true;
  } else {
    return false;
  }
};

export const isUnratedContentLocked = () => {
  const contentLockConfig = GLOBALS.store?.settings.parentalControll.contentLock || {};
    // pconConfig && pconConfig?.contentLock ? pconConfig?.contentLock : {};
  const isEmpty = Object.keys(contentLockConfig).length > 0 ? false : true;
  const isUnratedLocked = contentLockConfig["lockUnratedContent"];
  console.log(
    "isUnratedContentLocked",
    pconConfig,
    contentLockConfig,
    contentLockConfig.lockUnratedContent,
    isUnratedLocked
  );
  if (!isEmpty) {
    return contentLockConfig.lockUnratedContent ? true : false;
  } else {
    return false;
  }
};

export const isRatingLocked = () => {
  const contentLockConfig =
    pconConfig && pconConfig?.purchaseLock ? pconConfig?.purchaseLock : {};
};
