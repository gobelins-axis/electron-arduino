const { app, BrowserWindow } = require('electron')
const {SerialPort} = require('serialport');
const { ipcMain } = require('electron')
require('dotenv').config();
const path = require('path')

try {
    require('electron-reloader')(module)
} catch (_) {}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadURL('https://google.com')
}


app.whenReady().then(() => {
    createWindow()
})

// Sur Windows, killer le process quand on ferme la fenêtre
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// Sur macOS, quand on ferme la fenêtre le processus reste dans le dock
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

const port = new SerialPort({path: process.env.PORT, baudRate: 9600 });

ipcMain.on('colorClick', (event, data) => {
    setLedColor(data);
})

// Interact with arduino
const setLedColor = (color) => {
    port.write(color, (err) => {
        if (err) return console.log('Error on write: ', err.message);
        console.log('message written');
    });
}
