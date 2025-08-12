// Get LRN from URL
const urlParams = new URLSearchParams(window.location.search);
const lrn = urlParams.get("lrn");

// Display LRN
document.getElementById("lrn-display").textContent = `LRN: ${lrn}`;

// Google Apps Script Web App URL (replace with your deployed URL)
const scriptURL = "https://script.google.com/macros/s/AKfycbzGx5rIgY9y-If49E8lO_d-m7tXI4t3Sq51JmcF11rAPlYxs6ik1YXP0hiBE-AnJYiPjw/exec";

// Fetch learner details
fetch(`${scriptURL}?lrn=${encodeURIComponent(lrn)}`)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert("Learner not found.");
            document.getElementById("grade-section").textContent = "N/A";
            document.getElementById("learner-name").textContent = "N/A";
            document.getElementById("proficiency-level").textContent = "N/A";
            document.getElementById("time-updated").textContent = "N/A";
            document.getElementById("remarks").textContent = "N/A";
            return;
        }

        // Populate learner details
        document.getElementById("grade-section").textContent = data["GRADE LEVEL AND SECTION"] || "N/A";
        document.getElementById("learner-name").textContent = data["NAME OF LEARNER"] || "N/A";
        document.getElementById("proficiency-level").textContent = data["PROFICIENCY LEVEL"] || "N/A";
        document.getElementById("time-updated").textContent = data["TIME UPDATED"] || "N/A";
        document.getElementById("remarks").textContent = data["REMARKS"] || "N/A";
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        alert("Unable to fetch learner data.");
    });
