<template>
	<div>
		<!-- i18n-string -->
		<b-form-group id="i18n-string" horizontal :label-cols="4" breakpoint="md" :description="ui['description']" :label="ui['label']">
			<b-card no-body> <!-- :header="'<h5>' + ui['label'] + '</h5>'" -->
				<b-list-group flush>
					<b-list-group-item v-for="(val, lang) in lpairs" :key="lang">
						<div class="d-flex w-100 justify-content-start"> <!-- d-flex w-100 justify-content-between -->
							<h5 class="mb-1">{{val}}</h5>
							<small style="margin-left: 0.5em; vertical-align: top;">{{lang}}</small>
							<b-badge class="ml-auto p-2" variant="danger" @click="deleteLang(lang)"><span class="fas fa-minus"></span></b-badge>
						</div>
					</b-list-group-item>
				</b-list-group>
				<b-card-body>
					<b-container>
					<b-row>
					<b-col cols="9" class="mr-3 p-0">
						<b-form-input id="i18n-string-newvalue" type="text" name="i18n-string-newvalue" :placeholder="ui['placeholder']" v-model="newString" :state="stringState" @input="resetState()"></b-form-input>
					</b-col>
					<b-col class="mr-3 p-0">
						<b-form-input size="3" maxlength="3" id="i18n-string-newlang" type="text" name="i18n-string-newlang" placeholder="language" v-model="newLanguage" :state="langState" @input="resetState()" v-if="freeform"></b-form-input>
						<b-form-select v-model="newLanguage" :options="languages" :state="langState" @change="resetState()" v-else></b-form-select>
					</b-col>
					<b-btn @click="addPair()"><span class="fas fa-plus"></span></b-btn>
					</b-row>
					</b-container>
				</b-card-body>
			</b-card>
		</b-form-group>
	</div>
</template>

<script src="./i18n-string.js"></script>
