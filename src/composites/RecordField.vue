<template functional>
	<wrapper :wrapped="true">
		<div class="header">
			<div class="header__label">
				<slot name="title"/><span v-if="props.required" class="header__required">*</span>
			</div>
			<div class="header__right">
				<slot name="header-right"/>
			</div>
		</div>

		<slot name="input"/>
	</wrapper>
</template>


<style lang="scss" scoped>

.header {
	width: 100%;
	display: inline-flex;
	margin-bottom: 5px;

	&__label {
		display: inline-flex;
	}

	&__right {
		margin-left: auto;
		//display: inline-flex; // inline things in component using this
	}

	&__required {
		color: red;
	}
}


</style>

<script>
export default {
	name: 'record-field',
}
</script>
