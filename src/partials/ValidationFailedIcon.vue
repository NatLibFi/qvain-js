<template>
	<div class="error">
		<font-awesome-icon icon="exclamation" fixed-width />
	</div>
</template>

<style lang="scss" scoped>
.error {
    background-color: white;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    border: solid red 4px;
	padding-top: 4px;

	svg {
		color: red;
    	font-size: 30px;
	}
}
</style>
