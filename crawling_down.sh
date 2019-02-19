#!/bin/sh
echo "down Crawling by pm2 !!"
pm2 delete crawl_ottimo.js
pm2 delete crawl_pavan.js
pm2 delete crawl_wellstory_by_node_script.js
echo "pm2 -> Crawling 기능 정지"

#echo "down Crawling by forever !!"
#forever stop crawl_ottimo.js
#forever stop crawl_wellstory.js
#forever stop crawl_pavan.js
#echo "forever -> Crawling 기능 정지"
