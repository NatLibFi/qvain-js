#!/bin/sh
#
# -wvh- download latest schemas from metax source code
#
# https://github.com/CSCfi/metax-api/tree/test/src/metax_api/api/rest/base/schemas
#

set -ex

ATT_SCHEMA_URL="https://raw.githubusercontent.com/CSCfi/metax-api/test/src/metax_api/api/rest/base/schemas/att_dataset_schema.json"
ATT_SCHEMA_FILE='att-'$(date "+%Y%m%d")'.json'
IDA_SCHEMA_URL="https://raw.githubusercontent.com/CSCfi/metax-api/test/src/metax_api/api/rest/base/schemas/ida_dataset_schema.json"
IDA_SCHEMA_FILE='ida-'$(date "+%Y%m%d")'.json'

curl -s -S -L --max-redirs 2 -H "Content-Type: application/schema+json" -H "Accept-Language: en" ${ATT_SCHEMA_URL} > ${ATT_SCHEMA_FILE}
curl -s -S -L --max-redirs 2 -H "Content-Type: application/schema+json" -H "Accept-Language: en" ${IDA_SCHEMA_URL} > ${IDA_SCHEMA_FILE}
ln -fs ${ATT_SCHEMA_FILE} att.json
ln -fs ${IDA_SCHEMA_FILE} ida.json
