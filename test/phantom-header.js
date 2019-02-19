var casper = require('casper').create();
// how to dump headers and what they look like
casper.on('resource.requested', function (request) {
  console.log('Request ' + JSON.stringify(request, undefined, 4));
});

casper.on('resource.received', function (response) {
  console.log('Receive ' + JSON.stringify(response, undefined, 4));
});
