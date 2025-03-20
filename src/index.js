
// Set global CSS variables dynamically
document.documentElement.style.setProperty('--tab-width', '298px');
document.documentElement.style.setProperty('--tab-height', '398px');
let flag = 0;



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

function toPassos(flag) {

    if (flag == 1) {
        document.getElementById("passos").style.display = "flex"
        document.getElementById("content").style.display = "none"
    }
    else {
        document.getElementById("passos").style.display = "none"
        document.getElementById("content").style.display = "flex"
    }
}


let passoIndex = 1; // Start after qquatro.html

function addNewForm() {

    const container = document.getElementById('formsContainer');
    const div = document.createElement('div');
    div.classList.add('itemPasso');
    div.id = "passo" + passoIndex;
    div.innerHTML = `
            <p>Passo ${passoIndex}</p>
            <div class="botaoContainer">
                <button onclick="removeForm(${passoIndex})" class="botaoPreencher"> Eliminar passo </button>
                <button onclick="executeWalkthrough(${passoIndex})"class="botaoPreencher">Preencher ></button>
            </div>
    `;
    container.appendChild(div);
    passoIndex += 1
}



function putIframe(frame, passo) {

    const container = document.getElementById('cogFrames');
    const div = document.createElement('iframe');

    div.id = "iframe" + frame + passo;
    div.className = "iframe" + frame;
    div.frameBorder = "0"
    div.src = ["qum", "qdois", "qtres", "qquatro"][frame-1] + ".html";

    container.appendChild(div);
}


