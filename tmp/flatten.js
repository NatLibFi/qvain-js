var flatten = require('flat')

var dataset = {
	"id": 2023,
	"identifier": "9380665a-7d96-4c91-bbae-152d69e139e6",
	"data_catalog": {
		"id": 1,
		"identifier": "urn:nbn:fi:att:2955e904-e3dd-4d7e-99f1-3fed446f96d1"
	},
	"dataset_version_set": [
	{
		"identifier": "9380665a-7d96-4c91-bbae-152d69e139e6",
		"preferred_identifier": "urn:nbn:fi:att:7802345a-c842-4b4e-9d56-9bb0c8075b0a",
		"removed": false,
		"date_created": "2018-08-08T12:22:43+03:00"
	}
	],
	"deprecated": false,
	"metadata_owner_org": "csc.fi",
	"metadata_provider_org": "csc.fi",
	"metadata_provider_user": "teppo.testaaja@csc.fi",
	"research_dataset": {
		"files": [
		{
			"title": "HTML Integration Test File",
			"file_type": {
				"in_scheme": "https://metax.fairdata.fi/es/reference_data/file_type/_search?pretty",
				"identifier": "http://purl.org/att/es/reference_data/file_type/file_type_text",
				"pref_label": {
					"en": "Text",
					"fi": "Teksti",
					"und": "Teksti"
				}
			}
		}
		],
		"title": {
			"en": "Fairdata PAS Management Integration Test Dataset"
		},
		"creator": [
		{
			"name": "Teppo Testaaja",
			"@type": "Person",
			"member_of": {
				"name": {
					"fi": "Mysteeriorganisaatio"
				},
				"@type": "Organization"
			}
		}
		],
		"curator": [
		{
			"name": "Rahikainen",
			"@type": "Person",
			"member_of": {
				"name": {
					"fi": "MysteeriOrganisaatio"
				},
				"@type": "Organization"
			},
			"identifier": "id:of:curator:rahikainen"
		}
		],
		"language": [
		{
			"title": {
				"en": "English language",
				"fi": "Englannin kieli",
				"sv": "engelska",
				"und": "Englannin kieli"
			},
			"identifier": "http://lexvo.org/id/iso639-3/eng"
		}
		],
		"modified": "2014-01-17T08:19:58Z",
		"provenance": [
		{
			"temporal": {
				"start_date": "2018-06-01T17:41:59+03:00"
			},
			"description": {
				"en": "Provenance description"
			},
			"preservation_event": {
				"in_scheme": "https://metax.fairdata.fi/es/reference_data/preservation_event/_search?pretty",
				"identifier": "http://purl.org/att/reference_data/preservation_event/preservation_event_upd",
				"pref_label": {
					"en": "Object update",
					"fi": "Objektin päivitys",
					"und": "Objektin päivitys"
				}
			}
		}
		],
		"description": {
			"en": "Dataset for integration testing."
		},
		"access_rights": {
			"access_type": {
				"in_scheme": "https://metax.fairdata.fi/es/reference_data/access_type/_search?pretty",
				"identifier": "http://purl.org/att/es/reference_data/access_type/access_type_open_access",
				"pref_label": {
					"en": "Open",
					"fi": "Avoin",
					"und": "Avoin"
				}
			},
			"restriction_grounds": {
				"in_scheme": "https://metax.fairdata.fi/es/reference_data/restriction_grounds/_search?pretty",
				"identifier": "http://purl.org/att/es/reference_data/restriction_grounds/restriction_grounds_1",
				"pref_label": {
					"en": "Open, no known restrictions",
					"fi": "Avoin, ei tiedossa olevia rajoituksia",
					"sv": "Öppen tillgång, inga kända orsaker till begränsningar",
					"und": "Avoin, ei tiedossa olevia rajoituksia"
				}
			}
		},
		"version_notes": [
		"This version is initial version."
		],
		"total_ida_byte_size": 531,
		"preferred_identifier": "urn:nbn:fi:att:7802345a-c842-4b4e-9d56-9bb0c8075b0a",
		"metadata_version_identifier": "836b7a0f-b772-497c-a451-c81f42e39d25"
	},
	"preservation_state": 0,
	"removed": false,
	"date_created": "2018-08-08T12:22:43+03:00",
	"service_created": "tpas"
}


var flatDataset = flatten(dataset)

flatDataset['metadata_provider_org'] = "Gotcha, Inc."

console.log(flatDataset['metadata_provider_org'])
console.log(dataset['metadata_provider_org'])

flatDataset['data_catalog.new'] = "This is a new value"
console.log(flatDataset['data_catalog.new'])
console.log(dataset['data_catalog'])
