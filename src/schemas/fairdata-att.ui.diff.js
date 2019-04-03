// Copy IDA UI and edit only changed fields
export default (idaUi) => {
	return {
		...idaUi,
		'/properties/files': {
			'tab': 'notab',
		},
		'/properties/directories': {
			'tab': 'notab',
		},
		'/properties/remote_resources': {
			'tab': 'files',
			'widget': 'schema-array',
		},
		'/properties/remote_resources/*/properties/license': {
			'widget': 'reference-data',
			'props': {
				'esIndex': "reference_data",
				'esDoctype': "license",
				'typeahead': false,
				'tags': false,
				'async': false,
				'count': 100,
				'grouped': false,
				'labelNameInSchema': 'title',
			},
			'placeholder': "– choose license –",
			'title': "license",
		},
		'/properties/remote_resources/*/properties/file_type': {
			'widget': 'reference-data',
			'props': {
				'esIndex': "reference_data",
				'esDoctype': "file_type",
				'typeahead': false,
				'tags': false,
				'async': false,
				'count': 100,
				'grouped': false,
				'labelNameInSchema': 'title',
			},
			'placeholder': "– choose file type –",
			'title': "file type",
		},
		'/properties/remote_resources/*/properties/resource_type': {
			'widget': 'reference-data',
			'props': {
				'esIndex': "reference_data",
				'esDoctype': "resource_type",
				'typeahead': false,
				'tags': false,
				'async': false,
				'count': 100,
				'grouped': false,
				'labelNameInSchema': 'title',
			},
			'placeholder': "– choose resource type –",
			'title': "resource type",
		},
		'/properties/remote_resources/*/properties/use_category': {
			'widget': 'reference-data',
			'props': {
				'esIndex': "reference_data",
				'esDoctype': "use_category",
				'typeahead': false,
				'tags': false,
				'async': false,
				'count': 100,
				'grouped': false,
				'labelNameInSchema': 'title',
			},
			'placeholder': "– choose use category –",
			'title': "use category",
		},
	}
}
