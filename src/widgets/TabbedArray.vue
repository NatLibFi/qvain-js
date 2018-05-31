<template>
	<div>
		<!-- (tabbed-array component) -->

		<b-card no-body>
			<b-tabs card v-model="tabIndex">
				<b-tab :title="el && tabField && el[tabField] ? el[tabField] : `#${i + 1}`" v-for="(el, i) in value" :key="i">
					Tab Contents {{i}}<br/>
					(min: {{ minimum }} / max: {{ maximum || '-' }})<br/>
					title: {{ uiTitle }}<br/>
					description: {{ uiDescription }}<br/>
					label: {{ uiLabel }}<br/>
					<b-btn size="sm" variant="danger" class="float-right" :disabled="value.length <= minimum" @click="()=>closeTab(i)">Delete entry</b-btn>
					<b-btn size="sm" @click="tabIndex = 2">sel-2</b-btn>

					<component is="schema-tab-selector" :schema="schemaForChild(i)" :path="newPath(i)" :value="value[i]" :parent="parent[property]" :property="i" :tab="myTab" :activeTab="activeTab" :depth="depth" @delete="deleteElement"></component>
				</b-tab>

				<b-nav-item slot="tabs" :disabled="value.length >= maximum" @click.prevent="newTab" href="#">+</b-nav-item>

				<!-- no elements in array -->
				<div slot="empty" class="text-center text-muted">
					No people added
					<br> Add a new person using + button.
				</div>
			</b-tabs>
		</b-card>
		<!-- doPlus doMinus -->
	</div>
</template>

<script src="./TabbedArray.js"></script>
