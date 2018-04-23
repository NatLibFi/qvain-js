#!/bin/sh
#
# -wvh- download latest schema from iow.csc.fi
#
# http://iow.csc.fi/api/rest/exportResource?graph=http%3A%2F%2Fiow.csc.fi%2Fns%2Fmrd%23CatalogRecord&content-type=application%2Fschema%2Bjson&lang=en&raw=true
# http://iow.csc.fi/api/rest/exportModel?graph=http%3A%2F%2Fiow.csc.fi%2Fns%2Fmrd&content-type=application%2Fschema%2Bjson&lang=en
#

set -ex

#SCHEMA_URL="http://iow.csc.fi/ns/mrd"
#SCHEMA_URL="http://iow.csc.fi/api/resolve/mrd"
#SCHEMA_URL="http://iowdev.csc.fi/ns/mrd.jschema"

SCHEMA_URL="https://tietomallit.suomi.fi/api/rest/exportModel?graph=http%3A%2F%2Furi.suomi.fi%2Fdatamodel%2Fns%2Fmrd&content-type=application%2Fschema%2Bjson&lang=en&raw=true"
TARGET='tietomallit_ns_mrd-'$(date "+%Y%m%d")'.json'

#curl -i -L --max-redirs 2 -H "Content-Type: application/schema+json" -H "Accept-Language: en" ${SCHEMA_URL}
curl -s -S -L --max-redirs 2 -H "Content-Type: application/schema+json" -H "Accept-Language: en" ${SCHEMA_URL} > ${TARGET}
ln -fs ${TARGET} schema.json

SCHEMA_URL="https://raw.githubusercontent.com/CSCfi/metax-api/test/src/metax_api/api/rest/base/schemas/ida_dataset_schema.json"
TARGET='metax_ida_dataset-'$(date "+%Y%m%d")'.json'

curl -s -S -L --max-redirs 2 -H "Content-Type: application/schema+json" -H "Accept-Language: en" ${SCHEMA_URL} > ${TARGET}
ln -fs ${TARGET} ida.json
