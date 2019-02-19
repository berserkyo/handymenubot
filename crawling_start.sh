#!/bin/sh
echo "start Crawling by pm2 !!"
pm2 start crawl_ottimo.js
pm2 start crawl_pavan.js
pm2 start crawl_wellstory_by_node_script.js
echo "pm2 -> Crawling 시작~~"
#echo "start Crawling by forever !!"
#forever start -o /home/ec2-user/hjw/src/logs/crawl_ottimo_out.log -e /home/ec2-user/hjw/src/logs/crawl_ottimo_err.log crawl_ottimo.js
#forever start -o /home/ec2-user/hjw/src/logs/crawl_well_out.log -e /home/ec2-user/hjw/src/logs/crawl_well_err.log crawl_wellstory.js
#forever start -o /home/ec2-user/hjw/src/logs/crawl_pavan_out.log -e /home/ec2-user/hjw/src/logs/crawl_pavan_err.log crawl_pavan.js
#echo "forever -> Crawling 시작~~"
