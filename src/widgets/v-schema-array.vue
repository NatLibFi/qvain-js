<template>
	<div no-style="border: 2px solid #dddddd; border-radius: 5px; padding: 0;">
		<!-- (array component) -->

		<h2>{{ uiTitle }}</h2>

		<p v-if="uiDescription">{{ uiDescription }}</p>

		<b-form-group id="" :label-cols="4" :description="uiDescription" :label="uiLabel" :horizontal="true">
		<div style="border: 2px solid #eeeeee; border-radios: 5px; padding-top: 5px;">
			<div v-for="(child, index) in children" :key="index" style="border-left: 2px solid #aaaaaa; padding-left: 1em; margin-left: 1em;">
				<component is="schema-tab-selector" :schema="schemaForChild(index)" :path="newPath(index)" :value="value[index]" :parent="parent[property]" :property="index" :tab="myTab" :activeTab="activeTab" :depth="depth" @delete="deleteElement"></component>
			</div>
			<div style="background-color: #999999; color: #eeeeee; padding: 2px 1em; border-radius: 5px; border-top: 1px solid #333333;">
				list <button type="button" :disabled="this.children.length <= this.minimum" @click="doMinus">-</button> | <button type="button" :disabled="this.children.length >= this.maximum" @click="doPlus">+</button>
				(min: {{ minimum }} / max: {{ maximum || '-' }})
			</div>
		</div>
		</b-form-group>

	</div>
</template>

<script src="./v-schema-array.js"></script>
