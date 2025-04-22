
// Set global CSS variables dynamically

let flag = 0;
let passoIndex = 1;


function addNewForm(flag) {
    const container = document.getElementById('formsContainer');
    const div = document.createElement('div');
    div.classList.add('itemPasso');
    div.id = "passo" + passoIndex;
    div.innerHTML = `
            <p id="passoDesc${passoIndex}" class="passoDescOverflow">Passo ${passoIndex}</p>
            <div class="botaoContainer">
                <button onclick="removeForm(${passoIndex})" class="botaoPreencher"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></i> </button>
                <button onclick="executeWalkthrough(${passoIndex}, ${flag})"class="botaoPreencher"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>
            </div>
    `;
    container.appendChild(div);
    passoIndex += 1
}

function addNewFormArgumento(passoIndexBom, passoDesc, flag) {

    const iframe = document.getElementById("passosFrame");
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    const container = iframeDoc.getElementById('formsContainer');
    if (!container) {
        alert("Nao encontrei o container")
        return;
    }

    if (passoDesc == undefined) passoDesc = "Passo " + passoIndexBom
    const div = document.createElement('div');
    div.classList.add('itemPasso');
    div.id = "passo" + passoIndexBom;
    div.innerHTML = `
            <p id="passoDesc${passoIndexBom}" class="passoDescOverflow">${passoDesc}</p>
            <div class="botaoContainer">
                <button onclick="executeWalkthrough(${passoIndexBom}, ${flag})"class="botaoPreencher"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>
            </div>
    `;
    container.appendChild(div);
}


function importPassos() {
    const input = document.getElementById("fileInput")

    if (input.files.length > 0) {
        const file = input.files[0];

        // Ler o conteúdo do ficheiro (se for necessário)
        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const jsonData = JSON.parse(event.target.result);
                //while (passoIndex != 1) {
                //    removeForm(passoIndex - 1)
                //    passoIndex = passoIndex - 1
                //}
                for (const key in jsonData) {
                    if (key != 0) {
                        addNewFormArgumento(key, jsonData[key].nome, 1)
                    }
                }
                const iframe = document.getElementById("passosFrame");
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                iframeDoc.getElementById("personaSpot").value = jsonData[0].persona;
                iframeDoc.getElementById("tarefaSpot").value = jsonData[0].tarefa;
                window.googleFormsVar = jsonData[0].googleLink
            } catch (e) {
                alert("Erro ao parsear o JSON: " + e.message);
            }
        };
        reader.readAsText(file);


        document.getElementById("contentFrame").style.display = "none"
        document.getElementById("passosFrame").style.display = "flex"

    } else {
        document.getElementById("error").innerHTML = "Nenhum arquivo importado";
    }
}





function putIframe(frame, passo) {

    const container = document.getElementById('cogFrames');
    const div = document.createElement('iframe');

    div.id = "iframe" + frame + passo;
    div.className = "iframe" + frame;
    div.frameBorder = "0"
    div.src = ["qzero", "qum", "qdois", "qtres", "qquatro"][frame] + ".html";

    container.appendChild(div);
}

// Código Maligno
function removeForm(numeroPasso) {
    const divToRemove = document.getElementById(`passo${numeroPasso}`);
    const iframe0 = document.getElementById("iframe0" + numeroPasso)
    const iframe1 = document.getElementById("iframe1" + numeroPasso)
    const iframe2 = document.getElementById("iframe2" + numeroPasso)
    const iframe3 = document.getElementById("iframe3" + numeroPasso)
    const iframe4 = document.getElementById("iframe4" + numeroPasso)

    if (divToRemove) {
        divToRemove.remove();
    }
    if (iframe0) {
        iframe0.remove();
    }
    if (iframe1) {
        iframe1.remove();
    }
    if (iframe2) {
        iframe2.remove();
    }
    if (iframe3) {
        iframe3.remove();
    }
    if (iframe4) {
        iframe4.remove();
    }
}





let state = 0

