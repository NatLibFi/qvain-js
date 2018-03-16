<template>
	<div>
		<!-- div class="mx-2 my-3 row" -->
			oh hello! i'm a file browser! user is {{ user }}!<br/>
			<hr/>
			<div>
			<b-tabs pills card vertical @input="getProjectForTab">
				<b-tab :title="`Project ${project}`" v-for="project in projects" :key="project">
					<filelist :project="project" :root="rootId" path="/"></filelist>
				</b-tab>
			</b-tabs>
			</div>
	</div>
</template>

<script src="./filebrowser.js"></script>
