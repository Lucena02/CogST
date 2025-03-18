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



ipcRenderer.on('access-token', async (event, accessToken) => {
    if (accessToken) {
        window.localStorage.setItem('access_token', accessToken);

        try {
            const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {
                    "Authorization": `Bearer ${accessToken}` 
                }
            });

            // Check if response is OK (status 200-299)
            if (!response.ok) {
                //window.localStorage.setItem('debug', "nao encontrei resposta");
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
