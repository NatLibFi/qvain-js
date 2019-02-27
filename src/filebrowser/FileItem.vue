<template>
  	<b-card class="rounded-0" no-body>
    	<b-card-body class="d-flex py-1 align-items-center">
      		<font-awesome-icon :icon="icon" size="2x" class="mr-4 text-muted"/>
			<div class="py-2">
				<div class="d-flex">
					<h6 class="mb-0">
						{{single.name}}
						<span v-if="secondary" class="text-muted m-0 font-italic">{{secondary}}</span>
					</h6>
				</div>
				<p class="my-2">
					<font-awesome-icon
						v-b-tooltip.hover
						title="Title"
						:icon="icons.faPencilAlt"
						:class="single.title ? 'text-primary' : 'text-secondary'"
						class="mr-2" />
					<font-awesome-icon
						v-b-tooltip.hover
						class="mr-2"
						:icon="icons.faTag"
						title="Use Category"
						:class="single.use_category ? 'text-primary' : 'text-secondary'" />
				</p>
			</div>
			<b-btn-group class="ml-auto">
				<b-btn variant="primary" class="px-3 py-2" v-b-toggle="single.identifier">
					<font-awesome-icon :icon="icons.faPen"/>
				</b-btn>
				<b-btn variant="danger" class="px-3 py-2" @click="$emit('delete', { type, fields: single })">
					<font-awesome-icon :icon="icons.faTrash"/>
				</b-btn>
			</b-btn-group>
    	</b-card-body>
		<b-collapse :id="single.identifier" accordion="file-accordion" class="mt-2" :style="{'padding': '20px', 'padding-top': '0px'}">
			<b-form-group class="my-1" label="Title" key="title" horizontal lable-for="title">
				<b-form-input class="qvain-input" id="title" placeholder="Title" v-model="single.title"></b-form-input>
			</b-form-group>

			<b-form-group class="my-1" label="Description" key="description" horizontal lable-for="description">
				<b-form-input class="qvain-input" id="description" placeholder="Description" v-model="single.description"></b-form-input>
			</b-form-group>

			<RefList
				esDoctype="use_category"
				placeholder="use category"
				help="help text"
				uiLabel="Use category"
				:value="single.use_category"
				:setValue="v => {
					single.use_category = {
						in_scheme: v.in_scheme,
						identifier: v.identifier,
						pref_label: v.pref_label,
					}
				}"
				type="multiselect"
				:customLabel="(item) => item['pref_label'] ?
					item['pref_label']['en'] ||
					item['pref_label']['fi'] ||
					item['pref_label']['und'] ||
					'(no label)' : item['identifier']"
					isRequired>
			</RefList>

			<RefList v-if="type === 'files'"
				esDoctype="file_type"
				placeholder="file type"
				type="multiselect"
				help="help text"
				uiLabel="File Type"
				:value="single.file_type"
				:setValue="v => {
					single.file_type = {
						in_scheme: v.in_scheme,
						identifier: v.identifier,
						pref_label: v.pref_label,
					}
				}"
				:customLabel="(item) => item['pref_label'] ?
					item['pref_label']['en'] ||
					item['pref_label']['fi'] ||
					item['pref_label']['und'] ||
					'(no label)' : item['identifier']">
			</RefList>
		</b-collapse>
  	</b-card>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import RefList from '@/widgets/refdata/list-ui'
import RealRefList from '@/components/ReferenceData.vue'

import {
	faTrash,
	faPen,
	faPencilAlt,
	faTag
} from "@fortawesome/free-solid-svg-icons";

export default {
	name: "SingleObject",
	components: {
		FontAwesomeIcon,
		RefList,
		RealRefList,
	},
	props: [
		"icon",
		"secondary",
		"single",
		"removeItem",
		"type"
	],
	data() {
		return {
			icons: {
				faPen,
				faTrash,
				faPencilAlt,
				faTag
			}
		};
	},
};
</script>

<style>
.form-group {
	margin-bottom: 0;
}
.qvain-input {
	border-top: 0px;
	border-left: 0px;
	border-right: 0px;
	border-radius: 0px;
}
</style>
