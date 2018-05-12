<template>
	<div>
		<div class="mx-2 my-3 row">
			<b-button-toolbar aria-label="Fetch toolbar">
				<b-button-group size="sm" class="mx-1">
					<b-btn v-b-tooltip.hover.bottom title="create new record">new</b-btn>
					<b-btn v-b-tooltip.hover.bottom title="edit a record">edit</b-btn>
				</b-button-group>
				
				<b-input-group size="sm" class="mx-1" left="owner">
					<b-form-select size="sm" v-model="ownerSelect" v-b-tooltip.hover.bottom title="select record owner">
						<template slot="first">
							<option :value="$auth.user.id" selected>myself</option>
						</template>
						<optgroup label="groups">
							<option v-for="(option, idx) in myGroupsOptions" :value="option.value" :disabled="option.disabled" :key="`option_${idx}_opt`" v-html="option.text"></option>
						</optgroup>
					</b-form-select>
					<b-input-group-button slot="right">
						<b-btn :pressed.sync="recordSource['local']" @click="fetch('local')" v-b-tooltip.hover.bottom title="show in-progress records">in progress</b-btn>
						<b-btn :pressed.sync="recordSource['metax']" @click="fetch('metax')" v-b-tooltip.hover.bottom title="show records awaiting approval">published</b-btn>
					</b-input-group-button>
				</b-input-group>
				
				<b-input-group size="sm" class="mx-1" left="search" v-b-tooltip.hover.bottom title="search titles">
					<b-form-input v-model="filterString" placeholder="title" />
				</b-input-group>

				<busy-button size="sm">save</busy-button>

			</b-button-toolbar>
		</div>
		
		<div class="m-2">
			<b-table id="dataset-list" class="m-1" tbody-class="dataset-list" striped hover show-empty :items="records" :fields="fields" :filter="filterTitles">
				<template slot="owner" slot-scope="data">
					<span v-b-tooltip.hover.auto :title="data.item.uid">{{ data.item.owner }}</span>
				</template>
				<template slot="state" slot-scope="data">
					<preservation-state v-if="data.item.state" :state="data.item.state">state</preservation-state>
				</template>
			<!--
				<template slot="created" slot-scope="data">
					<span v-b-tooltip.hover.auto :title="data.item.created">{{ friendlyDate(data.item.created) }}</span>
				</template>
			-->
			</b-table>
		</div>
		
	</div>
</template>

<style>
	.dataset-list-enter, .dataset-list-leave-active {
		display: none;
		/* transition: all 1s; */
		/* transition: fade 1s; */
		transition: fade 1s;
	}
	.dataset-list-enter-active {
		transition: transform 0.5s;
	}
	.dataset-list-move {
		transition: transform 0.5s;
	}
</style>

<script src="./RecordList.js"></script>
