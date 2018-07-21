#!/bin/sh
echo "start Crawling by forever !!"
forever start -o /home/ec2-user/hjw/src/logs/crawl_ottimo_out.log -e /home/ec2-user/hjw/src/logs/crawl_ottimo_err.log crawl_ottimo.js
forever start -o /home/ec2-user/hjw/src/logs/crawl_well_out.log -e /home/ec2-user/hjw/src/logs/crawl_well_err.log crawl_wellstory.js
echo "forever -> Crawling 시작~~"
