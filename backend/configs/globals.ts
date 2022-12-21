const GlobalsConfig = (function(){
	let url = 'https://reachclient.dev.mr.tv3cloud.com/';
	let stsUrl = 'https://ottapp-appgw-client-A.dev.mr.tv3cloud.com/Green/sts/';
    

	return {
			url: url,
			stsUrl: stsUrl,
	}
})();

const MFGlobalsConfig = GlobalsConfig;
export { MFGlobalsConfig };
