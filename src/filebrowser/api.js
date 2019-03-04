import axios from 'axios'

const apiBaseUrl = "/api/proxy"
const apiTimeout = 10000 // ms

const apiUrl = function(str) {
	if (!str) {
		return apiBaseUrl
	}

	if (str.substr(-1) === '/') {
		return str.substr(0, str.length - 1)
	}
	return str
}(process.env.VUE_APP_METAX_FILEAPI_URL)

let fileapi = axios.create({
	baseURL: apiUrl,
	timeout: apiTimeout,
	headers: {'User-Agent': 'qvain.js (axios)'},
	responseType: 'json',
})

//https://metax-test.csc.fi/rest/directories/files?project=project_x&path=/

fileapi.get('/files', {
	params: {
		project: 'project_x',
		path: '/',
	},
})
