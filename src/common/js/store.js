
// 后期需要重构
export function saveToLocal(id, key, value) {

    let lgzy = window.localStorage.__lgzy__s__;
    if (!lgzy) {
        lgzy = {};
        lgzy[id] = {};
    } else {
        lgzy = JSON.parse(lgzy);
        if (!lgzy[id]) {
            lgzy[id] = {};
        }
    }

    lgzy[id][key] = value;
    // console.log(lgzy);
    window.localStorage.__lgzy__s__ = JSON.stringify(lgzy);
}

// 之后统一用这个
export function lgLocalStorage(name, value) {
    if(value) {
        // 存
        let item;
        item = JSON.stringify(value);
        window.localStorage.setItem(name, item);
    }else {
        // 取
        return JSON.parse(window.localStorage.getItem(name));
    }
    
}


export function loadFromLocal(id, key, def) {
    let lgzy = window.localStorage.__lgzy__s__;
    if (!lgzy) {
        return def;
    }
    lgzy = JSON.parse(lgzy)[id];
    if (!lgzy) {
        return def;
    }
    return lgzy[key];
}
    
export function saveCurrentChild(id) {
    window.localStorage.currentChild = id
}

export function deleteCurrentChild() {
    window.localStorage.currentChild = ''
}

export function getCurrentChild() {
    return window.localStorage.currentChild
}

export function getLang() {
    return window.localStorage.localeLanguage || 'zh'
}

export function clearLoacl() {
    window.localStorage.clear();
}