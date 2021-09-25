'use strict';
const log = require('npmlog');

log.level = process.env.LOG_LEVEL || 'info'; // 判断 debug 模式

log.heading = 'ifan'; // 修改前缀
log.headingStyle = { fg: 'black', bg: 'white' };

log.addLevel('name', 2000, { fg: 'green', bold: true }); // 添加自定义命令

function index() {
    log.info('cli', 'log test');
}

module.exports = log;
