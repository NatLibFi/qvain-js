<template>
	<div id="filter">
		<form>
			Show records that...
			<input type="checkbox" name="created" value="created"/>
			Show records that I own:
			
			<input type="checkbox" id="own_all" name="own_all" v-model="allChecked" v-on:click="toggleAllPerms">
				<label for="own_all">all</label>
			&nbsp;|&nbsp;
			<input type="checkbox" id="own_usr" name="own_usr" value="usr" v-model="checkedOwnership">
				<label for="own_all">myself</label>
			shared with me:
			<input type="checkbox" id="own_grp" name="own_grp" value="grp" v-model="checkedOwnership">
				<label for="own_all">group</label>
			<input type="checkbox" id="own_org" name="own_org" value="org" v-model="checkedOwnership">
				<label for="own_all">organisation</label>

			<div class="debugging" style="display: none;">
			myUid: {{ myUid }}; myGroups: {{ myGroups }}; wanted: {{ checkedOwnership }}; sortByField: {{ sortByField }}
			</div>
			<div style="display: none;"><!-- in HTML5 every button is a submit button by default, which will reload the page, so set the type parameter -->
				<button type="button" v-on:click="sortByDate">sort by date</button> <button type="button" v-on:click="sortRecords">sort by</button> <button type="button" :title="autoFetch ? 'disabled; use the checkboxes' : 'fetch records'" v-bind:disabled="autoFetch" v-on:click="fetchByOwnertype">fetch</button>
				<button id="c1" class="btn" v-on:click="sortByDate">test</button> <button id="c2" class="btn" v-on:click="sortByDate">test</button> <button id="c3" class="btn" v-on:click="sortByDate">test</button> <button id="c4" class="btn" v-on:click="sortByDate">test</button>
				<hr/>
			</div>
		</form>
		<div v-for="record in records" style="display: none;">
		{{ record.id }} – {{ record.title }} – {{ record.owner }} <button type="button" class="toggle-more" v-bind:id="'toggle-' + record.id">…</button>
		<span v-bind:id="'toggle-' + record.id + '-text'" class="expandable">created: <time :datetime="record.created">{{ record.created | formatDate }}</time></span>
		</div>

		<p style="display: none;">filtered:</p>
		<table v-if="filteredRecords.length" class="table" id="record-list">
			<thead>
				<tr>
					<th v-for="column in tableColumns">
						<a v-on:click="sortByField = column.field; sortRecords()" style="color: #002233;">{{ column.header }} <i class="fa fa-sort" style="color: #004466;"></i></a>
					</th>
				</tr>
			</thead>
			<tbody is="transition-group" name="record-list">
				<tr v-for="record in records" :key="record.id" v-on:click.capture="$router.push({ name: 'editor', params: { id: record.id}})">
					<td v-for="column in tableColumns">
						<!-- <xrouter-link :to="{ name: 'editor', params: { id: record.id }}">{{ record.id }}</xrouter-link> -->
						{{ record[column.field] }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script src="./v-lister.js"></script>
