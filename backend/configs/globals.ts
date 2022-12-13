const MFGlobalsConfig = (function(){
	this.url = 'https://reachclient.dev.mr.tv3cloud.com/';
	this.stsUrl = 'https://ottapp-appgw-client-A.dev.mr.tv3cloud.com/Green/sts/';

	const switchEnvironment = () => {
		
	}

	const setStsUrl = (url: string) => {
		this.stsUrl = url;
	}

	const reviveMFGlobalConfig = (serializedInstance: any) => {
		if(serializedInstance){
			this.url = serializedInstance?.url;
			this.stsUrl = serializedInstance?.stsUrl;
		}
		return this;
	}

	return {
		setters: {
			reviveMFGlobalConfig,
			switchEnvironment,
			setStsUrl,
		},
		environment: {
			url: this.url,
			stsUrl: this.stsUrl,
		}
	}
})();

export { MFGlobalsConfig };