// 0 -> Modo criação; 1 -> Modo edição
function executeWalkthrough(indexPasso, flag) {
    console.log("OLD STATE: " + state)
    const passos = document.getElementById("passos")
    const botoes = document.getElementById("botoes")
    const botoesIndex = document.getElementById("botoes" + indexPasso)
    const iframe0 = document.getElementById("iframe0" + indexPasso)
    const iframe1 = document.getElementById("iframe1" + indexPasso)
    const iframe2 = document.getElementById("iframe2" + indexPasso)
    const iframe3 = document.getElementById("iframe3" + indexPasso)
    const iframe4 = document.getElementById("iframe4" + indexPasso)
    const nomePasso = document.getElementById("passoDesc" + indexPasso)
    const avançar = document.getElementById("avançar")

    if (state == 0) {
        passos.style.display = "none"

        if (!iframe0) {
            putIframe(0, indexPasso)
            // Para alterar o texto dentro do iframe0 para o nome do passo (Para os casos do import)
            const iframe0 = document.getElementById("iframe0" + indexPasso)
            iframe0.onload = function () {
                iframe0.contentDocument.getElementById("passoDesc").innerHTML = document.getElementById("passoDesc" + indexPasso).innerHTML;
                if (flag == 1) {
                    iframe0.contentDocument.getElementById("passoDesc").readOnly = true;
                }

            };
        }
        else {
            iframe0.style.display = "flex"
        }

        // Colocar botoes
        if (!(document.getElementById("botoes" + indexPasso))) {
            const div = document.createElement('div');
            div.className = "botoes"
            div.id = "botoes" + indexPasso
            if (flag == 0) {
                div.innerHTML = `
                <button onclick="backWalkthrough(${indexPasso}, ${flag})" class="botao">Retroceder</button>
                `;

                // document.getElementById("botoesTesteRetroceder").style.display = "none"

            }
            else {
                div.innerHTML = `
                <button onclick="backWalkthrough(${indexPasso}, ${flag})" class="botao">Retroceder</button>
                <button onclick="executeWalkthrough(${indexPasso}, ${flag})" class="botao" id="avançar">Avançar</button>
                `;
            }

            botoes.appendChild(div);


        }
        else {
            botoesIndex.style.display = "flex"
        }

        botoes.style.display = "flex"


        state += 1
    }
    else if (state == 1) {
        iframe0.style.display = "none"
        if (!iframe1) {
            putIframe(1, indexPasso)
        }
        else {
            iframe1.style.display = "flex"
        }

        if (iframe0.contentDocument.getElementById("passoDesc")?.value) {
            nomePasso.innerHTML = iframe0.contentDocument.getElementById("passoDesc")?.value
        }
        state += 1
    }
    else if (state == 2) {
        iframe1.style.display = "none"
        if (!iframe2) {
            putIframe(2, indexPasso)
        }
        else {
            iframe2.style.display = "flex"
        }
        state += 1
    }
    else if (state == 3) {
        iframe2.style.display = "none"
        if (!iframe3) {
            putIframe(3, indexPasso)
        }
        else {
            iframe3.style.display = "flex"
        }
        state += 1
    }
    else if (state == 4) {
        iframe3.style.display = "none"
        if (!iframe4) {
            putIframe(4, indexPasso)
        }
        else {
            iframe4.style.display = "flex"
        }
        avançar.innerHTML = "Acabar";
        state += 1
    }
    else if (state == 5) {
        iframe4.style.display = "none"
        passos.style.display = "flex"
        botoes.style.display = "none"
        avançar.innerHTML = "Avançar"
        botoesIndex.style.display = "none"
        state = 0
    }


    console.log("NEW STATE: " + state)
}


function backWalkthrough(indexPasso) {
    const passos = document.getElementById("passos")
    const botoes = document.getElementById("botoes")
    const botoesIndex = document.getElementById("botoes" + indexPasso)
    const iframe0 = document.getElementById("iframe0" + indexPasso)
    const iframe1 = document.getElementById("iframe1" + indexPasso)
    const iframe2 = document.getElementById("iframe2" + indexPasso)
    const iframe3 = document.getElementById("iframe3" + indexPasso)
    const iframe4 = document.getElementById("iframe4" + indexPasso)
    const nomePasso = document.getElementById("passoDesc" + indexPasso)
    const avançar = document.getElementById("avançar")

    if (state == 1) {
        if (iframe0.contentDocument.getElementById("passoDesc")?.value) {
            nomePasso.innerHTML = iframe0.contentDocument.getElementById("passoDesc")?.value
        }
        botoesIndex.style.display = "none"
        passos.style.display = "flex"
        iframe0.style.display = "none"
        botoes.style.display = "none"
    }
    if (state == 2) {
        iframe0.style.display = "flex"
        iframe1.style.display = "none"
    }
    if (state == 3) {
        iframe1.style.display = "flex"
        iframe2.style.display = "none"
    }
    if (state == 4) {
        iframe2.style.display = "flex"
        iframe3.style.display = "none"
    }
    if (state == 5) {
        iframe3.style.display = "flex"
        iframe4.style.display = "none"
        avançar.innerHTML = "Avançar";
    }
    state -= 1;
}


