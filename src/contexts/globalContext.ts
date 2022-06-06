import { createContext } from 'react';
import { UserProfile } from "../@types/UserProfile";


export interface GlobalProps {
    userProfile: UserProfile | undefined,
    setProfile: (userProfile: UserProfile) => void;
}

export const GlobalContext = createContext<any>({});
