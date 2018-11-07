<template>
	<div>
		<transition name="slideinout" appear>
		<b-alert :show="$root.dismissCountDown" style="z-index: 1000; position: fixed; top: 1rem; left: 0; right: 0; width: 90%; margin: 0 auto; opacity: 0.90;" dismissible :variant="$root.alertVariant" @dismissed="$root.dismissAlert" @dismiss-count-down="$root.countDownChanged">
			<p>{{ $root.alertText }}</p>
		</b-alert>
		</transition>

		<b-navbar id="app-top-bar" toggleable="md" type="dark" variant="primary">

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
						<b-dropdown-item to="#" @click="$root.language = 'en'">EN</b-dropdown-item>
						<b-dropdown-item to="#" @click="$root.language = 'fi'" disabled>FI</b-dropdown-item>
						<b-dropdown-item to="#" @click="$root.language = 'se'" disabled>SE</b-dropdown-item>
					</b-nav-item-dropdown>

					<!-- login dropdown -->
					<b-nav-item-dropdown v-if="$auth.loggedIn" right>

						<template slot="text">
							<span style="font-weight: bold;">user</span>
						</template>

						<b-dropdown-header>
							<font-awesome-icon icon="user" class="text-primary mr-2" fixed-width /> <a>{{ $auth.user.name }}</a>
						</b-dropdown-header>
						<b-dropdown-divider></b-dropdown-divider>
						<b-dropdown-item to="/userinfo">about me</b-dropdown-item>
						<b-dropdown-item @click="$auth.logout()">sign out</b-dropdown-item>
					</b-nav-item-dropdown>
					<b-nav-item v-else :href="$auth.loginUrl">login</b-nav-item>

				</b-navbar-nav>
			</b-collapse>
		</b-navbar>

		<b-navbar toggleable type="dark" id="app-sub-bar">

			<b-nav-toggle target="nav_collapse"></b-nav-toggle>

			<b-link class="navbar-brand" to="/">
				<span>Qvain</span>
			</b-link>

			<b-collapse is-nav id="nav_collapse">

				<b-navbar-nav>
					<b-nav-item to="/dataset">create record</b-nav-item>
					<b-nav-item to="/datasets">show records</b-nav-item>
				</b-navbar-nav>

			</b-collapse>
		</b-navbar>
	</div>
</template>

<style>
.slideinout-enter-active {
	animation: fadein-top .5s;
}

.slideinout-leave-active {
	animation: fadeout-top 1s;
}

@-webkit-keyframes fadein-top {
	from {top: 0; opacity: 0;}
	to {top: 1rem; opacity: 0.90;}
}

@keyframes fadein-top {
	from {top: 0; opacity: 0;}
	to {top: 1rem; opacity: 0.90;}
}

@-webkit-keyframes fadeout-top {
	from {top: 1rem; opacity: 1;}
	to {top: 0; opacity: 0;}
}

@keyframes fadeout-top {
	from {top: 1rem; opacity: 1;}
	to {top: 0; opacity: 0;}
}

.bounce-enter-active {
	animation: bounce-in .5s;
}
.bounce-leave-active {
	animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
	0% {
		transform: scale(0);
	}
	50% {
		transform: scale(1.2);
	}
	100% {
		transform: scale(1);
	}
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
	transition: all .3s ease;
}
.slide-fade-leave-active {
	transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
	transform: translateX(10px);
	opacity: 0;
}

</style>


<script>
export default {
	name: 'navigation',
	data: function() {
		return {
		}
	},
}
</script>
