<template>
	<div id="filter">
		<form>
			Show records that...
			<input type="checkbox" name="created" value="created" /> Show records that I own:

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
			<div style="display: none;">
				<!-- in HTML5 every button is a submit button by default, which will reload the page, so set the type parameter -->
				<button type="button" v-on:click="sortByDate">sort by date</button>
				<button type="button" v-on:click="sortRecords">sort by</button>
				<button type="button" :title="autoFetch ? 'disabled; use the checkboxes' : 'fetch records'" v-bind:disabled="autoFetch" v-on:click="fetchByOwnertype">fetch</button>
				<button id="c1" class="btn" v-on:click="sortByDate">test</button>
				<button id="c2" class="btn" v-on:click="sortByDate">test</button>
				<button id="c3" class="btn" v-on:click="sortByDate">test</button>
				<button id="c4" class="btn" v-on:click="sortByDate">test</button>
				<hr/>
			</div>
		</form>
		<div v-for="record in records" :key="record" style="display: none;">
			{{ record.id }} – {{ record.title }} – {{ record.owner }}
			<button type="button" class="toggle-more" v-bind:id="'toggle-' + record.id">…</button>
			<span v-bind:id="'toggle-' + record.id + '-text'" class="expandable">created:
				<time :datetime="record.created">{{ record.created | formatDate }}</time>
			</span>
		</div>

		<p style="display: none;">filtered:</p>
		<table v-if="filteredRecords.length" class="table" id="record-list">
			<thead>
				<tr>
					<th v-for="column in tableColumns" :key="column">
						<a v-on:click="sortByField = column.field; sortRecords()" style="color: #002233;">{{ column.header }}
							<font-awesome-icon :icon="icon.faSort" style="color: #004466" />
						</a>
					</th>
				</tr>
			</thead>
			<tbody is="transition-group" name="record-list">
				<tr v-for="record in records" :key="record.id" v-on:click.capture="$router.push({ name: 'editor', params: { id: record.id}})">
					<td v-for="column in tableColumns" :key="column">
						<!-- <xrouter-link :to="{ name: 'editor', params: { id: record.id }}">{{ record.id }}</xrouter-link> -->
						{{ record[column.field] }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'

import userdb from './userdb.js'
import recorddb from './recorddb.js'

var apiURL = 'https://api.github.com/repos/vuejs/vue/commits?per_page=3&sha='
var currentUid = '069'
var ALLPERMS = ['usr', 'grp', 'org']

var makeToggles = function() {
  var toggles = document.getElementsByClassName('toggle-more')
  Array.prototype.forEach.call(toggles, function(el) {
    el.addEventListener('click', function() {
      //document.getElementById(el.id + '-text').classList.toggle("expanded");
      el.nextElementSibling.classList.toggle('expanded')
    })
  })
}

//module.exports = {
export default {
  //template: '<div>lister</div>',
  data: function() {
    return {
      myUid: '',
      myGroups: [],
      tableColumns: [
        { header: 'id', field: 'id' },
        { header: 'title', field: 'title' },
        { header: 'owner', field: 'owner' },
        { header: 'created', field: 'created' },
      ],
      records: [],
      checkedOwnership: ['usr', 'grp'],
      //sortByField: "id",
      sortByField: '',
      autoFetch: true,
      icon: {
        faSort,
      },
    }
  },

  created: function() {
    //this.fetchData()
    this.fakeData()
    //this.records = this.filteredRecords;
    //this.filteredRecords();
    this.myUid = currentUid
    this.myGroups = userdb.getGroupsFor(currentUid).map(function(v) {
      return v.gid
    })
    this.fetchByOwnertype()
  },

  mounted: function() {
    this.makeToggles()
  },

  filters: {
    truncate: function(v) {
      var newline = v.indexOf('\n')
      return newline > 0 ? v.slice(0, newline) : v
    },
    formatDate: function(v) {
      //return v.replace(/T|Z/g, ' ')
      return v.replace(/T/, ' ').replace(/(Z|\+).*/, '')
    },
  },

  methods: {
    alert: function(msg) {
      return window.alert(msg)
    },
    fetchData: function() {
      var xhr = new XMLHttpRequest()
      var self = this
      xhr.open('GET', apiURL + self.currentBranch)
      xhr.onload = function() {
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
      if (!this.sortByField) {
        return
      }
      console.log(this.sortByField, typeof this)
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
      this.records = recorddb.getAllForUser(
        currentUid,
        this.checkedOwnership.indexOf('grp') > -1,
        this.checkedOwnership.indexOf('org') > -1,
      )
    },
    makeToggles: makeToggles,
  },

  computed: {
    allChecked: function() {
      return this.checkedOwnership.length === ALLPERMS.length
    },
    filteredRecords: function() {
      return recorddb.getAllForUser(
        currentUid,
        this.checkedOwnership.indexOf('grp') > -1,
        this.checkedOwnership.indexOf('org') > -1,
      )
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
      return recorddb.getAllForUser(
        currentUid,
        this.checkedOwnership.indexOf('grp') > -1,
        this.checkedOwnership.indexOf('org') > -1,
      )
    },
  },
  watch: {
    checkedOwnership: function() {
      return this.autoFetch ? this.fetchByOwnertype() : false
    },
  },
  components: {
    FontAwesomeIcon,
  },
}
</script>
