<template>
	<li>
		<a v-b-popover.hover="data.id" title="file information" @click.stop="modalOpen(id, data.file_path, data.project_identifier)">{{ fileName }}</a> (<b>id:</b> {{ id }}, <b>identifier:</b> {{ identifier }} test: {{ data.id }})
	</li>
</template>

<script>
export default {
	name: "file",
	props: ['id', 'fileName', 'identifier', 'data', 'modalOpen'],
	methods: {},
}
</script>
