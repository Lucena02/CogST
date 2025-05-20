
async function runTestsAcessibility(){
    const siteValue = document.getElementById("site-analise").value.trim();
    window.electronAPI.send("medir-acesibilidade", siteValue)
}
