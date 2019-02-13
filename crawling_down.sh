#!/bin/sh
echo "down Crawling by forever !!"
forever stop crawl_ottimo.js
forever stop crawl_wellstory.js
forever stop crawl_pavan.js
echo "forever -> Crawling 기능 정지"
