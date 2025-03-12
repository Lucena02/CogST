
import { writeStats } from "./sheets";

// Set global CSS variables dynamically
document.documentElement.style.setProperty('--tab-width', '298px');
document.documentElement.style.setProperty('--tab-height', '398px');
let flag = 0;

function resizeWindow() {
    const content = document.getElementById("content");
    const iframe1 = document.getElementById("iframe1")
    let seta = document.getElementById("seta");
    let tabWidth = getComputedStyle(document.documentElement).getPropertyValue('--tab-width').trim();

    if (tabWidth === '298px') {
        document.documentElement.style.setProperty('--tab-width', '16px');
        window.electronAPI.updateWindowSize(16);
        seta = seta.innerHTML = "<";
        if (state == 0) {
            content.style.display = "none";
        }
        if (state == 1) {
            iframe1.style.display = "none";
        }
    }
    else {
        document.documentElement.style.setProperty('--tab-width', '298px');
        window.electronAPI.updateWindowSize(300);
        seta = seta.innerHTML = ">";
        if (state == 0) {
            content.style.display = "flex";
        }
        if (state == 1) {
            iframe1.style.display = "flex";
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

    console.log("Collected Form Data:", data);

    // Example: Show in an alert or send to a server
    alert(JSON.stringify(data, null, 2));
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

    if (state == 0) {
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

