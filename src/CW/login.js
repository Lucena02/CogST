
lucide.createIcons();
function resizeWindow() {

    const toggleButton = document.getElementById('toggleButton');
    const sidebarTab = document.getElementById('sidebarTab');
    const toggleIcon = document.getElementById('toggleIcon');
    const contentContainer = document.getElementById('contentContainer');

    if (isExpanded == false) {

        sidebarTab.style.width = 'var(--tab-width)';
        toggleIcon.setAttribute('data-lucide', 'chevron-right');
        contentContainer.style.opacity = '1';
        contentContainer.style.width = '90%';
        window.electronAPI.updateWindowSize(330);
        isExpanded = true
    } else {
        sidebarTab.style.width = 'var(--collapsed-width)';
        contentContainer.style.opacity = '0';
        contentContainer.style.width = '0';
        toggleIcon.setAttribute('data-lucide', 'chevron-left');
        window.electronAPI.updateWindowSize(40);
        isExpanded = false
    }
}
let isExpanded = true;
/*
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
    */
// Mudar o botão para "Logout" quando é efetuado o "Login"
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

async function checkToken() {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    // No access token stored → user must log in
    if (!accessToken) {
        setUI(false);
        return false;
    }

    try {
        const valid = await isTokenValid(accessToken);

        if (!valid) {
            console.warn("Access token invalid or expired");

            // Attempt silent refresh if refresh token exists
            if (refreshToken) {
                const newToken = await refreshAccessToken(refreshToken);
                if (newToken) {
                    console.log("Access token refreshed successfully");
                    setUI(true);
                    return true;
                } else {
                    console.warn("Failed to refresh token");
                    setUI(false);
                    return false;
                }
            } else {
                // No refresh token, must log in again
                setUI(false);
                return false;
            }
        }
        // Token is still valid
        setUI(true);
        return true;

    } catch (err) {
        setUI(false);
        return false;
    }
}

function setUI(loggedIn) {
    document.getElementById("login").innerHTML = loggedIn ? "Logout" : "Login";
    document.getElementById("contentContainer").style.display = "flex";
    document.getElementById("spinnerLoading").style.display = "none";
}

checkToken();


async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;
    return new Promise((resolve) => {
        window.electronAPI.onAccessTokenRefreshed((newToken) => {
            if (newToken) {
                localStorage.setItem('access_token', newToken);
                resolve(newToken);
            } else {
                resolve(null);
            }
        });
        window.electronAPI.refreshAccessToken(refreshToken);
    });
}

async function isTokenValid(accessToken) {
    try {
        const res = await fetch(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
        );
        if (!res.ok) return false;
        const data = await res.json();


        if (data.expires_in && Number(data.expires_in) > 60) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error("Token check failed:", err);
        return false;
    }
}



// alert(localStorage.getItem("access_token"))
// // Para mudar o botao para Logout caso haja uma token valida
// if (localStorage.getItem("access_token") != null) {
//     document.getElementById("login").innerHTML = "Logout";
// }

window.googleFormsVar = null
window.tarefaVar = null
window.SHEET_API_KEY = window.env.SHEET_API_KEY

function toPassos() {
    document.getElementById("botoesTesteRetroceder").style.display = "flex"
    document.getElementById("passosFrame").style.display = "flex"
    document.getElementById("contentFrame").style.display = "none"
}

function retrocedePassos() {
    document.getElementById("botoesTesteRetroceder").style.display = "none"
    document.getElementById("passosFrame").style.display = "none"
    document.getElementById("contentFrame").style.display = "flex"
}

function definirCW() {
    window.electronAPI.send("definir-CW")
}

function preencherCW() {
    if (localStorage.getItem("access_token") == null) {
        alert("Please login first")
    }
    else {
        window.electronAPI.send("preencher-CW")
    }

}

function gerarRelatorio() {
    if (localStorage.getItem("access_token") == null) {
        alert("Please login first")
    }
    else {
        window.electronAPI.send("definir-relatorio")
    }
}

async function retrocederCW() {
    const result = await window.electronAPI.showConfirmationDialog({
        title: "Confirm",
        message: "Are you sure you want to go back? All progress will be lost",
        buttons: ["Cancel", "Yes"]
    });

    if (result === 1) {
        window.electronAPI.send("start-main-app");
    }
}


function fechar() {
    window.electronAPI.send("fechaTudo")
}

function retroceder() {
    window.electronAPI.send("go-back")
}

function getHelp() {
    window.electronAPI.send("getHelp")
}

function exportPassos() {
    const passosData = {};
    const iframe = document.getElementById("passosFrame");

    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    iframeDocument.querySelectorAll("div[id^='passo']").forEach(passooo => {
        const match = passooo.id.match(/passo(\d+)/);
        if (match) {
            const [_, passo] = match;


            if (!passosData[passo]) {
                passosData[passo] = {};
            }

            const passoID = "passoDesc" + passo
            const passoDescricao = passooo.querySelector(`#${passoID}`)?.textContent;
            passosData[passo].nome = passoDescricao;

        }

    });

    passosData[0] = passosData[0] || {}; // Ensure object exists
    const tarefa = document.getElementById("tarefa")?.value || "";
    const googleLink = document.getElementById("google-link")?.value || "";
    const persona = document.getElementById("persona")?.value || "";

    passosData[0].tarefa = tarefa;
    passosData[0].googleLink = googleLink;
    passosData[0].persona = persona;

    const jsonData = JSON.stringify(passosData);


    const blob = new Blob([jsonData], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "CW.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

