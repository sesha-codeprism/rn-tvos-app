import axios from 'axios';
import { GLOBALS } from '../utils/globals';

export const DOMAIN: string =
  'https://ottapp-appgw-client-a.dev.mr.tv3cloud.com';

export const AxiosSecure = axios.create({
  withCredentials: true,
  headers: {
    Authorization: `OAUTH2 access_token="AuthToken1lZHLbpwwFIafZtiBfMEGFixI5qomqpROR2p3HvvM4AxgaptMyNPX0CatqkZqJev89ndu0u9qUBo6CWXtfe8WtFqQdTgWmlF3515YPyZ9b41KWpv4JyobM6hEmjYURTvnBrB_tDrv3u-YSn9Vyhpa4ZLntnFG9Imx50CvLgSCEAsyB62g89qP4Sobodsp34kWSo4EzkWRx6LIREyx4HEaWDzDiQUULeFJS9ip_6nejz2UVd83sD_8hg7kDe6hE50PUxWcxND46AFE05Z3u8Nqt4wqKc0wpzvhhRWPiazFxYqjCXYuUtSC0uKiu9mWsGAe8dmB_ceONQg_WNhYM_ShhaAiLxD5u7mtltY4c_I_v-DV3nyyl79jrzUNlG44Omn1EWy0sWGPC4tQWJUtyA1HlNOgJEV4UkxoxibFPA2SkjlJUTE9oqppzBXUq2nuzbVq8LWx-kV4bbp74S4lzREpGM5xmMgJYTlOOeOE5xhlBeXR6rnXFtzHrsScEppnDLHo1gZDQP2AOMtJFuAHGDeDViVLGeCTkjE5pRCnRQax4FkRUyiwyEPgx1O0va9uP20rwnjprRu_-sc7uJ65edg3OaIXuq7X22_s5Sa9svrLvl5yvEn71YKq7w"`,
    Cookie: `oauth=refresh_token="AuthToken1jZBda9swFIZ_jX1nY1v-vPCFm6SL15WxJaTQuxPpOFFjfUyS2_rfTzGlHYVBQbwSj54jHambGEdJsT07p21AuiC79cPgOHN50mDcHGttFIuFid0zoaOaWEyV8FLYWzuh-VRqnf1_xVX9MOkZBdj4VYxWgY6VOXn6Yn1kSVL4aQnOUDruZr-kI3Bx3ZcgsJXgwMBTTM9wMXBUvtcgTwQyDhculzvDzavmBu1P2aZlSUhaV0kRrgyCQ7ZAklZ1doUdpWqSrmdfOneNz5yil8sE0hqaOoKmgoikUEa5Z9ECr8yjN3s_a2w7rUfcH_5Bh-wd7lHC0gLDAabRhb8RRtH-6A-bfh3u-En2cq8uKJef__SAO5y_TZy1RV5gOjAaZUOOUd5UGEFZNRHBJoXaR3kcwu19t9ptu6wo28OpVtNu_X2jnEB98_Bnu5bJ3U1JjmV6eapXDzv12Bjy-CvIBhUQ9hc";access-token="AuthToken1lZHLbpwwFIafZtiBfMEGFixI5qomqpROR2p3HvvM4AxgaptMyNPX0CatqkZqJev89ndu0u9qUBo6CWXtfe8WtFqQdTgWmlF3515YPyZ9b41KWpv4JyobM6hEmjYURTvnBrB_tDrv3u-YSn9Vyhpa4ZLntnFG9Imx50CvLgSCEAsyB62g89qP4Sobodsp34kWSo4EzkWRx6LIREyx4HEaWDzDiQUULeFJS9ip_6nejz2UVd83sD_8hg7kDe6hE50PUxWcxND46AFE05Z3u8Nqt4wqKc0wpzvhhRWPiazFxYqjCXYuUtSC0uKiu9mWsGAe8dmB_ceONQg_WNhYM_ShhaAiLxD5u7mtltY4c_I_v-DV3nyyl79jrzUNlG44Omn1EWy0sWGPC4tQWJUtyA1HlNOgJEV4UkxoxibFPA2SkjlJUTE9oqppzBXUq2nuzbVq8LWx-kV4bbp74S4lzREpGM5xmMgJYTlOOeOE5xhlBeXR6rnXFtzHrsScEppnDLHo1gZDQP2AOMtJFuAHGDeDViVLGeCTkjE5pRCnRQax4FkRUyiwyEPgx1O0va9uP20rwnjprRu_-sc7uJ65edg3OaIXuq7X22_s5Sa9svrLvl5yvEn71YKq7w"`,
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
});

const requestHandler = (request: any) => {
  // request.headers['Authorization'] = `OAUTH2 access_token=\"${accessToken}\"`;
  // request.headers['Cookie'] = `oauth=refresh_token=\"${refreshToken}\";access-token=\"${accessToken}\"`;
  request.headers[
    'Authorization'
  ] = `OAUTH2 access_token="AuthToken1lZHLbpwwFIafZtiBfMEGFixI5qomqpROR2p3HvvM4AxgaptMyNPX0CatqkZqJev89ndu0u9qUBo6CWXtfe8WtFqQdTgWmlF3515YPyZ9b41KWpv4JyobM6hEmjYURTvnBrB_tDrv3u-YSn9Vyhpa4ZLntnFG9Imx50CvLgSCEAsyB62g89qP4Sobodsp34kWSo4EzkWRx6LIREyx4HEaWDzDiQUULeFJS9ip_6nejz2UVd83sD_8hg7kDe6hE50PUxWcxND46AFE05Z3u8Nqt4wqKc0wpzvhhRWPiazFxYqjCXYuUtSC0uKiu9mWsGAe8dmB_ceONQg_WNhYM_ShhaAiLxD5u7mtltY4c_I_v-DV3nyyl79jrzUNlG44Omn1EWy0sWGPC4tQWJUtyA1HlNOgJEV4UkxoxibFPA2SkjlJUTE9oqppzBXUq2nuzbVq8LWx-kV4bbp74S4lzREpGM5xmMgJYTlOOeOE5xhlBeXR6rnXFtzHrsScEppnDLHo1gZDQP2AOMtJFuAHGDeDViVLGeCTkjE5pRCnRQax4FkRUyiwyEPgx1O0va9uP20rwnjprRu_-sc7uJ65edg3OaIXuq7X22_s5Sa9svrLvl5yvEn71YKq7w"`;

  request.headers[
    'Cookie'
  ] = `oauth=refresh_token="AuthToken1jZBda9swFIZ_jX1nY1v-vPCFm6SL15WxJaTQuxPpOFFjfUyS2_rfTzGlHYVBQbwSj54jHambGEdJsT07p21AuiC79cPgOHN50mDcHGttFIuFid0zoaOaWEyV8FLYWzuh-VRqnf1_xVX9MOkZBdj4VYxWgY6VOXn6Yn1kSVL4aQnOUDruZr-kI3Bx3ZcgsJXgwMBTTM9wMXBUvtcgTwQyDhculzvDzavmBu1P2aZlSUhaV0kRrgyCQ7ZAklZ1doUdpWqSrmdfOneNz5yil8sE0hqaOoKmgoikUEa5Z9ECr8yjN3s_a2w7rUfcH_5Bh-wd7lHC0gLDAabRhb8RRtH-6A-bfh3u-En2cq8uKJef__SAO5y_TZy1RV5gOjAaZUOOUd5UGEFZNRHBJoXaR3kcwu19t9ptu6wo28OpVtNu_X2jnEB98_Bnu5bJ3U1JjmV6eapXDzv12Bjy-CvIBhUQ9hc";access-token="AuthToken1lZHLbpwwFIafZtiBfMEGFixI5qomqpROR2p3HvvM4AxgaptMyNPX0CatqkZqJev89ndu0u9qUBo6CWXtfe8WtFqQdTgWmlF3515YPyZ9b41KWpv4JyobM6hEmjYURTvnBrB_tDrv3u-YSn9Vyhpa4ZLntnFG9Imx50CvLgSCEAsyB62g89qP4Sobodsp34kWSo4EzkWRx6LIREyx4HEaWDzDiQUULeFJS9ip_6nejz2UVd83sD_8hg7kDe6hE50PUxWcxND46AFE05Z3u8Nqt4wqKc0wpzvhhRWPiazFxYqjCXYuUtSC0uKiu9mWsGAe8dmB_ceONQg_WNhYM_ShhaAiLxD5u7mtltY4c_I_v-DV3nyyl79jrzUNlG44Omn1EWy0sWGPC4tQWJUtyA1HlNOgJEV4UkxoxibFPA2SkjlJUTE9oqppzBXUq2nuzbVq8LWx-kV4bbp74S4lzREpGM5xmMgJYTlOOeOE5xhlBeXR6rnXFtzHrsScEppnDLHo1gZDQP2AOMtJFuAHGDeDViVLGeCTkjE5pRCnRQax4FkRUyiwyEPgx1O0va9uP20rwnjprRu_-sc7uJ65edg3OaIXuq7X22_s5Sa9svrLvl5yvEn71YKq7w"`;

  request.headers['User-Agent'] =
    'MediaKind (unknown version) CFNetwrok/1128 Darwin/19.6.0 (x86_64)';
  // request.headers['X-ClientConfig'] = "f=16;t=2";
  // request.headers['X-TV3-TransactionId'] = "00b43fd6fb408ff534b13d8317385c491f5ae9ec-1-1631859814100";
  return request;
};

const errorResponseHandler = (error: any) => {
  const errorResponse = error.response;
  // if the error status code is not 401 just retrun the error to the respective component 😑
  // Let component handle it 🤷🏼‍♂️
  if (errorResponse.status !== 401) {
    return Promise.reject(error);
  }
  console.log(
    '%cToken Expired 😥',
    'color: red',
    'while calling:',
    error.config.url,
  );
  if (!errorResponse.retrying) {
    errorResponse.retrying = true;
    return axios
      .post(`/api/v1/user/auth/refreshToken`, {
        refreshToken: refreshToken,
      })
      .then(res => {
        // Take the new ✨ assessToken and  💫 refreshToken, store them locally.
        console.log('%cGot new Tokens 🥳', 'color: green');
        if (__DEV__) {
          console.log({
            'Access Token': res.data.data.accessToken,
            'Refresh Token': res.data.data.refreshToken,
            'user ID': res.data.data.userId,
          });
        }
        GLOBALS.store.accessToken = res.data.data.accessToken;
        GLOBALS.store.refreshToken = res.data.data.refreshToken;
        error.response.config.headers['Authorization'] =
          'Bearer ' + res.data.data.accessToken;
        return axios(error.response.config);
      })
      .catch(error => {
        // IF getting refresh token fails. Ask the user to login again
        return Promise.reject(error);
      });
  } else {
    // This means this is the second try to get refreshToken.
    //Clear all data 🗑 and Kick the user to login screen now. 👻
    return Promise.reject(error);
  }
};

export const API = {
  login: `${DOMAIN}/Green/sts//oauth/signin/LIVEID?tenant=default&deviceId=c-c6114a92-6a0d55ba-294f0cd5ba&response_type=token&redirect_uri=https%3A%2F%2Freachclient.dev.mr.tv3cloud.com%2F%3Foauth%3DLIVEID%26tenant%3Ddefault%239wxtmga2d8o&deviceTypeV2=Web&deviceType=WebChrome`,

  getHubs: (groups: string, storeId: string, pivots: string, lang: string) =>
    AxiosSecure.get(`https://appgw-client-a.pprod.mr.tv3cloud.com/S120/discovery//v3/hubs?storeId=HubsAndFeeds-Tizen2&%24groups=1%2C4012526%2C4029018%2C4029510%2C2121342&pivots=Language%7Cen&%24lang=en-US
`),

  // getHubs: (groups: string, storeId: string, pivots: string, lang: string) => AxiosSecure.get(`${DOMAIN}/S1/discovery/v3/hubs?$groups=${groups}&storeId=${storeId}&pivots=${pivots}&$lang=${lang}`)
};
