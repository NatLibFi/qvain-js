#!/bin/sh
#
# -wvh- list all results in ES for specific index
#

if [ -z "$1" ]; then
	echo usage: "$0 <index field>"
	exit 1
fi

set -ex

#curl -k -L -X GET 'https://metax-test.csc.fi/es/reference_data/funder_type/_search/?size=10000&pretty=1&_source=label.*'
curl -k -L -X GET 'https://metax-test.csc.fi/es/reference_data/'"$1"'/_search?size=10000&pretty=1&filter_path=hits.hits._source'
