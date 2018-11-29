import axios from 'axios'

/*

Reference data fields: code, id, label, type, uri, scheme

{
	code: "embargo",
	id: "access_type_embargo",
	label: {
		en: "Embargo",
		fi: "Embargo",
		und: "Embargo",
	},
	type: "access_type",
	uri: "http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo",
	scheme: "http://uri.suomi.fi/codelist/fairdata/use_category",
}

Schema expects:

{
	identifier (URI): required
	in_scheme (URI)
	pref_label (lang object)
	definition (lang object)
}

Fields with 'internal_code' set should be filtered out.
*/

const FILTER_FIELD = 'internal_code'
const FILTER_VALUE = "hide"

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
		`${apiUrl}/${index}/${doctype}/_search?size=200&pretty=1&filter_path=hits.hits._source`, {
			timeout: 5000,
			responseType: 'json',
		})
}

export function esApiSearchClient(index, doctype, searchterm, count) {
	const params = {
		size: count,
		pretty: 1,
		filter_path: 'hits.hits._source',
		q: searchterm
	}

	return axios.get(`${apiUrl}/${index}/${doctype}/_search`, {
		params,
		timeout: 5000,
		responseType: 'json',
	})
}

// Reduce callback function that takes a Elastic Search response.data.hits.hits array
// and transforms the API to schema format, filtering fields.
// We add a 'secondary' field for display purposes that should not be added into the data.
export function convertToSchemaFields(res, es) {
	if (!es._source || !es._source.uri || es._source[FILTER_FIELD]) return res

		es = es._source

		res.push({
			identifier: es.uri,
			secondary: es.code || es.id || null,
			pref_label: es.label,
		})
		return res
}

const sortById = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)

export function groupByParent(objectArray) {
	let grouped = objectArray.reduce(function(acc, obj) {
		if (!obj['_source']) return acc

			// get rid of the annoying _source level
			obj = obj['_source']

			// if a value doesn't have parent_ids, add it to empty key
			let targets = obj['parent_ids'] || ['']

			// group top categories with their children
			if (targets.length < 1) {
				targets = obj['has_children'] ? [obj.id] : ['']
			}

			for (let key of targets) {
				if (!acc[key]) {
					acc[key] = { group: null, children: [] }
				}
				if (obj.id === key) {
					// group item
					acc[key].group = obj
				} else {
					// child item
					acc[key].children.push(obj)
				}
			}
			return acc
	}, {})

	// pre-sort children
	Object.keys(grouped).forEach(group => grouped[group].children.sort(sortById))

	return grouped
}

export function filterKeys(full, wanted) {
	return Object.keys(full)
	.filter(key => wanted.includes(key))
	.reduce((obj, key) => {
		obj[key] = full[key]
		return obj
	}, {})
}
