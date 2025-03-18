
// Set global CSS variables dynamically
document.documentElement.style.setProperty('--tab-width', '298px');
document.documentElement.style.setProperty('--tab-height', '398px');
let flag = 0;



function resizeWindow() {
    const content = document.getElementById("content");
    let seta = document.getElementById("seta");
    let tabWidth = getComputedStyle(document.documentElement).getPropertyValue('--tab-width').trim();

    if (tabWidth === '298px') {
        document.documentElement.style.setProperty('--tab-width', '16px');
        window.electronAPI.updateWindowSize(16);
        seta.innerHTML = "<";
        if (state == 0) {
            content.style.display = "none";
        }
    }
    else {
        document.documentElement.style.setProperty('--tab-width', '298px');
        window.electronAPI.updateWindowSize(300);
        seta.innerHTML = ">";
        if (state == 0) {
            content.style.display = "flex";
        }
    }
}


function collectFormData() {
    // Get the iframes
    const iframe1 = document.getElementById("iframe1").contentWindow.document;
    const iframe2 = document.getElementById("iframe2").contentWindow.document;
    const iframe3 = document.getElementById("iframe3").contentWindow.document;
    const iframe4 = document.getElementById("iframe4").contentWindow.document;

    // Function to extract values from each iframe form
    function getFormData(iframeDoc) {
        return {
            problema: iframeDoc.getElementById("problema-sim")?.checked ? iframeDoc.getElementById("problema-sim").value :
                iframeDoc.getElementById("problema-nao")?.checked ? iframeDoc.getElementById("problema-nao").value :
                    "No selection",
            severidade: iframeDoc.getElementById("gravidade")?.value || "Not selected",
            comentarios: iframeDoc.getElementById("comentarios")?.value || "No comments"
        };
    }


    // Collect data from each form
    const data = {
        inicio: {
            tarefa: document.getElementById('tarefa').value,
            googleLink: document.getElementById('google-link').value
        },
        qum: getFormData(iframe1),
        qdois: getFormData(iframe2),
        qtres: getFormData(iframe3),
        qquatro: getFormData(iframe4)
    };

    alert(JSON.stringify(data, null, 2));
    writeStats(data, data.inicio.googleLink)

}

let state = 0

function executeWalkthrough() {

    const inicio = document.getElementById("content")
    const botoes = document.getElementById("botoes")
    const iframe1 = document.getElementById("iframe1")
    const iframe2 = document.getElementById("iframe2")
    const iframe3 = document.getElementById("iframe3")
    const iframe4 = document.getElementById("iframe4")
    const avançar = document.getElementById("avançar")
    if (localStorage.getItem("access_token") == null) {
        document.getElementById("error").innerHTML = "Por favor faça login primeiro"
    }
    else if (state == 0) {
        state = 1
        botoes.style.display = "flex"
        inicio.style.display = "none"
        iframe1.style.display = "flex"
    }
    else if (state == 1) {
        state = 2
        iframe1.style.display = "none"
        iframe2.style.display = "flex"
    }
    else if (state == 2) {
        state = 3
        iframe2.style.display = "none"
        iframe3.style.display = "flex"
    }
    else if (state == 3) {
        state = 4
        iframe3.style.display = "none"
        iframe4.style.display = "flex"
        avançar.innerHTML = "Acabar";
    }
    else if (state == 4) {
        state = 5
        iframe4.style.display = "none"
        collectFormData()
        //iframe2.style.display = "flex"
    }
    console.log(state)
}


function backWalkthrough() {
    const inicio = document.getElementById("content")
    const iframe1 = document.getElementById("iframe1")
    const botoes = document.getElementById("botoes")
    const iframe2 = document.getElementById("iframe2")
    const iframe3 = document.getElementById("iframe3")
    const iframe4 = document.getElementById("iframe4")
    const avançar = document.getElementById("avançar")

    if (state == 1) {
        state = 0
        botoes.style.display = "none"
        inicio.style.display = "flex"
        iframe1.style.display = "none"
    }

    if (state == 2) {
        state = 1
        iframe1.style.display = "flex"
        iframe2.style.display = "none"
    }
    if (state == 3) {
        state = 2
        iframe2.style.display = "flex"
        iframe3.style.display = "none"
    }
    if (state == 4) {
        state = 3
        iframe3.style.display = "flex"
        iframe4.style.display = "none"
        avançar.innerHTML = "Avançar";
    }
}



const API_KEY = window.env.SHEET_API_KEY;

function writeStats(data, url) {
    const regex = /\/\w+\//g;
    const matches = url.match(regex);
    const sheet_id = matches[1].slice(1, -1);

    createNewSheet(sheet_id)
    fillSheet(data, sheet_id)
}



function createNewSheet(sheet_id) {
    let userName = localStorage.getItem('nome_user');
        
        let request = {
            requests: [
                {
                    addSheet: {
                        properties: {
                            title: userName
                        }
                    }
                }
            ]
        };
    let accessToken = localStorage.getItem("access_token");
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}:batchUpdate?key=${API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(request)
    })
        .then(response => response.json())
        .then(data => alert("New sheet created!" + JSON.stringify(data, null, 2)))
        .catch(error => alert("Error:", error));
}



function fillSheet(infos, url) {
    const dataa = [
        [
            "O utilizador vai tentar executar a ação correta?\n\n", // Primeira frase com espaçamento
            "O utilizador percebe que a ação correta está disponível?\n\n", // Segunda frase com espaçamento
            "O utilizador associará a ação correta com o resultado esperado?\n\n", // Terceira frase com espaçamento
            "O utilizador receberá feedback adequado e perceberá que está a avançar na sua tarefa?\n\n" // Quarta frase com espaçamento
        ]
    ];

    const request = {
        values: dataa
    };

    const accessToken = localStorage.getItem("access_token");

    // Fazer a requisição para preencher a planilha com os dados
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${url}/values/A1:D1?valueInputOption=RAW`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })
    .then(response => response.json())
    .then(data => {
        alert("Planilha preenchida com sucesso!");
    })
    .catch(error => {
        alert("Erro ao preencher a planilha: " + error);
    });
}



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

// Para verificar se de facto alguem fez login
window.electronAPI.onAccessToken((event, accessToken) => {
    const statusElement = document.getElementById('login');
    if (accessToken) {
        statusElement.innerHTML = "Logout";
    }
});