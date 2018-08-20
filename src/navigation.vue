<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="primary">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand to="#">
        <img src="/static/imgs/Qvain_neg_300px.png" class="d-inline-block align-top" alt="Fairdata: Qvain">
      </b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item>Support</b-nav-item>
          <b-nav-item>Docs</b-nav-item>
          <b-nav-item>Contact Us</b-nav-item>
        </b-navbar-nav>

        <!-- right-aligned items -->
        <b-navbar-nav class="ml-auto">

          <!-- language dropdown -->
          <b-nav-item-dropdown text="lang" right>
            <b-dropdown-item to="#">EN</b-dropdown-item>
            <b-dropdown-item to="#">FI</b-dropdown-item>
            <b-dropdown-item to="#">SE</b-dropdown-item>
          </b-nav-item-dropdown>

          <!-- login dropdown -->
          <b-nav-item-dropdown v-if="$auth.loggedIn" right>

            <!-- Using text slot -->
            <template slot="text">
              <span style="font-weight: bold;">user</span>
            </template>

            <b-dropdown-header>
              <font-awesome-icon :icon="icon.faUser" style="color: #0099aa" />
              <a>{{ $auth.user.name }}</a>
            </b-dropdown-header>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item href="">profile</b-dropdown-item>
            <b-dropdown-item href="">signout</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item v-else href="/api/auth/login">login</b-nav-item>

        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-navbar toggleable type="dark" variant="info">

      <b-nav-toggle target="nav_collapse"></b-nav-toggle>

      <b-link class="navbar-brand" to="/">
        <span>Qvain</span>
      </b-link>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item to="/tabui">create record</b-nav-item>
          <b-nav-item to="/records">show records</b-nav-item>
          <b-nav-item to="/files">select files</b-nav-item>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'Navigation',
  data: function() {
    return {
      icon: {
        faUser,
      },
    }
  },
  components: {
    FontAwesomeIcon,
  },
}
</script>