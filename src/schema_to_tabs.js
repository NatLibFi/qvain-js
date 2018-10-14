import { foreachSchema } from './lib/foreach_schema.js'
//import jsonpointer from 'json-pointer'

function schemaToTabs(schema, ui, tabs) {
	let curTab = "0"
	foreachSchema(schema, function(path) {
		console.log("path:", path, "tab:", curTab)
		let newTab = path in ui && 'tab' in ui[path] ? ui[path].tab : undefined
		if (newTab !== undefined && newTab !== curTab) {
			console.log("new tab:", newTab)
			tabs.push(newTab)
		}
	})
}

function schemaToTabs2(schema, ui, tabs) {
	for (let path in ui) {
		let newTab = ui[path]['tab']
		if (newTab !== undefined && newTab !== "0") {
			console.log("new tab:", newTab)
			tabs.push(newTab)
		}
	}
}

export { schemaToTabs, schemaToTabs2 }
