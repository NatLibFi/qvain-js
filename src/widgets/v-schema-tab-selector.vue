<template>
	<div>
		<!-- schema-tab-selector -->
		<div v-if="showWidgets">
			<p>ui widgets</p>
			<select v-model="customWidget">
				<option v-for="(constructor, name) in this.$options.components" :key="constructor">{{ name }}</option>
			</select>
		</div>

		<div v-if="showTypeSelector">
			<p>this schema has multiple possible types; please choose one</p>
			<select v-model="dataType">
				<option disabled value="">Please select one</option>
				<option v-for="type in possibleTypes" :key="type">
					{{ type }}
				</option>
			</select>
		</div>
		
		<!-- actual component -->
		<!-- keep-alive -->
		<component v-if="activeTab === myTab" :class="[ activeTab === myTab ? 'righttab': 'wrongtab']" :is="widget" v-bind="widgetProps" :schema="schema" :path="path" :value="parent[property]" :valtype="dataType" :parent="parent" :property="property" :tab="myTab" :activeTab="activeTab" :depth="newdepth" v-on="$listeners">
			<p>{{ dataType }}</p>
		</component>
		<skip v-else :schema="schema" :path="path" :value="parent[property]" :valtype="dataType" :parent="parent" :property="property" :tab="myTab" :activeTab="activeTab" :depth="depth" v-on="$listeners"></skip>
		<!-- <div style="color: #eeeeee;">hidden myTab: {{ myTab }} {{ typeof myTab }} tab: {{ tab }} {{ typeof tab }} active: {{ activeTab }} {{ typeof activeTab }}</div> -->
		
	</div>
</template>

<script src="./v-schema-tab-selector.js"></script>
