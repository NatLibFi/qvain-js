import axios from 'axios'

const API_BASE = "https://metax-test.csc.fi/rest/"
//const API_PROJECT_ROOT_URL = "https://metax-test.csc.fi/rest/directories/root"

var fileapi = axios.create({
	baseURL: 'https://metax-test.csc.fi/rest/',
	timeout: 1000,
	headers: {'User-Agent': 'qvain.js (axios)'},
	responseType: 'json'
})

//https://metax-test.csc.fi/rest/directories/files?project=project_x&path=/

fileapi.get('/directories/files', {
	params: {
		project: 'project_x',
		path: '/'
	}
)
