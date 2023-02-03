import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getDataFromUDL } from '../../backend';
import { UserAccountInfo } from '../@types/Account';
import { GLOBALS } from '../utils/globals';
const useAccount = () => {
    useEffect(() => {
        if (__DEV__) {
            console.log("Use effect in useAccount triggered")
        }
    }, [])

    const getAccount = async () => {
        const udl = "udl://subscriber/account/";
        const response = await getDataFromUDL(udl);
        const accountInfo: UserAccountInfo = response.data;
        return accountInfo;
    }
    const { data: userAccountInfo } = useQuery('account', getAccount, {
        cacheTime: Infinity,
        staleTime: Infinity,
        retry: 5,
        enabled: !!GLOBALS.bootstrapSelectors && !!GLOBALS.store?.accessToken
    })

    useEffect(() => {
        if (!userAccountInfo) {
            return;
        }
        GLOBALS.userAccountInfo = userAccountInfo;
    }, [userAccountInfo])
    return userAccountInfo;
}

export default useAccount