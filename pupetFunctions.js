// Exemplo com Puppeteer
const puppeteer = require('puppeteer');
const axeCore = require('axe-core');


export async function runTestsAcessibility(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const siteValue = document.getElementById("site-analise").value.trim();
    await page.goto(siteValue);
    alert("1")
    // Injeta axe-core no contexto da página
    await page.addScriptTag({ path: require.resolve('axe-core') });
    alert("2")
    // Roda a análise no contexto da página
    const results = await page.evaluate(async () => {
        return await axe.run(); // você pode passar seletores específicos
    });
    alert("3")
    alert(JSON.stringify(results.violations))
    await browser.close();
}
