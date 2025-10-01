lucide.createIcons();

function getHelp(int) {
    parent.getHelp(int);
}


const radios = document.querySelectorAll('input[name="problema"]');
radios.forEach(radio => {
    radio.addEventListener('change', checkProblema);
});

function checkProblema() {

    const problema = document.querySelector('input[name="problema"]:checked');
    const severidade = document.getElementById("severidade");

    if (problema && problema.value === "No") {
        severidade.style.display = "flex"
    } else {
        severidade.style.display = "none"
    }
}




