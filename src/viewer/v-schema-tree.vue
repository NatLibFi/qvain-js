<template>
<li>
	<div class="treeview-branch" :class="{bold: isFolder}" @click="toggle" @dblclick="changeType">
		<i class="fa" :class="[open ? 'fa-folder-open' : 'fa-folder']" aria-hidden="true"></i>
		{{ name || "/" }}
		
		<!-- <b-btn @click.stop="edit(path, schema)"><i class="fa fa-edit" aria-hidden="true"></i> edit</b-btn> -->
		<b-btn variant="link" size="sm" v-b-tooltip.hover.auto title="edit" @click.stop="edit(path, schema)"><i class="fa fa-edit" aria-hidden="true"></i></b-btn>
		<span :class="{ 'text-secondary': !uiTab }">{{ myTab }}</span>
		
		<!-- <span v-if="isFolder">[{{open ? '-' : '+'}}]</span> -->
	</div>
	<ul class="treeview fa-ul" v-show="open" v-if="isFolder">
		<div class="item" v-for="(sub, key) in schema" :key="sub.id">
			<schema-tree v-if="typeof sub === 'object'" class="item" :schema="sub" :path="path + '/' + key" :name="key" :pref="pref" :edit="edit" :tab="myTab" v-on="$listeners"></schema-tree>
			<li v-else><i class="fa fa-square-o" aria-hidden="true"></i> {{ key }}</li>
		</div>
		<!-- <schema-tree class="item" v-for="(sub, key) in schema" :schema="sub" :path="path + '/' + key" :name="key" :key="sub.id"></schema-tree> -->
	</ul>
</li>
</template>

<script src="./v-schema-tree.js"></script>
