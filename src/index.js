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

let state = 0

function executeWalkthrough() {

    const inicio = document.getElementById("content")
    const botoes = document.getElementById("botoes")
    const iframe1 = document.getElementById("iframe1")
    const iframe2 = document.getElementById("iframe2")

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
    console.log(state)
}


function backWalkthrough() {
    const inicio = document.getElementById("content")
    const iframe1 = document.getElementById("iframe1")
    const botoes = document.getElementById("botoes")
    const iframe2 = document.getElementById("iframe2")

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
}



