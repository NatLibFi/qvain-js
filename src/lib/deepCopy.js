/*
	Make a deep clone of an object. Only supports JSON primitive types.

	Based on:
	
	https://www.npmjs.com/package/json-deep-copy
	https://github.com/zxdong262/deep-copy
	https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
*/
export default function deepCopy(src) {
  if (src == null || typeof src !== 'object') return src
  
  if (Array.isArray(src)) {
    let ret = src.slice()
    let i = ret.length
    while (i--) {
      ret[i] = deepCopy(ret[i])
    }
    return ret
  }

  let dest = {}
  for (let key in src) {
    dest[key] = deepCopy(src[key])
  }
  return dest
}