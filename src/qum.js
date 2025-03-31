const radios = document.querySelectorAll('input[name="problema"]');
radios.forEach(radio => {
    radio.addEventListener('change', checkProblema);
});

function checkProblema() {

    const problema = document.querySelector('input[name="problema"]:checked');
    const severidade = document.getElementById("severidade");

    if (problema && problema.value === "Sim") {
        severidade.style.display = "flex"
    } else {
        severidade.style.display = "none"
    }
}




