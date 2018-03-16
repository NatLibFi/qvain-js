<template>
	<div>
		<b-tabs pills card vertical @input="getProjectForTab">
			<b-tab :title="`Project ${project}`" v-for="project in projects" :key="project">
				<filelist :project="project" :root="rootId" :path="path"></filelist>
			</b-tab>
		</b-tabs>
	</div>
</template>

<script src="./filebrowser.js"></script>
