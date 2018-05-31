<template>
	<div>
		<!-- ElasticSearch widget -->
		<b-form-group id="fundertype-form-group" horizontal :label-cols="4" breakpoint="md" :description="uiDescription" :label="uiLabel">
			<!-- b-alert :show="!!error" variant="danger">error contacting reference data API server: {{ error }}</b-alert -->
			<b-input-group>
				<b-form-select v-model="selected" v-if="optgroups">
					<option :value="null" disabled>{{ uiPlaceholder }}</option>
					<option v-for="(child, childIndex) in noGroupItems" :key="child.id" :value="child" v-if="child !== null">{{ child.label[lang] || child.label['und'] }} [{{ child.code }}]</option>
					<optgroup v-for="(groupid, index) in groups" v-if="groupid !== null" :key="groupid" :label="items[groupid].group.label[lang]">
						<option v-for="(child, childIndex) in items[groupid].children" :key="child.id" :value="child" v-if="child !== null">{{ child.label[lang] || child.label['und'] }} [{{ child.code }}]</option>
					</optgroup>
				</b-form-select>
				<b-form-select v-model="selected" v-else> <!-- class="mb-1" -->
					<option :value="null" disabled>{{ placeholder }}</option>
					<option v-for="item in items" :key="item.id" :value="item">{{ item.label[lang] || item.label['und'] }} [{{ item.code }}]</option>
				</b-form-select>
				<b-input-group-append>
					<b-btn variant="danger" ref="refErrorButton" id="refdata-error-btn" v-b-tooltip.hover="error" v-if="error"><i class="fas fa-exclamation-triangle"></i></b-btn>
					<b-btn variant="dark" v-b-tooltip.hover="error" title="retry" v-if="error" @click="getList(esIndex, esDoctype)">
						<i class="fas fa-sync" v-if="!busy"></i>
						<i class="fas fa-sync fa-spin" v-if="busy"></i>
					</b-btn>
					<b-btn variant="secondary" v-b-popover.hover="ui['help']" title="help"><span class="fas fa-question-circle"></span></b-btn>
				</b-input-group-append>
				<b-popover target="refdata-error-btn" triggers="hover click" class="error-popover">
					<template slot="title">
						<b-btn variant="dark"><i class="fas fa-sync"></i></b-btn>
						<b-btn class="close" aria-label="Close">
							<span class="d-inline-block" aria-hidden="true">&times;</span>
						</b-btn>
					Error
					</template>
					<b-alert variant="danger" show>
						{{ error }}
					</b-alert>
				</b-popover>
			</b-input-group>
		</b-form-group>
	</div>
</template>

<style>
.popover {
	color: red;
}
.error-popover {
	background-color: red;
}
</style>

<script src="./list.js"></script>
