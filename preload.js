const {ipcRenderer} = require('electron')
// const ArcadePrototype = require('arcade-prototype');
const ArcadePrototype = require('./external/lib');
const { contextBridge } = require('electron');

window.addEventListener("DOMContentLoaded", () => {
    ArcadePrototype.ipcRenderer = ipcRenderer;
    ArcadePrototype.start();
    contextBridge.exposeInMainWorld('__arcadeFeu', ArcadePrototype);
})