function collectFormData() {
    // Get all iframes that match the pattern "iframeN1", "iframeN2", etc.
    const iframeGroups = {};
    document.querySelectorAll("iframe[id^='iframe']").forEach(iframe => {
        const match = iframe.id.match(/iframe(\d+)(\d)/);
        if (match) {
            const [_, frame, passo] = match;
            if (!iframeGroups[passo]) {
                iframeGroups[passo] = {};
            }
            iframeGroups[passo][`q${frame}`] = iframe.contentWindow.document;
        }
    });

    // Function to extract values from each iframe form
    function getFormData(iframeDoc, qKey) {
        if (qKey == "q0") {
            const passoDescricao = iframeDoc.getElementById("passoDesc")?.value || "";
            if (!passoDescricao) return ""
            return { passoDescricao }
        }

        const problema = iframeDoc.getElementById("problema-sim")?.checked ? iframeDoc.getElementById("problema-sim").value :
            iframeDoc.getElementById("problema-nao")?.checked ? iframeDoc.getElementById("problema-nao").value :
                "";
        const severidade = iframeDoc.getElementById("gravidade")?.value || "";
        const comentarios = iframeDoc.getElementById("comentarios")?.value || "";

        // Check if the form has any meaningful data
        if (!problema && !severidade && !comentarios) {
            return null; // Return null if the form is empty
        }

        return { problema, severidade, comentarios };
    }
    //alert(document.getElementById("tarefaSpot").value,)
    //alert(window.parent.googleFormsVar)
    // Collect data from each iframe dynamically
    const data = {
        inicio: {
            tarefa: document.getElementById("tarefaSpot").value,
            googleLink: window.parent.googleFormsVar
        }
    };

    Object.keys(iframeGroups).forEach(group => {
        const groupData = {};
        // qKey -> em que frame estamos
        Object.keys(iframeGroups[group]).forEach(qKey => {
            const formData = getFormData(iframeGroups[group][qKey], qKey);
            if (formData) { // Only include non-empty forms
                groupData[qKey] = formData;
            }
        });

        if (Object.keys(groupData).length > 0) { // Only include groups with data
            data[`passo${group}`] = groupData;
        }
    });
    // alert(JSON.stringify(data, null, 2));
    writeStats(data, data.inicio.googleLink);
}


function writeStats(data, url) {

    const regex = /\/\w+\//g;
    const matches = url.match(regex);
    const sheet_id = matches[1].slice(1, -1);

    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem('nome_user')
    loadGapiWithAuth(token).then(() => {
        createNewSheet(sheet_id, username).then(() => {
            fillSheet(data, sheet_id)
        }).catch(error => {
            alert("Error creating sheet:" + error.message);
        });
    })
}

// GAPI
function loadGapiWithAuth(accessToken) {
    return new Promise((resolve, reject) => {
        if (!accessToken) {
            alert("Não há access token");
            return reject("Sem token");
        }
        gapi.load("client", () => {
            gapi.client.init({
                apiKey: window.parent.SHEET_API_KEY,
                discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
            }).then(() => {
                gapi.client.setToken({ access_token: accessToken });

                return gapi.client.load("sheets", "v4");
            }).then(() => {
                alert("GAPI Loaded, Authenticated & Sheets API Ready!");
                resolve(); // 👈 GAPI e Sheets prontos
            }).catch(error => {
                alert("Erro ao inicializar GAPI: " + error.message);
                reject(error);
            });
        });
    });
}


