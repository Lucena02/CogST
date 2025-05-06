const { chromium } = require('playwright');

(async () => {
    const dimensions = [
        { width: 360, height: 390, name: 'mobile' },
        { width: 768, height: 810, name: 'tablet' },
        { width: 1366, height: 1920, name: 'desktop' },
    ];

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();

    for (const viewport of dimensions) {
        const page = await context.newPage();
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        page.on('console', msg => {
            console.log(`[Browser Console] ${msg.type().toUpperCase()}: ${msg.text()}`);
        });
        await page.goto('https://barca88.github.io/Home/');
        await page.waitForLoadState('networkidle');


        // Horizontal Scroll
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        console.log(`→ ${viewport.name}: horizontal scroll? ${hasHorizontalScroll ? '❌ Sim' : '✅ Não'}`);



        //const allElements = await page.$$('*');
        //
        //for (const el of allElements) {
        //    el.c
        //    const box = await el.boundingBox();
        //    console.log(box)
        //    const tagName = await el.evaluate(node => node.tagName);
        //    console.log(tagName);
        //}


        // Criar um dicionario de nivel -> Nodos. e verificar que todos os niveis tao direitos
        await page.evaluate(() => {
            console.log(document.body.getRootNode());
            console.log((document.body.getRootNode().childNodes)[0].tagName)
        });
        page.close()
    }

    await browser.close();
})();
