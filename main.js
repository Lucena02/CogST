const { app, BrowserWindow, screen } = require("electron");

let win;

app.whenReady().then(() => {
    const { width, height } = screen.getPrimaryDisplay().bounds;

    win = new BrowserWindow({
        width: 200,
        height: 300,
        x: width - 200,
        y: height / 2 - 300 / 2,
        frame: false, // Removes the window frame
        transparent: true, // Makes the background transparent
        alwaysOnTop: true, // Keeps it above all windows
        resizable: false,
        fullscreenable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.setIgnoreMouseEvents(false); // Allows clicks to pass through
    win.loadFile("index.html");
});
