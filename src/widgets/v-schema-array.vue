<template>
	<div style="border: 2px solid #dddddd; border-radius: 5px; padding: 0;">
		<!-- (array component) -->
		
		<div v-for="(child, index) in children" style="border-left: 2px solid #aaaaaa; padding-left: 1em; margin-left: 1em;">
			<component is="schema-selector" :schema="schemaForChild(index)" :path="newPath(index)" :value="value[index]" :parent="value" :property="index" :tab="myTab" @delete="deleteElement"></component>
		</div>
		
		<div style="background-color: #888888; color: #eeeeee; padding: 2px 1em; border-radius: 5px; border-top: 1px solid #333333;">
			array <button type="button" :disabled="this.children.length <= this.minimum" @click="doMinus">-</button> | <button type="button" :disabled="this.children.length >= this.maximum" @click="doPlus">+</button>
			(min: {{ minimum }} / max: {{ maximum || '-' }})
		</div>
		
	</div>
</template>

<script src="./v-schema-array.js"></script>
