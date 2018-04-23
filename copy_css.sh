#!/bin/sh
#
# -wvh- copy css from node modules to vendor directory
#
#       Make sure you've got bootstrap-vue and boostrap installed:
#         npm i bootstrap-vue bootstrap@4.0.0-beta.2
#
#       Check the last version of bootstrap (excluding/including preleases):
#         npm show react-native@* version
#         npm show bootstrap versions
#

[ -d "public/vendor/bootstrap-vue" ] || mkdir -p "public/vendor/bootstrap-vue"
[ -d "public/vendor/bootstrap" ] || mkdir -p "public/vendor/bootstrap"

cp -v node_modules/bootstrap-vue/dist/bootstrap-vue.css* public/vendor/bootstrap-vue/
cp -v node_modules/bootstrap/dist/css/bootstrap*.css* public/vendor/bootstrap/
