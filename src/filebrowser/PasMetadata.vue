<template>
	<b-card class="cursor-reset bg-light">
		<h4>File metadata for PAS</h4>
		<p>Here you can edit file metadata to make you files viable for PAS. Note that these changes do not affect your dataset directly.</p>

		<table id="file-table" style="width: 100%;">
			<thead>
				<th>Title</th>
				<th>Format</th>
				<th>Description</th>
			</thead>
			<tbody>
				<td>
					{{file.file_characteristics['title'] || '-' }}
				</td>
				<td>{{ file.file_format || '-' }}</td>
				<td style="width: 50%;">
					{{ file.file_characteristics['description'] || '-' }}
				</td>
			</tbody>
		</table>

		<b-row>
			<b-col lg="6">
				<b-form-group label="Encoding:">
					<b-form-select v-model="edits.encoding" :options="encodingOptions">
						<template slot="first">
							<option :value="undefined" disabled>-- Select an encoding --</option>
						</template>
					</b-form-select>
				</b-form-group>
			</b-col>

			<b-col lg="6">
				<b-form-group label="Sequential settings:">
					<b-form-checkbox class="" v-model="sequential" name="check-button" switch>
						This file is a sequential file (for example csv file)
					</b-form-checkbox>
				</b-form-group>
			</b-col>
		</b-row>

		<b-row v-if="sequential" style="margin-bottom: 10px;">
			<b-col lg="6">
				<b-form-group label="Delimiter:">
					<b-form-select  v-model="edits.delimiter" :options="delimiterOptions">
						<template slot="first">
							<option :value="undefined" disabled>-- Select a delimiter --</option>
						</template>
					</b-form-select>
				</b-form-group>
			</b-col>
			<b-col lg="6">
				<b-form-group label="Quoting character (defaults: \ ):" >
					<b-form-input v-model="edits.quotingCharacter" placeholder="Enter quoting character"></b-form-input>
				</b-form-group>
			</b-col>
		</b-row>

		<b-row v-if="sequential" style="margin-bottom: 10px;">
			<b-col lg="6">
				<b-form-group label="Record separator:">
					<b-form-select v-model="edits.separator" :options="separatorOptions">
						<template slot="first">
							<option :value="undefined" disabled>-- Select a record separator --</option>
						</template>
					</b-form-select>
				</b-form-group>
			</b-col>
			<b-col lg="6">
				<b-form-group label="Header:">
					<b-form-checkbox v-model="edits.header" name="check-button" switch>
						Header in file?
					</b-form-checkbox>
				</b-form-group>
			</b-col>

		</b-row>

		<p class="info-text" v-if="file"> Note! By saving the data you are changing the file metadata regardless whether you select the file into your dataset or not. Dataset is not saved / published!</p>
		<p class="info-text" v-else> Note! By saving the data you are changing the file metadata FOR ALL THE FILES IN THE FOLDER regardless whether you select the files / folder into your dataset or not. Dataset is not saved / published!</p>
		<b-alert :show="saveResult === 'failed'" variant="danger" dismissible>Something went wrong. Your changes are not saved. Please try again.</b-alert>
		<b-alert :show="saveResult === 'success'" variant="success" dismissible>The file metadata was successfully saved.</b-alert>
		<b-button @click="save" variant="primary" class="w-100 h-100">Save PAS Metadata</b-button>
	</b-card>
</template>

<style lang="scss" scoped>

.first-row {
	padding: 5px;
	> * {
		display: inline-block;
		width: 30%;
	}
	> *:not(:first-child) {
		margin-left: 5px;
	}
}
.info-text {
	padding-bottom: 20px;
	padding-top: 20px;
	padding-left: 60px;
	padding-right: 60px;
}
</style>

<style lang="scss">
table#file-table thead th {
    border-top: 0px;
}
</style>



<script>
import axios from 'axios'
import dateFormat from 'date-fns/format'

const fileAPI = axios.create({
	baseURL: process.env.VUE_APP_METAX_FILEAPI_URL,
	timeout: 3000,
	responseType: 'json',
})

