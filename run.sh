#!/bin/sh
mode="dev"
start_prod="npm run forever-start"
start_dev="npm run nodemon-start"
start_test="npm test"

while getopts m: OPT
do
    case $OPT in
        m) mode="$OPTARG" ;;
    esac
done

# 環境変数設定
if [ "${mode}" = "prod" ]; then
    export NODE_ENV=production
    export PORT=3001    
elif [ ${mode} = "test" ]; then
    export NODE_ENV=test
    export PORT=3001             
else
    export NODE_ENV=development
    export PORT=3001
fi

# 起動コマンド
if [ ${mode} = "prod" ]; then
    #eval $start_prod
    eval $start_dev   
elif [ ${mode} = "test" ]; then
    eval $start_test
else
    eval $start_dev
fi
