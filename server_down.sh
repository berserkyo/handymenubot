#!/bin/sh
echo "down HandyMenuBot for KAKAO API Server by pm2 !!"
pm2 delete handybot_server.js
echo "forever -> HandyMenuBot for KAKAO API Server Down !!"

#echo "down HandyMenuBot for KAKAO API Server by forever !!"
#forever stop handybot_server.js
#echo "forever -> HandyMenuBot for KAKAO API 연동 서버 정지"