function createNewSheet(sheetId, sheetName) {
    return new Promise((resolve, reject) => {

        gapi.client.sheets.spreadsheets.batchUpdate({
            spreadsheetId: sheetId,
            requests: [
                {
                    addSheet: {
                        properties: {
                            title: sheetName
                        }
                    }
                }
            ]
        }).then((response) => {
            if (response.result.replies) {
                resolve(sheetName); // Retorna o nome da aba criada
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

function checkExist(nomeDaSheet, spreadsheetId) {
    return new Promise((resolve, reject) => {
        gapi.client.sheets.spreadsheets.get({
            spreadsheetId: spreadsheetId
        }).then(response => {
            const sheets = response.result.sheets;
            const targetSheet = sheets.find(sheet => sheet.properties.title === nomeDaSheet);

            if (targetSheet) {
                // alert("VOU ELIMINAR A SHEET");
                gapi.client.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: spreadsheetId,
                    resource: {
                        requests: [
                            {
                                deleteSheet: {
                                    sheetId: targetSheet.properties.sheetId
                                }
                            }
                        ]
                    }
                }).then(() => {
                    // alert("Sheet deleted!");
                    resolve(1);
                }).catch(err => {
                    reject(err);
                });
            } else {
                resolve(0);
            }
        }).catch(err => {
            reject(err);
        });
    });
}



function fillSheet(data, spreadsheetId) {
    const tamanho = Object.keys(data).length
    const sheetName = localStorage.getItem('nome_user'); // Get the sheet name
    const range = `${sheetName}!A1:E${tamanho}`;
    const valueInputOption = "RAW";

    const values = [
        [
            "",
            "O utilizador vai \ntentar executar a \nação correta?",
            "O utilizador percebe \nque a ação correta \nestá disponível?",
            "O utilizador associará\n a ação correta com\n o resultado esperado?",
            "O utilizador receberá\n feedback adequado e\n perceberá que está\n a avançar na sua tarefa?"
        ]
    ];
    Object.keys(data).forEach(key => {
        if (key.startsWith("passo")) {
            const passo = data[key];
            let array = []
            array.push(passo["q0"]["passoDescricao"])
            for (j = 1; j <= 4; j++) {
                if (passo["q" + j]["problema"] == "" || passo["q" + j]["problema"] == "Sim") {
                    array.push(
                        `Sim\nComentários: ${passo["q" + j]["comentarios"]}`
                    );
                }
                else {
                    array.push(
                        `Não (Severidade: ${passo["q" + j]["severidade"]})\nComentários: ${passo["q" + j]["comentarios"]}`
                    );
                }

            }

            values.push(array)
        }
    });

    const body = { values: values };

    // First, update cell values
    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: valueInputOption,
        resource: body,
    }).then((response) => {
        // Now, update background color, text formatting, and column width
        applyFormatting(spreadsheetId, sheetName);
        applyConditionalFormatting(spreadsheetId, sheetName)
        // Verificar se o relatorio existe
        checkExist("Relatorio", spreadsheetId).then((response) => {
            // alert(response)
            fillRelatorio(spreadsheetId)
        })

    }).catch(error => {
        alert("Erro ao preencher a planilha:" + error.message);
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


function cellToSeveridade(cell) {
    const regex = /\(Severidade: ([\w\s]+)\)/;
    const match = cell.match(regex);
    if (match && match[1]) {
        switch (match[1]) {
            case "Muito Pequena":
                return 1
            case "Pequena":
                return 2
            case "Normal":
                return 3
            case "Grave":
                return 4
            case "Muito Grave":
                return 5
        }
    }
    else {
        return 0
    }
}

function getComentario(cell) {
    const regex = /Comentários: (.*)/;
    const match = cell.match(regex);
    if (match && match[1]) {
        return match[1]
    }
    else {
        return 0
    }
}


async function fillRelatorio(sheetID) {

    const metadataResponse = await gapi.client.sheets.spreadsheets.get({
        spreadsheetId: sheetID
    });

    const sheets = metadataResponse.result.sheets;
    const allSheetData = {};

    for (const sheet of sheets) {
        const sheetName = sheet.properties.title;

        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: sheetID,
            range: `${sheetName}`
        });

        allSheetData[sheetName] = response.result.values || [];
    }

    let informacoes = {}
    let severidade = {}
    let comentarios = {}
    const numeroEvals = Object.keys(allSheetData).length - 1 // Obter o total de páginas para fazer a média
    Object.keys(allSheetData).forEach(key => {
        const sheet = allSheetData[key]
        if (sheet && sheet.length > 1) {
            for (let i = 1; i < sheet.length; i++) {
                const nomePasso = sheet[i][0];

                if (!(nomePasso in informacoes)) {
                    informacoes[nomePasso] = [0, 0, 0, 0];
                    severidade[nomePasso] = [0, 0, 0, 0];
                    comentarios[nomePasso] = ["", "", "", ""];
                }
                for (let j = 1; j < 5; j++) {
                    if (sheet[i][j].startsWith("Não")) {
                        informacoes[sheet[i][0]][j - 1] += 1
                        severidade[sheet[i][0]][j - 1] += cellToSeveridade(sheet[i][j])
                    }
                    comentarios[sheet[i][0]][j - 1] += getComentario(sheet[i][j])
                }
            }
        }
    })

    alert("INFO: " + JSON.stringify(informacoes))
    alert("Severidade: " + JSON.stringify(severidade))
    alert("Comentarios: " + JSON.stringify(comentarios))

    // Calcular severidade média
    Object.keys(severidade).forEach(key => {
        for (let i = 0; i < 4; i++) {
            severidade[key][i] = (severidade[key][i]) / numeroEvals
        }
    })
    alert("Severidade Média: " + JSON.stringify(severidade))

    //Resumir os comentarios todos
    fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gemma3",
            prompt: "Vou te mandar um dicionario. Por favor devolve me o dicionario com as mesmas chaves, os mesmos passos, e o mesmo numero de strings dentro de cada passo. Só quero que pegues em cada string dentro de cada passo e a resumas em poucas palavras. Se for texto que nao faz sentido, coloca um '-'. Se conseguires deduzir o problema de um passo com base nos comentários podes adicionar no fim das strings desse passo. Não te esqueças, uma string de input dá uma string de output. Manda-me só o dicionário, não quero outro texto. Aqui está: " + JSON.stringify(comentarios),
            stream: false
        })
    }).then(response => response.json())
        .then(data => {
            alert(data.response);
            rawResponse = data.response.trim().replace(/^```json\n?/, "").replace(/```$/, "").trim();
            alert(rawResponse)
            comentarios = JSON.parse(rawResponse);
            alert(JSON.stringify(comentarios))
            createNewSheet(sheetID, "Relatorio").then(() => {
                fillRelatorioAux(informacoes, severidade, comentarios, sheetID)

            }).catch(error => {
                alert("Erro a criar a Spreadsheet dos relatórios: " + error.message)
            })
        })
        .catch(error => {
            alert("Ollama não está a funcionar.");
            console.error(error);
        });
}


