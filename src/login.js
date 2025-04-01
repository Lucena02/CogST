

// Para verificar se de facto alguem fez login
window.electronAPI.onAccessToken((event, accessToken) => {
    alert("HASHHAD")
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
