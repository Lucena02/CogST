const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("env", {
    WIDTH: process.env.WIDTH,
    HEIGHT: process.env.HEIGHT,
    SHEET_API_KEY: process.env.SHEET_API_KEY
});


contextBridge.exposeInMainWorld("electronAPI", {
    send: (channel, data) => ipcRenderer.send(channel, data),
    receive: (channel, func) => ipcRenderer.once(channel, (event, ...args) => func(...args)),
    runAxeTest: (url) => ipcRenderer.invoke("medir-acesibilidade", url),
    runRespTest: (url) => ipcRenderer.invoke("medir-responsividade", url),
    showConfirmationDialog: (options) => ipcRenderer.invoke('show-confirmation-dialog', options),
    onAccessToken: (callback) => ipcRenderer.on('auth-tokens', callback),
    doLogin: () => ipcRenderer.send("login"),
    updateWindowSize: (width) => ipcRenderer.send("update-window-width", width),
    getEnv: () => ({
        WIDTH: process.env.WIDTH,
        HEIGHT: process.env.HEIGHT
    }),

    refreshAccessToken: (refreshToken) => ipcRenderer.send('refresh-access-token', refreshToken),
    onAccessTokenRefreshed: (callback) => {
        ipcRenderer.once('access-token-refreshed', (event, newToken) => {
            callback(newToken);
        });
    }
});


ipcRenderer.on('auth-tokens', async (event, tokens) => {
    if (tokens) {
        window.localStorage.setItem('access_token', tokens.access_token);
        window.localStorage.setItem('refresh_token', tokens.refresh_token);

        try {
            const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {
                    "Authorization": `Bearer ${tokens.access_token}`
                }
            });

            // Check if response is OK (status 200-299)
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();

            window.localStorage.setItem('nome_user', data.name); // Save the name in localStorage
        } catch (error) {
            alert('Error fetching user info: ' + JSON.stringify(error.message)); // Handle errors
        }
    } else {
        alert('No access token received');
    }
});
