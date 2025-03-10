const radios = document.querySelectorAll('input[name="problema"]');
console.log(radios)
radios.forEach(radio => {
    radio.addEventListener('change', checkProblema);
});

function checkProblema() {
    // Get the selected radio button by its name
    const problema = document.querySelector('input[name="problema"]:checked');
    const severidade = document.getElementById("severidade");
    // Check if the selected radio button has value "Sim"
    if (problema && problema.value === "Sim") {
        severidade.style.display = "flex"
    } else {
        severidade.style.display = "none"
    }
}