function fillRelatorioAux(data, severidade, comentarios, spreadsheetId) {
    const tamanho = (Object.keys(data).length) + 1
    const range = `Relatorio!A1:E${tamanho}`;
    const valueInputOption = "RAW";

    const values = [
        [
            "",
            "O utilizador vai \ntentar executar a \nação correta?",
            "O utilizador percebe \nque a ação correta \nestá disponível?",
            "O utilizador associará\n a ação correta com\n o resultado esperado?",
            "O utilizador receberá\n feedback adequado e\n perceberá que está\n a avançar na sua tarefa?"
        ]
    ];

    Object.keys(data).forEach(key => {
        for (let i = 0; i < 4; i++) {
            data[key][i] = (data[key][i]).toString() + " (Severidade Média - " + (severidade[key][i]).toString() + ")\n" + comentarios[key][i].toString()
        }
        data[key].unshift(key)
        values.push(data[key])
    })

    alert(JSON.stringify(values, null, 2))
    const body = { values: values };

    // First, update cell values
    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: valueInputOption,
        resource: body,
    }).then((response) => {
        applyFormatting(spreadsheetId, "Relatorio");
    }).catch(error => {
        alert("Erro ao preencher o relatorio:" + error.message);
    });
}

function applyConditionalFormatting(sheetId, sheetName) {
    const range = `${sheetName}!A1:E2`;  // Defina o intervalo diretamente

    const requests = [
        {
            "addConditionalFormatRule": {
                "rule": {
                    "ranges": [
                        {
                            "sheetId": sheetId,
                            "startRowIndex": 0,
                            "endRowIndex": 100,
                            "startColumnIndex": 0,
                            "endColumnIndex": 1
                        }
                    ],
                    "booleanRule": {
                        "condition": {
                            "type": "TEXT_CONTAINS",
                            "values": [
                                { "userEnteredValue": "Sim" }
                            ]
                        },
                        "format": {
                            "backgroundColor": { "red": 0.0, "green": 0.4, "blue": 0.0 }
                        }
                    }
                },
                "index": 0
            }
        },
        {
            "addConditionalFormatRule": {
                "rule": {
                    "ranges": [
                        {
                            "sheetId": sheetId,
                            "startRowIndex": 0,
                            "endRowIndex": 100,
                            "startColumnIndex": 0,
                            "endColumnIndex": 1
                        }
                    ],
                    "booleanRule": {
                        "condition": {
                            "type": "TEXT_CONTAINS",
                            "values": [
                                { "userEnteredValue": "Não" }
                            ]
                        },
                        "format": {
                            "backgroundColor": { "red": 0.4, "green": 0.0, "blue": 0.0 }
                        }
                    }
                },
                "index": 1
            }
        }
    ];

    // Aplicando a formatação condicional à planilha
    gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requests: requests
    }).then((response) => {
        console.log('Conditional formatting applied successfully:', response);
    }, (error) => {
        console.error('Error applying conditional formatting:', error);
    });
}






async function retrocedeCW2() {

    const result = await window.electronAPI.showConfirmationDialog({
        title: "Confirmar Retrocesso",
        message: "Tem a certeza que quer retroceder? Todo o progresso será perdido.",
        buttons: ["Cancelar", "Sim"]
    });

    if (result === 1) {
        window.electronAPI.send("start-main-app");
    }
}

