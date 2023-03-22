import React from 'react';

export interface DetailsContextInterface {
    closePanel: () => void;
}

export const DetailsContext = React.createContext<DetailsContextInterface>({
    closePanel: () => { }
})