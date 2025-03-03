const { app, BrowserWindow, screen, ipcMain } = require("electron");
require('dotenv').config({path: 'vars.env'});
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
            preload: __dirname + "/preload.js", 
        }
    });

    win.setIgnoreMouseEvents(false); // Allows clicks to pass through
    win.loadFile("index.html");
});


ipcMain.on("update-window-width", (event, targetWidth) => {
    if (!win) return;

    let { width, height, x, y } = win.getBounds();
    const step = 2; // Change width by 5px per interval
    const intervalTime = 20; // Adjust size every 10ms

    // Determine whether we're expanding or shrinking
    const increasing = width < targetWidth;

    let interval = setInterval(() => {
        // Gradually adjust the width
        if (increasing && width < targetWidth) {
            width = Math.min(width + step, targetWidth);
        } else if (!increasing && width > targetWidth) {
            width = Math.max(width - step, targetWidth);
        } else {
            clearInterval(interval); // Stop when we reach the target width
        }

        // Apply the new width
        win.setBounds({ x, y, width, height });

    }, intervalTime); // Run every 10ms
});


