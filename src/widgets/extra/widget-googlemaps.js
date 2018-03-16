import vSchemaBase from '../v-schema-base.vue'
import axios from 'axios'

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

export default {
	extends: vSchemaBase,
	name: 'widget-googlemaps',
	data: function() {
		return {
			address: "",
			addressResult: "",
			addressFound: false,
			addressError: "",
			addressState: null,
			xcoordinates: {
				longitude: undefined,
				latitude: undefined,
			},
			defaultCoordinates: {
				// Helsinki
				latitude: 60.1698556,
				longitude: 24.9383791,
			},
		}
	},
	methods: {
		getAddress: function() {
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
					//this.coordinates.latitude = coords.latitude
					//this.coordinates.longitude = coords.longitude
					//this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: this.coordinates })
					this.coordinates = coords
				}
			})
			.catch(error => {
				this.addressState = 'invalid'
				this.addressError = error
				console.log(error)
			})
		}
	},
	computed: {
		coordinates: {
			get () {
				//return this.$store.state.obj.message
				return this.value
			},
			set (value) {
				//this.$store.commit('updateMessage', value)
				this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: value })
			}
		},
		mapUrl: function() {
			//return "https://maps.google.com/maps?q=" + this.coordinates.latitude + "," + this.coordinates.longitude + "&hl=es;z=14&output=embed"
			var coords = typeof this.coordinates.latitude === 'number' && typeof this.coordinates.longitude === 'number' ? this.coordinates : this.defaultCoordinates
			return "https://maps.google.com/maps?q=" + coords.latitude + "," + coords.longitude + "&hl=es;z=14&output=embed"
		},
		mapUrl2: function() {
			//return "http://www.openstreetmap.org/#map=" + 5 + "/" + this.coordinates.latitude + "/" + this.coordinates.longitude
			return "http://staticmap.openstreetmap.de/staticmap.php?center=" + this.coordinates.latitude + "," + this.coordinates.longitude + "&zoom=14&maptype=mapnik"
		},
	},
	created() {
		//if (this.parent['longitude'] !== undefined) { this.coordinates.longitude = parent['longitude'] }
		//if (this.parent['latitude'] !== undefined) { this.coordinates.longitude = parent['latitude'] }
		/*
		if (typeof this.parent === 'object') {
			this.coordinates.longitude = parent['longitude']
			this.coordinates.latitude = parent['latitude']
		}
		console.log("parent:", this.parent, this.property, this.path, this)
		*/
		console.log("map widget")
	},
}
