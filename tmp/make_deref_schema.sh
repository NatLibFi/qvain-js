#!/bin/sh

set -ex

node deref.js
jq '.allOf[0].properties.research_dataset' < deref.json > qvain-fairdata-ui.json
mv deref.json ../schema/qvain-fairdata-deref.json && mv qvain-fairdata-ui.json ../schema/
