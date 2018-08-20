<template>
  <b-card class="rounded-0" no-body>
    <b-card-body class="d-flex py-1 align-items-center">
      <font-awesome-icon :icon="icon" size="2x" class="mr-4 text-muted" />
      <div class="py-2">
        <div class="d-flex">
          <h6 class="mb-0">
            {{title}}
            <span v-if="secondary" class="text-muted m-0 font-italic">, {{secondary}}</span>
          </h6>
        </div>
        <p class="mb-0">Icons</p>
      </div>
      <b-btn-group class="ml-auto">
        <b-btn variant="primary" class="px-3 py-2" @click="openModal">
          <font-awesome-icon :icon="faPen" />

        </b-btn>
        <b-btn variant="danger" class="px-3 py-2" @click="removeItem">
          <font-awesome-icon :icon="faTrash" />
        </b-btn>
      </b-btn-group>
    </b-card-body>
  </b-card>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'SingleObject',
  props: ['icon', 'title', 'secondary', 'single', 'removeItem', 'openModal'],
  data: function() {
    return {
      faPen,
      faTrash,
    }
  },
  methods: {},
  computed: {},
  watch: {},
  components: {
    FontAwesomeIcon,
  },
  created: function() {},
}
</script>

<style>
.form-group {
  margin-bottom: 0;
}
</style>