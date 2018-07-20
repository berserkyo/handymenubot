#!/bin/sh
echo "start Crawling by forever !!"
forever start -o /home/ec2-user/hjw/src/logs/crawl_out.log -e /home/ec2-user/hjw/src/logs/crawl_err.log dl-image.js
echo "forever -> Crawling 시작~~"
