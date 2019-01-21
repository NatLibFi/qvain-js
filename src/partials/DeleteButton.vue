<template functional>
	<button class="delete-button" variant="link" v-on:click="listeners.click">
		<font-awesome-icon icon="times" fixed-width class="icon" />
	</button>
</template>

<style lang="scss" scoped>
.delete-button {
	padding: 0;
	color: black;
	&:hover .icon {
		color: red;
	}
}
</style>

<script>
export default {
    name: 'delete-button',
}
</script>
