#!/bin/sh

sed -i -e "s@##AOB_UI_BFF_URL##@$APPLICATION_BFF_URL@g" build/static/js/main.*.js
sed -i -e "s@##AOB_UI_BFF_URL##@$APPLICATION_BFF_URL@g" build/static/js/main.*.js.map
http-server build