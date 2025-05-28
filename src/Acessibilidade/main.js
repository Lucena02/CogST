lucide.createIcons();
let isExpanded = true;
let resultadosShowing = false;
function resizeWindow() {

    const toggleButton = document.getElementById('toggleButton');
    const sidebarTab = document.getElementById('sidebarTab');
    const toggleIcon = document.getElementById('toggleIcon');
    const contentContainer = document.getElementById('contentContainer');

    if (isExpanded == false) {

        //sidebarTab.style.width = 'var(--tab-width)';
        toggleIcon.setAttribute('data-lucide', 'chevron-right');
        contentContainer.style.opacity = '1';
        contentContainer.style.width = '90%';
        if (resultadosShowing == true) {
            window.electronAPI.updateWindowSize(600);
        }
        else {
            window.electronAPI.updateWindowSize(330);
        }

        isExpanded = true
    } else {
        //sidebarTab.style.width = 'var(--collapsed-width)';
        contentContainer.style.opacity = '0';
        contentContainer.style.width = '0';
        toggleIcon.setAttribute('data-lucide', 'chevron-left');
        window.electronAPI.updateWindowSize(40);
        isExpanded = false
    }
}


async function runTestsAcessibility() {
    const siteValue = document.getElementById("site-analise").value.trim();

    try {
        const result = await window.electronAPI.runAxeTest(siteValue);
        window.electronAPI.updateWindowSize(600)
        resultadosShowing = true
        const resultsContainer = document.getElementById("lista1");

        //Violations
        result["violations"].forEach(violation => {

            const violationDiv = document.createElement("div");
            violationDiv.classList.add("violation-entry");

            const severity = document.createElement("p");
            severity.innerHTML = `<strong>Impact:</strong> ${violation.impact || "Unknown"}`;
            violationDiv.appendChild(severity);

            const help = document.createElement("p");
            help.innerHTML = `<strong>Issue:</strong> ${violation.help}`;
            violationDiv.appendChild(help);

            violation["nodes"].forEach(node => {
                const htmlElement = document.createElement("pre");
                htmlElement.textContent = `Element: ${node.html}`;
                violationDiv.appendChild(htmlElement);
            });

            const helpURL = document.createElement("button");
            helpURL.onclick = () => {
                window.open(violation.helpUrl, "_blank");
            };
            helpURL.innerHTML = `Learn More <i data-lucide="help-circle"></i>`;
            violationDiv.appendChild(helpURL);

            const separator = document.createElement("hr");
            violationDiv.appendChild(separator);

            // Add the complete violation block to the container
            resultsContainer.appendChild(violationDiv);
        })
        document.getElementById("formsAxe").style.display = "none"
        document.getElementById("resultadosAxe").style.display = "block"
    } catch (err) {
        alert("Erro: " + err.message);
    }
}

function retroceder() {
    window.electronAPI.updateWindowSize(330)
    window.electronAPI.send("go-back")
}



function toggleDetails(numero) {
    const details = document.getElementById("details" + numero);

    if (details.style.display === "none" || details.style.display === "") {
        details.style.display = "block";
    } else {
        details.style.display = "none";
    }
}