const { app, BrowserWindow, screen, ipcMain } = require("electron");
require('dotenv').config({ path: 'vars.env' });
require('dotenv').config({ path: 'priv.env' });
let win;

app.whenReady().then(() => {
    const { width, height } = screen.getPrimaryDisplay().bounds;
    console.log(parseInt(process.env.WIDTH));
    console.log(process.env.HEIGHT);
    win = new BrowserWindow({
        width: parseInt(process.env.WIDTH),
        height: parseInt(process.env.HEIGHT),
        x: width - parseInt(process.env.WIDTH),
        y: height / 2 - parseInt(process.env.HEIGHT) / 2,
        frame: false, // Removes the window frame
        transparent: true, // Makes the background transparent
        alwaysOnTop: true, // Keeps it above all windows
        resizable: false,
        fullscreenable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: __dirname + "/src/preload.js",
        }
    });

    win.setIgnoreMouseEvents(false); // Allows clicks to pass through
    win.loadFile("src/index.html");
});


ipcMain.on("update-window-width", (event, newWidth) => {
    const { width, height } = screen.getPrimaryDisplay().bounds;
    if (win) {
        let { height, y } = win.getBounds();
        console.log(newWidth)

        win.setBounds({ x: (width - newWidth), y, width: newWidth, height });
        console.log(`Width resized to: ${newWidth}`);
    }
});




