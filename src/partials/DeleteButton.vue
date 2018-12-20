<template functional>
	<b-btn class="delete-button" variant="link" v-on:click="listeners.click">
		<font-awesome-icon icon="times" fixed-width class="icon" />
	</b-btn>
</template>

<style lang="scss" scoped>
.delete-button {
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
