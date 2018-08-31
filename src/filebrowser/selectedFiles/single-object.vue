<template>
  <b-card class="rounded-0" no-body>
    <b-card-body class="d-flex py-1 align-items-center">
      <font-awesome-icon :icon="icon" size="2x" class="mr-4 text-muted" />
      <div class="py-2">
        <div class="d-flex">
          <h6 class="mb-0">
            {{info.name}}
            <span v-if="secondary" class="text-muted m-0 font-italic">{{secondary}}</span>
          </h6>
        </div>
        <p class="my-2">
          <font-awesome-icon v-b-tooltip.hover title="Title" :icon="icons.faPencilAlt" :class="single.title ? 'text-primary' : 'text-secondary'"
            class="mr-2" />
          <font-awesome-icon v-b-tooltip.hover class="mr-2" :icon="icons.faTag" title="Use Category"
            :class="single.use_category ? 'text-primary' : 'text-secondary'" />
        </p>
      </div>
      <b-btn-group class="ml-auto">
        <b-btn variant="primary" class="px-3 py-2" @click="openModal">
          <font-awesome-icon :icon="icons.faPen" />
        </b-btn>
        <b-btn variant="danger" class="px-3 py-2" @click="removeItem">
          <font-awesome-icon :icon="icons.faTrash" />
        </b-btn>
      </b-btn-group>
    </b-card-body>
  </b-card>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faTrash,
  faPen,
  faPencilAlt,
  faTag,
} from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'SingleObject',
  props: [
    'icon',
    'info',
    'secondary',
    'single',
    'removeItem',
    'openModal',
    'type',
  ],
  data: function() {
    return {
      icons: {
        faPen,
        faTrash,
        faPencilAlt,
        faTag,
      },
    }
  },
  methods: {},
  computed: {},
  watch: {},
  components: {
    FontAwesomeIcon,
  },
  created: function() {
  },
}
</script>

<style>
.form-group {
  margin-bottom: 0;
}
</style>