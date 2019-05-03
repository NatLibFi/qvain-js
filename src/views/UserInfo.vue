<template>
	<div>
		<h1>About me</h1>

		<div v-if="$auth.user" role="tablist">
			<b-card no-body class="mb-1">
				<b-card-header header-tag="header" class="p-1" role="tab">
					<b-btn block href="#" v-b-toggle.userinfo-tab1 variant="secondary">User</b-btn>
				</b-card-header>
				<b-collapse id="userinfo-tab1" visible accordion="userinfo-accordion" role="tabpanel">
					<b-card-body>
						<dl class="row card-text">
							<dt class="col-sm-2">Name</dt>
							<dd class="col-sm-10">{{ $auth.user.name || "–" }}</dd>

							<dt class="col-sm-2">ID</dt>
							<dd class="col-sm-10">{{ $auth.user.id || "–" }}</dd>

							<dt class="col-sm-2">Email</dt>
							<dd class="col-sm-10">{{ $auth.user.email || "–" }}</dd>
						</dl>
					</b-card-body>
				</b-collapse>
			</b-card>
			<b-card no-body class="mb-1">
				<b-card-header header-tag="header" class="p-1" role="tab">
					<b-btn block href="#" v-b-toggle.userinfo-tab2 variant="secondary">Organisation</b-btn>
				</b-card-header>
				<b-collapse id="userinfo-tab2" visible accordion="userinfo-accordion" role="tabpanel">
					<b-card-body>
						<dl class="row card-text">
							<dt class="col-sm-2">Organisation</dt>
							<dd class="col-sm-10">{{ $auth.user.organisation || "–" }}</dd>

							<dt class="col-sm-2">Organisation type</dt>
							<dd class="col-sm-10">{{ $auth.user.organisation_type || "–" }}</dd>

							<dt class="col-sm-2">EPPN</dt>
							<dd class="col-sm-10">{{ $auth.user.eppn || "–" }}</dd>
						</dl>
					</b-card-body>
				</b-collapse>
			</b-card>
			<b-card no-body class="mb-1">
				<b-card-header header-tag="header" class="p-1" role="tab">
					<b-btn block href="#" v-b-toggle.userinfo-tab3 variant="secondary">Projects</b-btn>
				</b-card-header>
				<b-collapse id="userinfo-tab3" accordion="userinfo-accordion" role="tabpanel">
					<b-card-body>
						<dl class="row card-text">
							<dt class="col-sm-2">IDA projects</dt>
							<dd class="col-sm-10">
								<ul v-if="$auth.user.projects" class="list-inline">
								<li v-for="project in $auth.user.projects" :key="project" class="list-inline-item"><span class="badge badge-secondary text-monospace">{{ project }}</span></li>
								</ul>
								<span v-else class="font-italic">No projects</span>
							</dd>
						</dl>
					</b-card-body>
				</b-collapse>
			</b-card>
			<b-card no-body class="mb-1">
				<b-card-header header-tag="header" class="p-1" role="tab">
					<b-btn block href="#" v-b-toggle.userinfo-tab4 variant="secondary">Session</b-btn>
				</b-card-header>
				<b-collapse id="userinfo-tab4" accordion="userinfo-accordion" role="tabpanel">
					<b-card-body>
						<b-form-textarea id="jwt-token-contents" class="card-text" rows="16" style="font-family: monospace;" plaintext :value="stringifiedToken">
						</b-form-textarea>
					</b-card-body>
				</b-collapse>
			</b-card>
		</div>

		<div v-else>
			<b-alert variant="secondary" show><p class="font-italic">You are not logged in.</p></b-alert>
		</div>

	</div>
</template>

<script>
export default {
	name: "user-info",
	data: function() {
		return {}
	},
	methods: {
		/*
		getGroups: function() {
			this.myGroupsOptions = []
			myGroups.forEach(
				grp => {
					this.myGroupsOptions.push({
						text: grp.name,
						value: grp.id,
					})
				})
		},
		*/
	},
	computed: {
		/*
		filterRegExp: function() {
			return new RegExp('.*' + this.filterString + '.*', 'ig')
		},
		*/
		stringifiedToken() {
			return (this.$auth && this.$auth.user._jwt) ? JSON.stringify(this.$auth.user._jwt, null, 2) : null
		},
	},
	created() {
		//this.$auth.user.projects = ["2001036", "20010xx", "2001666"]
	},
}
</script>
