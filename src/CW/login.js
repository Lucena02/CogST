
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
        document.getElementById("error").innerHTML = "Por favor faça login primeiro"
    }
    else {
        window.electronAPI.send("preencher-CW")
    }

}

function gerarRelatorio() {
    window.electronAPI.send("definir-relatorio")
}

async function retrocederCW() {
    const result = await window.electronAPI.showConfirmationDialog({
        title: "Confirmar Retrocesso",
        message: "Tem a certeza que quer retroceder? Todo o progresso será perdido.",
        buttons: ["Cancelar", "Sim"]
    });

    if (result === 1) {
        window.electronAPI.send("start-main-app");
    }
}


function fechar() {
    window.electronAPI.send("fechaTudo")
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