export default {
	name: 'PAS-metadata',
	props: {
		identifier: {
			type: String,
			required: true
		},
		file: {
			type: Object,
			default: null
		},
		folder: {
			type: Object,
			default: null
		}
	},
	methods: {
		// needs to support adding values and updating values. Should be able to delete csv values
		async save() {
			// reset save failed alert
			this.saveResult = null;
			const payload = { identifier: this.identifier };

			// combine with old values - csv options
			const characteristics = Object.assign({}, this.file.file_characteristics);

			// remove csv values so that edited values are applied if format is csv
			// Note: if format is different from csv and there are existing csv values they are deleted
			delete characteristics.csv_delimiter;
			delete characteristics.csv_has_header;
			delete characteristics.csv_record_separator;
			delete characteristics.csv_quoting_char;

			// add csv info only if the file is csv file
			if (this.sequential) {
				this.edits.delimiter && (characteristics.csv_delimiter = this.edits.delimiter);
				this.edits.header && (characteristics.csv_has_header = this.edits.header);
				this.edits.separator && (characteristics.csv_record_separator = this.edits.separator);
				this.edits.quotingCharacter && (characteristics.csv_quoting_char = this.edits.quotingCharacter);
				this.sequential && (payload.file_format = 'text/csv');
				// Note: by the default set file_format to text/plain
				!this.sequential && (payload.file_format = 'text/plain');
			}
			payload.file_characteristics = characteristics;

			// always include encoding
			this.edits.encoding && (characteristics.encoding = this.edits.encoding);


			try {
				const { data: { success, failed } } = await fileAPI.patch('files/', [payload]);
				if (failed.length > 0) {
					this.saveResult = 'failed';
				} else {
					this.saveResult = 'success';

					// set values based on save result
					const savedCharacteristics = success[0].object.file_characteristics;
					this.edits.delimiter = savedCharacteristics.delimiter;
					this.edits.header = savedCharacteristics.csv_has_header;
					this.edits.separator = savedCharacteristics.csv_record_separator;
					this.edits.quotingCharacter = savedCharacteristics.csv_quoting_char;
					this.sequential = payload.file_format === 'text/csv';
				}
			} catch (error) {
				this.saveResult = 'failed';
				throw error;
			}

		}
	},
	data() {
		return {
			saveResult: null,
			sequential: false,
			edits: {
				// defaults
				delimiter: undefined,
				header: undefined,
				separator: undefined,
				quotingCharacter: undefined,
				encoding: undefined,
			},
			separatorOptions: [
				{ value: 'LF', text: 'LF (default)' },
				{ value: 'CRLF', text: 'CRLF' },
				{ value: 'CR', text: 'CR' },
				/* CR LF (Windows), LF (Unix) and CR (Macintosh) line break types.
					The Carriage Return (CR) character (0x0D, \r) moves the cursor to the beginning of the line without advancing to the next line.
					This character is used as a new line character in Commodore and Early Macintosh operating systems (OS-9 and earlier).

					The Line Feed (LF) character (0x0A, \n) moves the cursor down to the next line without returning to the beginning of the line.
					This character is used as a new line character in UNIX based systems (Linux, Mac OSX, etc)

					The End of Line (EOL) sequence (0x0D 0x0A, \r\n) is actually two ASCII characters, a combination of the CR and LF characters.
					It moves the cursor both down to the next line and to the beginning of that line.
					This character is used as a new line character in most other non-Unix operating systems including Microsoft Windows, Symbian OS and others.

					Source: https://stackoverflow.com/questions/1552749/difference-between-cr-lf-lf-and-cr-line-break-types
				*/
			],
			delimiterOptions: [
				{ value: '\t', text: 'Tab' },
				{ value: ' ', text: 'Space' },
				{ value: ';', text: 'Semicolon' },
				{ value: ',', text: 'Comma (default)' },
				{ value: ':', text: 'Colon' },
				{ value: '.', text: 'Dot' },
				{ value: '|', text: 'Pipe' }
			],
			encodingOptions: [
				{ value: 'UTF-8', text: 'UTF-8 (default)' },
				{ value: 'UTF-16', text: 'UTF-16' },
				{ value: 'UTF-32', text: 'UTF-32' },
				{ value: 'ISO-8859-15', text: 'ISO-8859-15' },
			],
		}
	},
	created() {
		console.log('created file', this.file);
		this.sequential = this.file && this.file.file_format === 'text/csv';
		if (this.file.file_characteristics) {
			this.edits.delimiter = this.file.file_characteristics.csv_delimiter;
			this.edits.header = this.file.file_characteristics.csv_has_header;
			this.edits.separator = this.file.file_characteristics.csv_record_separator;
			this.edits.quotingCharacter = this.file.file_characteristics.csv_quoting_char;
			this.edits.encoding = this.file.file_characteristics.encoding;
		}

	}
}
</script>
