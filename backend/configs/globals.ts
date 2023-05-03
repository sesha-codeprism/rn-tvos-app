const GlobalsConfig = (function () {
	//let url = 'https:/ / reachclient.dev.mr.tv3cloud.com / ';
	let url = "https://reachclient.prodb.skt.tv3cloud.com/";
	let stsUrl = '';
	let defaultLanguage = 'en-US';
	let deviceType = "AppleTV";

	const config = {
		//For SKT prodb:

		inhomeDetection: {
			inHomeDefault: false,
			connectionUrl: "mediafirst.bsm.esb-qa.sasktel.com",
			inHomeApiEndpoint:
				"/rest/ST_Process_MaxProvisioning/REST/DeviceInHome/{accountId}?jsonFormat=stream",
			useSubscriberInHome: false,
		},

		//For Dev and Tmo:

		// inhomeDetection: {
		// 	inHomeDefault: false,
		// 	connectionUrl: "mkinhome.azurewebsites.net",
		// 	inHomeApiEndpoint: "/v1/ihd/users/userAccount/{accountId}/isInHome",
		// 	useSubscriberInHome: false,
		// },
		bitrates10ft: [
			{
				localizedText: "str_bitrate_option_0",
				id: "7040",
				icon: "quality_best",
				default: true,
			},
			{
				localizedText: "str_bitrate_option_1",
				id: "4324",
				icon: "quality_better",
			},
			{
				localizedText: "str_bitrate_option_2",
				id: "3250",
				icon: "quality_good",
			},
		]
	}

	return {
		url: url,
		stsUrl: stsUrl,
		config: config,
		deviceType: deviceType,
		defaultLanguage: defaultLanguage
	}
})();

const MFGlobalsConfig = GlobalsConfig;
export { MFGlobalsConfig };