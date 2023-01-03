/**
 * Enum represents the type of the pinned item.
 * @enum {string}
 */
export enum PinnedItemType {
    Program = "Program",
    Series = "Series",
    Package = "Package",
    Person = "Person",
    FavoriteChannel = "FavoriteChannel",
    HiddenChannel = "HiddenChannel",
    Title = "Title",
}

export interface IPinnedItemsResponse {
    CreatedUtc: string
    Id: string
    IsAdult: boolean
    ItemType: string
}

export interface IPinnedItemsRequestParams {
    type: string,
    skip?: number,
    top?: number
}