<template>
	<b-modal id="modal1" ref="edit-modal" size="lg" title="Edit schema UI" cancel-title="cancel" ok-title="set" @ok="save()" @show="open()">
		<!-- hint editor -->
		<template slot="modal-title">
			<i class="fa fa-angle-right" aria-hidden="true"></i> <span v-if="path">{{ path }}</span><span v-else><i>schema root</i></span>
		</template>
		
		<b-container fluid>
			<b-row class="mb-2">
				<b-col cols="3">widget</b-col>
				<b-col>
					<b-form-select v-model="customWidget" :options="widgetList" class="mb-3">
						<template slot="first">
							<option :value="null">– use default –</option>
						</template>
					</b-form-select>
				</b-col>
			</b-row>
			
			<b-row class="mb-2">
				<b-col cols="3">widget options</b-col>
				<b-col>
					<b-list-group v-if="false">
						<b-list-group-item v-for="(val, option) in listWidgetOptions" :key="option" class="d-flex justify-content-between align-items-center">
						{{ option }}
						<b-badge variant="primary" pill>default</b-badge>
						<b-badge variant="primary" pill>default</b-badge>
						</b-list-group-item>
					</b-list-group>
					
					<ul v-if="listWidgetOptions">
						<li v-for="(val, option) in listWidgetOptions" :key="val" class="mt-1">
						<b>{{ option }}</b>
						value:
							<span v-if="option in customWidgetOptions">{{ customWidgetOptions[option] }}</span>
							<span v-else><i>unset</i></span>
						default:
							<span v-if="val['default']">{{ val['default'] }}</span>
							<span v-else><i>unset</i></span>
						<b-btn v-b-toggle="'collapseWidgetOption'+option" variant="primary">edit</b-btn>
							<b-collapse :id="'collapseWidgetOption'+option" class="mt-2">
								<b-card>
									<b-form-input type="text" v-model="customWidgetOptions[option]" placeholder="option"></b-form-input>
									<p class="card-text"></p>
								</b-card>
							</b-collapse>
						</li>
					</ul>
					<p v-else><i>no options for this widget</i></p>
				</b-col>
			</b-row>

			<b-row class="mb-2">
				<b-col cols="3">label</b-col>
				<b-col>
					<b-form-input type="text" v-model="label" placeholder="label"></b-form-input>
				</b-col>
			</b-row>
			
			<b-row class="mb-2">
				<b-col cols="3">help</b-col>
				<b-col>
					<b-form-input type="text" v-model="help" placeholder="help text"></b-form-input>
				</b-col>
			</b-row>
			
			<b-row class="mb-2">
				<b-col cols="3">placeholder</b-col>
				<b-col>
					<b-form-input type="text" v-model="placeholder" placeholder="placeholder for input fields"></b-form-input>
				</b-col>
			</b-row>
			
			<b-row class="mb-2">
				<b-col cols="3">tab</b-col>
				<b-col>
					<!-- <b-button class="p-0 m-0" size="sm" variant="link" v-for="c in 6"> -->
						<span class="fa-stack" v-for="c in 6" :key="c" @click="myTab = c">
							<span class="fa fa-stack-2x" :class="[ myTab === c ? 'fa-square' : 'fa-square-o' ]"></span><strong class="fa-stack-1x" :class="{ 'text-light': myTab === c }">{{ c }}</strong>
							<i class="fas fa-headphones" data-fa-transform="shrink-6" data-fa-mask="fas fa-square">{{c}}</i>
						</span>
					<!-- </b-button> -->
				</b-col>
			</b-row>
			
			<b-row class="mb-2">
				<b-col cols="3">tab</b-col>
				<b-col class="p-3">
					<span class="fa-layers fa-fw" v-for="c in 6" :key="c" @click="myTab = c">
						<i class="fas fa-square"></i>
						<span class="fa-layers-text fa-inverse" data-fa-transform="shrink-2" style="font-weight:900">{{c}}</span> <!-- data-fa-transform="shrink-8" -->
					</span>
				</b-col>
			</b-row>
			
			<b-row class="mb-2" style="display: none">
				<b-col cols="3">tab</b-col>
				<b-col>
					<b-form-radio-group id="tabradio"
								buttons
								button-variant="outline-secondary"
								size="sm"
								v-model="myTab"
								:options="[1, 2, 3, 4, 5, 6]"
								name="tabRadioButtons" />
				</b-col>
			</b-row>
			
		</b-container>
	</b-modal>
</template>

<script src="./hint-editor.js"></script>
