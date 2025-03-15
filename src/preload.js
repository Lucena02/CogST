const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("env", {
    WIDTH: process.env.WIDTH,
    HEIGHT: process.env.HEIGHT,
    SHEET_API_KEY: process.env.SHEET_API_KEY
});


contextBridge.exposeInMainWorld("electronAPI", {
    updateWindowSize: (width) => ipcRenderer.send("update-window-width", width),
    getEnv: () => ({
        WIDTH: process.env.WIDTH,
        HEIGHT: process.env.HEIGHT
    })
});