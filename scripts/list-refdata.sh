#!/bin/sh
#
# -wvh- list refdata in Elastic Search
#

curl --user user:pass -k -L -X GET https://metax-test.csc.fi/es/_mapping | jq 'to_entries | .[] | {(.key): .value.mappings | keys}'
