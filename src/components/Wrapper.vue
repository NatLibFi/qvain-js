<template>
	<div class="wrapper">
		<slot></slot>
	</div>
</template>
<script>

export default {
	name: 'wrapper',
}
</script>

<style <style lang="scss" scoped>
.wrapper {
	padding: 20px;
    box-shadow: 2px 2px 15px 0px lightgrey;
}
</style>

