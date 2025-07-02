
lucide.createIcons();
let isExpanded = true;
let resultadosShowing = false;
function resizeWindow() {

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

async function runResponsivenessCheck() {
    const siteValue = document.getElementById("site-analise").value.trim();
    if (siteValue == "") {
        document.getElementById("error").style.display = "flex"
        return
    }

    try {
        document.getElementById("loading").style.display = "flex"
        document.getElementById("formsAxe").style.display = "none"
        document.getElementById("textoLoading").innerHTML = "A correr testes de responsividade..."
        const result = await window.electronAPI.runRespTest(siteValue);
        window.electronAPI.updateWindowSize(600)
        document.getElementById("loading").style.display = "none"
        document.getElementById("resultadosAxe").style.display = "block"
        document.getElementById("legenda").style.display = "block"

        resultadosShowing = true

        const resultsContainer1 = document.getElementById("lista1");
        document.getElementById("texto1").innerHTML = "Mobile - " + result["mobile"].length + " issues"
        result["mobile"].forEach(issue => {

            const incompleteDiv = document.createElement("div");
            incompleteDiv.classList.add("issue-entry");

            const description = document.createElement("p");
            description.innerHTML = `${issue || "Unknown"}`;
            incompleteDiv.appendChild(description);



            const separator = document.createElement("hr");
            incompleteDiv.appendChild(separator);

            // Add the complete violation block to the container
            resultsContainer1.appendChild(incompleteDiv);
        })

        const resultsContainer2 = document.getElementById("lista2");
        document.getElementById("texto2").innerHTML = "Tablet - " + result["tablet"].length + " issues"
        result["tablet"].forEach(issue => {

            const incompleteDiv = document.createElement("div");
            incompleteDiv.classList.add("issue-entry");

            const description = document.createElement("p");
            description.innerHTML = `${issue || "Unknown"}`;
            incompleteDiv.appendChild(description);



            const separator = document.createElement("hr");
            incompleteDiv.appendChild(separator);

            // Add the complete violation block to the container
            resultsContainer2.appendChild(incompleteDiv);
        })

        const resultsContainer3 = document.getElementById("lista3");
        document.getElementById("texto3").innerHTML = "Desktop - " + result["desktop"].length + " issues"
        result["desktop"].forEach(issue => {

            const incompleteDiv = document.createElement("div");
            incompleteDiv.classList.add("issue-entry");

            const description = document.createElement("p");
            description.innerHTML = `${issue || "Unknown"}`;
            incompleteDiv.appendChild(description);



            const separator = document.createElement("hr");
            incompleteDiv.appendChild(separator);

            // Add the complete violation block to the container
            resultsContainer3.appendChild(incompleteDiv);
        })

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