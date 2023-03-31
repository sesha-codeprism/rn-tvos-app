enum  MKPTrackTypeEnum {
    none = 0,
    text,
    thumbnail,
    audio
}

export type MKPTrackType = typeof MKPTrackTypeEnum;

type MKPTrack = {
    url:  URL,
    label: string,
    identifier: string,
    defaultTrack: boolean, // If set to YES, this track would be considered as default.
    type: MKPTrackType
}

export type MKPSubtitleTrack = MKPTrack & {
    language: string, // The IETF BCP 47 language tag associated with the subtitle track.
};

export type MKPAudioTrack =  MPTrack & {
    language: string, // The IETF BCP 47 language tag associated with the subtitle track.
}