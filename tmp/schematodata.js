
function toData(ptr) {
	if (ptr === "") return ""

	var els = ptr.substring(1).split(/\//)
	var inProp = false

	for (let i in els) {
		if (els[i] === "properties" && !inProp) {
			delete els[i]
			inProp = !inProp
		} else {
			inProp = false
		}
		if (els[i] === "anyOf" || els[i] === "allOf" || els[i] === "oneOf" || els[i] === "not") {
			if (els[i] === "not") {
				delete els[i]
				continue
			}
			delete els[i]
			let j = parseInt(i) + 1
			if (j < els.length && els[j].match(/^(\d+)$/)) {
				delete els[j]
			}
		}
	}

	return "/" + els.filter(x => x !== undefined).join("/")
}

function toSchema(ptr) {
	if (ptr === "") return ""

	var els = ptr.substring(1).split(/\//)

	for (let i in els) {
		if (els[i].match(/^(\d+|-)$/)) {
		} else {
			//els.splice(i, 0, "properties")
			els[i] = "properties/" + els[i]
		}
	}

	return "/" + els.join("/")
}


function printPath(path) {
	console.log(path, "-->", toData(path))
}

function printToSchema(path) {
	console.log(path, "-->", toSchema(path))
}

printPath("/person/properties/ablke")
printPath("/person/properties/ablke/properties")
printPath("/person/properties/ablke/properties/name")
printPath("/person/properties/properties")
printPath("/person/properties/properties/name")
printPath("/person/properties/properties/properties")
printPath("/person/0")
printPath("")
printPath("/")
printPath("/anyOf")
printPath("/anyOf/0")
printPath("/not")
printPath("/not/0")

printToSchema("/jack/name")
printToSchema("/users/0")
printToSchema("/users/0/name")
