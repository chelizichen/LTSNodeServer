#!/bin/bash  

readonly ServerName="TestNodeServer"
rm -r ./build
mkdir ./build

npm run build

cp ./simp.yaml ./build/
cp package.json ./build/
cp package-lock.json ./build/

tar -cvf $ServerName.tar.gz ./build