<template>
	<div class="container-fluid">
		<b-form-select v-model="selectedSchema" :options="getTestSchemaNames()" class="mb-3"></b-form-select>
		
		<b-alert variant="info" show>
			selected schema:
			<div v-if=selectedSchema>
				<code>{{ selectedSchema }}</code>
			</div>
			<div v-else>
				<i>none</i>
			</div>
		</b-alert>
		
		<h1 style="margin-top: 1em;">form generator</h1>
		
		<h2>test data</h2>
		<textarea name="textarea" rows="8" cols="80" placeholder="test data here" v-model="testdata"></textarea><br/>
		<button type="button" @click="parseJson()">set</button><br/>
		<b-alert variant="danger" :show="dataParseError.length">error: {{ dataParseError }}</b-alert><br/>

		<!-- <h2>schema root</h2> -->
		<!-- type: {{ schemaJson.type }} -->
		<!-- schema :schema="schemaJson" path="" name="/" :value="value" v-on:validateParent="cuckoo" --><!-- /schema -->

		<hr/>
		<h2>schema root</h2>
		<component :is="schema-selector" :schema="schemaJson" path="" name="/" :value="this.$store.state.record" parent=""></component>
		
	</div>
</template>

<script>
import userdb from './userdb.js'
import recorddb from './recorddb.js'

var apiURL = 'https://api.github.com/repos/vuejs/vue/commits?per_page=3&sha='
var currentUid = "069"
var ALLPERMS = ['usr', 'grp', 'org']

var makeToggles = function() {
	var toggles = document.getElementsByClassName("toggle-more")
	Array.prototype.forEach.call(toggles, function(el) {
		el.addEventListener('click', function() {
			//document.getElementById(el.id + '-text').classList.toggle("expanded");
			el.nextElementSibling.classList.toggle("expanded")
		})
	})
}

//module.exports = {
export default {
	//template: '<div>lister</div>',
	data: function() {
		return {
			myUid: "",
			myGroups: [],
			tableColumns: [
			{ header: "id", field: "id" },
			{ header: "title", field: "title" },
			{ header: "owner", field: "owner" },
			{ header: "created", field: "created" },
			],
			records: [],
			checkedOwnership: ['usr', 'grp'],
			//sortByField: "id",
			sortByField: "",
			autoFetch: true,
		}
	},

	created: function () {
		//this.fetchData()
		this.fakeData()
		//this.records = this.filteredRecords;
		//this.filteredRecords();
		this.myUid = currentUid
		this.myGroups = userdb.getGroupsFor(currentUid).map(function(v) {return v.gid})
		this.fetchByOwnertype()
	},

	mounted: function() {
		this.makeToggles()
	},

	filters: {
		truncate: function (v) {
			var newline = v.indexOf('\n')
			return newline > 0 ? v.slice(0, newline) : v
		},
		formatDate: function (v) {
			//return v.replace(/T|Z/g, ' ')
			return v.replace(/T/, ' ').replace(/(Z|\+).*/, '')
		}
	},

	methods: {
		alert: function (msg) {
			return window.alert(msg)
		},
		fetchData: function () {
			var xhr = new XMLHttpRequest()
			var self = this
			xhr.open('GET', apiURL + self.currentBranch)
			xhr.onload = function () {
				self.commits = JSON.parse(xhr.responseText)
				console.log(self.commits[0].html_url)
			}
			xhr.send()
		},
		fakeData: function() {
			//this.records = dummyRecords;
			this.records = recorddb.getAllForUser(currentUid)
		},
		toggleAllPerms: function() {
			//console.log("toggle?", event.target);
			/*
			 *			if (this.checkedOwnership.length > 0) {
			 *				this.checkedOwnership = [];
			 *				return [];
		} else {
			this.checkedOwnership = ALLPERMS;
			return ALLPERMS;
		}
		*/
			/*
			 *			if (event.target.checked) {
			 *				this.checkedOwnership = ALLPERMS;
		} else {
			this.checkedOwnership = [];
		}
		*/
			//this.checkedOwnership = this.checkedOwnership.length === ALLPERMS.length ? [] : ALLPERMS;
			this.checkedOwnership = this.allChecked ? [] : ALLPERMS
		},
		sortByDate: function() {
			this.records.sort(function(a, b) {
				return a.created > b.created
			})
		},
		sortRecords: function() {
			if (!this.sortByField) { return }
			console.log(this.sortByField, typeof(this))
			//console.log("before:", this.records.map(function(v) {return v.id}));
			var vm = this
			this.records.sort(function(a, b) {
				var aval = a[vm.sortByField]
				var bval = b[vm.sortByField]
				//console.log(vm.sortByField, typeof(vm));
				if (aval < bval) {
					return -1
				}
				if (aval > bval) {
					return 1
				}

				return 0
			})
			//console.log("after:", this.records.map(function(v) {return v.id}));
		},
		fetchByOwnertype: function() {
			//this.records = recorddb.getAllForUser(currentUid, true, true);
			this.records = recorddb.getAllForUser(currentUid, this.checkedOwnership.indexOf("grp") > -1, this.checkedOwnership.indexOf("org") > -1)
		},
		makeToggles: makeToggles,
	},

	computed: {
		allChecked: function() {
			return this.checkedOwnership.length === ALLPERMS.length
		},
		filteredRecords: function() {
			return recorddb.getAllForUser(currentUid, this.checkedOwnership.indexOf("grp") > -1, this.checkedOwnership.indexOf("org") > -1)
		},
		/*
		 *		filterByOwnertype: function() {
		 *			vm = this;
		 *			//this.sortRecords();
		 *			return this.records.filter(function(record) {
		 *				//console.log("xxx", record.ownertype, vm.checkedOwnership.indexOf("grp"));
		 *				return (record.ownertype == "uid") || (vm.checkedOwnership.indexOf("grp") > -1 && record.ownertype == "gid") || (vm.checkedOwnership.indexOf("org") > -1 && record.ownertype == "org");
	});
	},
	*/
		reFetchByOwnertype: function() {
			//this.records = recorddb.getAllForUser(currentUid, this.checkedOwnership.indexOf("grp") > -1, this.checkedOwnership.indexOf("org") > -1);
			return recorddb.getAllForUser(currentUid, this.checkedOwnership.indexOf("grp") > -1, this.checkedOwnership.indexOf("org") > -1)
		},
	},
	watch: {
		checkedOwnership: function() {
			return this.autoFetch ? this.fetchByOwnertype() : false
		},
	},
}
</script>
