

var _testTabSchema = {
	'tabs': ["first", "second"],
	'/properties/user': {
		'tab': 1,
	},
	'/properties/location': {
		'tab': 2,
	},
}


var _testTabSchema2 = {
	'': { 'tab': 0 },
	'/properties/user': { 'tab': 1 },
	'/properties/user/properties/first_name': { 'description': "your first name" },
	'/properties/user/properties/last_name': { 'description': "your last name" },
	'/properties/user/properties/age': { 'description': "your age" },
	'/properties/user/properties/phone': { 'description': "a phone number" },
	'/properties/phone/properties/personal': { 'tab': 1, 'description': "personal phone number" },
	'/properties/phone/properties/work': { 'description': "work phone number" },
	'/properties/location': { 'tab': 2, 'widget': 'widget-googlemaps', 'label': "coordinates" },
	'/properties/pets': { 'tab': 3 },
	'/properties/pets/properties/cat': { 'tab': 4 },
	'/properties/phone': { 'tab': 5 },
}


var _testFunderWidget = {
	'': { 'tab': 1 },
	'/properties/funder_type': {
		'widget': 'refdata-list',
		'placeholder': "– choose funder type –",
		'label': "funder type",
		'description': "This is some fancy optional description for the funder field",
		'help': "This is the optional help text for the funder field",
	},
	'/properties/title': {
		'widget': 'i18n-string',
		'props': {
			isTitle: true,
			freeform: false,
		},
		'placeholder': "dataset title",
		'label': "title",
		'description': "title of the dataset",
		'help': "This is help for the title of the dataset",
	},
}


var _schemaFairDataUI = {
	'': { 'tab': 1 },
	'#/definitions/langString': {
		'widget': 'i18n-string',
		'placeholder': "text",
		//'label': "multilingual string",
		//'description': "multilingual string",
		'help': "An item possibly defined in multiple languages.",
	},
}


