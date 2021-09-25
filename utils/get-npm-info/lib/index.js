'use strict';

const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');

function getNpmInfo(npmName, registry) {
    if(!npmName) {
        return null;
    }
    const registryUrl = registry || getDefaultRegistry();
    const npmUrlInfo = urlJoin(registryUrl, npmName);
    return axios.get(npmUrlInfo).then(res => {
        if(res.status === 200) {
            return res.data;
        }
        return null;
    }).catch(err => {
        return Promise.reject(err);
    });
}

function getDefaultRegistry(isOriginal = false) {
    return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org';
}

async function getNpmVersion(npmName, registry) {
    const data = await getNpmInfo(npmName, registry);
    if(data) {
        return Object.keys(data.versions);
    } else {
        return [];
    }
}

function getSemverVersions(baseVersion, versions) {
    return versions
        .filter(version => semver.satisfies(version, `^${baseVersion}`)) // 大于等于 baseVersion
        .sort((a, b) => semver.gt(b, a));
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
    const versions = await getNpmVersion(npmName, registry);
    const newVersions =  getSemverVersions(baseVersion, versions)
    if(newVersions && newVersions.length > 0) {
        return newVersions[0];
    }
}

module.exports = {
    getNpmInfo,
    getNpmVersion,
    getNpmSemverVersion,
};