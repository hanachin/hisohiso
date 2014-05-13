function withHooks(callback) {
    chrome.storage.sync.get({hooks:[]}, function (items) {
        callback(items.hooks);
    });
}

function saveHooks(hooks) {
    chrome.storage.sync.set({hooks: hooks}, function () {
        if (chrome.runtime.lastError) {
            alert('save hooks failed: ' + chrome.runtime.lastError);
        }
    });
}
