const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("env", {
    WIDTH: process.env.WIDTH,
    HEIGHT: process.env.HEIGHT,
});


contextBridge.exposeInMainWorld("electronAPI", {
    updateWindowSize: (width) => ipcRenderer.send("update-window-width", width),
    getEnv: () => ({
        WIDTH: process.env.WIDTH,
        HEIGHT: process.env.HEIGHT
    })
});