#!/bin/sh
echo "start KAKAO API Server by forever !!"
forever start -o /home/ec2-user/hjw/src/logs/out.log -e /home/ec2-user/hjw/src/logs/err.log h.js
echo "forever -> KAKAO API 연동 서버 시작~~"
