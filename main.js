const { app, BrowserWindow } = require('electron')
const {SerialPort} = require('serialport');
const { ipcMain } = require('electron')
require('dotenv').config();
const path = require('path')
const { getArduinoBoardPort } = require('utils');

// try {
//     require('electron-reloader')(module)
// } catch (_) {}

const { ReadlineParser } = require('@serialport/parser-readline')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });

    win.loadURL('http://localhost:3000');

    // win.loadFile("external/arcade.html")
    // win.webContents.openDevTools();
    win.once('ready-to-show', () => {
        win.show()
      })
    return win;
}

const createSerialPort = (win, arduinoPort) => {
    const port = new SerialPort({path: arduinoPort, baudRate: 9600 });
    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    parser.on('data', (data) => {
        console.log(data);
        if(data.includes("buttonName:") && data.includes("buttonState:")){
            const buttonName = data.split('_')[0].split(':')[1];
            const buttonState = data.split('_')[1].split(':')[1];
            win.webContents.send(buttonState, buttonName);
        }

        if(data.includes("id:1") || data.includes("id:2")) {
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
    getArduinoBoardPort().then(
        (port) => {
            createSerialPort(win, port);
        },
        (error) => {
            console.log(error);
        },
    )
})

// Sur Windows, killer le process quand on ferme la fenêtre
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// Sur macOS, quand on ferme la fenêtre le processus reste dans le dock
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

const joystickNormalizedPosition = (x, y) => {
    const newX = map(x, 0, 1023, -1, 1);
    const newY = map(y, 0, 1023, -1, 1);
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