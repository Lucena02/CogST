const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const dimensions = [
        { width: 360, height: 640, name: 'mobile' },
        { width: 810, height: 1080, name: 'tablet' },
        { width: 1920, height: 1080, name: 'desktop' }
    ];
    const issues = {}
    dimensions.forEach(dimension => {
        issues[dimension.name] = []
    })
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();

    for (const viewport of dimensions) {
        const page = await context.newPage();
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        page.on('console', msg => {
            console.log(`[Browser Console] ${msg.type().toUpperCase()}: ${msg.text()}`);
        });
        await page.goto(process.argv[2]);
        await page.waitForLoadState('networkidle');


        // Horizontal Scroll
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        console.log(`→ ${viewport.name}: horizontal scroll? ${hasHorizontalScroll ? '❌ Há scroll horizontal...' : '✅ Sem scroll horizontal!'}`);
        if (hasHorizontalScroll) {
            issues[viewport.name].push(`❌ Scroll Horizontal`)
        }



        const foundIssues = await page.evaluate(() => {
            let collectedIssues = []
            function verificaLimites(nodo1, nodo2) {
                if ((nodo2.x > nodo1.x && nodo2.x < nodo1.x + nodo1.width && nodo2.y > nodo1.y && nodo2.y < nodo1.y + nodo1.height) || (nodo2.x + nodo2.width > nodo1.x && nodo2.x + nodo2.width < nodo1.x + nodo1.width && nodo2.y + nodo2.height > nodo1.y && nodo2.y + nodo2.height < nodo1.y + nodo1.height)) {
                    return true // nodo2 dentro do nodo1
                }
                else {
                    return false
                }
            }
            // Cuidado com os IGUAIS aqui !!!
            function verificaLimites2(nodo1, nodo2) {
                if ((nodo2.x >= nodo1.x && nodo2.x <= nodo1.x + nodo1.width && nodo2.y >= nodo1.y && nodo2.y <= nodo1.y + nodo1.height) || (nodo2.x + nodo2.width >= nodo1.x && nodo2.x + nodo2.width <= nodo1.x + nodo1.width && nodo2.y + nodo2.height >= nodo1.y && nodo2.y + nodo2.height <= nodo1.y + nodo1.height)) {
                    return true // nodo2 dentro do nodo1
                }
                else {
                    return false
                }
            }


            // Obter todos os nodos
            const nodos = document.body.getElementsByTagName("*")
            const irmaosMaus = new Set();
            for (const nodo of nodos) {
                // Verificar altura e largura entre pai/filho
                if (nodo.childNodes.length != 0 && nodo.nodeType === 1) {

                    let infoPai = nodo.getBoundingClientRect()


                    for (const filho of nodo.children) {

                        // console.log(filho.scrollWidth)
                        // console.log(filho.clientWidth)
                        // console.log(filho.scrollHeight)
                        // console.log(filho.clientHeight)

                        // Ignorar elementos com posiçao absolute/fixed
                        if (getComputedStyle(filho).position === "absolute" || getComputedStyle(filho).position === "fixed") {
                            console.log("⚠️ Elemento com posição fixed/absolute -> Verificar manualmente")
                            collectedIssues.push("⚠️ Elemento com posição fixed/absolute -> Verificar manualmente: Tag: " + filho.tagName + " Class: " + filho.className)
                            continue
                        }
                        // Verificar overflows de cada elemento (No site do JIB, estoura com animaçoes)
                        if (filho.scrollWidth > filho.clientWidth || filho.scrollHeight > filho.clientHeight) {
                            console.log("⚠️ Conteúdo possivelmente escondido por overflow/truncamento:", filho.tagName, filho.className);
                            collectedIssues.push("⚠️ Conteúdo possivelmente escondido por overflow/truncamento: Tag: " + filho.tagName + " Class: " + filho.className)
                        }



                        // Comparar nodo filho ao nodo pai
                        let infoFilho = filho.getBoundingClientRect()
                        if (!verificaLimites2(infoPai, infoFilho)) {

                            console.log("PONTO PAI: " + nodo.className + "   " + nodo.tagName + "   " + "ponto1: (" + infoPai.x + ", " + infoPai.y + ") ponto2: (" + (infoPai.x + infoPai.width) + ", " + (infoPai.y + infoPai.height) + ")")
                            console.log("PONTO FILHO: " + filho.className + "   " + filho.tagName + "   " + "ponto1: (" + infoFilho.x + ", " + infoFilho.y + ") ponto2: (" + (infoFilho.x + infoFilho.width) + ", " + (infoFilho.y + infoFilho.height) + ")")

                            console.log("⚠️ NAO ESTÁ RESPONSIVO (I vs P)->" + filho.tagName + "  " + filho.className + "\n")
                            collectedIssues.push("⚠️ NAO ESTÁ RESPONSIVO (I vs P). Elemento 1 -> Tag: " + filho.tagName + " Class: " + filho.className + " Id: " + filho.id + " Elemento 2 -> Tag: " + nodo.tagName + " Class: " + nodo.className + " Id: " + nodo.id)
                        }

                        function createKey(el1, el2) {
                            const ids = [el1.id, el2.id].sort();
                            return ids.join('_');
                        }


                        // Comparar nodo com os irmãos
                        for (const irmao of nodo.children) {
                            let infoIrmao = irmao.getBoundingClientRect()
                            if (irmao === filho) {
                                console.log("IGUAIS, SKIP")
                                continue
                            }
                            if (verificaLimites(infoFilho, infoIrmao)) {
                                const key = createKey(filho, irmao);
                                if (!irmaosMaus.has(key)) {
                                    console.log("PONTO FILHO1: " + irmao.className + "   " + irmao.tagName + "   " + "ponto1: (" + infoIrmao.x + ", " + infoIrmao.y + ") ponto2: (" + (infoIrmao.x + infoIrmao.width) + ", " + (infoIrmao.y + infoIrmao.height) + ")")
                                    console.log("PONTO FILHO2: " + filho.className + "   " + filho.tagName + "   " + "ponto1: (" + infoFilho.x + ", " + infoFilho.y + ") ponto2: (" + (infoFilho.x + infoFilho.width) + ", " + (infoFilho.y + infoFilho.height) + ")")

                                    console.log("⚠️ NAO ESTÁ RESPONSIVO (I vs I) ->" + filho.tagName + "  " + filho.className + "  " + filho.id + " VS " + irmao.id + "\n")
                                    collectedIssues.push("⚠️ NAO ESTÁ RESPONSIVO(I vs I). Elemento 1 -> Tag: " + filho.tagName + " Class: " + filho.className + " Id: " + filho.id + " Elemento 2 -> Tag: " + irmao.tagName + " Class: " + irmao.className + " Id: " + irmao.id)

                                    irmaosMaus.add(key);
                                }
                            }
                        }

                    }
                }
                else {
                    //console.log("NAO TENHO FILHOS")
                }
            }
            return collectedIssues;
        });
        issues[viewport.name] = issues[viewport.name].concat(foundIssues);
        console.log(issues)
        page.close()
    }

    const jsonString = JSON.stringify(issues, null, 4);
    // Write JSON to a file
    fs.writeFile('output.json', jsonString, (err) => {
        if (err) {
            console.error('Error writing file', err);
        } else {
            console.log('✅ JSON file has been saved.');
        }
    });

    await browser.close();
})();
