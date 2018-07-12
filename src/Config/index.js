import axios from 'axios'

// SET API Server
export const API = {
	base: "http://worldenergystation.com/barkodo/index.php/barkodo_api/api"
	//base: "http://192.168.1.85:8888/Barkodo/api/V1/"
	// base: 'http://localhost:8888/Barkodo2/index.php/response'
};

// SET Theme Color Applicationƒ
export const Bakodo_Color = '#B7A5EF'
export const Loading_Color = '#6E69CC'
export const getAPI = async (name, params) => {
	const url = 'http://www.worldenergystation.com/barkodo/index.php/response'
	const option = {
		headers: {
			'Content-Type': 'application/json'
		},
		timeout: 10000
	}
	const body = {
		'name': name,
		'params': params
	}
	return await axios.post(url, body, option)
}

export const getAPIPromise = (name, params) => {
	const url = 'http://www.worldenergystation.com/barkodo/index.php/response'
	const option = {
		headers: {
			'Content-Type': 'application/json'
		},
		timeout: 10000
	}
	const body = {
		'name': name,
		'params': params
	}
	return axios.post(url, body, option)
}
