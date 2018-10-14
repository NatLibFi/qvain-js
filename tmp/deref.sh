#!/bin/bash
#
# -wvh- call node to deref schemas and jq to do some layout housekeeping
#

set -ex

node deref.js
for fn in _ida.json _att.json; do
	jq --tab '.allOf[0]' < ${fn} > ${fn:1}
	rm ${fn}
done
