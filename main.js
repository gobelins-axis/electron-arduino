const { app, BrowserWindow } = require('electron')
const {SerialPort} = require('serialport');
const { ipcMain } = require('electron')
require('dotenv').config();
const { ReadlineParser } = require('@serialport/parser-readline')

// try {
//     require('electron-reloader')(module)
// } catch (_) {}


const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('index.html')
    // win.webContents.openDevTools();
    return win;
}

const createSerialPort = (win) => {
    const port = new SerialPort({path: process.env.PORT, baudRate: 9600 });
    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
    parser.on('data', (data) => {
        if(data.localeCompare("first") === 0){
            win.webContents.send('btnClick', 'btnLeft')
        }
        if(data.localeCompare("second") === 0){
            win.webContents.send('btnClick', 'btnRight')
        }
    })
    return port;
}

app.whenReady().then(() => {
    const win = createWindow()
    const serialPort = createSerialPort(win)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})


// Interact with arduino
const setLedColor = (color) => {
    port.write(color, (err) => {
        if (err) return console.log('Error on write: ', err.message);
        console.log('message written');
    });
}
