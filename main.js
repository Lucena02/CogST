const { app, BrowserWindow, screen, ipcMain, dialog, clipboard } = require("electron");
require('dotenv').config({ path: 'vars.env' });
require('dotenv').config({ path: 'priv.env' });
const { google } = require("googleapis");
const express = require("express");


let win;
app.whenReady().then(() => {
    const { width, height } = screen.getPrimaryDisplay().bounds;
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
    win.loadFile("src/menu.html");



});


//app.whenReady().then();

ipcMain.on("login", (event) => {
    authenticateUser();
});

ipcMain.on("start-main-app", () => {
    if (win) {
        win.loadFile("src/CW/menuCW.html");
    }
});

ipcMain.on("definir-CW", () => {
    if (win) {
        win.loadFile("src/CW/definirCW.html");
    }
});

ipcMain.on("preencher-CW", () => {
    if (win) {
        win.loadFile("src/CW/preencherCW.html");
    }
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


ipcMain.handle('show-confirmation-dialog', async (event, options) => {
    const win = BrowserWindow.getFocusedWindow();
    const result = await dialog.showMessageBox(win, {
        type: "warning",
        buttons: options.buttons || ["Cancelar", "Sim"],
        defaultId: 0,
        cancelId: 0,
        title: options.title || "Confirmar",
        message: options.message || "Tem a certeza?",
    });
    return result.response; // 0 = Cancel, 1 = Yes
});




const CLIENT_ID = process.env.ID_CLIENTE;
const CLIENT_SECRET = process.env.SECRET_CLIENTE;
const REDIRECT_URI = "http://localhost:3000";
const SCOPES = [
    "openid",
    "profile",
    "email",
    "https://www.googleapis.com/auth/spreadsheets"
];

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

async function authenticateUser() {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });

    let win = new BrowserWindow({ width: 800, height: 600 });
    win.loadURL(authUrl);
}


// Create an Express server to handle OAuth 2.0 redirect
const app2 = express();
app2.get('/', async (req, res) => {
    const code = req.query.code;
    if (code) {
        try {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);
            console.log("Authenticated successfully!", tokens);
            res.send('Authentication Successful!');
            console.log(tokens['access_token'])
            win.webContents.send("access-token", tokens['access_token']);
            dialog.showMessageBox({ type: "info", message: "Authentication Successful!" });
        } catch (error) {
            console.error("Error obtaining token:", error);
            res.send('Authentication Failed!');
            dialog.showMessageBox({ type: "error", message: "Authentication Failed!" });
        }
    }
});

app2.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});

