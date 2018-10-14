<template>
	<div class="container-fluid">
		<!-- Map widget -->

		<b-container fluid>
			<b-row class="my-1">
				<b-col sm="2"><label for="input-address">Address:</label></b-col>
				<b-col sm="10">
					<b-input-group :state="addressState">
						<b-form-input id="input-address" type="text" placeholder="type address..." v-model="address" @keyup.enter.native="getAddress"></b-form-input>
						
						<b-input-group-button slot="right">
							<b-btn @click="getAddress">search</b-btn>
						</b-input-group-button>
					</b-input-group>
				</b-col>
			</b-row>
			<b-row class="my-1">
				<b-col sm="2"></b-col>
				<b-col sm="2"><label for="input-latitude">latitude:</label></b-col>
				<b-col sm="3">
					<b-form-input id="input-latitude" type="text" disabled="disabled" v-model="coordinates.latitude"></b-form-input>
				</b-col>
				<b-col sm="2"><label for="input-longitude">longitude:</label></b-col>
				<b-col sm="3">
					<b-form-input id="input-longitude" type="text" disabled="disabled" v-model="coordinates.longitude"></b-form-input>
				</b-col>
			</b-row>
			<b-row align-h="center">
				<b-col sm="2"></b-col>
				<b-col sm="10">
					<b-embed type="iframe" aspect="16by9" :src="mapUrl"></b-embed>
					<iframe v-if="coordinates.latitude" width="300" height="170" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" :src="mapUrl" style="border: 1px solid gray;"></iframe>
					<!-- <br /><small><a href="https://maps.google.com/maps?q='+data.lat+','+data.lon+'&hl=es;z=14&amp;output=embed" style="color:#0000FF;text-align:left" target="_blank">See map bigger</a></small> //-->
				</b-col>
			</b-row>
			<b-row v-if="false" align-h="center">
				<b-col sm="2"></b-col>
				<b-col sm="10">
					<b-embed type="iframe" aspect="16by9" :src="mapUrl2"></b-embed>
					<iframe v-if="coordinates.latitude" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" :src="mapUrl2" style="border: 1px solid gray;"></iframe>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
import vSchemaBase from '../v-schema-base.vue'
import axios from 'axios'

function parseApiResults(json) {
	if (json['status'] !== "OK") return
	if (typeof json['results'] !== 'object') return
	if (typeof json['results'].length < 1) return
	if (typeof json['results'][0]['geometry']['location'] !== 'object') return
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
			let coords = typeof this.coordinates.latitude === 'number' && typeof this.coordinates.longitude === 'number' ? this.coordinates : this.defaultCoordinates
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
</script>
