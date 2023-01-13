import { pbr } from "../analytics/consts";
import { IChannel } from "../live/live";

export function recentlyAiredRights(
    channel: Pick<IChannel, "LiveRights">
): boolean {
    if (!channel) {
        return false;
    }
    const { LiveRights = [] } = channel;
    if (LiveRights.length > 0) {
        const { r = "" } = LiveRights[0];
        return r.split(",").indexOf(pbr.RestrictionsType.RA) === -1;
    }
    return false;
}

export const validCatchupStationIds = (channels: IChannel[]): string[] => {
    const validCatchupStationIds: string[] = [];

    channels.map((channel: IChannel) => {
        if (
            recentlyAiredRights(channel) &&
            !!channel.FirstCatchupStartUtc &&
            channel?.LastCatchupEndUtc &&
            Date.parse(channel?.LastCatchupEndUtc) > Date.now()
        ) {
            validCatchupStationIds.push(channel.StationId);
        }
    });

    return validCatchupStationIds;
};