const { chromium } = require('playwright');

(async () => {
    const dimensions = [
        { width: 360, height: 640, name: 'mobile' },
        { width: 810, height: 1080, name: 'tablet' },
        { width: 1920, height: 1080, name: 'desktop' }
    ];

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();

    for (const viewport of dimensions) {
        const page = await context.newPage();
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        page.on('console', msg => {
            console.log(`[Browser Console] ${msg.type().toUpperCase()}: ${msg.text()}`);
        });
        await page.goto('https://jib-wine.vercel.app/');
        await page.waitForLoadState('networkidle');


        // Horizontal Scroll
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        console.log(`→ ${viewport.name}: horizontal scroll? ${hasHorizontalScroll ? '❌ Há scroll horizontal...' : '✅ Sem scroll horizontal!'}`);






        await page.evaluate(() => {
            // Obter todos os nodos
            const nodos = document.body.getElementsByTagName("*")

            for (const nodo of nodos) {
                // Verificar altura e largura entre pai/filho
                if (nodo.childNodes.length != 0 && nodo.nodeType === 1) {

                    let infoPai = nodo.getBoundingClientRect()
                    let paiXum = infoPai.x
                    let paiYum = infoPai.y
                    let paiXdois = infoPai.x + infoPai.width
                    let paiYdois = infoPai.y + infoPai.height

                    for (const filho of nodo.children) {
                        // console.log(filho.scrollWidth)
                        // console.log(filho.clientWidth)
                        // console.log(filho.scrollHeight)
                        // console.log(filho.clientHeight)

                        // Verificar overflows de cada elemento (No site do JIB, estoura com animaçoes)
                        if (filho.scrollWidth > filho.clientWidth || filho.scrollHeight > filho.clientHeight) {
                            console.log("⚠️ Conteúdo possivelmente escondido por overflow/truncamento:", filho.tagName, filho.className);
                        }


                        // Ignorar elementos com posiçao absolute/fixed
                        if (getComputedStyle(filho).position === "absolute" || getComputedStyle(filho).position === "fixed") {
                            console.log("Elemento com posição fixed/absolute -> Verificar manualmente")
                        }
                        else {
                            let infoFilho = filho.getBoundingClientRect()
                            if (infoFilho.x < paiXum || infoFilho.y < paiYum || infoFilho.x + infoFilho.width > paiXdois || infoFilho.y + infoFilho.height > paiYdois) {

                                console.log("PONTO PAI: " + nodo.className + "   " + nodo.tagName + "   " + "ponto1: (" + paiXum + ", " + paiYum + ") ponto2: (" + paiXdois + ", " + paiYdois + ")")
                                console.log("PONTO FILHO: " + filho.className + "   " + filho.tagName + "   " + "ponto1: (" + infoFilho.x + ", " + infoFilho.y + ") ponto2: (" + infoFilho.x + infoFilho.width + ", " + infoFilho.y + infoFilho.height + ")")

                                console.log("NAO ESTÁ RESPONSIVO ->" + filho.tagName + "  " + filho.className + "\n")
                            }
                        }

                    }
                }
                else {
                    //console.log("NAO TENHO FILHOS")
                }
            }
        });
        page.close()
    }

    await browser.close();
})();
