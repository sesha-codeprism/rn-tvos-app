export interface HubsList {
  hubGroup1: HubObject[];
  hubGroup2: HubObject[];
}

export interface HubObject {
  source: string;
  label: string;
  width: number;
  height: number;
  color: string;
  variant: string;
  focusColor: string;
}
