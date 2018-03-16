#!/bin/sh
#
# -wvh- extract alpha-2 and alpha-3 codes from iso629-3 tab separated file
#
#       field 1: 3-letter
#       field 4: 2-letter (if exists)
#       field 7: full language name (might contain braces)
#

IN="iso-639-3_20180123.tab"
OUT_TWO_LETTER="iso639-1.json"
OUT_THREE_LETTER="iso639-2.json"

set -ex

# 2-letter
awk -F $'\t' -v ORS="" 'BEGIN{print "{"}; $4 ~ /^[a-z][a-z]$/ {count++; gsub("[ ]*\\(.*\\)", "", $7); print (count == 1 ? "" : ",") "\x22" $4 "\x22:\x22" $7 "\x22"}; END{print "}\n"};' ${IN} > ${OUT_TWO_LETTER}

# 3-letter
awk -F $'\t' -v ORS="" 'BEGIN{print "{"}; $1 ~ /^[a-z][a-z][a-z]$/ {count++; gsub("[ ]*\\(.*\\)", "", $7); print (count == 1 ? "" : ",") "\x22" $1 "\x22:\x22" $7 "\x22"}; END{print "}\n"};' ${IN} > ${OUT_THREE_LETTER}
