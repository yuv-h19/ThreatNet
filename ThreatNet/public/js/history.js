window.onload = function () {

    // Retrieve stored history entries
    let history1 = localStorage.getItem("history1");
    let history2 = localStorage.getItem("history2");

    let list = document.getElementById("historyList");

    // Handle empty history state
    if (!history1 && !history2) {
        let empty = document.createElement("p");
        empty.classList.add("empty-history");
        empty.innerText = "No recent activity yet";
        list.appendChild(empty);
        return;
    }

    // Render first history item
    if (history1) {
        let li1 = document.createElement("li");
        li1.innerHTML = history1;
        list.appendChild(li1);
    }

    // Render second history item
    if (history2) {
        let li2 = document.createElement("li");
        li2.innerHTML = history2;
        list.appendChild(li2);
    }
};