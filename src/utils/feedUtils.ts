import React from 'react';
import { udlList, UdlProviders } from '../../backend/udl/provider';

/** Implement rest of the feed calls.. Currently focusing on YouMightLike feature only */
export const feedActionsByURI: { [key: string]: any } = {
    Dynamic: {
        "udl://device/apps/allapps": null,
        "udl://device/apps/Game": null,
        "udl://device/apps/General": null,

        "udl://discovery/categories/items":
            null,
        "udl://discovery/categories/items/?pivots=true":
            null,

        "udl://discovery/feeds/movies":
            null,
        "udl://discovery/feeds/moviesandtvshows":
            null,
        "udl://discovery/feeds/packages":
            null,
        "udl://discovery/feeds/payperview":
            null,
        "udl://discovery/feeds/tvshows":
            null,
        "udl://discovery/feeds/Zones":
            null,

        "udl://discovery/librariespivotcategories/items":
            null,
        "udl://discovery/libraryprograms/complete":
            null,
        "udl://discovery/libraryprograms/complete/?pivots=true":
            null,

        "udl://discovery/libraryprograms/collections/packages":
            null,

        "udl://discovery/promotionalcategories/items":
            null,
        "udl://dvrproxy/viewable-subscription-items":
            null,
        "udl://dvrproxy/viewable-subscription-items-showtype":
            null,
        "udl://dvrproxy/viewable-subscription-items-showtype/?pivots=true":
            null,

        "udl://discovery/svodpackagetitles":
            null,

        "udl://live/catchup/items":
            null,
        "udl://live/catchup/items/?pivots=true":
            null,
        "udl://live/catchup/pivotitems":
            null,
        "udl://live/favoritechannelsfeed":
            null,
        "udl://live/feeds/trending":
            null,
        "udl://live/feeds/playableChannels":
            null,
        "udl://live/feeds/catchup":
            null,
        "data://live/feeds/hubRestartTvShowcards":
            null,
        "udl://live/feeds/hubRestartTvShowcards":
            null,
        "udl://live/myStations":
            null,

        "udl://netflix/titles": null,

        "udl://subscriber/library":
            udlList[`subscriber/library/YouMightLikeByTaste`],
        "udl://subscriber/libraries":
            null,

        "udl://subscriber/similarprograms":
            null,

        "uidef://GuideFilterFeed":
            null,
        "udl://discovery/subscriptionPackage/items":
            null,
        "udl://discovery/subscriptionPackage/items/?pivots=true":
            null,
        "udl://dvrproxy/subscription-items":
            null,
        "udl://subscriber/feeds/live-trending-programs":
            null,
        "udl://search/view-all": null,
    },
    Custom: {
        "udl://discovery/categories/items":
            null,
        "udl://discovery/feeds": null,
        "udl://subscriber/libraries":
            null,
        "udl://discovery/libraryprograms/complete":
            null,
        "udl://discovery/promotionalcategories/items":
            null,
        "udl://discovery/subscriptionPackage/CategoryItems":
            null,
        "udl://discovery/subscriptionPackage/items":
            null,
        "udl://discovery/subscriptionPackage/items/?pivots=true":
            null,
        "udl://discovery/librariespivotcategories/items":
            null,
        "udl://discovery/libraryprograms/complete/?pivots=true":
            null,
    },
    Mixed: {
        "udl://discovery/feeds": null,
        "udl://discovery/promotionalcategories/items":
            null,

        "udl://discovery/categories/items":
            null,
        "udl://discovery/categories/items/?pivots=true":
            null,

        "udl://discovery/libraryprograms/complete":
            null,
        "udl://discovery/libraryprograms/complete/?pivots=true":
            null,

        "udl://discovery/libraryprograms/collections/packages":
            null,
        "udl://subscriber/libraries":
            null,

        "udl://discovery/subscriptionPackage/CategoryItems":
            null,
        "udl://discovery/subscriptionPackage/items":
            null,
        "udl://discovery/subscriptionPackage/items/?pivots=true":
            null,
        "udl://discovery/librariespivotcategories/items":
            null,
    },
};