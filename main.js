const { app, BrowserWindow } = require('electron')
const {SerialPort} = require('serialport');
const { ipcMain } = require('electron')
require('dotenv').config();
const { ReadlineParser } = require('@serialport/parser-readline')
const path = require('path')


const UPPER_RES_BOUND = 1023;
const LOWER_RES_BOUND = 0;

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })
    win.loadURL('http://0.0.0.0:8080')

    // win.loadFile("external/arcade.html")
    win.webContents.openDevTools();
    win.once('ready-to-show', () => {
        win.show()
      })
    return win;
}

const createSerialPort = (win) => {
    const port = new SerialPort({path: process.env.PORT, baudRate: 9600 });
    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    parser.on('data', (data) => {
        if(data.includes("buttonName:") && data.includes("buttonState:")){
            const buttonName = data.split('_')[0].split(':')[1];
            const buttonState = data.split('_')[1].split(':')[1];
            win.webContents.send(buttonState, buttonName);
        }

        if(data.includes("joystickId:1") || data.includes("joystickId:2")) {
            const joystickId = parseInt(data.split('_')[0].split(':')[1]);
            const joystickX = data.split('_')[1].split(':')[1];
            const joystickY = data.split('_')[2].split(':')[1];
            
            const normalizedPosition = joystickNormalizedPosition(joystickX, joystickY);
            win.webContents.send('joystick:move', {joystickId, position: normalizedPosition})
        }
    })
    return port;
}

app.whenReady().then(() => {
    const win = createWindow();
    createSerialPort(win);
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

const joystickNormalizedPosition = (x, y) => {
    const newX = map(x, LOWER_RES_BOUND, UPPER_RES_BOUND, -1, 1);
    const newY = map(y, LOWER_RES_BOUND, UPPER_RES_BOUND, -1, 1);
    const distanceFromCenter = distance(newX, newY, 0);
    if(distanceFromCenter < 0.05) {
        return {
            x: 0,
            y: 0,
        };
    }
    return {
        x: newX,
        y: newY,
    };
}

const map = (axisValue, in_min, in_max, out_min, out_max) => {
    return (axisValue - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

const distance = (x, y, maxValue) => {  
    return (Math.sqrt((maxValue - x) * (maxValue - x)) + (maxValue - y) * (maxValue - y));
  }