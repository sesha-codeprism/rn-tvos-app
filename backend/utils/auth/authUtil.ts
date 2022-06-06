export const addAuthToken = (token: string | null): {Authorization: string} => {
	const authToken = 'OAUTH2 access_token="' + token + '"';
	return {
		Authorization: authToken,
	};
};
