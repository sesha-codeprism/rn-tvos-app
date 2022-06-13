import DuplexMessage from "../DuplexMessage";

export interface IStateSlice {
  messages: {
    [key: string]: DuplexMessage[];
  };
  continuationToken?: string;
}

export type StateSlice = IStateSlice;

export const initialState: StateSlice = { messages: {} };
