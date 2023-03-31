const GlobalsConfig = (function () {
	let url = 'https://reachclient.prodb.skt.tv3cloud.com/';
	let stsUrl = '';
	let defaultLanguage = 'en-US';
	const config = {
		//For SKT prodb:

		inhomeDetection: {
        inHomeDefault: false,
        connectionUrl: "mediafirst.bsm.esb-qa.sasktel.com",
        inHomeApiEndpoint:
            "/rest/ST_Process_MaxProvisioning/REST/DeviceInHome/{accountId}?jsonFormat=stream",
        useSubscriberInHome: false,
    	}

		//For Dev and Tmo:

		// inhomeDetection: {
		// 	inHomeDefault: false,
		// 	connectionUrl: "mkinhome.azurewebsites.net",
		// 	inHomeApiEndpoint: "/v1/ihd/users/userAccount/{accountId}/isInHome",
		// 	useSubscriberInHome: false,
		// },
	}

	return {
		url: url,
		stsUrl: stsUrl,
		config:config,
	}
})();

const MFGlobalsConfig = GlobalsConfig;
export { MFGlobalsConfig };