import axios from 'axios'

const apiUrl = function(str) {
	if (!str) {
		return "http://127.0.0.1"
	}

	if(str.substr(-1) === '/') {
		return str.substr(0, str.length - 1)
	}
	return str
}(process.env.VUE_APP_ES_API_URL)

if (!process.env.VUE_APP_ES_API_URL) {
	console.error("no ElasticSearch api url set; please define VUE_APP_ES_API_URL")
}

export default function esApiClient(index, doctype) {
	return axios.get(
		`${apiUrl}/${index}/${doctype}/_search?size=10000&pretty=1&filter_path=hits.hits._source`, {
			timeout: 5000,
			responseType: 'json',
		})
}

export function esApiSearchClient(index, doctype, searchterm) {
	return axios.get(
		`${apiUrl}/${index}/${doctype}/_search?q=${searchterm}&size=10000&pretty=1&filter_path=hits.hits._source`, {
			timeout: 5000,
			responseType: 'json',
		})
}
