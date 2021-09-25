'use strict';

module.exports = core;

// require: .js/.json/.node
// .js =>  module.exports/exports
// .json => JSON.parse
// any => .js
const semver = require('semver');
const colors = require('colors/safe');
const log = require('@ifan-dev/log');

const constant = require('./const');
const pkg = require('../package.json');

const userHome = require('user-home');
const pathExists = require('path-exists').sync;

function core(argv) {
    try {
        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
        checkUserHome();
    } catch(e) {
        log.error(e.message);
    }
}

function checkUserHome() {
    if(!userHome || !pathExists(userHome)) {
        throw new Error(colors.red(`当前登陆用户主目录不存在！`));
    }
}

function checkRoot() { 
    const rootCheck = require('root-check');
    rootCheck();
}

function checkPkgVersion() {
    log.notice('cli', pkg.version);
}

function checkNodeVersion() {
    // 1 获取当前版本号
    const currentVersion = process.version;
    const lowestVersion = constant.LOWEST_NODE_VERSION;
    if(!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`ifan-dev 需要安装 v${lowestVersion} 以上版本的 Node.js`))
    }
    // console.log();
    // 2 比对最低版本号
}