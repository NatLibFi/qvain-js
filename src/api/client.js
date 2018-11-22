import axios from 'axios'

const apiBaseUrl = "/api"

const apiUrl = function(str) {
	if (!str) {
		return apiBaseUrl
	}

	if (str.substr(-1) === '/') {
		return str.substr(0, str.length - 1)
	}
	return str
}(process.env.VUE_APP_QVAIN_API_URL)


/*
 * API errors look like this:
 *
 * {
 *   "msg": "some horrible error occured and a kitten has died",
 *   "code": "400"
 * }
 *
 * Fields:
 *
 * `msg`: error text
 * `code`: HTTP status code, 4xx or 5xx
 *
 * Some errors might have these extra fields:
 *
 * `help`: longer description, specifically meant for end users
 * `url`: link to a location that provides more information
 *
 * If you can connect to the API server at all, the most likely error is database related;
 * the UI is unlikely to show anything that doesn't exist or the user doesn't have permission for.
 */

const client = axios.create({
	baseURL: apiUrl,
	timeout: 5000,
	responseType: "json",
})

const addDataset = dataset => {
	return client.post("/datasets/", {
		dataset,
		type: 2,
		schema: "metax-ida"
	});
}

const updateDataset = id => dataset => {
	return client.put("/datasets/" + id, {
		dataset,
		type: 2,
		schema: "metax-ida",
		id
	});
}

const getDataset = id =>
	client.get('/datasets/' + id);

export default {
	client,
	addDataset,
	updateDataset,
	getDataset
};


