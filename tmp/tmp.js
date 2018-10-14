var testString = "/properties/person/0/properties/name/properties/first"

function toData1(ptr) {
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
					continue;
				}
				delete els[i]
				let j = parseInt(i) + 1
				if (j < els.length && els[j].match(/^(\d+)$/)) {
					delete els[j]
				}
			}
		}

		//return "/" + els.filter(x => x !== undefined).join("/")
		//return "/" + els.join("/")
		return els.filter(x => x !== undefined)
}

function toData2(ptr) {
	if (ptr === "") return ""

		var els = ptr.substring(1).split(/\//)
		var result = []
		var inProp = false

		for (let i in els) {
			if (els[i] === "properties" && !inProp) {
				inProp = !inProp
				continue
			} else {
				inProp = false
			}
			if (els[i] === "anyOf" || els[i] === "allOf" || els[i] === "oneOf" || els[i] === "not") {
				if (els[i] === "not") {
					continue;
				}
				let j = parseInt(i) + 1
				if (j < els.length && els[j].match(/^(\d+)$/)) {
					continue
				} else {
					//result.push(els[j])
				}
			}
			result.push(els[i])
		}

		//return "/" + result.join("/")
		return result
}

function toData3(ptr) {
	if (ptr === "") return ""

		var els = ptr.substring(1).split(/\//)
		var result = []
		var inProp = false

		for (let i in els) {
			if (els[i] === "properties" && !inProp) {
				inProp = !inProp
				continue
			}
			result.push(els[i])
			//if (inProp) { inProp = false };
			inProp = false
			if (els[i] === "anyOf" || els[i] === "allOf" || els[i] === "oneOf" || els[i] === "not") {
				if (els[i] === "not") {
					continue;
				}
				let j = parseInt(i) + 1
				if (j < els.length && els[j].match(/^(\d+)$/)) {
				} else {
					result.push(els[j])
				}
			}
		}

		//return "/" + result.join("/")
		return result
}



console.log(toData1(testString))
console.log(toData2(testString))
console.log(toData3(testString))

var totalTime, start = new Date, iterations = 100000; while (iterations--) {
	toData1("/properties/person/0/properties/name/properties/first")
}
totalTime = new Date - start;
console.log(totalTime)

var totalTime, start = new Date, iterations = 100000; while (iterations--) {
	toData2("/properties/person/0/properties/name/properties/first")
}
totalTime = new Date - start;
console.log(totalTime)

var totalTime, start = new Date, iterations = 100000; while (iterations--) {
	toData3("/properties/person/0/properties/name/properties/first")
}
totalTime = new Date - start;
console.log(totalTime)
