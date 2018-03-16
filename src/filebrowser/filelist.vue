<template>
	<div>
		<fileinfo-modal ref="refFileInfoModal"></fileinfo-modal>
		
		file list for <b>{{ project }}</b> path <b>{{ cwd }}</b> deep: {{ isSelectedDeep }}
		
		<ul v-if="directories.length">
			<li v-for="dir in directories">
				<a @click="openDir(dir.directory_path)">{{ dir.directory_name }}</a> ({{ dir.id }} {{ dir.identifier }})
			</li>
		</ul>
		<p v-else>no directories</p>
		
		<b-alert variant="danger" :show="!!error">{{ error }}</b-alert>
		<hr/>
		<b-breadcrumb :items="breadcrumbs"/>
		<hr/>
		
		<b-button-toolbar key-nav aria-label="File browser toolbar">
			<b-button-group class="mx-1">
				<b-btn v-b-tooltip.hover title="go to project top directory" @click="openDir('/')" :disabled="isToplevel"><i class="fa fa-angle-double-up" aria-hidden="true"></i></b-btn>
				<b-btn v-b-tooltip.hover title="go up one level" @click="openDir(parentDir(cwd))" :disabled="isToplevel"><i class="fa fa-angle-up" aria-hidden="true"></i></b-btn>
			</b-button-group>
			<b-button-group class="mx-1">
				<b-btn @click.stop="deselectDir(cwd)" v-if="cwd in selectedDirs">remove directory</b-btn>
				<b-btn @click.stop="selectDir(cwd)" :disabled="isSelectedDeep" v-else>add directory</b-btn>
			</b-button-group>
			<b-breadcrumb :items="breadcrumbs" class="my-0 p-2"/>
		</b-button-toolbar>
		
		<filetree :self="cwd" :children="directories" @opendir="openDir"></filetree>
		
		<b-table :fields="fileFields" :items="files" show-empty empty-text="no files in this directory" small hover>
			<template slot="actions" slot-scope="data">
				<b-btn size="sm" @click.stop="deselect(data.item.id)" :class="{ 'btn-outline-primary': isSelectedDeep }" :disabled="isSelectedDeep" v-if="data.item.id in selected">remove</b-btn>
				<b-btn size="sm" @click.stop="select(data.item.id)" :class="{ 'btn-outline-primary': isSelectedDeep }" :disabled="isSelectedDeep" v-else>{{ isSelectedDeep ? "selected" : "add" }}</b-btn>
				<b-btn size="sm" @click.stop="data.toggleDetails" class="mr-2">{{ data.detailsShowing ? 'less' : 'more'}} details</b-btn>
			</template>
			<template slot="row-details" slot-scope="data">
				<b-card>
					<b-row class="mb-2">
						<b-col sm="3" class="text-sm-right"><b>title:</b></b-col>
						<b-col>{{ data.item.file_characteristics['title'] }}</b-col>
					</b-row>
					<b-row class="mb-2">
						<b-col sm="3" class="text-sm-right"><b>description:</b></b-col>
						<b-col>{{ data.item.file_characteristics['description'] }}</b-col>
					</b-row>
					<b-row class="mb-2">
						<b-col sm="3" class="text-sm-right"><b>encoding:</b></b-col>
						<b-col>{{ data.item.file_characteristics['encoding'] }}</b-col>
					</b-row>
					<b-row class="mb-2">
						<b-col sm="3" class="text-sm-right"><b>format:</b></b-col>
						<b-col>{{ data.item.file_format }}</b-col>
					</b-row>
					<b-row class="mb-2">
						<b-col sm="3" class="text-sm-right"><b>application name:</b></b-col>
						<b-col>{{ data.item.file_characteristics['application_name'] }}</b-col>
					</b-row>
					<b-button size="sm" @click.stop="modalOpen(data.item.id, data.item.file_path, project)">json</b-button>
					<b-button size="sm" @click="data.toggleDetails">hide details</b-button>
				</b-card>
			</template>
			
		</b-table>
		
		<!--
		<ul v-if="files.length">
			<li v-for="file in files">
				{{ file }}
			</li>
			<file :id="file.id" :fileName="file.file_name" :identifier="file.identifier" :data="file" :modalOpen="modalOpen" v-for="file in files" :key="file.id"/>
		</ul>
		<p v-else>no files</p>
		//-->
		
		</div>
</template>

<script src="./filelist.js"></script>
