<template>
	<div>
		<!-- Map widget -->

		<b-container fluid>
			<b-row class="my-1">
				<b-col sm="2"><label for="input-address">{{ ui['label'] || "coordinates" }}</label></b-col>
				<b-col sm="10">
					<b-input-group :state="addressState" :description="ui['description']" :label="ui['label']">
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

<script src="./widget-googlemaps.js"></script>
