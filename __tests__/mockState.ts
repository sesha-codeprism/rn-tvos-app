const mockState = {
    discovery: {
        hubs: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {
                "https://appgw-client-a.cip.mr.tv3cloud.com/S108/discovery//v3/hubs?storeId=HubsAndFeeds-Main&%24groups=4000000%2C4000001%2C4000002%2C4000003%2C4752&pivots=Language%7Cen&%24lang=en-US": {
                    data: [
                        {
                            Id: "72eae5f5-9f44-47bf-8285-71f7e43126ad",
                            Name: "{profile_name}",
                            Feeds: [
                                {
                                    Id: "4a519b05-705f-4b1c-a3a9-d669f1a0dc6d",
                                    Name: "Continue",
                                    Uri: "udl://subscriber/library/Continue",
                                    ShowcardAspectRatio: "Mixed",
                                },
                                {
                                    Id: "de795937-b094-441f-9013-3908071da3f7",
                                    Name: "Recording",
                                    Uri:
                                        "udl://dvrproxy/viewable-subscription-items/",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "dvr",
                                    NavigationTargetText: "View all {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "6d09497c-1dc6-45b7-ac9f-b132f4e7bedc",
                                    Name: "Downloads",
                                    Uri: "udl://downloads/downloadlist",
                                    ShowcardAspectRatio: "TwoByThree",
                                    NavigationTargetUri: "downloads",
                                    NavigationTargetText: "Download Manager",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "1104be16-1c35-4022-a2d2-062c18a031f4",
                                    Name: "Favorites",
                                    Uri: "udl://subscriber/library/Pins",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "favorites",
                                    NavigationTargetText: "View all {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "f1dde9cd-9746-4bc6-88b3-083f92aa0178",
                                    Name: "Purchases",
                                    Uri: "udl://subscriber/library/Library",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "libraries",
                                    NavigationTargetText: "View all {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "84d78f0a-16da-460b-9e30-068e9ee6d8a9",
                                    Name: "YouMightLike",
                                    Uri:
                                        "udl://subscriber/library/YouMightLike",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri:
                                        "browserecommendations",
                                    NavigationTargetText: "All recommendations",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "ddd2df46-e09b-4f9e-8cd3-14ca4ab3eee4",
                                    Name: "Your Shows",
                                    Uri: "udl://discovery/feeds/tvshows",
                                    ShowcardAspectRatio: "FourByThree",
                                    NavigationTargetUri: "browsetv",
                                    NavigationTargetText: "View All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "3450db00-d6f9-445e-846e-1116a88c155f",
                                    Name: "YourChannels",
                                    Uri: "udl://live/myStations/",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "liveTvGuide",
                                    NavigationTargetText: "View Guide",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "96b82d10-071f-4f10-a105-fb8a1381414c",
                                    Name: "Reminders",
                                    Uri: "udl://subscriber/library/Reminders",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "reminders",
                                    NavigationTargetText: "View All {0}",
                                    NavigationTargetVisibility: "ClientDefined",
                                    Layout: "Category",
                                },
                                {
                                    Id: "1653158d-6435-4258-856b-db7283bbef7c",
                                    Name: "Because You Watched",
                                    Uri:
                                        "udl://subscriber/library/YouMightLike",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri:
                                        "browsemixedrecommendations",
                                    NavigationTargetText: "{0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "c73b29b6-5fce-4eb7-b87b-0bc620d91ab4",
                                    Name: "Continue Watching",
                                    Uri: "udl://subscriber/library/Continue",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "libraries",
                                    NavigationTargetText: "View All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "7e98dede-4bb9-4f4c-bb42-3e64a0b26968",
                                    Name: "NewContents",
                                    Uri:
                                        "udl://discovery/feeds/7e98dede-4bb9-4f4c-bb42-3e64a0b26968",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "9548486e-a164-49a4-9eb8-92790b5900e0",
                                    Name: "RecommendationsNew",
                                    Uri:
                                        "udl://subscriber/library/YouMightLike",
                                    ShowcardAspectRatio: "TwoByThree",
                                    NavigationTargetUri:
                                        "browserecommendations",
                                    NavigationTargetText: "recommendations all",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                            ],
                        },
                        {
                            Id: "68d5b1e9-e5bf-4306-b15c-3ed6288bc2f2",
                            Name: "Live",
                            Feeds: [
                                {
                                    Id: "049ec112-150a-48ed-98df-b55a56606347",
                                    Name: "On Now",
                                    Uri: "udl://live/feeds/playableChannels/",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "liveTvGuide",
                                    NavigationTargetText: "View Guide",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "c93c7052-fead-4a18-bf9c-2623bd80bbec",
                                    Name: "PPV",
                                    Uri: "udl://discovery/feeds/payperview",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsepayperview",
                                    NavigationTargetText: "View all {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "8f16dd85-5e9e-4c46-9d23-2cf63d68a4c8",
                                    Name: "Recently Aired",
                                    Uri:
                                        "data://live/feeds/hubRestartTvShowcards",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "restartTv",
                                    NavigationTargetText: "View all {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "6676f305-17a2-4554-b296-2d425f1c8708",
                                    Name: "Trending",
                                    Uri: "udl://live/feeds/trending/",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsemovies",
                                    NavigationTargetText: "View All",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "034ba09d-c004-4af2-ba76-f18af6b33540",
                                    Name: "YouChannels",
                                    Uri: "udl://live/myStations/",
                                    ShowcardAspectRatio: "Mixed",
                                },
                                {
                                    Id: "5a196f03-827f-4b50-8f13-d3ba806f39f2",
                                    Name: "Live TV Promotion Test Feed",
                                    Uri:
                                        "udl://discovery/feeds/5a196f03-827f-4b50-8f13-d3ba806f39f2",
                                    ShowcardAspectRatio: "TwoByThree",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText:
                                        "All Live TV Promotions",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "6a39b52b-d28c-4cae-98d1-ff11ee4d89fa",
                                    Name: "Catchup Test",
                                    Uri:
                                        "udl://live/feeds/catchup/?$orderBy=Popularity",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "restartTv",
                                    NavigationTargetText: "View All",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "339391fd-61c6-493d-afb5-1b104102e222",
                                    Name: "BYW",
                                    Uri:
                                        "udl://subscriber/library/YouMightLike",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri:
                                        "browsemixedrecommendations",
                                    NavigationTargetText: "BYW",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                            ],
                        },
                        {
                            Id: "ce228cac-7030-4510-abc9-f208c22ad5e5",
                            Name: "On Demand",
                            Feeds: [
                                {
                                    Id: "890b29f1-413d-4644-9013-48347a581df9",
                                    Name: "Movies",
                                    Uri: "udl://discovery/feeds/movies",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsemovies",
                                    NavigationTargetText: "View All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "dd850266-0b12-4fe0-9701-57bb501a772b",
                                    Name: "TVShows",
                                    Uri: "udl://discovery/feeds/tvshows",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsetv",
                                    NavigationTargetText: "View all {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "9635c786-ec15-4660-a019-a956023e74ec",
                                    Name: "Collections",
                                    Uri: "udl://discovery/feeds/packages",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsepackages",
                                    NavigationTargetText: "View all {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "9dbde46a-73cc-4923-a473-4bb9d97e18d7",
                                    Name: "Networks",
                                    Uri:
                                        "udl://discovery/feeds/9dbde46a-73cc-4923-a473-4bb9d97e18d7",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText: "View all {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "9834be40-8f1f-4160-889a-9ead2d5f381e",
                                    Name: "CMS_Subs_Test",
                                    Uri:
                                        "udl://discovery/feeds/9834be40-8f1f-4160-889a-9ead2d5f381e",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText: "View all {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "2eaf4bbe-8ebd-4edd-8a03-543826a2763d",
                                    Name: "Subscriptions",
                                    Uri:
                                        "udl://discovery/feeds/2eaf4bbe-8ebd-4edd-8a03-543826a2763d",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "2e30c25c-42ea-4e78-9c66-4639deb4807c",
                                    Name: "Movies_CategoryLayout",
                                    Uri: "udl://discovery/feeds/movies",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsemovies",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "ad86c5d1-31a4-48f3-add0-335ab944e919",
                                    Name: "TVShows_CategoryLayout",
                                    Uri: "udl://discovery/feeds/tvshows",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsetv",
                                    NavigationTargetText: "All",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "3d1504e3-6624-4633-81c8-a26ebc7aa266",
                                    Name: "Featured",
                                    Uri:
                                        "udl://discovery/feeds/3d1504e3-6624-4633-81c8-a26ebc7aa266",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText: "View all {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "e4bbce4d-9e68-4929-b735-d7ef9dbef079",
                                    Name: "PromotionGallery(Dynamic Movies)",
                                    Uri: "udl://discovery/feeds/movies",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsemovies",
                                    NavigationTargetText: "View All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "c14cbe2f-1880-4a1f-b0ce-56b50a85b293",
                                    Name: "MoviesAndTVsGallery_Automation",
                                    Uri:
                                        "udl://discovery/feeds/moviesandtvshows",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsemoviesandtv",
                                    NavigationTargetText: "AllMoviesAndTVs",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "eab14f5c-3db2-4d0e-82bb-09e1380245bd",
                                    Name: "Kids",
                                    Uri:
                                        "udl://discovery/feeds/eab14f5c-3db2-4d0e-82bb-09e1380245bd",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText: "View all {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "7afcab7c-0ab1-4050-b174-d4cc3db3c305",
                                    Name: "Custom_Layer1_Gallery",
                                    Uri:
                                        "udl://discovery/feeds/7afcab7c-0ab1-4050-b174-d4cc3db3c305",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "ed4176de-a7de-4bfb-93f4-d2d08ec068fb",
                                    Name: "CustomTest",
                                    Uri:
                                        "udl://discovery/feeds/ed4176de-a7de-4bfb-93f4-d2d08ec068fb",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText: "All",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "bb540aa4-3e42-459e-917f-beb53146e263",
                                    Name: "NewMovies_BrowseNewMovies_Gallery",
                                    Uri:
                                        "udl://discovery/feeds/movies?LicenseWindow=New",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri:
                                        "browsemovies?LicenseWindow=New",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "733b744a-8668-425d-ae7a-af769dec7799",
                                    Name: "NewMovies_BrowseNewMovies_Category",
                                    Uri:
                                        "udl://discovery/feeds/movies?LicenseWindow=New",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri:
                                        "browsemovies?LicenseWindow=New",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "d2d3dd2b-2072-408c-9d51-0785c1be3d7a",
                                    Name:
                                        "NewMovies_BrowseNewMoviesCustom_Gallery",
                                    Uri:
                                        "udl://discovery/feeds/movies?LicenseWindow=New",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri:
                                        "browsemovies?LicenseWindow=New",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "29ac4a79-f86a-4864-84e2-6d66ab8497cd",
                                    Name:
                                        "NewMovies_BrowseNewMoviesCustom_Category",
                                    Uri:
                                        "udl://discovery/feeds/movies?LicenseWindow=New",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri:
                                        "browsemovies?LicenseWindow=New",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "1a512c43-94f4-4147-bbef-e47bfadc4385",
                                    Name: "NewTVs_BrowseNewTVs_Gallery",
                                    Uri:
                                        "udl://discovery/feeds/tvshows?LicenseWindow=New",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri:
                                        "browsetv?LicenseWindow=New",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "0a1eae61-275b-4524-8eae-88cfc51b9bf6",
                                    Name: "NewTVs_BrowseNewTVs_Category",
                                    Uri:
                                        "udl://discovery/feeds/tvshows?LicenseWindow=New",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri:
                                        "browsetv?LicenseWindow=New",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "a19938a4-6f8c-423b-9189-37edd2f3b4c0",
                                    Name: "NewTVs_BrowseNewTVsCustom_Gallery",
                                    Uri:
                                        "udl://discovery/feeds/tvshows?LicenseWindow=New",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri:
                                        "browsetv?LicenseWindow=New",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "8e7a1203-d91b-45e7-a2c9-fbcc68f4746c",
                                    Name: "NewTVs_BrowseNewTVsCustom_Category",
                                    Uri:
                                        "udl://discovery/feeds/tvshows?LicenseWindow=New",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri:
                                        "browsetv?LicenseWindow=New",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "c9c3f7bb-811e-4ebd-9876-0d160cd07528",
                                    Name: "NewM&T_BrowseNewM&T_Gallery",
                                    Uri:
                                        "udl://discovery/feeds/moviesandtvshows?LicenseWindow=New",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri:
                                        "browsemoviesandtv?LicenseWindow=New",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "69b8d168-370f-4bae-916e-2f90545d4937",
                                    Name: "NewM&T_BrowseNewM&T_Category",
                                    Uri:
                                        "udl://discovery/feeds/moviesandtvshows?LicenseWindow=New",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri:
                                        "browsemoviesandtv?LicenseWindow=New",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "56c66a4a-1319-46b1-b39f-deba0f22f6f0",
                                    Name: "NewM&T_BrowseNewM&TCustom_Gallery",
                                    Uri:
                                        "udl://discovery/feeds/moviesandtvshows?LicenseWindow=New",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri:
                                        "browsemoviesandtv?LicenseWindow=New",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "4ba24412-077f-43b0-93cb-ebf23f4e8266",
                                    Name: "NewM&T_BrowseNewM&TCustom_Category",
                                    Uri:
                                        "udl://discovery/feeds/moviesandtvshows?LicenseWindow=New",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri:
                                        "browsemoviesandtv?LicenseWindow=New",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "385aaa63-a476-40c1-bc95-f20a0b881f72",
                                    Name: "Mixed_Layer1_Gallery",
                                    Uri:
                                        "udl://discovery/feeds/385aaa63-a476-40c1-bc95-f20a0b881f72",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "00e20e95-b2f1-4d1f-b615-2df302caa84d",
                                    Name: "MixedTest",
                                    Uri:
                                        "udl://discovery/feeds/00e20e95-b2f1-4d1f-b615-2df302caa84d",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "57beda65-b63e-440d-99b3-c1bdcbd9455a",
                                    Name: "AllMoviesTest",
                                    Uri: "udl://discovery/feeds/movies",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsemovies",
                                    NavigationTargetText: "View All",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "4416e06e-61bc-4fbc-896f-cdec14563aba",
                                    Name: "MoviesAndTVsCategory_Automation",
                                    Uri:
                                        "udl://discovery/feeds/moviesandtvshows",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsemoviesandtv",
                                    NavigationTargetText: "AllMoviesAndTVs",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "377f3b6d-58b8-416c-86de-c6a4b70a04ab",
                                    Name: "shortcut test",
                                    Uri:
                                        "udl://discovery/feeds/377f3b6d-58b8-416c-86de-c6a4b70a04ab",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsepackages",
                                    NavigationTargetText: "View All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                            ],
                            IsOnDemand: true,
                        },
                        {
                            Id: "19c0f217-69b9-4ec2-a16e-b2afba905e10",
                            Name: "Apps",
                            Feeds: [
                                {
                                    Id: "fe7fddd1-4475-4676-ab32-5a09414d7f53",
                                    Name: "Netflix",
                                    Uri: "udl://netflix/titles",
                                    ShowcardAspectRatio: "Mixed",
                                },
                                {
                                    Id: "c8c75d28-6a07-4c9c-a7fc-8e9df088deab",
                                    Name: "YourApps",
                                    Uri: "udl://device/apps/General",
                                    ShowcardAspectRatio: "TwoByThree",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText: "View All",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "5f5ace32-da06-487c-a479-89866cd04b8a",
                                    Name: "Installed Apps",
                                    Uri: "udl://device/apps/allapps",
                                    ShowcardAspectRatio: "SixteenByNine",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText: "View all",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                    IsStacked: false,
                                },
                                {
                                    Id: "a852f5d9-26cb-4b81-abb7-afcb918b7815",
                                    Name: "Installed Games",
                                    Uri: "udl://device/apps/Game",
                                    ShowcardAspectRatio: "SixteenByNine",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText: "View All",
                                    NavigationTargetVisibility: "ClientDefined",
                                    Layout: "Gallery",
                                    IsStacked: false,
                                },
                                {
                                    Id: "9a001f72-0c02-48a0-b2a6-6de4ef183d69",
                                    Name: "Stores",
                                    Uri:
                                        "udl://discovery/feeds/9a001f72-0c02-48a0-b2a6-6de4ef183d69",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsemovies",
                                    NavigationTargetText: "View all {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "7ed21749-6524-4374-901d-bf04bf57c780",
                                    Name: "Apps Test",
                                    Uri: "udl://device/apps/allapps",
                                    ShowcardAspectRatio: "SixteenByNine",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText: "View More",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                    IsStacked: true,
                                },
                                {
                                    Id: "e0d9e652-a530-4350-b5d2-ede5bb5c1086",
                                    Name: "My Apps",
                                    Uri:
                                        "udl://discovery/feeds/e0d9e652-a530-4350-b5d2-ede5bb5c1086",
                                    ShowcardAspectRatio: "SixteenByNine",
                                    NavigationTargetUri: "browsepromotions",
                                    NavigationTargetText: "View All",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                    IsStacked: true,
                                },
                                {
                                    Id: "a1b9067b-5951-476b-8c44-86d49cf08446",
                                    Name: "GTV",
                                    Uri:
                                        "udl://discovery/feeds/a1b9067b-5951-476b-8c44-86d49cf08446",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsetv",
                                    NavigationTargetText: "View All",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                            ],
                            IsApplicationHub: true,
                        },
                        {
                            Id: "01ceef9f-1819-40d1-a3db-788164a52160",
                            Name: "Stacked Filmstrip Hub",
                            Feeds: [
                                {
                                    Id: "097e4ded-af2e-46bf-ab62-91db8e80f3d3",
                                    Name: "Dynamic",
                                    Uri: "udl://discovery/feeds/movies",
                                    ShowcardAspectRatio: "SixteenByNine",
                                    NavigationTargetUri: "browsemovies",
                                    NavigationTargetText: "View All",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                    IsStacked: true,
                                },
                                {
                                    Id: "ee3479ed-4f9a-43d2-bfaa-b23f80b6fcdc",
                                    Name: "FeedYourChannel",
                                    Uri: "udl://live/myStations/",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsemovies",
                                    NavigationTargetText: "View all {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                            ],
                        },
                        {
                            Id: "33e7a6bc-3646-4e58-aab6-07b9e7a55191",
                            Name: "Zones",
                            Feeds: [
                                {
                                    Id: "15ca0328-459c-4905-848f-095fbb7f9927",
                                    Name: "Stores",
                                    Uri:
                                        "udl://discovery/feeds/15ca0328-459c-4905-848f-095fbb7f9927",
                                    ShowcardAspectRatio: "Mixed",
                                },
                            ],
                        },
                        {
                            Id: "63d11a71-8bd2-452c-a6ee-4e909dbb7b90",
                            Name: "HubForBrowseCategory",
                            Feeds: [
                                {
                                    Id: "0a665278-61d5-4e30-9740-cb1a7ba4284a",
                                    Name: "Movies",
                                    Uri: "udl://discovery/feeds/movies",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsemovies",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "2e63348d-f849-4c35-8b6f-ae19805a01c0",
                                    Name: "Feed2x3",
                                    Uri: "udl://discovery/feeds/movies",
                                    ShowcardAspectRatio: "TwoByThree",
                                    NavigationTargetUri: "browsemovies",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                                {
                                    Id: "c3571787-815a-4e6c-ba74-0f7d123cebe2",
                                    Name: "Feed4x3",
                                    Uri: "udl://discovery/feeds/movies",
                                    ShowcardAspectRatio: "FourByThree",
                                    NavigationTargetUri: "browsemovies",
                                    NavigationTargetText: "View all {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Gallery",
                                },
                                {
                                    Id: "dbbbf5ca-b0a6-4971-a11f-edfd73533364",
                                    Name: "Feed16x9",
                                    Uri: "udl://discovery/feeds/movies",
                                    ShowcardAspectRatio: "SixteenByNine",
                                    NavigationTargetUri: "browsemovies",
                                    NavigationTargetText: "View all {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                    IsStacked: false,
                                },
                                {
                                    Id: "086e9b53-d0a3-45d7-a6a2-c95fb52efff5",
                                    Name: "TV Shows",
                                    Uri: "udl://discovery/feeds/tvshows",
                                    ShowcardAspectRatio: "Mixed",
                                    NavigationTargetUri: "browsetv",
                                    NavigationTargetText: "All {0}",
                                    NavigationTargetVisibility: "Always",
                                    Layout: "Category",
                                },
                            ],
                        },
                        {
                            Id: "53734506-03a4-4483-9795-1d6a6d0f1ee9",
                            Name: "RTP-HLS-SC",
                            Feeds: [
                                {
                                    Id: "b33a7820-b9d6-4ff9-b4f1-e4fce07fb531",
                                    Name: "RTP-HLS",
                                    Uri:
                                        "udl://discovery/feeds/b33a7820-b9d6-4ff9-b4f1-e4fce07fb531",
                                    ShowcardAspectRatio: "Mixed",
                                },
                            ],
                        },
                    ],
                    status: {
                        initialized: true,
                        isLoaded: true,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                        expiryTime: "Fri, 17 Jul 2020 05:23:09 GMT",
                    },
                },
            },
            references: {
                '["HubsAndFeeds-Main","4000000,4000001,4000002,4000003,4752",{"short":"en","full":"en-US"}]': {
                    linkedHTTPResourceURL:
                        "https://appgw-client-a.cip.mr.tv3cloud.com/S108/discovery//v3/hubs?storeId=HubsAndFeeds-Main&%24groups=4000000%2C4000001%2C4000002%2C4000003%2C4752&pivots=Language%7Cen&%24lang=en-US",
                    status: {
                        initialized: true,
                        isLoaded: false,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                    },
                },
            },
        },
        feed: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {
                "https://appgw-client-a.cip.mr.tv3cloud.com/S108/discovery//v4/feeds/ddd2df46-e09b-4f9e-8cd3-14ca4ab3eee4/items?%24top=16&storeId=HubsAndFeeds-Main&%24groups=4000000%2C4000001%2C4000002%2C4000003%2C4752&pivots=Language%7Cen&%24lang=en-US&%24skip=0": {
                    data: {
                        Uri: null,
                        Items: [
                            {
                                Id: "series_1847_Default1",
                                Name: "Game of Thrones",
                                ItemType: "Series",
                                ShowType: "TVShow",
                                Images: [],
                                Ratings: [{ System: "MPAA", Value: "TV-14" }],
                                IsAdult: false,
                            },
                            {
                                Id: "series_66_Default1",
                                Name: "GOT",
                                ItemType: "Series",
                                ShowType: "TVShow",
                                Images: [],
                                Ratings: [{ System: "MPAA", Value: "TV-14" }],
                                IsAdult: false,
                            },
                            {
                                Id: "fake_PKHD0000000000110025_ericsson.com",
                                Name: "10015_000828",
                                ItemType: "Program",
                                ShowType: "TVShow",
                                ReleaseYear: 2006,
                                Images: [],
                                Ratings: [{ System: "MPAA", Value: "TV-MA" }],
                                IsAdult: false,
                            },
                            {
                                Id: "667969ThirdParty32363933393336",
                                Name: "13 Reasons Why",
                                ItemType: "Series",
                                ShowType: "TVShow",
                                Images: [
                                    {
                                        Size: "Small",
                                        ImageType: "PosterLandscape",
                                        Uri:
                                            "https://appgw-client-A.cip.mr.tv3cloud.com/images/img2/series/667969thirdparty32363933393336/posterlandscapesmall.jpg",
                                    },
                                    {
                                        Size: "Medium",
                                        ImageType: "PosterLandscape",
                                        Uri:
                                            "https://appgw-client-A.cip.mr.tv3cloud.com/images/img2/series/667969thirdparty32363933393336/posterlandscapemedium.jpg",
                                    },
                                ],
                                SupportedImages: [
                                    "4x3/KeyArt",
                                    "4x3/Poster",
                                    "3x4/KeyArt",
                                    "3x4/Poster",
                                    "2x3/KeyArt",
                                    "2x3/Poster",
                                    "16x9/KeyArt",
                                    "16x9/Poster",
                                    "3x2/KeyArt",
                                    "3x2/Poster",
                                    "KeyArtLandscape",
                                    "PosterLandscape",
                                ],
                                ImageBucketId: "img2",
                                Ratings: [{ System: "MPAA", Value: "R" }],
                                IsAdult: false,
                            },
                            {
                                Id: "fake_CLAA9452326660215388_TTV.COM",
                                Name:
                                    "232-RT-15358SEN-EPS2 rêves Español Auto Ingest",
                                ItemType: "Program",
                                ShowType: "TVShow",
                                ReleaseYear: 1993,
                                Images: [],
                                SupportedImages: ["4x3/KeyArt", "4x3/Poster"],
                                ImageBucketId: "img1",
                                Ratings: [{ System: "MPAA", Value: "G" }],
                                IsAdult: false,
                            },
                            {
                                Id: "fake_CLAA9452366660115388_TTV.COM",
                                Name:
                                    "236-RT-15358SEN-EPS1 rêves Español Auto Ingest",
                                ItemType: "Program",
                                ShowType: "TVShow",
                                ReleaseYear: 1993,
                                Images: [],
                                SupportedImages: ["4x3/KeyArt", "4x3/Poster"],
                                ImageBucketId: "img1",
                                Ratings: [{ System: "MPAA", Value: "G" }],
                                IsAdult: false,
                            },
                            {
                                Id: "fake_CLAA9452366660215388_TTV.COM",
                                Name:
                                    "236-RT-15358SEN-EPS2 rêves Español Auto Ingest",
                                ItemType: "Program",
                                ShowType: "TVShow",
                                ReleaseYear: 1993,
                                Images: [],
                                SupportedImages: ["4x3/KeyArt", "4x3/Poster"],
                                ImageBucketId: "img2",
                                Ratings: [{ System: "MPAA", Value: "G" }],
                                IsAdult: false,
                            },
                            {
                                Id: "fake_CLAA9452366660315388_TTV.COM",
                                Name:
                                    "236-RT-15358SEN-EPS3 rêves Español Auto Ingest",
                                ItemType: "Program",
                                ShowType: "TVShow",
                                ReleaseYear: 1993,
                                Images: [],
                                SupportedImages: ["4x3/KeyArt", "4x3/Poster"],
                                ImageBucketId: "img2",
                                Ratings: [{ System: "MPAA", Value: "G" }],
                                IsAdult: false,
                            },
                            {
                                Id: "fake_CLAA9452416660115388_TTV.COM",
                                Name:
                                    "241-RT-15358SEN-EPS1 rêves Español Auto Ingest",
                                ItemType: "Program",
                                ShowType: "TVShow",
                                ReleaseYear: 1993,
                                Images: [],
                                SupportedImages: ["4x3/KeyArt", "4x3/Poster"],
                                ImageBucketId: "img2",
                                Ratings: [{ System: "MPAA", Value: "G" }],
                                IsAdult: false,
                            },
                            {
                                Id: "fake_CLAA9452416660215388_TTV.COM",
                                Name:
                                    "241-RT-15358SEN-EPS2 rêves Español Auto Ingest",
                                ItemType: "Program",
                                ShowType: "TVShow",
                                ReleaseYear: 1993,
                                Images: [],
                                SupportedImages: ["4x3/KeyArt", "4x3/Poster"],
                                ImageBucketId: "img2",
                                Ratings: [{ System: "MPAA", Value: "G" }],
                                IsAdult: false,
                            },
                            {
                                Id: "fake_814_TestData",
                                Name: "30 Days of Night",
                                ItemType: "Program",
                                ShowType: "TVShow",
                                OriginalAirDate: "2019-01-01T00:00:00Z",
                                ReleaseYear: 2019,
                                Images: [],
                                SupportedImages: ["16x9/Poster"],
                                ImageBucketId: "img2",
                                Ratings: [{ System: "USTV", Value: "TV-14" }],
                                IsAdult: false,
                            },
                            {
                                Id: "fake_CLAA9454826660115388_TTV.COM",
                                Name:
                                    "482-RT-15358SEN-EPS1 rêves Español Auto Ingest",
                                ItemType: "Program",
                                ShowType: "TVShow",
                                ReleaseYear: 1993,
                                Images: [],
                                SupportedImages: ["4x3/KeyArt", "4x3/Poster"],
                                ImageBucketId: "img1",
                                Ratings: [{ System: "MPAA", Value: "G" }],
                                IsAdult: false,
                            },
                            {
                                Id: "fake_CLAA9454826660215388_TTV.COM",
                                Name:
                                    "482-RT-15358SEN-EPS2 rêves Español Auto Ingest",
                                ItemType: "Program",
                                ShowType: "TVShow",
                                ReleaseYear: 1993,
                                Images: [],
                                SupportedImages: ["4x3/KeyArt", "4x3/Poster"],
                                ImageBucketId: "img2",
                                Ratings: [{ System: "MPAA", Value: "G" }],
                                IsAdult: false,
                            },
                            {
                                Id: "fake_CLAA9456166660115388_TTV.COM",
                                Name:
                                    "616-RT-15358SEN-EPS1 rêves Español Auto Ingest",
                                ItemType: "Program",
                                ShowType: "TVShow",
                                ReleaseYear: 1993,
                                Images: [],
                                SupportedImages: ["4x3/KeyArt", "4x3/Poster"],
                                ImageBucketId: "img2",
                                Ratings: [{ System: "MPAA", Value: "G" }],
                                IsAdult: false,
                            },
                            {
                                Id: "fake_CLAA9456166660215388_TTV.COM",
                                Name:
                                    "616-RT-15358SEN-EPS2 rêves Español Auto Ingest",
                                ItemType: "Program",
                                ShowType: "TVShow",
                                ReleaseYear: 1993,
                                Images: [],
                                SupportedImages: ["4x3/KeyArt", "4x3/Poster"],
                                ImageBucketId: "img2",
                                Ratings: [{ System: "MPAA", Value: "G" }],
                                IsAdult: false,
                            },
                            {
                                Id: "fake_CLAA9456166660315388_TTV.COM",
                                Name:
                                    "616-RT-15358SEN-EPS3 rêves Español Auto Ingest",
                                ItemType: "Program",
                                ShowType: "TVShow",
                                ReleaseYear: 1993,
                                Images: [],
                                SupportedImages: ["4x3/KeyArt", "4x3/Poster"],
                                ImageBucketId: "img2",
                                Ratings: [{ System: "MPAA", Value: "G" }],
                                IsAdult: false,
                            },
                        ],
                    },
                    status: {
                        initialized: true,
                        isLoaded: true,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                        expiryTime: "Fri, 17 Jul 2020 05:23:10 GMT",
                    },
                },
                "https://appgw-client-a.cip.mr.tv3cloud.com/S108/discovery//v4/feeds/7e98dede-4bb9-4f4c-bb42-3e64a0b26968/items?%24top=16&storeId=HubsAndFeeds-Main&%24groups=4000000%2C4000001%2C4000002%2C4000003%2C4752&pivots=Language%7Cen&%24lang=en-US&%24skip=0": {
                    data: { Uri: null, Items: [] },
                    status: {
                        initialized: true,
                        isLoaded: true,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                        expiryTime: "Fri, 17 Jul 2020 05:23:10 GMT",
                    },
                },
            },
            references: {
                '[{"id":"ddd2df46-e09b-4f9e-8cd3-14ca4ab3eee4","$top":16,"$skip":0}]': {
                    linkedHTTPResourceURL:
                        "https://appgw-client-a.cip.mr.tv3cloud.com/S108/discovery//v4/feeds/ddd2df46-e09b-4f9e-8cd3-14ca4ab3eee4/items?%24top=16&storeId=HubsAndFeeds-Main&%24groups=4000000%2C4000001%2C4000002%2C4000003%2C4752&pivots=Language%7Cen&%24lang=en-US&%24skip=0",
                    status: {
                        initialized: true,
                        isLoaded: false,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                    },
                },
                '[{"id":"7e98dede-4bb9-4f4c-bb42-3e64a0b26968","$top":16,"$skip":0}]': {
                    linkedHTTPResourceURL:
                        "https://appgw-client-a.cip.mr.tv3cloud.com/S108/discovery//v4/feeds/7e98dede-4bb9-4f4c-bb42-3e64a0b26968/items?%24top=16&storeId=HubsAndFeeds-Main&%24groups=4000000%2C4000001%2C4000002%2C4000003%2C4752&pivots=Language%7Cen&%24lang=en-US&%24skip=0",
                    status: {
                        initialized: true,
                        isLoaded: false,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                    },
                },
            },
        },
        pivotCategories: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {
                "https://appgw-client-a.pprod.mr.tv3cloud.com/S120/discovery//v3/libraries/complete/pivot-items?pivotGroup=Genre&pivots=ShowType%7CMovie%2CLanguage%7Cundefined&%24itemsPerRow=16&%24top=12&%24skip=0&client=reach&%24groups=1%2C2%2C11%2C13%2C4005093%2C4005094%2C4005095%2C4012526%2C4016828%2C4023324%2C4023325%2C4023326%2C4023492%2C4023500%2C4029018%2C2121342&%24lang=en-US&storeId=HubsAndFeeds-Main": {
                    data: [
                        {
                            Id: "2001",
                            Name: "Action",
                            Items: [
                                {
                                    Id: "393234383635372D656E-546D73",
                                    Name: "Gravity",
                                    ItemType: "Program",
                                    ShowType: "Movie",
                                    ReleaseYear: 2013,
                                    Images: [
                                        {
                                            Size: "Small",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-A.pprod.mr.tv3cloud.com/images/images/program/393234383635372d656e-546d73/posterlandscapesmall.jpg",
                                        },
                                        {
                                            Size: "Medium",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-A.pprod.mr.tv3cloud.com/images/images/program/393234383635372d656e-546d73/posterlandscapemedium.jpg",
                                        },
                                    ],
                                    SupportedImages: [
                                        "4x3/KeyArt",
                                        "3x4/KeyArt",
                                        "3x4/Poster",
                                        "2x3/KeyArt",
                                        "2x3/Poster",
                                        "16x9/KeyArt",
                                        "KeyArtLandscape",
                                        "PosterLandscape",
                                    ],
                                    ImageBucketId: "images",
                                    Ratings: [
                                        {
                                            System: "MPAA",
                                            Value: "PG-13",
                                        },
                                    ],
                                    IsLive: true,
                                    ContentRatings: [
                                        {
                                            ProviderId: "RottenTomatoes",
                                            ProgramId:
                                                "393234383635372D656E-546D73",
                                            RatingValues: [
                                                {
                                                    RatingScheme:
                                                        "Critics_Score",
                                                    Score: "96",
                                                    Image:
                                                        "https://appgw-client-a.pprod.mr.tv3cloud.com/images/images/ContentRating/CertifiedFreshTomato.png",
                                                },
                                                {
                                                    RatingScheme:
                                                        "Audience_Score",
                                                    Score: "80",
                                                    Image:
                                                        "https://appgw-client-a.pprod.mr.tv3cloud.com/images/images/ContentRating/FreshPopcorn.png",
                                                },
                                            ],
                                        },
                                    ],
                                    IsAdult: false,
                                    IsGeneric: false,
                                },
                                {
                                    Id: "333537353534362D656E-546D73",
                                    Name: "Kung Fu Panda 2",
                                    ItemType: "Program",
                                    ShowType: "Movie",
                                    ReleaseYear: 2011,
                                    Images: [
                                        {
                                            Size: "Small",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-A.pprod.mr.tv3cloud.com/images/images/program/333537353534362d656e-546d73/posterlandscapesmall.jpg",
                                        },
                                        {
                                            Size: "Medium",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-A.pprod.mr.tv3cloud.com/images/images/program/333537353534362d656e-546d73/posterlandscapemedium.jpg",
                                        },
                                    ],
                                    SupportedImages: [
                                        "4x3/KeyArt",
                                        "3x4/KeyArt",
                                        "3x4/Poster",
                                        "2x3/KeyArt",
                                        "2x3/Poster",
                                        "16x9/KeyArt",
                                        "3x2/KeyArt",
                                        "KeyArtLandscape",
                                        "PosterLandscape",
                                    ],
                                    ImageBucketId: "images",
                                    Ratings: [
                                        {
                                            System: "MPAA",
                                            Value: "PG",
                                        },
                                    ],
                                    IsLive: true,
                                    ContentRatings: [
                                        {
                                            ProviderId: "RottenTomatoes",
                                            ProgramId:
                                                "333537353534362D656E-546D73",
                                            RatingValues: [
                                                {
                                                    RatingScheme:
                                                        "Critics_Score",
                                                    Score: "81",
                                                    Image:
                                                        "https://appgw-client-a.pprod.mr.tv3cloud.com/images/images/ContentRating/CertifiedFreshTomato.png",
                                                },
                                                {
                                                    RatingScheme:
                                                        "Audience_Score",
                                                    Score: "74",
                                                    Image:
                                                        "https://appgw-client-a.pprod.mr.tv3cloud.com/images/images/ContentRating/FreshPopcorn.png",
                                                },
                                            ],
                                        },
                                    ],
                                    IsAdult: false,
                                    IsGeneric: false,
                                },
                            ],
                            HasMore: true,
                        },
                        {
                            Id: "2681",
                            Name: "Comedy",
                            Items: [
                                {
                                    Id: "333537353534362D656E-546D73",
                                    Name: "Kung Fu Panda 2",
                                    ItemType: "Program",
                                    ShowType: "Movie",
                                    ReleaseYear: 2011,
                                    Images: [
                                        {
                                            Size: "Small",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-A.pprod.mr.tv3cloud.com/images/images/program/333537353534362d656e-546d73/posterlandscapesmall.jpg",
                                        },
                                        {
                                            Size: "Medium",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-A.pprod.mr.tv3cloud.com/images/images/program/333537353534362d656e-546d73/posterlandscapemedium.jpg",
                                        },
                                    ],
                                    SupportedImages: [
                                        "4x3/KeyArt",
                                        "3x4/KeyArt",
                                        "3x4/Poster",
                                        "2x3/KeyArt",
                                        "2x3/Poster",
                                        "16x9/KeyArt",
                                        "3x2/KeyArt",
                                        "KeyArtLandscape",
                                        "PosterLandscape",
                                    ],
                                    ImageBucketId: "images",
                                    Ratings: [
                                        {
                                            System: "MPAA",
                                            Value: "PG",
                                        },
                                    ],
                                    IsLive: true,
                                    ContentRatings: [
                                        {
                                            ProviderId: "RottenTomatoes",
                                            ProgramId:
                                                "333537353534362D656E-546D73",
                                            RatingValues: [
                                                {
                                                    RatingScheme:
                                                        "Critics_Score",
                                                    Score: "81",
                                                    Image:
                                                        "https://appgw-client-a.pprod.mr.tv3cloud.com/images/images/ContentRating/CertifiedFreshTomato.png",
                                                },
                                                {
                                                    RatingScheme:
                                                        "Audience_Score",
                                                    Score: "74",
                                                    Image:
                                                        "https://appgw-client-a.pprod.mr.tv3cloud.com/images/images/ContentRating/FreshPopcorn.png",
                                                },
                                            ],
                                        },
                                    ],
                                    IsAdult: false,
                                    IsGeneric: false,
                                },
                            ],
                            HasMore: true,
                        },
                        {
                            Id: "2715",
                            Name: "Drama",
                            Items: [],
                            HasMore: true,
                        },
                    ],
                },
                status: {
                    expiryTime: "Fri, 09 Oct 2020 07:37:27 GMT",
                    isLoaded: true,
                    isLoading: false,
                },
            },
            references: {
                '[{"pivotGroup":"Genre","$top":12,"$skip":0,"$itemsPerRow":16,"pivots":"ShowType|Movie,Language|","client":"reach"}]': {
                    linkedHTTPResourceURL:
                        "https://appgw-client-a.pprod.mr.tv3cloud.com/S120/discovery//v3/libraries/complete/pivot-items?pivotGroup=Genre&pivots=ShowType%7CMovie%2CLanguage%7Cundefined&%24itemsPerRow=16&%24top=12&%24skip=0&client=reach&%24groups=1%2C2%2C11%2C13%2C4005093%2C4005094%2C4005095%2C4012526%2C4016828%2C4023324%2C4023325%2C4023326%2C4023492%2C4023500%2C4029018%2C2121342&%24lang=en-US&storeId=HubsAndFeeds-Main",
                    status: {
                        initialized: true,
                        isLoaded: false,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                    },
                },
            },
        },
        program: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        promotionalCategories: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        categoryItems: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {
                "https://appgw-client-a.pprod.mr.tv3cloud.com/S120/discovery//v4/categories/55a9e645-7923-40b5-af3e-3117ea8bf982/items?%24top=100&storeId=HubsAndFeeds-Main&%24groups=1%2C5%2C9%2C11%2C12%2C13%2C14%2C4012526%2C4023324%2C4023325%2C4023326%2C4023492%2C4023498%2C4023500%2C4025815%2C4029510%2C4029584%2C4029609%2C4029795%2C4029860%2C4029874%2C4029875%2C4029876%2C2121342&%24lang=en-US&%24skip=0": {
                    data: [
                        {
                            Description: "",
                            HasSubcategories: false,
                            Id: "96bc5e5b-5f46-4f7e-b49e-e34e23207735",
                            Images: [],
                            IsAdult: false,
                            ItemCount: 5,
                            ItemType: "SvodPackage",
                            Name: "AVE_Subscription_Package"
                        },
                        {
                            Description: "Test subscription",
                            HasSubcategories: false,
                            Id: "ebec218d-9256-4cd5-ab96-1b89ef744d43",
                            Images: [],
                            IsAdult: false,
                            ItemCount: 3,
                            ItemType: "SvodPackage",
                            Name: "test-subscription-new",
                            Network: { Name: "dafault_tenant&+", DisplayName: [], Id: "1295af93-9fa9-4fbd-aed1-c62d96a65a1e", IsAdult: false },
                            NetworkId: "1295af93-9fa9-4fbd-aed1-c62d96a65a1e"
                        }
                    ],
                    status: {
                        expiryTime: "Tue, 20 Oct 2020 07:22:31 GMT",
                        initialized: true,
                        isFailed: false,
                        isLoaded: true,
                        isLoading: false,
                        refCounter: 1,
                        stale: false
                    }
                }
            },
            references: {
                '[{"id":"55a9e645-7923-40b5-af3e-3117ea8bf982","$top":100,"$skip":0}]': {
                    linkedHTTPResourceURL: "https://appgw-client-a.pprod.mr.tv3cloud.com/S120/discovery//v4/categories/55a9e645-7923-40b5-af3e-3117ea8bf982/items?%24top=100&storeId=HubsAndFeeds-Main&%24groups=1%2C5%2C9%2C11%2C12%2C13%2C14%2C4012526%2C4023324%2C4023325%2C4023326%2C4023492%2C4023498%2C4023500%2C4025815%2C4029510%2C4029584%2C4029609%2C4029795%2C4029860%2C4029874%2C4029875%2C4029876%2C2121342&%24lang=en-US&%24skip=0",
                    status: {
                        expiryTime: "Tue, 20 Oct 2020 07:22:31 GMT",
                        initialized: true,
                        isFailed: false,
                        isLoaded: true,
                        isLoading: false,
                        refCounter: 1,
                        stale: false
                    }
                }
            }
        },
        series: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        stores: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        categoriesSubcategories: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        subCategoryItems: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        collectionItems: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        libraryItems: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {
                "https://appgw-client-a.pprod.mr.tv3cloud.com/S120/discovery//v3/libraries/complete/items?pivots=ShowType%7CMovie&%24top=100&%24orderBy=Popularity&%24skip=0&storeId=HubsAndFeeds-Main&%24groups=1%2C5%2C9%2C11%2C12%2C13%2C14%2C4012526%2C4023324%2C4023325%2C4023326%2C4023492%2C4023498%2C4023500%2C4025815%2C4029510%2C4029584%2C4029609%2C4029795%2C4029860%2C4029874%2C4029875%2C4029876%2C2121342&%24lang=en-US": {
                    data: [
                        {
                            Id: "fake_567902_Default1",
                            Images: [],
                            IsAdult: false,
                            ItemType: "Program",
                            Name: "MF Asset - AD,CC,HD",
                            Ratings: [
                                { System: "MPAA", Value: "R" }],
                            length: 1,
                            __proto__: Array(0),
                            ReleaseYear: 2013,
                            ShowType: "Movie"
                        },
                        {
                            ContentRatings: [{
                                ProviderId: "RottenTomatoes",
                                ProgramId: "31303638383438382D656E-546D73",
                                RatingValues: [
                                    { RatingScheme: "Critics_Score", Score: "12", Image: "https://appgw-client-a.pprod.mr.tv3cloud.com/images/images/ContentRating/RottenTomato.png" },
                                    { RatingScheme: "Audience_Score", Score: "30", Image: "https://appgw-client-a.pprod.mr.tv3cloud.com/images/images/ContentRating/SpilledPopcorn.png" }
                                ]
                            }],
                            Id: "31303638383438382D656E-546D73",
                            ImageBucketId: "images",
                            Images: [
                                { Size: "Small", ImageType: "PosterLandscape", Uri: "https://appgw-client-A.pprod.mr.tv3cloud.com/image…638383438382d656e-546d73/posterlandscapesmall.jpg" },
                                { Size: "Medium", ImageType: "PosterLandscape", Uri: "https://appgw-client-A.pprod.mr.tv3cloud.com/image…38383438382d656e-546d73/posterlandscapemedium.jpg" }
                            ],
                            IsAdult: false,
                            IsGeneric: false,
                            IsLive: true,
                            ItemType: "Program",
                            Name: "Mortdecai",
                            Ratings: [{ System: "MPAA", Value: "R" }],
                            ReleaseYear: 2015,
                            ShowType: "Movie",
                            SupportedImages: ["4x3/KeyArt", "3x4/KeyArt", "3x4/Poster", "2x3/KeyArt", "2x3/Poster", "16x9/KeyArt", "3x2/KeyArt", "KeyArtLandscape", "PosterLandscape"]
                        },
                        {
                            ContentRatings: [{
                                ProviderId: "RottenTomatoes",
                                ProgramId: "31303638383438382D656E-546D73",
                                RatingValues: [
                                    { RatingScheme: "Critics_Score", Score: "12", Image: "https://appgw-client-a.pprod.mr.tv3cloud.com/images/images/ContentRating/RottenTomato.png" }
                                ]
                            }],
                            Id: "31303638383438382D656E-546D73",
                            ImageBucketId: "images",
                            Images: [
                                { Size: "Small", ImageType: "PosterLandscape", Uri: "https://appgw-client-A.pprod.mr.tv3cloud.com/image…638383438382d656e-546d73/posterlandscapesmall.jpg" },
                                { Size: "Medium", ImageType: "PosterLandscape", Uri: "https://appgw-client-A.pprod.mr.tv3cloud.com/image…38383438382d656e-546d73/posterlandscapemedium.jpg" }
                            ],
                            IsAdult: false,
                            IsGeneric: false,
                            IsLive: true,
                            ItemType: "Program",
                            Name: "Mortdecai",
                            Ratings: [{ System: "MPAA", Value: "R" }],
                            ReleaseYear: 2015,
                            ShowType: "Movie",
                            SupportedImages: ["4x3/KeyArt", "3x4/KeyArt", "3x4/Poster", "2x3/KeyArt", "2x3/Poster", "16x9/KeyArt", "3x2/KeyArt", "KeyArtLandscape", "PosterLandscape"]
                        }
                    ]
                }, status: {
                    initialized: true,
                    isLoaded: true,
                    isLoading: false,
                    isFailed: false,
                    refCounter: 1,
                    stale: false
                }
            },
            references: {
                '[{"pivots":"ShowType|Movie","$top":100,"$orderBy":"Popularity","$skip":0}]': {
                    linkedHTTPResourceURL: "https://appgw-client-a.pprod.mr.tv3cloud.com/S120/discovery//v3/libraries/complete/items?pivots=ShowType%7CMovie&%24top=100&%24orderBy=Popularity&%24skip=0&storeId=HubsAndFeeds-Main&%24groups=1%2C5%2C9%2C11%2C12%2C13%2C14%2C4012526%2C4023324%2C4023325%2C4023326%2C4023492%2C4023498%2C4023500%2C4025815%2C4029510%2C4029584%2C4029609%2C4029795%2C4029860%2C4029874%2C4029875%2C4029876%2C2121342&%24lang=en-US",
                    status: {
                        initialized: true,
                        isFailed: false,
                        isLoaded: false,
                        isLoading: false,
                        refCounter: 1,
                        stale: false
                    }
                }
            }
        },
        libraryPivots: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {
                "https://appgw-client-a.cip.mr.tv3cloud.com/S108/discovery//v3/libraries/complete/pivots?ShowType=Movie&%24groups=4000000%2C4000001%2C4000002%2C4000003%2C4752&%24lang=en-US&storeId=HubsAndFeeds-Main": {
                    data: [
                        {
                            "Id": "Genre",
                            "Name": "Genre",
                            "Pivots": [
                                {
                                    "Id": "Genre|2001",
                                    "Name": "Action"
                                },
                                {
                                    "Id": "Genre|20150",
                                    "Name": "Biography"
                                },
                                {
                                    "Id": "Genre|2822",
                                    "Name": "Mystery"
                                }
                            ]
                        },
                        {
                            "Id": "ShowType",
                            "Name": "ShowType",
                            "Pivots": [
                                {
                                    "Id": "ShowType|Movie",
                                    "Name": "Movie"
                                }
                            ]
                        },
                    ]
                }
            },
            references: {
                '[{"ShowType":"Movie"}]': {
                    linkedHTTPResourceURL: "https://appgw-client-a.cip.mr.tv3cloud.com/S108/discovery//v3/libraries/complete/pivots?ShowType=Movie&%24groups=4000000%2C4000001%2C4000002%2C4000003%2C4752&%24lang=en-US&storeId=HubsAndFeeds-Main",
                    status: {
                        initialized: true,
                        isLoaded: false,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1
                    }
                }
            }
        }
    },
    udl: {
        config: {
            authenticationType: "native",
            authToken:
                "AuthToken1lZBNb5wwEIZ_DdxYGQPGHDiQ7KeStFWyXalHYw-7VgxG_tiE_vqaTZNGVfdQyR6PnnnHo3kbLyQMHOqTc6ONsibC63AMqEkOx5EZNy24HBe9WbhzxpX2YsF1HyTxzloP5q9G6-w1_Sz8o-Mn6JldvPbKajYutDkG-mJDwAgV4bkEKWBw0k0h5YrJfq4PrIeaIJZSVtGEVSVLspSRJA8sucCZBRQv4Sw57MT_qPfTCHUzjgr2h0_ogD_gHgY2uPCrgI555eJHYKqvlTyDFHHDufaXMnB2cmyIcqS9U1o_z0aELy9N3y2Yq5o1MOcNbIz2YxAFQxDK0L8N7CU32urO_bb53UI6W0iuWGi0gtr61nIjWzDxxoQ59m0QRhG-ST_dcn7jRin9AuJ9efuxfePdSRv5kzmphwdmn-uMIlwVKU1TnBGMC5rmpCCY0BSVVUbi1esoDdivQ50WVVGQktIivjVhaRBvMK9IhgK8g2njpairlrOsa6uE8a5KckrapCq6Lmk5Ejxty7wt0nj70Nw-bRtckDrC3fqw257bkGxvvJ7K8jjCuMT3qx-rxj2CWt5_y_D-i9jd7SmNMvEL",
            refreshToken:
                "AuthToken1dZDbTsMwDEC_pn1r1WtYHvpQbTAG4iKYJuDNddwtIk2qJh3r35NOCBASUuREx8ex5XoUkjRSdXCut0FeB9mVPwOpSep9D4ObYpR93A2xO-aozChiNJ1Xwo21Iw1_Cq2z__mz-OPhgTqw8alT1kAfm2Hv6Yf1IUuS0l_nIAVpJ93kn6hAdnNeQ0cVIRwc6KBIzOiUMe9zl_Dy1MuB7IOuUpaxgvNkUYbLgcCRmGHJC87yGdaIZtRuI_75aUVHieTTLIF0AXwRAb-AKE-BRYVn0RnOzKMvezv1VNV9r2i7-4V22TfckoZzU0EtjMqFTwSqq5Q8khThs9zrjd6ad9Ln3f4Z-Zam9ShFxRuEvG14BNjyqFiwJuJl20YNJgLT5qJoyjS8vquXz9d1VrIK719eb55OafF4x2w2rF_X922QNZertxU71ZjSxibJzpP9hMt1EeTiEw",
            deviceId: "Desktop",
            protocol: "https",
            hostname: "reachclient.cip.mr.tv3cloud.com",
            currentLocale: { full: "en-US", short: "en" },
            deviceInfo: {
                deviceType: "Desktop",
                os: "OSX",
                netInfo: "f0:18:98:97:c1:fd",
            },
            oauth: "LIVEID",
            tenant: "default",
            id: "applicationConfig",
            name: "Application Configuration",
            deviceType: "Ios",
        },
    },
    bootstrap: {
        bootstrap: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {
                "https://ottapp-appgw-client-A.cip.mr.tv3cloud.com/Blue/sts/bootstrap": {
                    data: {
                        AccountId: "ecahtan@outlook.com",
                        DefaultProfileId:
                            "49781542-e6f6-4943-8669-e5a92d193aa3",
                        ProfileIds: ["49781542-e6f6-4943-8669-e5a92d193aa3"],
                        OriginalAccountId: "ecahtan@outlook.com",
                        DeviceId: "60a18a98-a97a-31a6-460a-18a98a97a31a",
                        RoutingGroupId: null,
                        ReleaseSlot: "108",
                        ServiceMap: {
                            Id: "default",
                            Services: {
                                buildmakerweb:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/S108/buildmakerweb/",
                                catchupPlaybackInfo:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/S108/dvrproxy/",
                                channelMapSlabs:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/catalogcache/s108-cache-channel-maps/",
                                client:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/htmlapp/20200708-9d4d635-3-s108-mr-int/Reach.html",
                                clientTraceLog:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/analyticskafkacollection/",
                                collection:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/analyticskafkacollection/",
                                collectionReach:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/analyticscollection/",
                                collectionstb:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/analyticskafkacollection/",
                                defaultAccHostName:
                                    "https://appgw-amp-a.cip.mr.tv3cloud.com/",
                                discovery:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/S108/discovery",
                                discoverySSL:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/S108/discovery/",
                                duplex:
                                    "wss://appgw-client-a.cip.mr.tv3cloud.com/S108/duplex/",
                                duplexLongPoll:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/S108/duplex/longpoll/events",
                                dvr:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/S108/dvrproxy/",
                                dvrnotification:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/",
                                image:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images",
                                kafkaCollection:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/analyticskafkacollection/",
                                license:
                                    "https://appgw-license-a.cip.mr.tv3cloud.com/S108/license/",
                                napaSlabs:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/catalogcache/s108-",
                                PrerollAudio:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/htmlapp/preroll/",
                                scheduleCache:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/catalogcache/s108-",
                                search:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/S108/search/",
                                searchSSL:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/S108/search/",
                                sts:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/S108/sts/",
                                subscriber:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/S108/subscriber/",
                                subscriberbkmark:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/S108/subscriberbkmark/",
                                ucGMSLog:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/analyticskafkacollection/",
                                uclicense:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/S108/uclicense",
                                upgradeNapa:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/catalogcache/upgrade/",
                                vodstorefront:
                                    "https://appgw-client-a.cip.mr.tv3cloud.com/tv3vod/s108pfclient-3027-3-appgw-client-a",
                            },
                            Prefixes: {
                                "10ft": "ottapp-",
                                "10ft-android-stb": "ottstb-",
                                "1ft": "ottapp-",
                                "2ft": "ottapp-",
                                "certloginclient-10ft-stb": "",
                            },
                            ClientProperties: {
                                CdnClientLottPlayback: {
                                    "1ft": "",
                                    "10ft": "",
                                    "2ft": "",
                                    "10ft-android-stb": "",
                                    "certloginclient-10ft-stb": "",
                                },
                                CdnClientVodPlayback: {
                                    "1ft": "",
                                    "10ft": "",
                                    "2ft": "",
                                    "10ft-android-stb": "",
                                    "certloginclient-10ft-stb": "",
                                },
                                ClientConnectionPrefixes: {
                                    "1ft": "ottapp-",
                                    "10ft": "ottapp-",
                                    "2ft": "ottapp-",
                                    "10ft-android-stb": "ottstb-",
                                    "certloginclient-10ft-stb": "",
                                },
                            },
                            ReleaseSlot: "108",
                        },
                        ChannelMapId: 4752,
                        ChannelMapGroupName: "AVE-UniversalMap_MapGroup",
                        SubscriberGroupIds: "4000000,4000001,4000002,4000003",
                        RightsGroupIds: "4000000,4000001,4000002,4000003,4752",
                        NotificationGroupIds:
                            "2000020,2000021,2000022,2000023,2000030,2000031",
                        UserId: "ecahtan@outlook.com",
                        DefaultUserId: "ecahtan@outlook.com",
                        TenantId: "default",
                        DvrEnabled: false,
                        Features: [
                            "1FTHubsFeeds",
                            "AudioChannel",
                            "AutoFavorite",
                            "DeviceManagement",
                            "DownloadAndGo",
                            "MessagingApp",
                            "MultiplePIN",
                            "ProgramReminders",
                            "ShowKeyBoard",
                            "ViewConcurrentUsers",
                            "adultstoreenabled",
                            "autoplay",
                            "bingeBar",
                            "browseBar",
                            "catchup",
                            "catchupByPopularity",
                            "catchupEnvironment",
                            "catchupTermsAcceptanceRequired",
                            "codeDeviceLinking",
                            "comphost",
                            "comphosttest",
                            "dev_settings",
                            "dvr",
                            "enableContentAdvisory",
                            "enableHTML5Playback",
                            "enableManualRecording",
                            "gridguide",
                            "guideExpandedRow",
                            "identity",
                            "lastWatched",
                            "livetimeshift",
                            "nDvr_ongoing_playback",
                            "newDvrManager",
                            "pinunpinnotification",
                            "playonButtonNew",
                            "profileOptInOptOut",
                            "recentlyAiredFullGuide",
                            "selectableQuality",
                            "selectableQuality10ft",
                            "settingsPanel",
                            "swimlanesSearch",
                            "swipeChannelChange",
                            "voice",
                            "voiceProgressive",
                            "volume",
                        ],
                        FeatureGroupId: "2000030",
                        BirthDate: null,
                        FeatureToggles: [
                            {
                                Name: "1FTHubsFeeds",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "AudioChannel",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "AutoFavorite",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "DeviceManagement",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "DownloadAndGo",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "MessagingApp",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "MultiplePIN",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "ProgramReminders",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "ShowKeyBoard",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "ViewConcurrentUsers",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "adultstoreenabled",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "autoplay",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "bingeBar",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "browseBar",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "catchup",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "catchupByPopularity",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "catchupEnvironment",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "catchupTermsAcceptanceRequired",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "codeDeviceLinking",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "comphost",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "comphosttest",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "dev_settings",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "dvr",
                                IsDefault: true,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "enableContentAdvisory",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "enableHTML5Playback",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "enableManualRecording",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "gridguide",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "guideExpandedRow",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "identity",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "lastWatched",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "livetimeshift",
                                IsDefault: true,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "nDvr_ongoing_playback",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "newDvrManager",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "pinunpinnotification",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "playonButtonNew",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "profileOptInOptOut",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "recentlyAiredFullGuide",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "selectableQuality",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "selectableQuality10ft",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "settingsPanel",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "swimlanesSearch",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "swipeChannelChange",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "voice",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "voiceProgressive",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                            {
                                Name: "volume",
                                IsDefault: false,
                                Properties: {},
                                Description: null,
                            },
                        ],
                        TimeZoneInformation: {
                            Bias: 480,
                            StandardName: "Pacific Standard Time",
                            StandardDate: {
                                Year: 0,
                                Month: 11,
                                DayOfWeek: 0,
                                Day: 1,
                                Hour: 1,
                                Minute: 59,
                                Second: 59,
                                Milliseconds: 0,
                            },
                            StandardBias: 0,
                            DaylightName: "Pacific Daylight Time",
                            DaylightDate: {
                                Year: 0,
                                Month: 3,
                                DayOfWeek: 0,
                                Day: 2,
                                Hour: 2,
                                Minute: 0,
                                Second: 0,
                                Milliseconds: 0,
                            },
                            DaylightBias: -60,
                        },
                        EasProfile: {
                            GeoCode: null,
                            MulticastEndpoint: {
                                Host: "239.195.2.233",
                                Port: 2042,
                            },
                            AudioBaseUri:
                                "https://ottapp-appgw-client-a.cip.mr.tv3cloud.com/htmlapp/eas/",
                        },
                        InHomeToken: "qzSryPrwMITresPp1sabrznwWsFJ",
                        DomainKeySeed: "2AEF957F15DF437A5543",
                        TermsAccepted: false,
                        VersionSet: null,
                        MaxAccountDevices: 100,
                        DeviceCount: 2,
                        DeviceName: "AppleTV1",
                        IhdServiceEnabled: false,
                        DownloadAndGoMaxDownloadLimitPerAsset: 1,
                        VoiceStateReportEnabled: false,
                    },
                    status: {
                        initialized: true,
                        isLoaded: true,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                        expiryTime: "Fri, 17 Jul 2020 05:18:09 GMT",
                    },
                },
            },
            references: {
                "[]": {
                    linkedHTTPResourceURL:
                        "https://ottapp-appgw-client-A.cip.mr.tv3cloud.com/Blue/sts/bootstrap",
                    status: {
                        initialized: true,
                        isLoaded: false,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                    },
                },
            },
        },
        landing: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {
                "https://reachclient.cip.mr.tv3cloud.com/landing.json": {
                    data: {
                        version: "20140207.1.524308",
                        sts:
                            "https://ottapp-appgw-client-A.cip.mr.tv3cloud.com/Blue/sts/",
                        acceptEncoding: "",
                        acceptLanguage: "en-US",
                        oauth: "LIVEID",
                        eject: ["NOTASHELLVERSION"],
                        upgradeUrls:
                            "https://play.google.com/store/search/?q=ericsson&c=apps|http://appstore.com/ericssoninc",
                        websocketClientConfig: {
                            userAgents: ["STB"],
                            host: "127.0.0.1",
                            port: 6060,
                        },
                        certLoginClientConfig: { userAgents: ["STB"] },
                        certbasedImplementation:
                            "scripts/utilities/certBasedBootstrap.js",
                        adultAuthTokenExpiration: 28800,
                        adultAuthTokenExtendedExpiration: 15552000,
                        tenant: "default",
                        fallbackIdpLaunchUrl: "",
                    },
                    status: {
                        initialized: true,
                        isLoaded: true,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 2,
                        expiryTime: "Sat, 18 Jul 2020 05:17:47 GMT",
                    },
                },
            },
            references: {
                "[]": {
                    linkedHTTPResourceURL:
                        "https://reachclient.cip.mr.tv3cloud.com/landing.json",
                    status: {
                        initialized: true,
                        isLoaded: false,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 2,
                    },
                },
            },
        },
    },
    live: {
        catalogCache: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        catchup: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        channelRights: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        scheduleCache: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
    },
    dvr: {
        subscriptionGroup: { httpResponseCache: {}, references: {} },
        viewable: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {
                "https://appgw-client-a.cip.mr.tv3cloud.com/S108/dvrproxy/v1/subscription-groups?%24type-filter=all&%24state-filter=viewable&%24orderby=startdate&%24lang=en-US&storeId=HubsAndFeeds-Main": {
                    status: {
                        initialized: true,
                        isLoaded: true,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                        expiryTime: "",
                    },
                },
            },
            references: {
                "[]": {
                    linkedHTTPResourceURL:
                        "https://appgw-client-a.cip.mr.tv3cloud.com/S108/dvrproxy/v1/subscription-groups?%24type-filter=all&%24state-filter=viewable&%24orderby=startdate&%24lang=en-US&storeId=HubsAndFeeds-Main",
                    status: {
                        initialized: true,
                        isLoaded: false,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                    },
                },
            },
        },
        scheduled: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {
                "https://appgw-client-a.cip.mr.tv3cloud.com/S108/dvrproxy//v1/subscription-groups?%24type-filter=all&%24state-filter=scheduled&%24orderby=startdate&%24lang=en-US&storeId=HubsAndFeeds-Main": {
                    status: {
                        initialized: true,
                        isLoaded: true,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                        expiryTime: "",
                    },
                },
            },
            references: {
                "[]": {
                    linkedHTTPResourceURL:
                        "https://appgw-client-a.cip.mr.tv3cloud.com/S108/dvrproxy//v1/subscription-groups?%24type-filter=all&%24state-filter=scheduled&%24orderby=startdate&%24lang=en-US&storeId=HubsAndFeeds-Main",
                    status: {
                        initialized: true,
                        isLoaded: false,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                    },
                },
            },
        },
    },
    subscriber: {
        pinnedItems: {},
        purchasedItems: {},
        devices: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        dynamicFeeds: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {
                "https://appgw-client-a.cip.mr.tv3cloud.com/S108/subscriber//v3/libraries/Continue?types=Title&atHome=true&%24skip=0&%24top=10&%24lang=en-US": {
                    data: {
                        Libraries: [
                            {
                                Id: "Continue",
                                Name: "Resume",
                                Description: "Your Recently Watched",
                                LibraryItems: [],
                            },
                        ],
                        LibraryItems: [],
                    },
                    status: {
                        initialized: true,
                        isLoaded: true,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 2,
                        expiryTime: "Fri, 17 Jul 2020 05:18:10 GMT",
                    },
                },
                "https://appgw-client-a.cip.mr.tv3cloud.com/S108/subscriber//v3/libraries/Pins?types=Title&atHome=true&%24skip=0&%24top=10&%24lang=en-US": {
                    data: {
                        Libraries: [
                            {
                                Id: "Pins",
                                Name: "Favorites",
                                Description: "Favorites",
                                LibraryItems: [],
                            },
                        ],
                        LibraryItems: [],
                    },
                    status: {
                        initialized: true,
                        isLoaded: true,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                        expiryTime: "Fri, 17 Jul 2020 05:18:10 GMT",
                    },
                },
                "https://appgw-client-a.cip.mr.tv3cloud.com/S108/subscriber//v3/libraries/Library?types=Title&atHome=true&%24skip=0&%24top=10&%24lang=en-US": {
                    data: {
                        Libraries: [
                            {
                                Id: "Library",
                                Name: "Rentals",
                                Description:
                                    "Active Rentals and Recently Purchased",
                                LibraryItems: [],
                            },
                        ],
                        LibraryItems: [],
                    },
                    status: {
                        initialized: true,
                        isLoaded: true,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                        expiryTime: "Fri, 17 Jul 2020 05:18:10 GMT",
                    },
                },
                "https://appgw-client-a.cip.mr.tv3cloud.com/S108/subscriber//v3/libraries/YouMightLike?types=Title&atHome=true&%24skip=0&%24top=10&%24lang=en-US": {
                    data: {
                        Libraries: [
                            {
                                Id: "YouMightLike",
                                Name: "You Might Like",
                                Description:
                                    "User Recommendations: You Might Like.",
                                HasMore: true,
                                ItemCount: 10,
                                LibraryItems: [
                                    "Default1_32933",
                                    "Default1_3255",
                                    "Default1_778800",
                                    "Default1_32939",
                                    "Default1_1835",
                                    "Default1_434",
                                    "Default1_437",
                                    "Default1_CPHD3154398000000001",
                                    "Default1_3321",
                                    "Default1_8341",
                                ],
                            },
                        ],
                        LibraryItems: [
                            {
                                Id: "Default1_32933",
                                ItemType: "Title",
                                IsPinned: false,
                                PurchaseActions: [
                                    {
                                        OfferId:
                                            "451938c0-dd1e-421a-b324-b5cecd16253f",
                                        ExternalOfferId:
                                            "451938c0-dd1e-421a-b324-b5cecd16253f",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_32933_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32933_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32933_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32933_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 5.99,
                                        Currency: "PHP",
                                        TransactionType: "Rent",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.2152949",
                                        HoursToExpiry: 47826,
                                        RentalWindow: "1.00:00:00",
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "f2d6e5a1-3947-4d64-9cff-554e6fba92b7",
                                        ExternalOfferId: "Offer_mins",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_32933_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32933_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32933_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32933_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 10,
                                        Currency: "PHP",
                                        TransactionType: "Rent",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.2152877",
                                        HoursToExpiry: 47826,
                                        RentalWindow: "00:10:00",
                                        Restrictions: ["dt"],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "6bda5568-12ef-4bd1-a4b8-9c043d306049",
                                        ExternalOfferId: "R108.7 pkg",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_32933_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32933_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32933_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32933_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 10,
                                        Currency: "PHP",
                                        TransactionType: "Purchase",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.2152762",
                                        HoursToExpiry: 47826,
                                        PackageId:
                                            "52a4497f-2138-4a0d-bbe3-3718aeab1033",
                                        ExternalPackageId: "R108.7 pkg",
                                        PackageName: "R108.7 pkg",
                                        ResourceType: "Package",
                                        ResourceId:
                                            "52a4497f-2138-4a0d-bbe3-3718aeab1033",
                                        ExternalResourceId:
                                            "52a4497f-2138-4a0d-bbe3-3718aeab1033",
                                        ExternalName: "R108.7 pkg",
                                        PackageTitleCount: 3,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "a3d18311-b78c-490d-9ddd-6c8c7961dce2",
                                        ExternalOfferId:
                                            "Svod_without stream limit",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_32933_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32933_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32933_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32933_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 5,
                                        Currency: "PHP",
                                        TransactionType: "Subscription",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc:
                                            "2021-01-17T06:41:38.069Z",
                                        TimeToExpiry: "184.01:23:28.2842681",
                                        HoursToExpiry: 4417,
                                        PackageId:
                                            "6a7bbae8-3810-4d1c-95e5-b5bf9502c8e2",
                                        ExternalPackageId: "123123",
                                        PackageName: "123123",
                                        ResourceType: "Subscription",
                                        ResourceId:
                                            "6a7bbae8-3810-4d1c-95e5-b5bf9502c8e2",
                                        ExternalResourceId:
                                            "6a7bbae8-3810-4d1c-95e5-b5bf9502c8e2",
                                        ExternalName: "123123",
                                        PackageTitleCount: 6,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "bbbd3947-d60b-4e45-9371-fb608aa4bd5e",
                                        ExternalOfferId: "Crave SVOD",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_32933_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32933_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32933_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32933_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 10,
                                        Currency: "PHP",
                                        TransactionType: "Subscription",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc:
                                            "2020-11-06T07:30:55.371Z",
                                        TimeToExpiry: "112.02:12:45.5862548",
                                        HoursToExpiry: 2690,
                                        PackageId:
                                            "7d105f1e-3f0e-4acf-8195-f75bbd0220dc",
                                        ExternalPackageId: "Crave On Demand",
                                        PackageName: "Crave On Demand",
                                        ResourceType: "Subscription",
                                        ResourceId:
                                            "7d105f1e-3f0e-4acf-8195-f75bbd0220dc",
                                        ExternalResourceId:
                                            "7d105f1e-3f0e-4acf-8195-f75bbd0220dc",
                                        ExternalName: "Crave On Demand",
                                        PackageTitleCount: 52,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                ],
                                IsGeoBlocked: false,
                                CatalogInfo: {
                                    Name: "Alice in Wonderland",
                                    ShowType: "Movie",
                                    Description:
                                        "A 19-year-old woman returns to a magical world from her childhood adventures and learns that she is destined to battle an oppressive queen and a fearsome monster, but she is beset by fear and uncertainty until she is aided by a mad hatter.",
                                    UniversalProgramId:
                                        "667969ThirdParty31303532313931",
                                    RuntimeSeconds: 6246,
                                    Network: {
                                        Id:
                                            "21f8a427-6cf4-4386-8d93-350a46755997",
                                        Name: "HBO",
                                        PFImages: [
                                            {
                                                Size: "Large",
                                                ImageType: "PFClientLarge",
                                                Uri:
                                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images/cip-a-ingsapmrins-img2/networks/21f8a427-6cf4-4386-8d93-350a46755997/pfclientlarge.jpg",
                                            },
                                            {
                                                Size: "Small",
                                                ImageType: "PFClientSmall",
                                                Uri:
                                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images/cip-a-ingsapmrins-img2/networks/21f8a427-6cf4-4386-8d93-350a46755997/pfclientsmall.jpg",
                                            },
                                        ],
                                        Images: [
                                            {
                                                Size: "Small",
                                                ImageType: "OneFootSmall",
                                                Uri:
                                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images/img2/networks/21f8a427-6cf4-4386-8d93-350a46755997/onefootsmall.jpg",
                                            },
                                            {
                                                Size: "Small",
                                                ImageType: "TenFootSmall",
                                                Uri:
                                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images/img2/networks/21f8a427-6cf4-4386-8d93-350a46755997/tenfootsmall.jpg",
                                            },
                                            {
                                                Size: "Large",
                                                ImageType: "TenFootLarge",
                                                Uri:
                                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images/img1/networks/21f8a427-6cf4-4386-8d93-350a46755997/tenfootlarge.jpg",
                                            },
                                            {
                                                Size: "Large",
                                                ImageType: "TwoFootLarge",
                                                Uri:
                                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images/img1/networks/21f8a427-6cf4-4386-8d93-350a46755997/twofootlarge.jpg",
                                            },
                                            {
                                                Size: "Large",
                                                ImageType: "OneFootLarge",
                                                Uri:
                                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images/img1/networks/21f8a427-6cf4-4386-8d93-350a46755997/onefootlarge.jpg",
                                            },
                                        ],
                                    },
                                    Ratings: [{ System: "MPAA", Value: "R" }],
                                    Tags: ["Feature"],
                                    Entitlements: [
                                        "jailbroken_blocked",
                                        "fwd_blocked",
                                        "rwd_blocked",
                                        "seek_skip_blocked",
                                        "seek_skip_fwd_blocked",
                                        "seek_skip_rwd_blocked",
                                        "pause_resume_blocked",
                                    ],
                                    IsNew: false,
                                    IsAdult: false,
                                    ReleaseYear: 2010,
                                    Locale: "en",
                                    HasContentAdvisory: false,
                                    Images: [
                                        {
                                            Size: "Small",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img1/program/667969thirdparty31303532313931/posterlandscapesmall.jpg",
                                        },
                                        {
                                            Size: "Medium",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img1/program/667969thirdparty31303532313931/posterlandscapemedium.jpg",
                                        },
                                    ],
                                    ImageBucketId: "img1",
                                    SupportedImages: [
                                        "4x3/KeyArt",
                                        "4x3/Poster",
                                        "3x4/KeyArt",
                                        "3x4/Poster",
                                        "2x3/KeyArt",
                                        "2x3/Poster",
                                        "16x9/KeyArt",
                                        "KeyArtLandscape",
                                        "PosterLandscape",
                                    ],
                                },
                            },
                            {
                                Id: "Default1_3255",
                                ItemType: "Title",
                                IsPinned: false,
                                PurchaseActions: [
                                    {
                                        OfferId:
                                            "c3ded622-6d98-4fd7-9acb-c329dea4681e",
                                        ExternalOfferId:
                                            "c3ded622-6d98-4fd7-9acb-c329dea4681e",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_3255_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_3255_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: ["ReachHD", "ReachSD"],
                                        Price: 5,
                                        Currency: "PHP",
                                        TransactionType: "Rent",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.2139248",
                                        HoursToExpiry: 47826,
                                        RentalWindow: "1.00:00:00",
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "bbbd3947-d60b-4e45-9371-fb608aa4bd5e",
                                        ExternalOfferId: "Crave SVOD",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_3255_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_3255_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: ["ReachHD", "ReachSD"],
                                        Price: 10,
                                        Currency: "PHP",
                                        TransactionType: "Subscription",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc:
                                            "2020-11-06T07:30:55.371Z",
                                        TimeToExpiry: "112.02:12:45.5849180",
                                        HoursToExpiry: 2690,
                                        PackageId:
                                            "7d105f1e-3f0e-4acf-8195-f75bbd0220dc",
                                        ExternalPackageId: "Crave On Demand",
                                        PackageName: "Crave On Demand",
                                        ResourceType: "Subscription",
                                        ResourceId:
                                            "7d105f1e-3f0e-4acf-8195-f75bbd0220dc",
                                        ExternalResourceId:
                                            "7d105f1e-3f0e-4acf-8195-f75bbd0220dc",
                                        ExternalName: "Crave On Demand",
                                        PackageTitleCount: 52,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                ],
                                IsGeoBlocked: false,
                                CatalogInfo: {
                                    Name: "Captain America: Civil War",
                                    ShowType: "Movie",
                                    Description:
                                        "Captain America and Iron Man disagree on the future of the Avengers when the United Nations proposes a stringent new system of accountability to be implemented for the Avengers, leaving the rest of the team to choose sides in the conflict.",
                                    UniversalProgramId:
                                        "667969ThirdParty32333232363134",
                                    RuntimeSeconds: 596,
                                    Ratings: [
                                        { System: "MPAA", Value: "PG-13" },
                                    ],
                                    Tags: ["Feature"],
                                    Entitlements: ["out_of_home_blocked"],
                                    IsNew: false,
                                    IsAdult: false,
                                    ReleaseYear: 2016,
                                    Locale: "en",
                                    HasContentAdvisory: true,
                                    Images: [
                                        {
                                            Size: "Small",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img1/program/667969thirdparty32333232363134/posterlandscapesmall.jpg",
                                        },
                                        {
                                            Size: "Medium",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img1/program/667969thirdparty32333232363134/posterlandscapemedium.jpg",
                                        },
                                    ],
                                    ImageBucketId: "img1",
                                    SupportedImages: [
                                        "4x3/KeyArt",
                                        "3x4/KeyArt",
                                        "3x4/Poster",
                                        "2x3/KeyArt",
                                        "2x3/Poster",
                                        "16x9/KeyArt",
                                        "3x2/KeyArt",
                                        "KeyArtLandscape",
                                        "PosterLandscape",
                                    ],
                                },
                            },
                            {
                                Id: "Default1_778800",
                                ItemType: "Title",
                                IsPinned: false,
                                PurchaseActions: [
                                    {
                                        OfferId:
                                            "0f784519-b111-45a4-a350-dc24dc526002",
                                        ExternalOfferId: "OfferBeautifulLife",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_778800_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 5,
                                        Currency: "PHP",
                                        TransactionType: "Rent",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.2123525",
                                        HoursToExpiry: 47826,
                                        RentalWindow: "1.00:00:00",
                                        Restrictions: ["ph", "tb"],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "cec22a39-d9e8-48fd-a996-2064f098c96f",
                                        ExternalOfferId:
                                            "cec22a39-d9e8-48fd-a996-2064f098c96f",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_778800_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 10,
                                        Currency: "PHP",
                                        TransactionType: "Rent",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.2123357",
                                        HoursToExpiry: 47826,
                                        RentalWindow: "1.00:00:00",
                                        PackageId:
                                            "c1e59c5f-1711-4155-9f1b-323e064b2302",
                                        ExternalPackageId: "Test TVOD Package",
                                        PackageName: "Test TVOD Package",
                                        ResourceType: "Package",
                                        ResourceId:
                                            "c1e59c5f-1711-4155-9f1b-323e064b2302",
                                        ExternalResourceId:
                                            "c1e59c5f-1711-4155-9f1b-323e064b2302",
                                        ExternalName: "Test TVOD Package",
                                        PackageTitleCount: 2,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "6bda5568-12ef-4bd1-a4b8-9c043d306049",
                                        ExternalOfferId: "R108.7 pkg",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_778800_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 10,
                                        Currency: "PHP",
                                        TransactionType: "Purchase",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.2123452",
                                        HoursToExpiry: 47826,
                                        PackageId:
                                            "52a4497f-2138-4a0d-bbe3-3718aeab1033",
                                        ExternalPackageId: "R108.7 pkg",
                                        PackageName: "R108.7 pkg",
                                        ResourceType: "Package",
                                        ResourceId:
                                            "52a4497f-2138-4a0d-bbe3-3718aeab1033",
                                        ExternalResourceId:
                                            "52a4497f-2138-4a0d-bbe3-3718aeab1033",
                                        ExternalName: "R108.7 pkg",
                                        PackageTitleCount: 3,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "a3d18311-b78c-490d-9ddd-6c8c7961dce2",
                                        ExternalOfferId:
                                            "Svod_without stream limit",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_778800_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 5,
                                        Currency: "PHP",
                                        TransactionType: "Subscription",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc:
                                            "2021-01-17T06:41:38.069Z",
                                        TimeToExpiry: "184.01:23:28.2813283",
                                        HoursToExpiry: 4417,
                                        PackageId:
                                            "6a7bbae8-3810-4d1c-95e5-b5bf9502c8e2",
                                        ExternalPackageId: "123123",
                                        PackageName: "123123",
                                        ResourceType: "Subscription",
                                        ResourceId:
                                            "6a7bbae8-3810-4d1c-95e5-b5bf9502c8e2",
                                        ExternalResourceId:
                                            "6a7bbae8-3810-4d1c-95e5-b5bf9502c8e2",
                                        ExternalName: "123123",
                                        PackageTitleCount: 6,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "d99d88ff-a0cb-435d-90ec-d42b9205dfb7",
                                        ExternalOfferId:
                                            "d99d88ff-a0cb-435d-90ec-d42b9205dfb7",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_778800_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 14.89,
                                        Currency: "PHP",
                                        TransactionType: "Subscription",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc:
                                            "2020-09-26T09:06:15.614Z",
                                        TimeToExpiry: "71.03:48:05.8263153",
                                        HoursToExpiry: 1707,
                                        PackageId:
                                            "da506061-3349-4b51-a422-f8f2aee33f41",
                                        ExternalPackageId:
                                            "CIP_sample_SVOD pkg",
                                        PackageName: "CIP_sample_SVOD pkg",
                                        ResourceType: "Subscription",
                                        ResourceId:
                                            "da506061-3349-4b51-a422-f8f2aee33f41",
                                        ExternalResourceId:
                                            "da506061-3349-4b51-a422-f8f2aee33f41",
                                        ExternalName: "CIP_sample_SVOD pkg",
                                        PackageTitleCount: 2,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "bbbd3947-d60b-4e45-9371-fb608aa4bd5e",
                                        ExternalOfferId: "Crave SVOD",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_778800_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 10,
                                        Currency: "PHP",
                                        TransactionType: "Subscription",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc:
                                            "2020-11-06T07:30:55.371Z",
                                        TimeToExpiry: "112.02:12:45.5833033",
                                        HoursToExpiry: 2690,
                                        PackageId:
                                            "7d105f1e-3f0e-4acf-8195-f75bbd0220dc",
                                        ExternalPackageId: "Crave On Demand",
                                        PackageName: "Crave On Demand",
                                        ResourceType: "Subscription",
                                        ResourceId:
                                            "7d105f1e-3f0e-4acf-8195-f75bbd0220dc",
                                        ExternalResourceId:
                                            "7d105f1e-3f0e-4acf-8195-f75bbd0220dc",
                                        ExternalName: "Crave On Demand",
                                        PackageTitleCount: 52,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "c700c629-f252-4a8e-b5da-dc05badd8d0e",
                                        ExternalOfferId:
                                            "c700c629-f252-4a8e-b5da-dc05badd8d0e",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_778800_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_778800_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 34.89,
                                        Currency: "PHP",
                                        TransactionType: "Subscription",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc:
                                            "2020-09-26T09:13:30.439Z",
                                        TimeToExpiry: "71.03:55:20.6512954",
                                        HoursToExpiry: 1707,
                                        PackageId:
                                            "c61c5396-c33f-4510-ab0d-a84f88215a04",
                                        ExternalPackageId: "CIP-Sample_anshita",
                                        PackageName: "CIP-Sample_anshita",
                                        ResourceType: "ParentSubscription",
                                        ResourceId:
                                            "c61c5396-c33f-4510-ab0d-a84f88215a04",
                                        ExternalResourceId:
                                            "c61c5396-c33f-4510-ab0d-a84f88215a04",
                                        ExternalName: "CIP-Sample_anshita",
                                        PackageTitleCount: 5,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                ],
                                IsGeoBlocked: false,
                                CatalogInfo: {
                                    Name: "A Beautiful Life",
                                    ShowType: "Movie",
                                    UniversalProgramId:
                                        "667969ThirdParty33323130373737",
                                    RuntimeSeconds: 142,
                                    Ratings: [{ System: "MPAA", Value: "R" }],
                                    Tags: ["Feature"],
                                    Entitlements: [
                                        "phone_blocked",
                                        "tablet_blocked",
                                        "fwd_blocked",
                                        "rwd_blocked",
                                        "seek_skip_blocked",
                                        "seek_skip_fwd_blocked",
                                        "seek_skip_rwd_blocked",
                                        "pause_resume_blocked",
                                    ],
                                    IsNew: false,
                                    IsAdult: false,
                                    ReleaseYear: 2011,
                                    Locale: "en",
                                    HasContentAdvisory: true,
                                    ImageBucketId: "img2",
                                    SupportedImages: [
                                        "4x3/KeyArt",
                                        "4x3/Poster",
                                        "3x4/KeyArt",
                                    ],
                                },
                            },
                            {
                                Id: "Default1_32939",
                                ItemType: "Title",
                                IsPinned: false,
                                PurchaseActions: [
                                    {
                                        OfferId:
                                            "ca48ea06-db12-4b16-a80a-c15f37313900",
                                        ExternalOfferId:
                                            "ca48ea06-db12-4b16-a80a-c15f37313900",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_32939_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32939_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32939_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32939_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 4.99,
                                        Currency: "PHP",
                                        TransactionType: "Rent",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.2107599",
                                        HoursToExpiry: 47826,
                                        RentalWindow: "1.00:00:00",
                                        Restrictions: ["tb"],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "95de8a04-70bc-46a5-abdd-ca2fc0684190",
                                        ExternalOfferId: "R108 Test Package",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_32939_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32939_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32939_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_32939_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 25,
                                        Currency: "PHP",
                                        TransactionType: "Rent",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.2107420",
                                        HoursToExpiry: 47826,
                                        RentalWindow: "1.00:00:00",
                                        PackageId:
                                            "01182a4f-ae64-4b27-9b16-c7e1185a8504",
                                        ExternalPackageId: "R108 Test Package",
                                        PackageName: "R108 Test Package",
                                        ResourceType: "Package",
                                        ResourceId:
                                            "01182a4f-ae64-4b27-9b16-c7e1185a8504",
                                        ExternalResourceId:
                                            "01182a4f-ae64-4b27-9b16-c7e1185a8504",
                                        ExternalName: "R108 Test Package",
                                        PackageTitleCount: 3,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                ],
                                IsGeoBlocked: false,
                                CatalogInfo: {
                                    Name: "Godzilla: King of the Monsters",
                                    ShowType: "Movie",
                                    Description:
                                        "A group of humans fights against an ancient super-species of monsters, who were believed to be myths and legends, and Godzilla fights for supremacy against a collection of monstrous foes in a battle that will determine humanity's future.",
                                    UniversalProgramId:
                                        "667969ThirdParty33323236373436",
                                    RuntimeSeconds: 118,
                                    Ratings: [{ System: "MPAA", Value: "R" }],
                                    Tags: ["Feature"],
                                    Entitlements: [
                                        "tablet_blocked",
                                        "pause_resume_blocked",
                                    ],
                                    IsNew: false,
                                    IsAdult: false,
                                    ReleaseYear: 2019,
                                    Locale: "en",
                                    HasContentAdvisory: true,
                                    Images: [
                                        {
                                            Size: "Small",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img1/program/667969thirdparty33323236373436/posterlandscapesmall.jpg",
                                        },
                                        {
                                            Size: "Medium",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img1/program/667969thirdparty33323236373436/posterlandscapemedium.jpg",
                                        },
                                    ],
                                    ImageBucketId: "img1",
                                    SupportedImages: [
                                        "4x3/KeyArt",
                                        "3x4/KeyArt",
                                        "3x4/Poster",
                                        "2x3/KeyArt",
                                        "2x3/Poster",
                                        "16x9/KeyArt",
                                        "3x2/KeyArt",
                                        "KeyArtLandscape",
                                        "PosterLandscape",
                                    ],
                                },
                            },
                            {
                                Id: "Default1_1835",
                                ItemType: "Title",
                                IsPinned: false,
                                PurchaseActions: [
                                    {
                                        OfferId:
                                            "3df75dc7-c454-432d-80d7-f8e18897dc4c",
                                        ExternalOfferId:
                                            "3df75dc7-c454-432d-80d7-f8e18897dc4c",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_1835_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_1835_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_1835_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_1835_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 6.99,
                                        Currency: "PHP",
                                        TransactionType: "Purchase",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.2070019",
                                        HoursToExpiry: 47826,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                ],
                                IsGeoBlocked: false,
                                CatalogInfo: {
                                    Name: "Friends",
                                    ShowType: "TVShow",
                                    Description:
                                        "Ross experiences trouble with his former wife when she insists upon leaving Ross out of their child's life entirely; Monica ends up going manic during a cleaning spree that is sparked when her parents announce their coming visit.",
                                    UniversalProgramId:
                                        "667969ThirdParty3132333836",
                                    RuntimeSeconds: 596,
                                    Network: {
                                        Id:
                                            "59859d29-667b-456d-9852-bb79e1b3734c",
                                        Name: "CNN",
                                        PFImages: [
                                            {
                                                Size: "Small",
                                                ImageType: "PFClientSmall",
                                                Uri:
                                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images/cip-a-ingsapmrins-img2/networks/59859d29-667b-456d-9852-bb79e1b3734c/pfclientsmall.jpg",
                                            },
                                            {
                                                Size: "Large",
                                                ImageType: "PFClientLarge",
                                                Uri:
                                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images/cip-a-ingsapmrins-img1/networks/59859d29-667b-456d-9852-bb79e1b3734c/pfclientlarge.jpg",
                                            },
                                        ],
                                        Images: [
                                            {
                                                Size: "Small",
                                                ImageType: "TwoFootSmall",
                                                Uri:
                                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images/cip-a-ingsapmrins-img2/networks/59859d29-667b-456d-9852-bb79e1b3734c/twofootsmall.jpg",
                                            },
                                            {
                                                Size: "Small",
                                                ImageType: "TenFootSmall",
                                                Uri:
                                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images/cip-a-ingsapmrins-img2/networks/59859d29-667b-456d-9852-bb79e1b3734c/tenfootsmall.jpg",
                                            },
                                            {
                                                Size: "Large",
                                                ImageType: "OneFootLarge",
                                                Uri:
                                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images/cip-a-ingsapmrins-img2/networks/59859d29-667b-456d-9852-bb79e1b3734c/onefootlarge.jpg",
                                            },
                                            {
                                                Size: "Large",
                                                ImageType: "TwoFootLarge",
                                                Uri:
                                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images/cip-a-ingsapmrins-img2/networks/59859d29-667b-456d-9852-bb79e1b3734c/twofootlarge.jpg",
                                            },
                                            {
                                                Size: "Small",
                                                ImageType: "OneFootSmall",
                                                Uri:
                                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images/cip-a-ingsapmrins-img2/networks/59859d29-667b-456d-9852-bb79e1b3734c/onefootsmall.jpg",
                                            },
                                            {
                                                Size: "Large",
                                                ImageType: "TenFootLarge",
                                                Uri:
                                                    "https://appgw-client-a.cip.mr.tv3cloud.com/images/cip-a-ingsapmrins-img2/networks/59859d29-667b-456d-9852-bb79e1b3734c/tenfootlarge.jpg",
                                            },
                                        ],
                                    },
                                    Ratings: [
                                        { System: "MPAA", Value: "TV-14" },
                                    ],
                                    Tags: ["Feature"],
                                    IsNew: false,
                                    IsAdult: false,
                                    ReleaseYear: 1994,
                                    OriginalAirDate: "1994-09-29T00:00:00Z",
                                    SeriesId: "667969ThirdParty383133",
                                    EpisodeName: "The One with the Sonogram",
                                    SeasonNumber: 1,
                                    SeasonId: "667969ThirdParty383133_1",
                                    EpisodeNumber: "2",
                                    NewEpisodeCount: 0,
                                    Locale: "en",
                                    HasContentAdvisory: true,
                                    Images: [
                                        {
                                            Size: "Small",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img2/series/667969thirdparty383133/posterlandscapesmall.jpg",
                                        },
                                        {
                                            Size: "Medium",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img2/series/667969thirdparty383133/posterlandscapemedium.jpg",
                                        },
                                    ],
                                    ImageBucketId: "img2",
                                    SupportedImages: [
                                        "4x3/KeyArt",
                                        "4x3/Poster",
                                        "3x4/KeyArt",
                                        "3x4/Poster",
                                        "2x3/KeyArt",
                                        "2x3/Poster",
                                        "16x9/KeyArt",
                                        "16x9/Poster",
                                        "3x2/KeyArt",
                                        "KeyArtLandscape",
                                        "PosterLandscape",
                                    ],
                                },
                            },
                            {
                                Id: "Default1_434",
                                ItemType: "Title",
                                IsPinned: false,
                                PurchaseActions: [
                                    {
                                        OfferId:
                                            "6dd3a556-6319-490c-bc97-c57a682a713b",
                                        ExternalOfferId:
                                            "6dd3a556-6319-490c-bc97-c57a682a713b",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_434_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_434_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_434_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_434_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 5,
                                        Currency: "PHP",
                                        TransactionType: "Rent",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.2055659",
                                        HoursToExpiry: 47826,
                                        RentalWindow: "1.00:00:00",
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "465ee395-27c3-4ca9-9cb9-f36c2aa7a62a",
                                        ExternalOfferId: "test_offer_1",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_434_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_434_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_434_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_434_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 1,
                                        Currency: "PHP",
                                        TransactionType: "Rent",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.2055524",
                                        HoursToExpiry: 47826,
                                        RentalWindow: "1.00:00:00",
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "95de8a04-70bc-46a5-abdd-ca2fc0684190",
                                        ExternalOfferId: "R108 Test Package",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_434_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_434_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_434_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_434_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 25,
                                        Currency: "PHP",
                                        TransactionType: "Rent",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.2055458",
                                        HoursToExpiry: 47826,
                                        RentalWindow: "1.00:00:00",
                                        PackageId:
                                            "01182a4f-ae64-4b27-9b16-c7e1185a8504",
                                        ExternalPackageId: "R108 Test Package",
                                        PackageName: "R108 Test Package",
                                        ResourceType: "Package",
                                        ResourceId:
                                            "01182a4f-ae64-4b27-9b16-c7e1185a8504",
                                        ExternalResourceId:
                                            "01182a4f-ae64-4b27-9b16-c7e1185a8504",
                                        ExternalName: "R108 Test Package",
                                        PackageTitleCount: 3,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "4cf59a8b-9521-4a67-aefc-406951d99093",
                                        ExternalOfferId: "purchase aquaman",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_434_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_434_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_434_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_434_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 10,
                                        Currency: "PHP",
                                        TransactionType: "Purchase",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.2055573",
                                        HoursToExpiry: 47826,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "bbbd3947-d60b-4e45-9371-fb608aa4bd5e",
                                        ExternalOfferId: "Crave SVOD",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_434_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_434_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_434_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_434_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 10,
                                        Currency: "PHP",
                                        TransactionType: "Subscription",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc:
                                            "2020-11-06T07:30:55.371Z",
                                        TimeToExpiry: "112.02:12:45.5765376",
                                        HoursToExpiry: 2690,
                                        PackageId:
                                            "7d105f1e-3f0e-4acf-8195-f75bbd0220dc",
                                        ExternalPackageId: "Crave On Demand",
                                        PackageName: "Crave On Demand",
                                        ResourceType: "Subscription",
                                        ResourceId:
                                            "7d105f1e-3f0e-4acf-8195-f75bbd0220dc",
                                        ExternalResourceId:
                                            "7d105f1e-3f0e-4acf-8195-f75bbd0220dc",
                                        ExternalName: "Crave On Demand",
                                        PackageTitleCount: 52,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                ],
                                IsGeoBlocked: false,
                                CatalogInfo: {
                                    Name: "Aquaman",
                                    ShowType: "Movie",
                                    Description:
                                        "When the fight for the seas reaches the shore, a half-Atlantean man finds himself pushing against his real identity, but when the fate of the planet is at stake, he embarks on an adventure to find an ancient source of power and become a king.",
                                    UniversalProgramId:
                                        "667969ThirdParty33303235393735",
                                    RuntimeSeconds: 388,
                                    Ratings: [{ System: "MPAA", Value: "R" }],
                                    Tags: ["Feature"],
                                    IsNew: false,
                                    IsAdult: false,
                                    ReleaseYear: 2018,
                                    Locale: "en",
                                    HasContentAdvisory: false,
                                    Images: [
                                        {
                                            Size: "Small",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img2/program/667969thirdparty33303235393735/posterlandscapesmall.jpg",
                                        },
                                        {
                                            Size: "Medium",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img2/program/667969thirdparty33303235393735/posterlandscapemedium.jpg",
                                        },
                                    ],
                                    ImageBucketId: "img2",
                                    SupportedImages: [
                                        "4x3/KeyArt",
                                        "4x3/Poster",
                                        "3x4/KeyArt",
                                        "3x4/Poster",
                                        "2x3/KeyArt",
                                        "2x3/Poster",
                                        "16x9/KeyArt",
                                        "16x9/Poster",
                                        "3x2/KeyArt",
                                        "KeyArtLandscape",
                                        "PosterLandscape",
                                    ],
                                },
                            },
                            {
                                Id: "Default1_437",
                                ItemType: "Title",
                                IsPinned: false,
                                PurchaseActions: [
                                    {
                                        OfferId:
                                            "e1bb6a1f-5669-4b32-be48-a32575f71e1b",
                                        ExternalOfferId:
                                            "e1bb6a1f-5669-4b32-be48-a32575f71e1b",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_437_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_437_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_437_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_437_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 6.99,
                                        Currency: "PHP",
                                        TransactionType: "Purchase",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.2033995",
                                        HoursToExpiry: 47826,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                    {
                                        OfferId:
                                            "a3d18311-b78c-490d-9ddd-6c8c7961dce2",
                                        ExternalOfferId:
                                            "Svod_without stream limit",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_437_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_437_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_437_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_437_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 5,
                                        Currency: "PHP",
                                        TransactionType: "Subscription",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc:
                                            "2021-01-17T06:41:38.069Z",
                                        TimeToExpiry: "184.01:23:28.2723851",
                                        HoursToExpiry: 4417,
                                        PackageId:
                                            "6a7bbae8-3810-4d1c-95e5-b5bf9502c8e2",
                                        ExternalPackageId: "123123",
                                        PackageName: "123123",
                                        ResourceType: "Subscription",
                                        ResourceId:
                                            "6a7bbae8-3810-4d1c-95e5-b5bf9502c8e2",
                                        ExternalResourceId:
                                            "6a7bbae8-3810-4d1c-95e5-b5bf9502c8e2",
                                        ExternalName: "123123",
                                        PackageTitleCount: 6,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                ],
                                IsGeoBlocked: false,
                                CatalogInfo: {
                                    Name: "The Intruder",
                                    ShowType: "Movie",
                                    Description:
                                        "When a young couple decides to buy their dream home, they believe that they have found the perfect place to settle, but when the homeowner appears attached to the house, the couple soon realize that they must deal with an invasion in their lives.",
                                    UniversalProgramId:
                                        "667969ThirdParty33323036353439",
                                    RuntimeSeconds: 1802,
                                    Ratings: [
                                        { System: "MPAA", Value: "PG-13" },
                                    ],
                                    Tags: ["Feature"],
                                    Entitlements: ["seek_skip_blocked"],
                                    IsNew: false,
                                    IsAdult: false,
                                    ReleaseYear: 2019,
                                    Locale: "en",
                                    HasContentAdvisory: true,
                                    Images: [
                                        {
                                            Size: "Small",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img2/program/667969thirdparty33323036353439/posterlandscapesmall.jpg",
                                        },
                                        {
                                            Size: "Medium",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img2/program/667969thirdparty33323036353439/posterlandscapemedium.jpg",
                                        },
                                    ],
                                    ImageBucketId: "img2",
                                    SupportedImages: [
                                        "4x3/KeyArt",
                                        "3x4/KeyArt",
                                        "3x4/Poster",
                                        "2x3/KeyArt",
                                        "2x3/Poster",
                                        "16x9/KeyArt",
                                        "3x2/KeyArt",
                                        "KeyArtLandscape",
                                        "PosterLandscape",
                                    ],
                                },
                            },
                            {
                                Id: "Default1_CPHD3154398000000001",
                                ItemType: "Title",
                                IsPinned: false,
                                PlayActions: [
                                    {
                                        VideoProfile: {
                                            PlaybackUri:
                                                "http://vsppstreamer-vspp03-pod1.cip.mr.tv3cloud.com:5555/shss/Default1_CPHD3154398000000001/index.ism/Manifest?device=sa_stb_ss_hd_enc",
                                            PlaybackOrigin:
                                                "ONPREMISEDYNAMICSMOOTH",
                                            Id:
                                                "Default1_CPHD3154398000000001_SmoothStreaming_Stb_HD",
                                            Owner: "azuki",
                                            Encoding: "SmoothStreaming",
                                            QualityLevel: "HD",
                                            ClientType: "Stb",
                                            AudioTags: {},
                                        },
                                        ExpirationUtc: "2034-02-01T00:00:00Z",
                                        TimeToExpiry: "4946.18:41:50.2020790",
                                        HoursToExpiry: 118722,
                                        StartUtc: "2019-11-08T00:00:00Z",
                                        Restrictions: [],
                                        Terms: "Standard offer T&Cs apply",
                                    },
                                    {
                                        VideoProfile: {
                                            PlaybackUri:
                                                "http://vsppstreamer-vspp03-pod1.cip.mr.tv3cloud.com:5555/shss/Default1_CPHD3154398000000001/index.ism/Manifest?device=sa_stb_ss_sd_enc",
                                            PlaybackOrigin:
                                                "ONPREMISEDYNAMICSMOOTH",
                                            Id:
                                                "Default1_CPHD3154398000000001_SmoothStreaming_Stb_SD",
                                            Owner: "azuki",
                                            Encoding: "SmoothStreaming",
                                            QualityLevel: "SD",
                                            ClientType: "Stb",
                                            AudioTags: {},
                                        },
                                        ExpirationUtc: "2034-02-01T00:00:00Z",
                                        TimeToExpiry: "4946.18:41:50.2020748",
                                        HoursToExpiry: 118722,
                                        StartUtc: "2019-11-08T00:00:00Z",
                                        Restrictions: [],
                                        Terms: "Standard offer T&Cs apply",
                                    },
                                    {
                                        VideoProfile: {
                                            PlaybackUri:
                                                "http://vsppstreamer-vspp03-pod1.cip.mr.tv3cloud.com:5555/shls/Default1_CPHD3154398000000001/index.m3u8?device=sa_reach_hd_enc",
                                            PlaybackOrigin: "ONPREMISEDYNAMIC",
                                            Id:
                                                "Default1_CPHD3154398000000001_Jitp_Reach_HD",
                                            Owner: "azuki",
                                            Encoding: "Jitp",
                                            QualityLevel: "ReachHD",
                                            ClientType: "Reach",
                                            AudioTags: {},
                                        },
                                        ExpirationUtc: "2034-02-01T00:00:00Z",
                                        TimeToExpiry: "4946.18:41:50.2020736",
                                        HoursToExpiry: 118722,
                                        StartUtc: "2019-11-08T00:00:00Z",
                                        Restrictions: [],
                                        Terms: "Standard offer T&Cs apply",
                                    },
                                    {
                                        VideoProfile: {
                                            PlaybackUri:
                                                "http://vsppstreamer-vspp03-pod1.cip.mr.tv3cloud.com:5555/shls/Default1_CPHD3154398000000001/index.m3u8?device=sa_reach_sd_enc",
                                            PlaybackOrigin: "ONPREMISEDYNAMIC",
                                            Id:
                                                "Default1_CPHD3154398000000001_Jitp_Reach_SD",
                                            Owner: "azuki",
                                            Encoding: "Jitp",
                                            QualityLevel: "ReachSD",
                                            ClientType: "Reach",
                                            AudioTags: {},
                                        },
                                        ExpirationUtc: "2034-02-01T00:00:00Z",
                                        TimeToExpiry: "4946.18:41:50.2020725",
                                        HoursToExpiry: 118722,
                                        StartUtc: "2019-11-08T00:00:00Z",
                                        Restrictions: [],
                                        Terms: "Standard offer T&Cs apply",
                                    },
                                ],
                                IsGeoBlocked: false,
                                CatalogInfo: {
                                    Name: "Fighting With My Family",
                                    ShowType: "Movie",
                                    Description:
                                        "While a former professional wrestler decides to use his talents to make a living by performing at small venues around the country, his children express their dreams of joining the ranks of the World Wrestling Entertainment.",
                                    UniversalProgramId:
                                        "667969ThirdParty32383931363735",
                                    RuntimeSeconds: 388,
                                    Ratings: [
                                        { System: "TELUSMovie", Value: "18A" },
                                        { System: "MPAA", Value: "R" },
                                    ],
                                    Tags: ["Feature"],
                                    IsNew: false,
                                    IsAdult: false,
                                    ReleaseYear: 2019,
                                    Locale: "en",
                                    HasContentAdvisory: true,
                                    Images: [
                                        {
                                            Size: "Small",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img1/program/667969thirdparty32383931363735/posterlandscapesmall.jpg",
                                        },
                                        {
                                            Size: "Medium",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img1/program/667969thirdparty32383931363735/posterlandscapemedium.jpg",
                                        },
                                    ],
                                    ImageBucketId: "img1",
                                    SupportedImages: [
                                        "4x3/KeyArt",
                                        "3x4/KeyArt",
                                        "3x4/Poster",
                                        "2x3/KeyArt",
                                        "2x3/Poster",
                                        "16x9/KeyArt",
                                        "3x2/KeyArt",
                                        "KeyArtLandscape",
                                        "PosterLandscape",
                                    ],
                                },
                            },
                            {
                                Id: "Default1_3321",
                                ItemType: "Title",
                                IsPinned: false,
                                PurchaseActions: [
                                    {
                                        OfferId:
                                            "ef703d46-200e-4fb6-aef9-5fc880f77185",
                                        ExternalOfferId: "maze runner",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_3321_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_3321_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_3321_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_3321_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 2,
                                        Currency: "PHP",
                                        TransactionType: "Rent",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2026-12-31T00:00:00Z",
                                        TimeToExpiry: "2357.18:41:50.1997454",
                                        HoursToExpiry: 56586,
                                        RentalWindow: "1.00:00:00",
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                ],
                                IsGeoBlocked: false,
                                CatalogInfo: {
                                    Name: "Maze Runner: The Scorch Trials",
                                    ShowType: "Movie",
                                    Description:
                                        "After escaping the Maze, Thomas and the rest of the Gladers are faced with the challenge of uncovering the true motivations of the mysterious organization WCKD, and their journey ultimately takes them to a desolated landscape known as the Scorch.",
                                    UniversalProgramId:
                                        "667969ThirdParty32313239373337",
                                    RuntimeSeconds: 596,
                                    Ratings: [
                                        { System: "MPAA", Value: "PG-13" },
                                    ],
                                    Tags: ["Feature"],
                                    IsNew: false,
                                    IsAdult: false,
                                    ReleaseYear: 2015,
                                    Locale: "en",
                                    HasContentAdvisory: true,
                                    Images: [
                                        {
                                            Size: "Small",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img1/program/667969thirdparty32313239373337/posterlandscapesmall.jpg",
                                        },
                                        {
                                            Size: "Medium",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img1/program/667969thirdparty32313239373337/posterlandscapemedium.jpg",
                                        },
                                    ],
                                    ImageBucketId: "img1",
                                    SupportedImages: [
                                        "4x3/KeyArt",
                                        "3x4/KeyArt",
                                        "3x4/Poster",
                                        "2x3/KeyArt",
                                        "2x3/Poster",
                                        "16x9/KeyArt",
                                        "KeyArtLandscape",
                                        "PosterLandscape",
                                    ],
                                },
                            },
                            {
                                Id: "Default1_8341",
                                ItemType: "Title",
                                IsPinned: false,
                                PurchaseActions: [
                                    {
                                        OfferId:
                                            "e010f3d0-7c14-455f-a51d-11d14a8242e5",
                                        ExternalOfferId:
                                            "e010f3d0-7c14-455f-a51d-11d14a8242e5",
                                        VideoProfiles: [
                                            {
                                                Id:
                                                    "Default1_8341_SmoothStreaming_Stb_HD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "HD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_8341_SmoothStreaming_Stb_SD",
                                                Owner: "azuki",
                                                Encoding: "SmoothStreaming",
                                                QualityLevel: "SD",
                                                ClientType: "Stb",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_8341_Jitp_Reach_HD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachHD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                            {
                                                Id:
                                                    "Default1_8341_Jitp_Reach_SD",
                                                Owner: "azuki",
                                                Encoding: "Jitp",
                                                QualityLevel: "ReachSD",
                                                ClientType: "Reach",
                                                AudioTags: {},
                                            },
                                        ],
                                        QualityLevels: [
                                            "HD",
                                            "SD",
                                            "ReachHD",
                                            "ReachSD",
                                        ],
                                        Price: 7.99,
                                        Currency: "PHP",
                                        TransactionType: "Rent",
                                        Terms: "Standard offer T&Cs apply",
                                        ExpirationUtc: "2025-12-31T00:00:00Z",
                                        TimeToExpiry: "1992.18:41:50.1977389",
                                        HoursToExpiry: 47826,
                                        RentalWindow: "1.00:00:00",
                                        PackageId:
                                            "6ab35650-0a42-4007-b80a-47ccfe0e0cc9",
                                        ExternalPackageId: "Test Package",
                                        PackageName: "Test Package",
                                        ResourceType: "Package",
                                        ResourceId:
                                            "6ab35650-0a42-4007-b80a-47ccfe0e0cc9",
                                        ExternalResourceId:
                                            "6ab35650-0a42-4007-b80a-47ccfe0e0cc9",
                                        ExternalName: "Test Package",
                                        PackageTitleCount: 2,
                                        Restrictions: [],
                                        Discountable: false,
                                    },
                                ],
                                IsGeoBlocked: false,
                                CatalogInfo: {
                                    Name: "After Life",
                                    ShowType: "TVShow",
                                    UniversalProgramId: "fake_8341_Default1",
                                    RuntimeSeconds: 106,
                                    Ratings: [
                                        { System: "MPAA", Value: "TV-14" },
                                    ],
                                    Tags: ["Feature"],
                                    IsNew: false,
                                    IsAdult: false,
                                    ReleaseYear: 2019,
                                    OriginalAirDate: "2019-08-08T00:00:00Z",
                                    SeriesId: "667969ThirdParty33303237373234",
                                    EpisodeName: "Episode 1",
                                    SeasonNumber: 1,
                                    SeasonId:
                                        "667969ThirdParty33303237373234_1",
                                    EpisodeNumber: "1",
                                    NewEpisodeCount: 0,
                                    Locale: "en-us",
                                    HasContentAdvisory: true,
                                    Images: [
                                        {
                                            Size: "Small",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img1/series/667969thirdparty33303237373234/keyartlandscapesmall.jpg",
                                        },
                                        {
                                            Size: "Medium",
                                            ImageType: "PosterLandscape",
                                            Uri:
                                                "https://appgw-client-a.cip.mr.tv3cloud.com/images/img1/series/667969thirdparty33303237373234/keyartlandscapemedium.jpg",
                                        },
                                    ],
                                    ImageBucketId: "img1",
                                    SupportedImages: [
                                        "4x3/KeyArt",
                                        "3x4/KeyArt",
                                        "2x3/KeyArt",
                                        "16x9/KeyArt",
                                        "3x2/KeyArt",
                                        "KeyArtLandscape",
                                    ],
                                },
                            },
                        ],
                    },
                    status: {
                        initialized: true,
                        isLoaded: true,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 3,
                        expiryTime: "Fri, 17 Jul 2020 05:18:10 GMT",
                    },
                },
                "https://appgw-client-a.cip.mr.tv3cloud.com/S108/subscriber//v3/libraries/Reminders?types=Title&atHome=true&%24skip=0&%24top=10&%24lang=en-US": {
                    data: {
                        Libraries: [
                            {
                                Id: "Reminders",
                                Name: "Reminders",
                                Description: "Reminders",
                                LibraryItems: [],
                            },
                        ],
                        LibraryItems: [],
                    },
                    status: {
                        initialized: true,
                        isLoaded: true,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                        expiryTime: "Fri, 17 Jul 2020 05:18:10 GMT"
                    }
                },
                "https://appgw-client-a.pprod.mr.tv3cloud.com/S120/subscriber/v3/libraries/Continue?types=Title&atHome=true&%24skip=0&%24top=10&%24lang=en-US&storeId=HubsAndFeeds-Main": {
                    data: {
                        Libraries: [
                            {
                                Id: "Continue",
                                Name: "Resume",
                                Description: "Your Recently Watched",
                                LibraryItems: [
                                    {
                                        Description: "",
                                        HasSubcategories: false,
                                        Id: "96bc5e5b-5f46-4f7e-b49e-e34e23207735",
                                        Images: [],
                                        IsAdult: false,
                                        ItemCount: 5,
                                        ItemType: "SvodPackage",
                                        Name: "AVE_Subscription_Package"
                                    }
                                ]
                            }
                        ],
                        LibraryItems: [{
                            Description: "",
                            HasSubcategories: false,
                            Id: "96bc5e5b-5f46-4f7e-b49e-e34e23207735",
                            Images: [],
                            IsAdult: false,
                            ItemCount: 5,
                            ItemType: "SvodPackage",
                            Name: "AVE_Subscription_Package"
                        }]
                    },
                    status: {
                        initialized: true,
                        isLoaded: true,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 2,
                        expiryTime: "Fri, 17 Jul 2020 05:18:10 GMT"
                    }
                }
            },
            references: {
                '[{"libraryId":"Continue","atHome":true}]': {
                    linkedHTTPResourceURL:
                        "https://appgw-client-a.pprod.mr.tv3cloud.com/S120/subscriber/v3/libraries/Continue?types=Title&atHome=true&%24skip=0&%24top=10&%24lang=en-US&storeId=HubsAndFeeds-Main",
                    status: {
                        initialized: true,
                        isLoaded: false,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 2,
                    },
                },
                '[{"libraryId":"Pins","atHome":true}]': {
                    linkedHTTPResourceURL:
                        "https://appgw-client-a.cip.mr.tv3cloud.com/S108/subscriber//v3/libraries/Pins?types=Title&atHome=true&%24skip=0&%24top=10&%24lang=en-US",
                    status: {
                        initialized: true,
                        isLoaded: false,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                    },
                },
                '[{"libraryId":"Library","atHome":true}]': {
                    linkedHTTPResourceURL:
                        "https://appgw-client-a.cip.mr.tv3cloud.com/S108/subscriber//v3/libraries/Library?types=Title&atHome=true&%24skip=0&%24top=10&%24lang=en-US",
                    status: {
                        initialized: true,
                        isLoaded: false,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                    },
                },
                '[{"libraryId":"YouMightLike","atHome":true}]': {
                    linkedHTTPResourceURL:
                        "https://appgw-client-a.cip.mr.tv3cloud.com/S108/subscriber//v3/libraries/YouMightLike?types=Title&atHome=true&%24skip=0&%24top=10&%24lang=en-US",
                    status: {
                        initialized: true,
                        isLoaded: false,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 3,
                    },
                },
                '[{"libraryId":"Reminders","atHome":true}]': {
                    linkedHTTPResourceURL:
                        "https://appgw-client-a.cip.mr.tv3cloud.com/S108/subscriber//v3/libraries/Reminders?types=Title&atHome=true&%24skip=0&%24top=10&%24lang=en-US",
                    status: {
                        initialized: true,
                        isLoaded: false,
                        isLoading: false,
                        isFailed: false,
                        stale: false,
                        refCounter: 1,
                    },
                },
            },
        },
        locationInfo: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        playOptions: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        profiles: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        program: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        series: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
        similarItems: {
            unusedResourcesCacheSize: 50,
            httpResponseCache: {},
            references: {},
        },
    },
    shortCode: {
        token: {
            data: {
                AccessToken:
                    "AuthToken1lZBNb5wwEIZ_DdxYGQPGHDiQ7KeStFWyXalHYw-7VgxG_tiE_vqaTZNGVfdQyR6PnnnHo3kbLyQMHOqTc6ONsibC63AMqEkOx5EZNy24HBe9WbhzxpX2YsF1HyTxzloP5q9G6-w1_Sz8o-Mn6JldvPbKajYutDkG-mJDwAgV4bkEKWBw0k0h5YrJfq4PrIeaIJZSVtGEVSVLspSRJA8sucCZBRQv4Sw57MT_qPfTCHUzjgr2h0_ogD_gHgY2uPCrgI555eJHYKqvlTyDFHHDufaXMnB2cmyIcqS9U1o_z0aELy9N3y2Yq5o1MOcNbIz2YxAFQxDK0L8N7CU32urO_bb53UI6W0iuWGi0gtr61nIjWzDxxoQ59m0QRhG-ST_dcn7jRin9AuJ9efuxfePdSRv5kzmphwdmn-uMIlwVKU1TnBGMC5rmpCCY0BSVVUbi1esoDdivQ50WVVGQktIivjVhaRBvMK9IhgK8g2njpairlrOsa6uE8a5KckrapCq6Lmk5Ejxty7wt0nj70Nw-bRtckDrC3fqw257bkGxvvJ7K8jjCuMT3qx-rxj2CWt5_y_D-i9jd7SmNMvEL",
                RefreshToken:
                    "AuthToken1dZDbTsMwDEC_pn1r1WtYHvpQbTAG4iKYJuDNddwtIk2qJh3r35NOCBASUuREx8ex5XoUkjRSdXCut0FeB9mVPwOpSep9D4ObYpR93A2xO-aozChiNJ1Xwo21Iw1_Cq2z__mz-OPhgTqw8alT1kAfm2Hv6Yf1IUuS0l_nIAVpJ93kn6hAdnNeQ0cVIRwc6KBIzOiUMe9zl_Dy1MuB7IOuUpaxgvNkUYbLgcCRmGHJC87yGdaIZtRuI_75aUVHieTTLIF0AXwRAb-AKE-BRYVn0RnOzKMvezv1VNV9r2i7-4V22TfckoZzU0EtjMqFTwSqq5Q8khThs9zrjd6ad9Ln3f4Z-Zam9ShFxRuEvG14BNjyqFiwJuJl20YNJgLT5qJoyjS8vquXz9d1VrIK719eb55OafF4x2w2rF_X922QNZertxU71ZjSxibJzpP9hMt1EeTiEw",
                TokenExpires: "2020-07-24T05:18:05.3190351Z",
                Status: "Success",
            },
            status: 200,
            headers: {
                "x-origin": "10.170.192.113:19220",
                "transfer-encoding": "Identity",
                date: "Fri, 17 Jul 2020 05:18:05 GMT",
                server: "nginx",
                "cache-control": "no-store, no-cache, max-age=0",
                "content-type": "application/json; charset=utf-8",
                expires: "Thu, 16 Jul 2020 05:18:05 GMT",
                "content-encoding": "br",
                "x-icid": "74bd2a4665e947b8a69b72c503e75b0c",
                connection: "keep-alive",
                vary: "Content-Encoding,Origin,Authorization",
                "x-mediaroom-cloud-version": "1.0.3088.1",
            },
            config: {
                transformRequest: {},
                transformResponse: {},
                timeout: 0,
                xsrfCookieName: "XSRF-TOKEN",
                xsrfHeaderName: "X-XSRF-TOKEN",
                maxContentLength: -1,
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json;charset=utf-8",
                    Authorization: 'OAUTH2 access_token="undefined"',
                    Cookie:
                        'oauth=refresh_token="undefined";access-token="undefined"',
                },
                method: "post",
                withCredentials: true,
                url:
                    "https://ottapp-appgw-client-A.cip.mr.tv3cloud.com/Blue/sts/request-token",
                data:
                    '{"deviceId":"60a18a98-a97a-31a6-460a-18a98a97a31a","deviceType":"AppleTV","regCode":"GHTTDY"}',
            },
            request: {
                UNSENT: 0,
                OPENED: 1,
                HEADERS_RECEIVED: 2,
                LOADING: 3,
                DONE: 4,
                readyState: 4,
                status: 200,
                timeout: 0,
                withCredentials: true,
                upload: {},
                _aborted: false,
                _hasError: false,
                _method: "POST",
                _response:
                    '{"AccessToken":"AuthToken1lZBNb5wwEIZ_DdxYGQPGHDiQ7KeStFWyXalHYw-7VgxG_tiE_vqaTZNGVfdQyR6PnnnHo3kbLyQMHOqTc6ONsibC63AMqEkOx5EZNy24HBe9WbhzxpX2YsF1HyTxzloP5q9G6-w1_Sz8o-Mn6JldvPbKajYutDkG-mJDwAgV4bkEKWBw0k0h5YrJfq4PrIeaIJZSVtGEVSVLspSRJA8sucCZBRQv4Sw57MT_qPfTCHUzjgr2h0_ogD_gHgY2uPCrgI555eJHYKqvlTyDFHHDufaXMnB2cmyIcqS9U1o_z0aELy9N3y2Yq5o1MOcNbIz2YxAFQxDK0L8N7CU32urO_bb53UI6W0iuWGi0gtr61nIjWzDxxoQ59m0QRhG-ST_dcn7jRin9AuJ9efuxfePdSRv5kzmphwdmn-uMIlwVKU1TnBGMC5rmpCCY0BSVVUbi1esoDdivQ50WVVGQktIivjVhaRBvMK9IhgK8g2njpairlrOsa6uE8a5KckrapCq6Lmk5Ejxty7wt0nj70Nw-bRtckDrC3fqw257bkGxvvJ7K8jjCuMT3qx-rxj2CWt5_y_D-i9jd7SmNMvEL","RefreshToken":"AuthToken1dZDbTsMwDEC_pn1r1WtYHvpQbTAG4iKYJuDNddwtIk2qJh3r35NOCBASUuREx8ex5XoUkjRSdXCut0FeB9mVPwOpSep9D4ObYpR93A2xO-aozChiNJ1Xwo21Iw1_Cq2z__mz-OPhgTqw8alT1kAfm2Hv6Yf1IUuS0l_nIAVpJ93kn6hAdnNeQ0cVIRwc6KBIzOiUMe9zl_Dy1MuB7IOuUpaxgvNkUYbLgcCRmGHJC87yGdaIZtRuI_75aUVHieTTLIF0AXwRAb-AKE-BRYVn0RnOzKMvezv1VNV9r2i7-4V22TfckoZzU0EtjMqFTwSqq5Q8khThs9zrjd6ad9Ln3f4Z-Zam9ShFxRuEvG14BNjyqFiwJuJl20YNJgLT5qJoyjS8vquXz9d1VrIK719eb55OafF4x2w2rF_X922QNZertxU71ZjSxibJzpP9hMt1EeTiEw","TokenExpires":"2020-07-24T05:18:05.3190351Z","Status":"Success"}',
                _url:
                    "https://ottapp-appgw-client-A.cip.mr.tv3cloud.com/Blue/sts/request-token",
                _timedOut: false,
                _trackingName: "unknown",
                _incrementalEvents: false,
                responseHeaders: {
                    "x-origin": "10.170.192.113:19220",
                    "transfer-encoding": "Identity",
                    date: "Fri, 17 Jul 2020 05:18:05 GMT",
                    server: "nginx",
                    "cache-control": "no-store, no-cache, max-age=0",
                    "content-type": "application/json; charset=utf-8",
                    expires: "Thu, 16 Jul 2020 05:18:05 GMT",
                    "content-encoding": "br",
                    "x-icid": "74bd2a4665e947b8a69b72c503e75b0c",
                    connection: "keep-alive",
                    vary: "Content-Encoding,Origin,Authorization",
                    "x-mediaroom-cloud-version": "1.0.3088.1",
                },
                _requestId: null,
                _headers: {
                    accept: "application/json, text/plain, */*",
                    "content-type": "application/json;charset=utf-8",
                    authorization: 'OAUTH2 access_token="undefined"',
                    cookie:
                        'oauth=refresh_token="undefined";access-token="undefined"',
                },
                _responseType: "",
                _sent: true,
                _lowerCaseResponseHeaders: {
                    "x-origin": "10.170.192.113:19220",
                    "transfer-encoding": "Identity",
                    date: "Fri, 17 Jul 2020 05:18:05 GMT",
                    server: "nginx",
                    "cache-control": "no-store, no-cache, max-age=0",
                    "content-type": "application/json; charset=utf-8",
                    expires: "Thu, 16 Jul 2020 05:18:05 GMT",
                    "content-encoding": "br",
                    "x-icid": "74bd2a4665e947b8a69b72c503e75b0c",
                    connection: "keep-alive",
                    vary: "Content-Encoding,Origin,Authorization",
                    "x-mediaroom-cloud-version": "1.0.3088.1",
                },
                _subscriptions: [],
                responseURL:
                    "https://ottapp-appgw-client-A.cip.mr.tv3cloud.com/Blue/sts/request-token",
            },
        },
    },
    navigation: {
        currentRoute: "Yourstuff",
        history: [
            { route: "Splash", params: {} },
            { route: "Yourstuff", params: {} }
        ]
    }, app: {
        theme: 0,
        browseGallery: {
            page: 0,
            lastPageReached: false,
            itemFeed: [],
            filterData: {},
        },
    }
};

export function getMockState() {
    return mockState;
}
