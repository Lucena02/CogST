try {
    document.getElementById("fileInput").addEventListener("change", function () {
        const feedback = document.getElementById("feedbackImportar");
        if (this.files.length > 0) {
            document.getElementById("error").innerHTML = "";
            feedback.textContent = "Importado!";
        } else {
            feedback.textContent = "";
        }
    });

} catch (error) {
    alert("Error in file input event listener: " + error.message);
}

