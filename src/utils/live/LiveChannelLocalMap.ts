import { each } from "lodash";

export class LiveChannelLocaleMap {
    private readonly locale: string; // "All" means single store.
    private readonly liveChannelIndexMap: number[]; // index array.  Each index maps to the live channel in LiveChannelMap with the corresponding index.
    private readonly stationTypes: string[];
    private readonly genres: {
        [key: string]: Genre;
    } = {};

    constructor(locale: string) {
        this.locale = locale;
        this.liveChannelIndexMap = [];
        this.stationTypes = [];
        this.genres = {};
    }

    public addChannel(index: number): boolean {
        if (this.liveChannelIndexMap.indexOf(index) > -1) {
            return false;
        } else {
            this.liveChannelIndexMap.push(index);
            return true;
        }
    }

    public addStationType(stationType: string | undefined): boolean {
        if (!stationType || this.stationTypes.indexOf(stationType) > -1) {
            return false;
        } else {
            this.stationTypes.push(stationType);
            return true;
        }
    }

    public addGenres(genres: Genre[]): void {
        each(genres, (element: Genre, index: number, list: Genre[]) => {
            if (!this.genres[element.Id]) {
                this.genres[element.Id] = element;
            }
        });
    }

    public getLocale(): string {
        return this.locale;
    }

    public getLiveChannelIndexMap(): number[] {
        return this.liveChannelIndexMap;
    }

    public getStationTypes(): string[] {
        return this.stationTypes;
    }

    public getGenres(): {
        [key: string]: Genre;
    } {
        return this.genres;
    }
}