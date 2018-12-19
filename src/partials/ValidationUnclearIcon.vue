<template>
	<div class="icon">
		<font-awesome-icon icon="exclamation-triangle" fixed-width />
	</div>
</template>

<style lang="scss" scoped>
$iconColor: #d28c13;
.icon {
    background-color: white;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    border: solid $iconColor 4px;
	padding: 3px;

	svg {
		color: $iconColor;
    	font-size: 25px;
	}
}
</style>
