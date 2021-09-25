'use strict';

module.exports = core;

// require: .js/.json/.node
// .js =>  module.exports/exports
// .json => JSON.parse
// any => .js
const path = require('path');
const semver = require('semver');
const colors = require('colors/safe');
const log = require('@ifan-dev/log');

const constant = require('./const');
const pkg = require('../package.json');

const userHome = require('user-home');
const pathExists = require('path-exists').sync;

let args;
async function core() {
    try {
        checkInputArgs();
        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
        checkUserHome();
        checkEnv();
        await checkGlobalUpdate();
    } catch(e) {
        log.error(e.message);
    }
}

async function checkGlobalUpdate() {
    // 1. 获取当前版本号
    const currentVersion = pkg.version;
    const npmName = pkg.name;
    const { getNpmSemverVersion } = require('@ifan-dev/get-npm-info');
    const lastVersion = await getNpmSemverVersion(currentVersion, npmName);
    if(lastVersion && semver.gt(lastVersion, currentVersion)) {
        log.warn('更新提示', colors.yellow(`
        请手动更新 ${npmName}，当前版本: ${currentVersion}, 最新版本：${lastVersion}
        更新命令：npm install -g ${npmName}`))
    }
    // 2. 调用 npm api，获取所有版本号
    // 3. 提取所有版本号，比对哪些大于当前版本
    // 4. 获取最新版本号，提示用户更新到该版本
}

function checkEnv() {
    const dotenv = require("dotenv");
    const dotenvPath = path.resolve(userHome, '.env');
    if(pathExists(dotenvPath)) {
        dotenv.config({
            path: dotenvPath,
        })
    }
    createDefaultConfig()
    log.verbose('环境变量', process.env.CLI_HOME_PATH);
}

function createDefaultConfig() {
    const cliConfig = {
        home: userHome,
    }
    if(process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
    } else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

function checkInputArgs() {
    const minimist = require("minimist");
    args = minimist(process.argv.slice(2));
    checkArgs();
}

function checkArgs() {
    if(args.debug) {
        process.env.LOG_LEVEL = 'verbose';
    } else {
        process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
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