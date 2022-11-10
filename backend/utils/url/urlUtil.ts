export const parseUri = (uri: string) => {
	if (uri.length > 0 && uri.charAt(uri.length - 1) === '/') {
		return uri.substring(0, uri.length - 1);
	}
	return uri;
};

export const getUrlParts = (url: string) => {
	if (typeof url !== 'string') {
		return;
	}

	const pattern = RegExp('^(([^:/?#]+):)?((//)?([^/?#:]*)(:([^/?#]*))?)?([^?#]*)(\\?([^#]*))?(#(.*))?');
	let matches = url.match(pattern) || [];

	return {
		href: url || '',
		host: matches[5] || '',
		port: matches[7] || '',
		hash: matches[11] || '',
		path: matches[8] || '',
		protocol: matches[1] || '',
		query: matches[9] || '',
	};
};

export const removeIdFromUri = (uri: string): string => {
	let feedURI = uri?.split("/");
	feedURI?.pop();
	return feedURI?.join("/");
};

export const getBaseURI = (uri: string): string => {
	return uri?.replace(/\/$/, "").split("/").slice(0, 4).join("/");
};

export const getQueryParams = (query: string) => {
	let params: any = {};

	if (query) {
		if (query.charAt(0) === '?') {
			query = query.substring(1);
		}

		let parts = query.split('&');

		if (parts) {
			for (let i = 0; i < parts.length; i++) {
				if (parts[i]) {
					let keyValue = parts[i].split('=');
					if (keyValue.length === 2) {
						if (keyValue[0] === 'title' || keyValue[0] === 'startUtc' || keyValue[0] === 'endUtc') {
							keyValue[1] = decodeURIComponent(decodeURIComponent(keyValue[1]));
						}
						params[keyValue[0]] = keyValue[1];
					} else if (keyValue.length === 1) {
						params[keyValue[0]] = '';
					}
				}
			}
		}
	}

	return params;
};
