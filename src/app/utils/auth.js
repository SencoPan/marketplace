import axios from 'axios';

export function request(config) {
	const userToken = localStorage.getItem('userToken');

	const requestConfig = {...config};
	if (!requestConfig.headers) {
		requestConfig.headers = {};
	}

	if (userToken) {
		requestConfig.headers.authorization = `Bearer ${userToken}`;
	}

	return axios.request(requestConfig);
}

export function fetchToken() {
	axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('userToken')}`;
}

export function authed() {
	return !!localStorage.getItem('userToken');
}

export function setToken(token) {
	localStorage.setItem('userToken', token);
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function verify() {
	let authedCheck;

	const token = localStorage.getItem('userToken');
	try {
		authedCheck = token ? await axios.get(`/user/verifyJWT`) : false;
	} catch (e) {
		authedCheck = false;
	}

	return authedCheck ? authedCheck.data : false;
}
