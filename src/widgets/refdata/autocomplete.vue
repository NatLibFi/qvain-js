<template>
	<div>
		<!-- autocomplete widget -->

		<transition-group name="tags" tag="div">
			<b-badge :ref="`badge-${i}`" variant="secondary" class="p-1 m-1 animated-tag" v-for="(value, i) in values" :key="value.id" @mouseenter="hover" @mouseleave="unhover" @click="values.splice(i, 1)">{{ value.label[searchLanguage] || value.label['und'] }} <sup><i class="fas fa-times text-danger"></i></sup></b-badge>
		</transition-group>
		<b-input-group>
			<b-input v-model="input" @input="onInput" @change="onChange" @keyup.enter.native="addValue" :state="apiState"></b-input>
			<b-input-group-append>
				<b-dropdown :text="this.searchLanguage.toUpperCase()" v-if="this.languages.length > 1" @hidden="onInput">
					<b-dropdown-item v-for="lang in languages" @click="searchLanguage = lang">{{ lang | uppercase }}</b-dropdown-item>
				</b-dropdown>
				<b-btn @click="addValue">add</b-btn>
			</b-input-group-append>
		</b-input-group>

		<b-form-select v-model="selected" :options="suggestions" :select-size="selectSize" class="mb-3" @input="onSelected" v-show="isOpen" v-if="typeahead"/>
		input: {{ input }}
		values: {{ values }}

	</div>
</template>

<style>
.animated-tag {
	transition: all .5s;
	display: inline-block;
}
.tags-enter-active {
	transition: all .3s ease;
}
.tags-leave-active {
	/* transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0); */
	position: absolute;
	transition: all .5s ease-in;
}
.tags-enter {
	transform: translateX(10px);
	opacity: 0;
}
.tags-leave-to {
	transform: translateY(10px);
	opacity: 0;
}
</style>

<script src="./autocomplete.js"></script>
