<template>
  <div row>
    <!-- ElasticSearch widget -->
    <b-form-group id="fundertype-form-group" horizontal :label-cols="uiLabel ? labelCols : 0" :description="uiDescription" :label="uiLabel">
      <!-- b-alert :show="!!error" variant="danger">error contacting reference data API server: {{ error }}</b-alert -->
      <b-input-group>
        <b-form-select v-model="selected" v-if="optgroups">
          <option :value="null" disabled>{{ uiPlaceholder }}</option>
          <option v-for="(child, childIndex) in noGroupItems" :key="child.id" :value="child" v-if="child !== null">{{ child.label[lang] || child.label['und'] }} [{{ child.code }}]</option>
          <optgroup v-for="(groupid, index) in groups" v-if="groupid !== null" :key="groupid" :label="items[groupid].group.label[lang]">
            <option v-for="(child, childIndex) in items[groupid].children" :key="child.id" :value="child" v-if="child !== null">{{ child.label[lang] || child.label['und'] }} [{{ child.code }}]</option>
          </optgroup>
        </b-form-select>
        <b-form-select v-model="selected" v-else>
          <!-- class="mb-1" -->
          <option :value="null" disabled v-if="placeholder">{{ placeholder }}</option>
          <option v-for="item in items" :key="item.id" :value="item">{{ item.label[lang] || item.label['und'] }} [{{ item.code }}]</option>
        </b-form-select>
        <b-input-group-append>
          <b-btn variant="danger" ref="refErrorButton" id="refdata-error-btn" v-b-tooltip.hover="error" v-if="error">
            <i class="fas fa-exclamation-triangle"></i>
          </b-btn>
          <b-btn variant="dark" v-b-tooltip.hover="error" title="retry" v-if="error" @click="getList(esIndex, esDoctype)">
            <i class="fas fa-sync" v-if="!busy"></i>
            <i class="fas fa-sync fa-spin" v-if="busy"></i>
          </b-btn>
          <b-btn variant="secondary" v-b-popover.hover="help" title="help" v-if="help" class="rounded-right">
            <span class="fas fa-question-circle"></span>
          </b-btn>
        </b-input-group-append>
        <b-popover target="refdata-error-btn" triggers="hover click" class="error-popover">
          <template slot="title">
            <b-btn variant="dark">
              <i class="fas fa-sync"></i>
            </b-btn>
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

<script>
import vSchemaBase from '../v-schema-base.vue'
import esApiClient from './es.js'

function groupByParent(objectArray) {
  var grouped = objectArray.reduce(function(acc, obj) {
    if (!obj['_source']) return acc

    // get rid of the annoying _source level
    obj = obj['_source']

    // if a value doesn't have parent_ids, add it to empty key
    var targets = obj['parent_ids'] || ['']

    // group top categories with their children
    if (targets.length < 1) {
      targets = obj['has_children'] ? [obj.id] : ['']
    }

    for (let key of targets) {
      if (!acc[key]) {
        acc[key] = { group: null, children: [] }
      }
      if (obj.id === key) {
        // group item
        acc[key].group = obj
      } else {
        // child item
        acc[key].children.push(obj)
      }
    }
    return acc
  }, {})

  // pre-sort children
  Object.keys(grouped).forEach(group => grouped[group].children.sort(sortById))

  return grouped
}

const sortById = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)

function filterKeys(full, wanted) {
  return Object.keys(full)
    .filter(key => wanted.includes(key))
    .reduce((obj, key) => {
      obj[key] = full[key]
      return obj
    }, {})
}

