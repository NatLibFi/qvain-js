<template>
	<div class="container-fluid">
		<h1 style="margin-top: 1em;">{{ title }}</h1>
		<small class="text-muted">Last updated {{ formatRelDate(lastModified) }}</small>
		
		<br/>
		<br/>
		
		<div class="col">
			<b-button-toolbar>
			<b-button-group>
			<b-button v-b-toggle="'collapse-record-metadata'" disabled>save</b-button>
			<b-button v-b-toggle="'collapse-record-metadata'" disabled>delete</b-button>
			<b-button v-b-toggle="'collapse-record-metadata'">details…</b-button>
			<b-button v-b-toggle="'collapse-record-owner'">owner…</b-button>
			</b-button-group>
			</b-button-toolbar>
		</div>
			
		<br/>

		<b-collapse id="collapse-record-metadata">
			<b-card><code>
				<b>qid:</b> {{ id }}<br/>
				<b>identifier:</b> urn:uuid:e41535e7-2d5b-42d1-bd33-4555fc791089<br/>
				<b>modified:</b> 2017-01-17T09:29:54Z<br/>
				<b>schema:</b> http://iowdev.csc.fi/ns/mrd.jschema<br/>
				</code>
			</b-card>
		</b-collapse>

		<b-collapse id="collapse-record-owner">
			<b-card>
				<div class="form-group row">
					<label for="ownertype-select" class="col-sm-2 col-form-label">ownertype</label>
					<div class="col-sm-10"><!-- class: col -->
						<b-button-group>
						<b-button class="active">person</b-button>
						<b-button>group</b-button>
						<b-button>organisation</b-button>
						</b-button-group>
					</div>

					<label for="owner-select" class="col-sm-2 col-form-label">owner</label>
					<div class="col-sm-10">
						<b-dropdown text="select owner" class="m-md-2">
							<b-dropdown-header>Choose group</b-dropdown-header>
							<b-dropdown-item>Project Ada</b-dropdown-item>
							<b-dropdown-item>Project B-tree</b-dropdown-item>
							<b-dropdown-item>Project Celsius</b-dropdown-item>
							<b-dropdown-divider></b-dropdown-divider>
							<b-dropdown-item>myself ({{ $auth.user ? $auth.user.name : "" }})</b-dropdown-item>
						</b-dropdown>
					</div>
					
					<br/><br/>
					
					<div class="col-sm-10">
						<b-btn disabled>set owner</b-btn>
					</div>

					<br/><br/>
					
					<div class="col-sm-10">
						<p class="text-muted"><b>Note:</b> groups can be added through your ATT profile, which you can find from the login link at the top.</p>
					</div>
				</div>
			</b-card>
		</b-collapse>
		
		<br/>
		
		<b-tabs>
			<b-tab title="first" active>
				<div class="container" style="margin-top: 1em;">
				<form>
					<div class="form-group row">
						<label for="identifier" class="col-sm-2 col-form-label">identifier</label>
						<div class="col-sm-10">
							<input v-model="identifier" type="text" class="form-control" id="identifier" placeholder="" value="http://urn.fi/urn:nbn:fi:csc-kata20160308103219249760">
						</div>
					</div>
					
					<div class="form-group row">
						<label for="title" class="col-sm-2 col-form-label">title</label>
						<div class="col-sm-10">
							<input v-model="title" type="text" class="form-control" id="title" placeholder="" value="Helsinki Kumpula SMEAR III meteorology - Air temperature - 2002">
						</div>
					</div>

					<div class="form-group row">
						<label for="description" class="col-sm-2 col-form-label">description</label>
						<div class="col-sm-10">
							<textarea v-model="description" style="width: 100%"></textarea>
						</div>
					</div>
					
					<div class="form-group row">
						<label for="keywords" class="col-sm-2 col-form-label">keywords</label>
						<div class="col-sm-10">
							<b-btn type="button" class="btn-sm" v-for="(keyword, index) in keywords" v-bind:key="index" style="margin-right: 0.8em;" @click="keywords.splice(index, 1)">{{ keyword }} <sup>x</sup></b-btn>
							<br/><br/>
							<b-input-group left="keyword">
								<b-form-input type="text" name="newKeywordText" v-model="newKeyword" @keyup.enter="addNewKeyword"></b-form-input> <!-- @keyup.enter = addNewKeyword -->

								<b-input-group-button slot="right">
									<b-btn type="button" text="add" @click="addNewKeyword">add</b-btn>
								</b-input-group-button>
							</b-input-group>
						</div>
					</div>

				</form>
				</div>
					
					
			</b-tab>
			<b-tab title="second">
				second part of the schema
			</b-tab>
			<b-tab title="third">
				third part of the schema
			</b-tab>
			<b-tab title="files" disabled>
				<b-card>file picker</b-card>
			</b-tab>
		</b-tabs>

		<hr/>
		<b-alert variant="warning" :show="id ? true : false">
			<p>Warning: this is a test record.</p>
			<p v-if="id">You requested record #{{id}}, but are shown a test record instead.</p>
		</b-alert>
	</div>
</template>

<script src="./v-editor.js"></script>
