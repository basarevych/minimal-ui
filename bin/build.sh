#!/bin/sh

pkg=yarn
which $pkg > /dev/null 2>&1
if [ $? -ne 0 ]; then
    pkg=npm
fi

rm -rf ./dist
mkdir ./dist
cd front
$pkg build 
cd ..
cp -r front/build dist/front
find ./dist -name '*.map' -delete
cp -r api ./dist/api
cp server.js dist/
cp config.js.example dist/
cp package.json dist/
