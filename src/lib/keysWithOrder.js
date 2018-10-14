// keysWithOrder takes an object and array and returns the keys of that object with those in the array sorted first (and then the rest).
export default function keysWithOrder(obj, order) {
	// NOTE: IE11 doesn't support Set(iterator)
	let keySet = new Set(order.filter(x => x in obj))
	Object.keys(obj).forEach(k => keySet.add(k))
	return Array.from(keySet)
}
