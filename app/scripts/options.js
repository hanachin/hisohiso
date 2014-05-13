'use strict';

document.addEventListener('DOMContentLoaded', function () {
    var name = document.querySelector('input[name=name]');
    var url  = document.querySelector('input[name=url]');

    function isFilledRequiredFields() {
        return !!name.value && !!url.value;
    }

    function clearFields() {
        name.value = '';
        url.value  = '';
    }

    function saveHooks(hooks) {
        chrome.storage.sync.set({hooks: hooks}, function () {
            if (chrome.runtime.lastError) {
                alert('save hooks failed: ' + chrome.runtime.lastError);
            }
        });
    }

    function getHookConfig() {
        return {name: name.value, url: url.value};
    }

    function withHooks(callback) {
        chrome.storage.sync.get({hooks:[]}, function (items) {
            callback(items.hooks);
        });
    }

    function addButtonClicked() {
        withHooks(function (hooks) {
            if (!isFilledRequiredFields()) {
                return alert('Oops, please input idobata hook name and idobata hook url!');
            }
            hooks.push(getHookConfig());
            saveHooks(hooks);
            clearFields();
        });
    }

    function removeHook(e) {
        var hookElem = e.target.parentElement;
        var hookElems = document.querySelectorAll('.hook');
        var elemIndex = null;
        for (var i = 0; i < hookElems.length; i++) {
            if (hookElems.item(i) === hookElem) {
                elemIndex = i;
            }
        }
        withHooks(function (hooks) {
            saveHooks(hooks.filter(function (element, index, array) {
                return index != elemIndex;
            }));
        });
    }

    function hookElement(hook) {
        var elem = document.createElement('li');
        elem.className += 'hook'
        elem.innerHTML = '<span class="name">' + hook.name + '</span>' + '<br/>' + '<span class="url">' + hook.url + '</span><br/><button class="delete">削除</button>';
        elem.querySelector('.delete').addEventListener('click', removeHook, false);
        return elem;
    }

    function renderHooks() {
        var hooksList = document.getElementById('hooks-list');
        hooksList.innerHTML = '';
        withHooks(function (hooks) {
            hooks.forEach(function (hook) {
                hooksList.appendChild(hookElement(hook));
            });
        });
    }

    document.querySelector('button[name=add]').addEventListener('click', addButtonClicked, false);
    chrome.storage.onChanged.addListener(renderHooks);
    renderHooks();
}, false);
