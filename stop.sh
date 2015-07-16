#!/bin/sh
l=$(npm run forever-list | grep usermanage)
uid=$(echo $l | cut -d " " -f 3)
npm run forever-stop $uid