var _schemaFairDataUiTabs = {
	'tabs': ["Content Description", "Temporal and Spatial Coverage", "Actors", "Relations and History", "Files", "(Extra)"],
	'': { 'tab': 1 },
	'#/definitions/langString': {
		'widget': 'i18n-string',
		'placeholder': "text",
		//'label': "multilingual string",
		//'description': "multilingual string",
		'help': "An item possibly defined in multiple languages.",
	},
	'/properties/title': {
		'tab': 1,
		'label': "Title",
		'title': "Name of the dataset",
		'description': "Dataset must have a name, i.e. title. There can be only one name, but it can have translations. Please give the language of the name (and its translations).",
		'placeholder': "title",
		'widget': 'i18n-string',
		'props': {
			'isTitle': true,
		},
	},
	'/properties/keyword': {
		'tab': 1,
		'title': "Keywords",
		'description': "Give free keywords that characterize the dataset. Below, there is an other field for controlled subject headings.",
		'placeholder': "keywords",
	},
	'/properties/language': {
		'tab': 1,
		'title': "Language",
		'description': "Language or languages used in the data contents.",
	},
	'/properties/description': {
		'tab': 1,
		'title': "Description",
		'description': "A characterization of the dataset that lucidly describes the dataset. Add new field for each language version. Please define the language used in each case.",
	},
	'/properties/bibliographic_citation': {
		'tab': 6,
		'title': "Recommended Bibliographic Citation",
		'description': "Your preferred way to cite the dataset in publications, etc.",
	},
	'/properties/theme': {
		'tab': 1,
		'title': "Subject heading",
		'description': "Choose subject headings from the General Finnish Ontology (YSO). It also has English and Swedish translations of the terms.",
	},
	'/properties/field_of_science': {
		'tab': 1,
		'title': "Field of Science",
		'description': "Field of science in the classification of the Ministry of Education and Culture.",
	},
	'/properties/temporal': {
		'tab': 2,
		'title': "Temporal coverage",
		'description': "Time span that is covered by the dataset, e.g. period of observations.",
	},
	'/properties/spatial': {
		'tab': 2,
		'title': "Spatial coverage",
		'description': "Area covered by the dataset, e.g. places of observations.",
	},
	// "producer project"
	'/properties/is_output_of': {
		'tab': 3,
		'title': "Producer Project",
		'description': "Project in which the dataset was created",
	},
	'/properties/creator': {
		'tab': 3,
		'title': "Creator of the dataset",
		'description': "The principal researcher or researchers involved in producing the data.",
	},
	// missing: distributor
	'/properties/contributor': {
		'tab': 3,
		'title': "Contributor",
		'description': "The organization or person that has participated in collecting, managing, or distributing of the dataset, or that has otherwise contributed to its development.",
	},
	'/properties/curator': {
		'tab': 3,
		'title': "Curator",
		'description': "Person tasked with reviewing, enhancing, cleaning, and standardizing metadata and the associated data.",
	},
	// missing: owner
	'/properties/relation': {
		'tab': 4,
		'title': "Reference to a related resource",
		'description': "Another dataset, publication, infrastructure and so on, related to this dataset.",
	},
	'/properties/provenance': {
		'tab': 4,
		'title': "Life cycle event",
		'description': "An action or event that the dataset was the subject of.",
	},
	'/properties/files': {
		'tab': 5,
	},
	'/properties/directories': {
		'tab': 5,
	},
	'/properties/remote_resources': {
		'tab': 5,
	},
	'/properties/access_rights': {
		'tab': 6,
		'title': "Access rights",
		'description': "*** description for access rights goes here ***"
	},
	'/properties/publisher': {
		'tab': 6,
		'title': "Publisher",
		'description': "*** description for publisher goes here ***",
	},
	'/properties/field_of_science': {
		'tab': 6,
		'title': "Field of Science",
		'description': "*** description for field of science goes here ***",
	},
	'/properties/issued': {
		'tab': 6,
		'title': "Issued",
		'description': "*** description for issued goes here ***",
	},
	'/properties/modified': {
		'tab': 6,
		'title': "modified",
		'description': "*** description for modified goes here ***",
	},
	'/properties/infrastructure': {
		'tab': 6,
		'title': "Infrastructure",
		'description': "*** description for infrastructure goes here ***",
	},
	'/properties/metadata_version_identifier': {
		'tab': 6,
		'title': "Metadata version identifier",
		'description': "*** description for metadata version identifier goes here ***",
	},
	'/properties/preferred_identifier': {
		'tab': 6,
		'title': "Preferred identifier",
		'description': "*** description for preferred identifier goes here ***",
	},
	'/properties/other_identifier': {
		'tab': 6,
		'title': "Other identifier",
		'description': "*** description for other identifier goes here ***",
	},
	'/properties/rights_holder': {
		'tab': 6,
		'title': "Rights holder",
		'description': "*** description for rights holder goes here ***",
	},
	'/properties/total_ida_byte_size': {
		'tab': 6,
		'title': "Total ida byte size",
		'description': "*** description for total ida byte size goes here ***",
	},
	'/properties/total_remote_resources_byte_size': {
		'tab': 6,
		'title': "Total remote resources byte size",
		'description': "*** description for total remote resources byte size goes here ***",
	},
	'/properties/value': {
		'tab': 6,
		'label': "Quality",
		'description': "Metadata quality value calculated in some manner.",
	},
	'/properties/version_info': {
		'tab': 6,
		'title': "Version info",
		'description': "*** description for version info goes here ***",
	},
	'/properties/version_notes': {
		'tab': 6,
		'title': "Version notes",
		'description': "*** description for version notes goes here ***",
	},
}


var testSchemaUis = {
	'tabs': _testTabSchema,
	'tabs2': _testTabSchema2,
	'funder': _testFunderWidget,
	'fairdata-ui-tabs': _schemaFairDataUiTabs,	'/properties/total_remote_resources_byte_size': {
		'tab': 6,
	},

}

export default testSchemaUis
