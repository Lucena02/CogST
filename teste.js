
// Set global CSS variables dynamically
document.documentElement.style.setProperty('--tab-width', '198px');
document.documentElement.style.setProperty('--tab-height', '298px');
let flag = 0;

function resizeWindow() {
    const content = document.getElementById("content");
    const seta = document.getElementById("seta");
    let tabWidth = getComputedStyle(document.documentElement).getPropertyValue('--tab-width').trim();
    console.log("Width from env:", window.env.WIDTH);
    if (tabWidth === '198px') {
        document.documentElement.style.setProperty('--tab-width', '38px');
        window.electronAPI.updateWindowSize(40);
        content.style.display = "none";
        seta = seta.innerHTML = "<";
    }
    else{
        document.documentElement.style.setProperty('--tab-width', '198px');
        window.electronAPI.updateWindowSize(200);
        content.style.display = "block";
        seta = seta.innerHTML = ">";
    }
}


