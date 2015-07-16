#!/bin/sh
DIR=$(cd $(dirname $0) && pwd) # 現在のディレクトリ
stop="${DIR}/node_modules/.bin/forever stop usermanage"
eval $stop

