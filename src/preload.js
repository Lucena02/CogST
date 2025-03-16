const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("env", {
    WIDTH: process.env.WIDTH,
    HEIGHT: process.env.HEIGHT,
    SHEET_API_KEY: process.env.SHEET_API_KEY
});


contextBridge.exposeInMainWorld("electronAPI", {
    onAccessToken: (callback) => ipcRenderer.on('access-token', callback),
    doLogin: () => ipcRenderer.send("login"),
    updateWindowSize: (width) => ipcRenderer.send("update-window-width", width),
    getEnv: () => ({
        WIDTH: process.env.WIDTH,
        HEIGHT: process.env.HEIGHT
    })
});



ipcRenderer.on('access-token', (event, accessToken) => {

    if (accessToken) {
        window.localStorage.setItem('access_token', accessToken);
    } else {
        alert('No access token received');
    }
});