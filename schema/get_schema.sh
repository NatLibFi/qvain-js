#!/bin/sh
#
# -wvh- download latest schema from iow.csc.fi
#
# http://iow.csc.fi/api/rest/exportResource?graph=http%3A%2F%2Fiow.csc.fi%2Fns%2Fmrd%23CatalogRecord&content-type=application%2Fschema%2Bjson&lang=en&raw=true
# http://iow.csc.fi/api/rest/exportModel?graph=http%3A%2F%2Fiow.csc.fi%2Fns%2Fmrd&content-type=application%2Fschema%2Bjson&lang=en
#

#SCHEMA_URL="http://iow.csc.fi/ns/mrd"
#SCHEMA_URL="http://iow.csc.fi/api/resolve/mrd"
SCHEMA_URL="http://iowdev.csc.fi/ns/mrd.jschema"

curl -i -L --max-redirs 2 -H "Content-Type: application/schema+json" -H "Accept-Language: en" ${SCHEMA_URL}