export default {
  name: 'refdata-list',
  description: 'refdata list from Elastic Search',
  schematype: 'object',
  props: {
    esIndex: {
      default: 'reference_data',
      type: String,
    },
    esDoctype: {
      default: 'funder_type', // funder_type, license
      type: String,
    },
    optgroups: {
      default: false,
      type: Boolean,
    },
    uiDescription: {
      type: String,
    },
    uiPlaceholder: {
      type: String,
    },
    uiLabel: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    help: { type: String },
    labelCols: {
      default: '3',
      type: String,
    },
    setValue: { required: true, type: Function },
  },
  data: function() {
    return {
      //selected: null,
      staticItems: [
        {
          id: 'funder_type_tekes',
          code: 'tekes',
          type: 'funder_type',
          uri:
            'http://purl.org/att/es/reference_data/funder_type/funder_type_tekes',
          wkt: '',
          label: { fi: 'Tekes', en: 'Tekes', und: 'Tekes' },
          parent_ids: [],
          child_ids: [],
          has_children: false,
          same_as: [],
        },
        {
          id: 'funder_type_tekes-shok',
          code: 'tekes-shok',
          type: 'funder_type',
          uri:
            'http://purl.org/att/es/reference_data/funder_type/funder_type_tekes-shok',
          wkt: '',
          label: { fi: 'Tekes SHOK', en: 'Tekes SHOK', und: 'Tekes SHOK' },
          parent_ids: [],
          child_ids: [],
          has_children: false,
          same_as: [],
        },
        {
          id: 'funder_type_eu-esr',
          code: 'eu-esr',
          type: 'funder_type',
          uri:
            'http://purl.org/att/es/reference_data/funder_type/funder_type_eu-esr',
          wkt: '',
          label: {
            fi: 'EU Euroopan sosiaalirahasto ESR',
            en: 'EU European Social Fund ESR',
            und: 'EU Euroopan sosiaalirahasto ESR',
          },
          parent_ids: [],
          child_ids: [],
          has_children: false,
          same_as: [],
        },
        {
          id: 'funder_type_eu-other',
          code: 'eu-other',
          type: 'funder_type',
          uri:
            'http://purl.org/att/es/reference_data/funder_type/funder_type_eu-other',
          wkt: '',
          label: {
            fi: 'EU muu rahoitus',
            en: 'EU other funding',
            und: 'EU muu rahoitus',
          },
          parent_ids: [],
          child_ids: [],
          has_children: false,
          same_as: [],
        },
        {
          id: 'funder_type_commercial',
          code: 'commercial',
          type: 'funder_type',
          uri:
            'http://purl.org/att/es/reference_data/funder_type/funder_type_commercial',
          wkt: '',
          label: { fi: 'Yritys', en: 'Commercial', und: 'Yritys' },
          parent_ids: [],
          child_ids: [],
          has_children: false,
          same_as: [],
        },
        {
          id: 'funder_type_academy-of-finland',
          code: 'academy-of-finland',
          type: 'funder_type',
          uri:
            'http://purl.org/att/es/reference_data/funder_type/funder_type_academy-of-finland',
          wkt: '',
          label: {
            fi: 'Suomen Akatemia',
            en: 'Academy of Finland',
            und: 'Suomen Akatemia',
          },
          parent_ids: [],
          child_ids: [],
          has_children: false,
          same_as: [],
        },
        {
          id: 'funder_type_eu-framework-programme',
          code: 'eu-framework-programme',
          type: 'funder_type',
          uri:
            'http://purl.org/att/es/reference_data/funder_type/funder_type_eu-framework-programme',
          wkt: '',
          label: {
            fi: 'EU puiteohjelmat',
            en: 'EU Framework Programme',
            und: 'EU puiteohjelmat',
          },
          parent_ids: [],
          child_ids: [],
          has_children: false,
          same_as: [],
        },
        {
          id: 'funder_type_eu-eakr',
          code: 'eu-eakr',
          type: 'funder_type',
          uri:
            'http://purl.org/att/es/reference_data/funder_type/funder_type_eu-eakr',
          wkt: '',
          label: {
            fi: 'EU Euroopan aluekehitysrahasto EAKR',
            en: 'EU Regional Development Fund EAKR',
            und: 'EU Euroopan aluekehitysrahasto EAKR',
          },
          parent_ids: [],
          child_ids: [],
          has_children: false,
          same_as: [],
        },
        {
          id: 'funder_type_finnish-fof',
          code: 'finnish-fof',
          type: 'funder_type',
          uri:
            'http://purl.org/att/es/reference_data/funder_type/funder_type_finnish-fof',
          wkt: '',
          label: {
            fi: 'Kotimainen rahasto tai säätiö',
            en: 'Finnish fund or foundation',
            und: 'Kotimainen rahasto tai säätiö',
          },
          parent_ids: [],
          child_ids: [],
          has_children: false,
          same_as: [],
        },
        {
          id: 'funder_type_foreign-fof',
          code: 'foreign-fof',
          type: 'funder_type',
          uri:
            'http://purl.org/att/es/reference_data/funder_type/funder_type_foreign-fof',
          wkt: '',
          label: {
            fi: 'Ulkomainen rahasto tai säätiö',
            en: 'Foreign fund or foundation',
            und: 'Ulkomainen rahasto tai säätiö',
          },
          parent_ids: [],
          child_ids: [],
          has_children: false,
          same_as: [],
        },
        {
          id: 'funder_type_other-public',
          code: 'other-public',
          type: 'funder_type',
          uri:
            'http://purl.org/att/es/reference_data/funder_type/funder_type_other-public',
          wkt: '',
          label: {
            fi: 'Muu julkinen rahoitus',
            en: 'Other public funding',
            und: 'Muu julkinen rahoitus',
          },
          parent_ids: [],
          child_ids: [],
          has_children: false,
          same_as: [],
        },
      ],
      items: null,
      byId: {},
      //items: null,
      error: null,
      busy: false,
      filterApiFields: true,
      lang: 'en',
      apiFields: ['code', 'id', 'label', 'type', 'uri'],
    }
  },
  methods: {
    getList: function(index, doctype) {
      this.busy = true
      var vm = this
      esApiClient(index, doctype)
        .then(response => {
          if (response.data && response.data.hits && response.data.hits.hits) {
            if (this.optgroups) {
              vm.items = groupByParent(response.data.hits.hits)
            } else {
              let items = response.data.hits.hits
              vm.items = vm.filterApiFields
                ? items.map(item => filterKeys(item['_source'], vm.apiFields))
                : items.map(item => item['_source'])
            }
            vm.error = null
          } else {
            vm.items = []
            vm.error = 'no data'
          }
        })
        .catch(error => {
          console.log(error)
          this.error = 'error calling ElasticSearch API'
          console.log(Object.keys(error))
          if (error.response && error.response.status) {
            this.error +=
              ': ' +
              error.response.status +
              (error.response.statusText
                ? '(' + error.response.statusText + ')'
                : '')
          }
        })
      // "finally() is not a function" :(
      //.finally(() => {
      vm.busy = false
      //})
    },
    indexOf: function(id) {
      if (!this.items) {
        return -1
      }
      for (let i = 0; i < this.items.length; i++) {
        if (this.items['id'] === id) {
          return i
        }
      }
      return -1
    },
  },
  computed: {
    selected: {
      get() {
        //return this.$store.state.obj.message
        //return this.value
        if (this.value && this.value['id']) {
          let index = this.indexOf(this.value.id)
          if (index >= 0) {
            return this.items[index]
          }
        }
        return null
      },
      set(value) {
        //this.$store.commit('updateMessage', value)
        //console.log("selected:", value)
        //this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: this.items[value] })
        this.setValue(value)
      },
    },
    groups: function() {
      return this.items ? Object.keys(this.items).sort() : []
    },
    noGroupItems: function() {
      return this.items && this.items[''] && this.items[''].children
        ? this.items[''].children
        : []
    },
  },
  created() {
    //console.log("refdata widget", this.value)
    //this.getList("reference_data", "funder_type")
    this.getList(this.esIndex, this.esDoctype)
  },
}
</script>
