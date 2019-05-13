#!/bin/bash
#
# -wvh- call node to deref schemas and jq to do some layout housekeeping
#

set -ex

node deref.js
for fn in _ida.schema.json _att.schema.json; do
	jq --tab '.allOf[0]' < ${fn} > fairdata-${fn:1}
	rm ${fn}
done
