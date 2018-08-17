<template>
  <b-card class="rounded-0" no-body>
    <b-card-body class="d-flex py-1 align-items-center">

      <i :class="`${icon} fa-2x mr-4 text-muted`"></i>
      <div class="py-2">
        <div class="d-flex">
          <h6 class="mb-0">
            {{title}}
            <span v-if="secondary" class="text-muted m-0 font-italic">, {{secondary}}</span>
          </h6>
        </div>
        <p class="mb-0">Icons</p>
      </div>

      <div class="ml-auto mr-3">
        <RefList esDoctype="use_category" placeholder="use category" help="help" :setValue="setUseCategory" />
      </div>
      <b-btn-group class="">
        <b-btn variant="primary" class="px-3 py-2" @click="openModal">
          <i class="fas fa-pen" />
        </b-btn>
        <b-btn variant="danger" class="px-3 py-2" @click="removeItem">
          <i class="fas fa-trash" />
        </b-btn>
      </b-btn-group>
    </b-card-body>
  </b-card>
</template>

<script>
import RefList from '../../widgets/refdata/list-ui'

export default {
  name: 'SingleObject',
  props: ['icon', 'title', 'secondary', 'single', 'removeItem', 'openModal'],
  data: function() {
    return {}
  },
  methods: {
    setUseCategory: function(value) {
      console.log('use_category', value)
    },
  },
  computed: {},
  watch: {},
  components: {
    RefList,
  },
  created: function() {},
}
</script>

<style>
.form-group {
  margin-bottom: 0;
}
</style>