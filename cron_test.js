var cron = require('node-cron');

cron.schedule('*/1 11-13 * * *', function () {
  console.log('info', 'At every minute past every hour from 11 through 13 ' + new Date());
  //logger.log();
});
