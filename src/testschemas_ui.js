

var _testTabSchema = {
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
	'/properties/phone/properties/personal': { 'description': "personal phone number" },
	'/properties/phone/properties/work': { 'description': "work phone number" },
	'/properties/location': { 'tab': 2, 'widget': 'widget-googlemaps', 'label': "coordinates" },
	'/properties/pets': { 'tab': 3 },
	'/properties/pets/properties/cat': { 'tab': 4 },
	'/properties/phone': { 'tab': 5 },
	'/properties/phone/properties/personal': { 'tab': 1, 'description': "personal phone number" },
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


var testSchemaUis = {
	'tabs': _testTabSchema,
	'tabs2': _testTabSchema2,
	'funder': _testFunderWidget,
	'fairdata-ui': _schemaFairDataUI,
}

export default testSchemaUis
