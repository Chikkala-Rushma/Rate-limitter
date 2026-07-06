const map = new Map();

export function registerScript(name, sha,script) {
    map.set(name, {sha:sha,script:script});
}

export function getScriptSha(name) {
    console.log('map', map)
    return map.get(name).sha;
}

export function getScript(name) {
    return map.get(name).script;
}

export function getScriptInfo(name, newSha) {
    return map.get(name);
}