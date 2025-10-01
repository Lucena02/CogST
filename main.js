const { app, BrowserWindow, screen, ipcMain, dialog, clipboard } = require("electron");
require('dotenv').config({ path: 'vars.env' });
require('dotenv').config({ path: 'priv.env' });
const { google } = require("googleapis");
const express = require("express");
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require("@google/genai");
const { exec } = require('child_process');
const { shell } = require("electron");


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
    //win.webContents.openDevTools();

});


// Se nao ha nenhuma janela, fecha javascript
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

ipcMain.on("fechaTudo", (event) => {
    win.close();
});

ipcMain.on("go-back", (event) => {
    if (win) {
        win.loadFile("src/menu.html");
    }
});

ipcMain.on("getHelp", (event) => {
    const helpFile = path.join(__dirname, "/src/help/help.html");
    shell.openExternal(`file://${helpFile}`);
});

ipcMain.on("login", (event) => {
    authenticateUser();
});

ipcMain.on("start-main-app", () => {
    if (win) {
        win.loadFile("src/CW/menuCW.html");
    }
});


ipcMain.on("acessibilidade-main-app", () => {
    if (win) {
        win.loadFile("src/Acessibilidade/menu.html");
    }
});

ipcMain.on("responsividade-main-app", () => {
    if (win) {
        win.loadFile("src/Responsividade/menu.html");
    }
});

ipcMain.on("definir-CW", () => {
    if (win) {
        win.loadFile("src/CW/definirCW.html");
    }
});

ipcMain.on("definir-relatorio", () => {
    if (win) {
        win.loadFile("src/CW/gerarRelatorio.html");
    }
});

ipcMain.on("preencher-CW", () => {
    if (win) {
        win.loadFile("src/CW/preencherCW.html");
    }
});



const axeCorePath = require.resolve('axe-core/axe.min.js');
const axeScript = fs.readFileSync(axeCorePath, 'utf8');

ipcMain.handle("medir-acesibilidade", async (event, url) => {
    const win = new BrowserWindow({
        show: false, // Set to true if you want to see the browser
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    try {
        await win.loadURL(url);

        await win.webContents.executeJavaScript(axeScript);

        const results = await win.webContents.executeJavaScript(`
            axe.run().then(results => results);
        `);

        console.log(results);
        console.log("TESTEEE");

        win.close();

        // Return the results
        return JSON.parse(JSON.stringify(results));
    } catch (error) {
        console.error("Erro ao medir acessibilidade:", error);
        throw new Error(`Erro ao medir acessibilidade: ${error.message}`);
    }
});

ipcMain.handle("medir-responsividade", async (event, url) => {

    try {
        const result = await runCommand('node testes.js ' + url);

        console.log(`Corri Responsividade`);

        const data = fs.readFileSync('output.json', 'utf-8');
        const jsonData = JSON.parse(data);

        return jsonData;

    } catch (error) {
        console.error("Erro ao medir responsividade:", error);
        throw new Error(`Erro ao medir responsividade: ${error.message}`);
    }
});

function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                return reject(new Error(stderr));
            }
            resolve(stdout); // Return the output if you want to log it
        });
    });
}

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



const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


ipcMain.on("resumir-comentarios", async (event, comentarios) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Recebes um dicionário onde cada chave é um passo e o valor é uma lista de 4 comentários.

            Tarefa:
            1. Resume cada comentário em até 6 palavras.
            2. Se um comentário for irrelevante ou incompreensível, escreve apenas '-'.
            3. Devolve apenas o dicionário final, como JSON. Sem texto extra antes nem depois.
            4. Cada chave deve ter sempre a mesma estrutura de 4 comentarios, mesmo que sejam strings vazias.
            É MUITO IMPORTANTE QUE DEVOLVAS APENAS O DICIONARIO SEM TEXTO ANTES NEM DEPOIS.

            Aqui está o dicionário:\n${JSON.stringify(comentarios)}`,
    });
    console.log(response.text);

    event.reply("resumo-pronto", response.text);
});




const CLIENT_ID = process.env.ID_CLIENTE;
const CLIENT_SECRET = process.env.SECRET_CLIENTE;
const REDIRECT_URI = "http://localhost:3000";
const SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/userinfo.profile"
];

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

async function authenticateUser() {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: SCOPES,
    });

    let win = new BrowserWindow({ width: 800, height: 600 });
    win.loadURL(authUrl);
}

ipcMain.on('refresh-access-token', async (event, refreshToken) => {
    try {
        // Attach the refresh token to the client
        oauth2Client.setCredentials({ refresh_token: refreshToken });

        // Request a new access token
        const { credentials } = await oauth2Client.refreshAccessToken();
        // OR with newer googleapis versions:
        // const { credentials } = await oauth2Client.getAccessToken();

        // Send it back to the renderer
        event.sender.send('access-token-refreshed', credentials.access_token);
    } catch (error) {
        console.error("Failed to refresh token:", error);
        event.sender.send('access-token-refreshed', null);
    }
});


// Create an Express server to handle OAuth 2.0 redirect
const app2 = express();
app2.get('/', async (req, res) => {
    const code = req.query.code;
    if (code) {
        try {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);
            //console.log("Authenticated successfully!", tokens);
            res.send('<script>window.close()</script>');
            //console.log(tokens['access_token'])

            win.webContents.send("auth-tokens", {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token  // <- refresh token is here
            });

            dialog.showMessageBox({ type: "info", message: "Authentication Successful!" });
        } catch (error) {
            console.error("Error obtaining token:", error);
            res.send('<script>window.close()</script>');
            dialog.showMessageBox({ type: "error", message: "Authentication Failed!" });
        }
    }
});

app2.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});

