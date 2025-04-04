
document.documentElement.style.setProperty('--tab-width', '298px');
document.documentElement.style.setProperty('--tab-height', '398px');


function resizeWindow() {
    const content = document.getElementById("contentA");
    let seta = document.getElementById("seta");
    let tabWidth = getComputedStyle(document.documentElement).getPropertyValue('--tab-width').trim();
    if (tabWidth === '298px') {
        document.documentElement.style.setProperty('--tab-width', '16px');
        window.electronAPI.updateWindowSize(16);
        seta.innerHTML = "<";
        content.style.display = "none";

    }
    else {
        document.documentElement.style.setProperty('--tab-width', '298px');
        window.electronAPI.updateWindowSize(300);
        seta.innerHTML = ">";
        content.style.display = "flex";

    }
}
// Para verificar se de facto alguem fez login
window.electronAPI.onAccessToken((event, accessToken) => {
    const statusElement = document.getElementById('login');

    if (accessToken) {
        statusElement.innerHTML = "Logout";
    }
});


// Logica do Login

function login() {
    if (localStorage.getItem("access_token") == null) {
        window.electronAPI.doLogin();
        document.getElementById("error").innerHTML = ""
    }
    else {
        document.getElementById("login").innerHTML = "Login";
        localStorage.clear()
    }
}

// Para mudar o botao para Logout caso haja uma token valida
if (localStorage.getItem("access_token") != null) {
    document.getElementById("login").innerHTML = "Logout";
}

window.googleFormsVar = null
window.tarefaVar = null
window.SHEET_API_KEY = window.env.SHEET_API_KEY

function toPassos(flag) {
    if (localStorage.getItem("access_token") == null) {
        document.getElementById("error").innerHTML = "Por favor faça login primeiro"
    }
    else if (flag == 1) {
        //loadGapiWithAuth(localStorage.getItem('access_token'))
        document.getElementById("passos").style.display = "flex"
        document.getElementById("content").style.display = "none"
        window.googleFormsVar = document.getElementById('google-link').value
        window.tarefaVar = document.getElementById('tarefa').value
    }
    else {
        document.getElementById("passos").style.display = "none"
        document.getElementById("content").style.display = "flex"
    }
}