function removeForm(numeroPasso) {
    const divToRemove = document.getElementById(`passo${numeroPasso}`);
    if (divToRemove) {
        divToRemove.remove();
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


function executeWalkthrough(indexPasso) {
    const passos = document.getElementById("passos")
    const botoes = document.getElementById("botoes")
    const iframe1 = document.getElementById("iframe1"+indexPasso)
    const iframe2 = document.getElementById("iframe2"+indexPasso)
    const iframe3 = document.getElementById("iframe3"+indexPasso)
    const iframe4 = document.getElementById("iframe4"+indexPasso)
    const avançar = document.getElementById("avançar")
    //if (localStorage.getItem("access_token") == null) {
    //    document.getElementById("error").innerHTML = "Por favor faça login primeiro"
    //}
    if (state == 0) {
        passos.style.display = "none"

        if (!iframe1){
            putIframe(1, indexPasso)
        }
        else{
            iframe1.style.display = "flex"
        }

        state = 1

        // Colocar botoes
        if (!(document.getElementById("botoes"+indexPasso))){
            const div = document.createElement('div');
            div.className = "botoes"
            div.id = "botoes" + indexPasso
            div.innerHTML = `
                    <button onclick="backWalkthrough(${indexPasso})" class="botao">Retroceder</button>
                    <button onclick="executeWalkthrough(${indexPasso})" class="botao" id="avançar">Avançar</button>
            `;
            botoes.appendChild(div);
        }
        else{
            document.getElementById("botoes").style.display = "flex"
        }

        loadGapiWithAuth(localStorage.getItem('access_token'))
    }
    else if (state == 1) {
        state = 2
        iframe1.style.display = "none"
        if (!iframe2){
            putIframe(2, indexPasso)
        }
        else{
            iframe2.style.display = "flex"
        }
        
    }
    else if (state == 2) {
        state = 3
        iframe2.style.display = "none"
        if (!iframe3){
            putIframe(3, indexPasso)
        }
        else{
            iframe3.style.display = "flex"
        }
    }
    else if (state == 3) {
        state = 4
        iframe3.style.display = "none"
        if (!iframe4){
            putIframe(4, indexPasso)
        }
        else{
            iframe4.style.display = "flex"
        }
        avançar.innerHTML = "Acabar";
    }
    else if (state == 4) {
        iframe4.style.display = "none"
        passos.style.display = "block"
        botoes.style.display = "none"
        avançar.innerHTML = "Avançar"
        state = 0
        //collectFormData()
    }
    console.log(state)
}


function backWalkthrough(indexPasso) {
    const passos = document.getElementById("passos")
    const botoes = document.getElementById("botoes")
    const iframe1 = document.getElementById("iframe1"+indexPasso)
    const iframe2 = document.getElementById("iframe2"+indexPasso)
    const iframe3 = document.getElementById("iframe3"+indexPasso)
    const iframe4 = document.getElementById("iframe4"+indexPasso)
    const avançar = document.getElementById("avançar")

    if (state == 1) {
        state = 0
        botoes.style.display = "none"
        passos.style.display = "block"
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

    createNewSheet(sheet_id).then(() => {
        fillSheet(data, sheet_id);
    }).catch(error => {
        console.error("Error creating sheet:", error);
    });
}

function createNewSheet(sheetId) {
    return new Promise((resolve, reject) => {
        let userName = localStorage.getItem('nome_user');

        gapi.client.sheets.spreadsheets.batchUpdate({
            spreadsheetId: sheetId,
            requests: [
                {
                    addSheet: {
                        properties: {
                            title: userName
                        }
                    }
                }
            ]
        }).then((response) => {
            if (response.result.replies) {
                alert("New sheet created!", response);
                resolve(userName); // Retorna o nome da aba criada
            } else {
                alert("Erro")
                reject("Sheet creation failed");
            }
        }).catch(error => {
            alert("Error:" + JSON.stringify(error));
            reject(error);
        });
    });
}


function fillSheet(data, spreadsheetId) {
    const sheetName = localStorage.getItem('nome_user'); // Get the sheet name
    const range = `${sheetName}!B1:E1`;
    const valueInputOption = "RAW";

    const values = [
        [
            "O utilizador vai \ntentar executar a \nação correta?",
            "O utilizador percebe \nque a ação correta \nestá disponível?",
            "O utilizador associará\n a ação correta com\n o resultado esperado?",
            "O utilizador receberá\n feedback adequado e\n perceberá que está\n a avançar na sua tarefa?"
        ]
    ];

    const body = { values: values };

    // First, update cell values
    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: valueInputOption,
        resource: body,
    }).then((response) => {
        console.log(`${response.result.updatedCells} cells updated.`);

        // Now, update background color, text formatting, and column width
        applyFormatting(spreadsheetId, sheetName);

    }).catch(error => {
        alert("Erro ao preencher a planilha:" + JSON.stringify(error));
    });
}

// Function to apply formatting (background color + text alignment + column width)
function applyFormatting(spreadsheetId, sheetName) {
    gapi.client.sheets.spreadsheets.get({ spreadsheetId: spreadsheetId }).then((response) => {
        const sheetId = response.result.sheets.find(sheet => sheet.properties.title === sheetName).properties.sheetId;

        const requests = [
            {
                repeatCell: {
                    range: {
                        sheetId: sheetId,
                        startRowIndex: 0, // First row
                        endRowIndex: 1,
                        startColumnIndex: 1, // Column B
                        endColumnIndex: 5   // Column E
                    },
                    cell: {
                        userEnteredFormat: {
                            backgroundColor: { red: 0.88, green: 0.88, blue: 0.88 }, // Light Gray (#E0E0E0)
                            horizontalAlignment: "CENTER",
                            textFormat: { bold: true }
                        }
                    },
                    fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
                }
            },
            // Set column width for B to E
            {
                updateDimensionProperties: {
                    range: {
                        sheetId: sheetId,
                        dimension: "COLUMNS",
                        startIndex: 1, // Column B
                        endIndex: 5    // Column E
                    },
                    properties: {
                        pixelSize: 250 // Adjust the column width (increase this value for wider columns)
                    },
                    fields: "pixelSize"
                }
            }
        ];

        return gapi.client.sheets.spreadsheets.batchUpdate({
            spreadsheetId: spreadsheetId,
            resource: { requests: requests }
        });

    }).then((response) => {
        console.log("Formatting applied successfully:", response);
    }).catch(error => {
        console.error("Error applying formatting:", error);
    });
}


function applyFormattingRed(spreadsheetId, sheetName, startRow, endRow, startCol, endCol) {
    gapi.client.sheets.spreadsheets.get({ spreadsheetId: spreadsheetId }).then((response) => {
        const sheetId = response.result.sheets.find(sheet => sheet.properties.title === sheetName).properties.sheetId;

        const requests = [
            {
                repeatCell: {
                    range: {
                        sheetId: sheetId,
                        startRowIndex: startRow,
                        endRowIndex: endRow,
                        startColumnIndex: startCol,
                        endColumnIndex: endCol
                    },
                    cell: {
                        userEnteredFormat: {
                            backgroundColor: { red: 0.88, green: 0.0, blue: 0.0 },
                            horizontalAlignment: "CENTER"
                        }
                    },
                    fields: "userEnteredFormat(backgroundColor,horizontalAlignment)"
                }
            }
        ];

        return gapi.client.sheets.spreadsheets.batchUpdate({
            spreadsheetId: spreadsheetId,
            resource: { requests: requests }
        });

    }).then((response) => {
        console.log("Formatting applied successfully:", response);
    }).catch(error => {
        console.error("Error applying formatting:", error);
    });
}







// GAPI
function loadGapiWithAuth(accessToken) {
    gapi.load("client", () => {
        gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
        }).then(() => {
            gapi.client.setToken({ access_token: accessToken }); // ✅ Set access token
            console.log("GAPI Loaded & Authenticated!");
        }).catch(error => {
            console.log("Error initializing GAPI:", error);
        });
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