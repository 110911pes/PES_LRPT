function login() {
    const lrn = document.getElementById("lrn-input").value.trim();
    if (lrn === "") {
        alert("Please enter your LRN.");
        return;
    }
    // Redirect to progress page with LRN in URL
    window.location.href = `progress.html?lrn=${encodeURIComponent(lrn)}`;
}
