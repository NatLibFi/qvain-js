import axios from 'axios'

const apiUrl = "https://pub.orcid.org/v2.1"
const apiResource = "record"

export default function orcidApiClient(orcid, apiResource) {
	return axios.get(
		`${apiUrl}/${orcid}/${apiResource}`, {
			timeout: 5000,
			responseType: 'json',
			// force application/json only, otherwise the orcid API returns an XML blob with mime type "application/vnd.orcid+xml"
			headers: {
				'Accept': 'application/json'
			}
	})
}
