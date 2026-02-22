// Save activity before leaving the page
window.addEventListener("beforeunload", function () {
    // Generate current timestamp
    let now = new Date();
    let dateTime = now.toLocaleString();

    // Create history message
    let message = "Viewed Phishing technique - " + dateTime;

    // Shift previous history entry
    let oldHistory = localStorage.getItem("history1");
    if (oldHistory) {
        localStorage.setItem("history2", oldHistory);
    }

    // Store latest history entry
    localStorage.setItem("history1", message);
});