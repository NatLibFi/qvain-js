import axios from 'axios'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

const API_URL = "https://metax-test.csc.fi/rest/v1/datasets/"

const fields = [
	{ label: "id",      key: "id",      sortable: true },
	{ label: "title",   key: "title",   sortable: true },
	{ label: "owner",   key: "owner",   sortable: true },
	{ label: "created", key: "created", sortable: true, formatter: 'friendlyDate' },
]

const records = [
	{
		id: "613",
		title: "Corine maanpeite 2006",
		owner: "Wouter Van Hemel",
		uid: "053bffbcc41edad4853bea91fc42ea18",
		created: "2017-10-12T07:16:14.573889",
	},
	{
		id: "612",
		title: "Vanhan rakennuslain mukaisesti vahvistettujen yleiskaavojen rasterit",
		owner: "Wouter Van Hemel",
		uid: "053bffbcc41edad4853bea91fc42ea18",
		created: "2017-10-12T07:16:13.185609",
	},
]

const myGroups = [
	{
		id: "053bffbcc41edad4853bea91fc42ea18",
		name: "Wouter's project group",
	},
	{
		id: "053bffbcc41edad4853bea91fc42ea18",
		name: "Treehuggers' Project",
	},
]

const AUTH_UID = "053bffbcc41edad4853bea91fc42ea18"

/*	
function parseApiResults(json) {
	if (json['status'] !== "OK") return;
	if (typeof json['results'] !== 'object') return;
	if (typeof json['results'].length < 1) return;
	if (typeof json['results'][0]['geometry']['location'] !== 'object') return;
	let coords = json.results[0].geometry.location
	return {
		latitude: coords['lat'],
		longitude: coords['lng'],
	}
}
*/

export default {
	name: "record-lister",
	data: function() {
		return {
			fields: fields,
			records: records,
			ownerSelect: null,
			filterString: null,
			myGroupsOptions: [],
			recordSource: {
				local: false,
				metax: false,
			},
		}
	},
	methods: {
		getAddress: function() {
			/*
			axios.get('http://maps.google.com/maps/api/geocode/json', {
				params: {address: this.address},
			 timeout: 3000,
			 responseType: 'json',
			})
			.then(response => {
				//this.sources = response.data.sources;
				this.addressState = 'valid'
				this.addressError = ""
				let coords = parseApiResults(response.data)
				console.log("coords:", coords)
				if (coords) {
					this.coordinates.latitude = coords.latitude
					this.coordinates.longitude = coords.longitude
					this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: this.coordinates })
				}
			})
			.catch(error => {
				this.addressState = 'invalid'
				this.addressError = error
				console.log(error)
			})
			*/
		},
		getGroups: function() {
			this.myGroupsOptions = []
			myGroups.forEach(
				grp => {
					this.myGroupsOptions.push({
					text: grp.name,
					value: grp.id,
				})
			})
		},
		friendlyDate: function(iso) {
			return distanceInWordsToNow(iso)
		},
		filterTitles: function(item) {
			if (!this.filterString) return true // don't filter null.toString()
			//let regex = new RegExp('.*' + this.filterString + '.*', 'ig')
			let regex = this.filterRegExp
			const test = regex.test(item.title)
			regex.lastIndex = 0
			return test
		},
		fetch: function(source) {
			this.toggleSource(source)
		},
		toggleSource: function(source) {
			Object.keys(this.recordSource).forEach(x => this.recordSource[x] = x === source)
		},
	},
	computed: {
		authUid: function() {
			return AUTH_UID
		},
		filterRegExp: function() {
			return new RegExp('.*' + this.filterString + '.*', 'ig')
		},
	},
	created: function() {
		this.getGroups()
		this.ownerSelect = AUTH_UID
	},
}
