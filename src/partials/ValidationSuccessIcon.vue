<template>
	<div class="icon">
		<font-awesome-icon icon="check" fixed-width />
	</div>
</template>

<style lang="scss" scoped>
$iconColor: #16c516;
.icon {
    background-color: white;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    border: solid $iconColor 4px;
	padding-top: 4px;

	svg {
		color: $iconColor;
		font-size: 30px;
	}
}
</style>
