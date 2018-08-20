<template>
	<b-badge :variant="variant" class="state-widget animate-pop-down" :class="type" v-b-tooltip.hover.auto :title="long">
		<font-awesome-icon :icon="icon" />
		</i> {{ short }}</b-badge>
</template>

<style>
.state-widget {
  cursor: default;
}

@keyframes pop-in {
  0% {
    /* opacity: 0; */
    transform: translateY(-6rem) scale(0.8);
    background-color: #333333;
  }
  90% {
    /* opacity: 1; */
    transform: none;
    background-color: #333333;
  }
}

@keyframes fadeFromGrey {
  0% {
    background-color: #333333;
  }
  80% {
    background-color: #222222;
  }
}

.animate-pop-down {
  animation: pop-in 1.2s ease-out forwards;
  /* animation: 2s ease-out 0s fadeFromGrey; */

  /*
	animation: 0.8s ease-out 0s pop-in,
		1.8s ease-out 0.8s fadeFromGrey;
	*/
}

.state-user-fail {
  background-color: #aa0000;
}
.state-user-wait {
  background-color: #ff9900;
}
.state-user-success {
  background-color: #009900;
}
.state-system-fail {
  background-color: #aa0000;
}
.state-system-wait {
  background-color: #666666;
} /* was: #ffcc00 */
.state-system-success {
  background-color: #009900;
}
.state-other-fail {
  background-color: #aa0000;
}
.state-other-wait {
  background-color: #0000aa;
}
.state-other-success {
  background-color: #009900;
}

.state-unknown {
  background-color: #333333;
}
</style>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faExclamationTriangle,
  faEdit,
  faCogs,
  faClock,
  faEllipsisH,
  faCheck,
} from '@fortawesome/free-solid-svg-icons'
import StateDefs from '@/data/preservation_state.json'

export default {
  name: 'preservation-state',
  props: ['state'],
  data() {
    return {
      variant: 'dark',
    }
  },
  computed: {
    description: function() {
      if (!this.state) {
        return ''
      }
      return StateDefs[this.state] || {}
    },
    long: function() {
      return this.description['name'] || 'unknown state'
    },
    short: function() {
      return (this.description['short']['en'] || this.long).toLowerCase()
    },
    type: function() {
      return 'state-' + this.description.who + '-' + this.description.type
    },
    icon: function() {
      switch (this.description.type) {
        case 'fail':
          return faExclamationTriangle
        case 'wait':
          switch (this.description.who) {
            case 'user':
              return faEdit
            case 'system':
              return faCogs
            case 'other':
              return faClock
            default:
              return faEllipsisH
          }
        case 'success':
          return faCheck
      }
      return ''
    },
    numState: function() {
      return Number(this.state)
    },
  },
  components: {
    FontAwesomeIcon,
  },
}
</script>
