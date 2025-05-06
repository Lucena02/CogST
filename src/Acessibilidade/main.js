// Exemplo com Puppeteer
const puppeteer = require('puppeteer');
const axeCore = require('axe-core');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://seusite.com');

    // Injeta axe-core no contexto da página
    await page.addScriptTag({ path: require.resolve('axe-core') });

    // Roda a análise no contexto da página
    const results = await page.evaluate(async () => {
        return await axe.run(); // você pode passar seletores específicos
    });

    console.log(results.violations); // Integrar com seu sistema
    await browser.close();
})();
