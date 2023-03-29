const GlobalsConfig = (function () {
	let url = 'https://reachclient.prodb.skt.tv3cloud.com/';
	let stsUrl = '';
	let defaultLanguage = 'en-US';

	return {
		url: url,
		stsUrl: stsUrl,
	}
})();

const MFGlobalsConfig = GlobalsConfig;
export { MFGlobalsConfig };