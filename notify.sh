#!/bin/bash

repo=$CI_PROJECT_NAME # 项目信息
tag=$CI_COMMIT_REF_NAME # 分支号或者tag
pipline_url=$CI_JOB_URL # 任务运行的gitlab url
user=$GITLAB_USER_NAME # 提交人
result=""

if [ $CI_JOB_STATUS = "success" ]; then
    result="✅ build success"
else
    result="❌ '\e[41;36m build failed\e[0m'"
fi

# 调用企业微信机器人api发消息
uri='https://hooks.slack.com/services/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'
content="【Gitlab Ci Build Result】
User: $user
Repo: $repo
Tag: 🐶
Result: $result"

#echo $content
curl $uri \
    -H 'Content-Type: application/json' \
    -d "{\"msgtype\":\"text\",\"text\":{\"content\":\"$content\"}}"

curl -X POST --data-urlencode \
"payload={\"channel\": \"#test-for-slack-app\", \"username\": \"CI-build-bot\", \"text\": \"$content.\"}" $uri