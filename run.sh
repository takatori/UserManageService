#!/bin/sh
DIR=$(cd $(dirname $0) && pwd)
mode="dev"
env="dev"
start_prod="${DIR}/node_modules/.bin/forever start --uid 'usermanage' -a app.js"
start_dev="${DIR}/node_modules/.bin/nodemon app.js"
start_test="${DIR}/node_modules/.bin/mocha --reporter spec"

while getopts m:e: OPT
do
    case $OPT in
        m) mode="$OPTARG" ;;
        e) env="$OPTARG"
    esac
done

# 環境変数設定
if [ ${mode} = "prod" ]; then
    export NODE_ENV=production
    export PORT=3001    
elif [ ${mode} = "test" ]; then
    export NODE_ENV=test
    export PORT=3001             
else
    if [ ${env} = "prod" ]; then
        export NODE_ENV=production
        export PORT=3001
    else
        export NODE_ENV=development
        export PORT=3001
    fi
fi

# 起動コマンド
if [ ${mode} = "prod" ]; then
    eval $start_prod
elif [ ${mode} = "test" ]; then
    eval $start_test
else
    eval $start_dev
fi
