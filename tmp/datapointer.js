export function dataPointer(ptr) {
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

function ptrFor(path) {
}

ptrFor("")
ptrFor("/")
ptrFor("/identifier")
ptrFor("/properties/title")
ptrFor("/properties/properties/properties/name")
ptrFor("/properties/creator/0")
ptrFor("/properties/creator/0/properties/name")
ptrFor("/properties/creator/0/properties")
ptrFor("/properties/creator/0/properties/")
ptrFor("/properties/creator/oneOf/0/properties/name")
ptrFor("/properties/creator/oneOf/1/properties/partOf/properties/name")
ptrFor("/properties/creator/not/properties/name")
