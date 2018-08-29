import FairdataIdaSchema from './fairdata-ida.schema.json'
import FairdataIdaUi from './fairdata-ida.ui.js'

// Qvain backend knows these schemas as:
//
//   ida: {family: 2, schema: "metax-ida"}
//   att: {family: 2, schema: "metax-att"}
//

export default {
	ida: {
		schema: FairdataIdaSchema,
		ui: FairdataIdaUi,
		name: "Fairdata (IDA)",
		id: "metax-ida",
		family: 2,
	},
}
