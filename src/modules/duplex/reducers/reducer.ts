import { ReducerActions, createActionTypes, createReducer } from "../../../utils/redux-util";
import { State } from "../../../index";
import { StateSlice } from "./stateSlice";
import DuplexMessage from "../DuplexMessage";

/**
 * Reducer actions
 *
 * Synchronous actions which update current store slice
 *
 * Each action may or may not do update
 *
 * `this.draft`   - mutable current store slice, where changes should be done
 * `this.current` - immutable current store slice, which could be used for faster reads
 *                  note that update of `draft` is applied to `current` after action function is finished
 * `this.state`   - immutable application state, use it with selectors to get information
 *                  about application state
 */
export class DuplexMessagesReducerActions extends ReducerActions<StateSlice> {
    addMessage(message: DuplexMessage) {
        return { ...this.current,  'messages' :  this.current.messages[message.type] ? { ...this.current.messages , [message.type]: [...this.current.messages[message.type], message]} : { ...this.current.messages, [message.type] : [message] }  };

    }

    addContinuationToken(continuationToken: string){
        return { ...this.current, continuationToken }
    }
}

export const actions = new DuplexMessagesReducerActions();
export const reducer = createReducer(actions, (state: State) => state.duplex.messages);
export const actionTypes = createActionTypes<StateSlice, DuplexMessagesReducerActions>(actions);
