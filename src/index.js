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
    const iframe1 = document.getElementById("iframe1")

    if (state == 0) {
        state = 1
        inicio.style.display = "none"
        iframe1.style.display = "flex"
    }
}




