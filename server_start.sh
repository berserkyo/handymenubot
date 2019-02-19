#!/bin/sh
echo "start HandyMenuBot for KAKAO API Server by pm2 !!"
pm2 start handybot_server.js
echo "forever -> HandyMenuBot for KAKAO API Server Start !!"

#echo "start HandyMenuBot for KAKAO API Server by forever !!"
#forever start -o /home/ec2-user/hjw/src/logs/handybot_server_out.log -e /home/ec2-user/hjw/src/logs/handybot_server_err.log handybot_server.js
#echo "forever -> HandyMenuBot for KAKAO API 연동 서버 시작~~"
