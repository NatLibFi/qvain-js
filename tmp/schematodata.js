
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

function toData2(ptr) {
	if (ptr === "") return ""

		var els = ptr.substring(1).split(/\//)
		var result = []
		var inProp = false
		var inComb = false

		for (let i in els) {
			if (inComb) {
				inComb = false
				if (els[i].match(/^(\d+)$/)) {
					continue
				}
			}
			if (els[i] === "properties" && !inProp) {
				inProp = !inProp
				continue
			}
			inProp = false
			if (els[i] === "anyOf" || els[i] === "allOf" || els[i] === "oneOf" || els[i] === "not") {
				if (els[i] === "not") {
					continue
				}
				inComb = true
				continue
			}
			result.push(els[i])
		}

		return "/" + result.join("/")
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

//export { toData, toSchema }

var totalTime, start = new Date, iterations = 6; while (iterations--) {
	toSchema("/properties/person/0/properties/name/properties/first")
} // totalTime → the number of milliseconds it took to execute // the code snippet 6 times
totalTime = new Date - start;

function printPath(path) {
	console.log(path, "-->", toData(path), " | ", toData2(path))
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
printPath("/properties/person/0")
printPath("")
printPath("/")
printPath("/anyOf")
printPath("/anyOf/0")
printPath("/allOf/0/properties/street_address")
printPath("/allOf/jack/properties/street_address")
printPath("/allOf/1/properties/type/enum/1")
printPath("/not")
printPath("/not/0")
printPath("/not/properties/name")
printPath("/not/allOf/0/properties/name")
printPath("/properties/name/properties/properties")
printPath("/properties/person/0")
printPath("/properties/person/0/name")
printPath("/properties/person/0/properties/name")

printToSchema("/jack/name")
printToSchema("/users/0")
printToSchema("/users/0/name")
