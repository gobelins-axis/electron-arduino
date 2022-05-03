const {ipcRenderer} = require('electron')

window.addEventListener("DOMContentLoaded", () => {
    window.__arcade__.set_ipc_renderer(ipcRenderer);
})

