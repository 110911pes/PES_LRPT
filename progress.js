// Get LRN from URL
const urlParams = new URLSearchParams(window.location.search);
const lrn = urlParams.get("lrn");

// Display LRN in the page
document.getElementById("lrn-display").textContent = `LRN: ${lrn}`;

// Google Apps Script Web App URL (Deployed as "Anyone with the link" access)
const scriptURL = "https://script.google.com/a/macros/deped.gov.ph/s/AKfycbyhaKd9RD3hQMPTOfJZy5sRBYKvNsfnjrIEMBC18rk_QLQfNPmhtUdKIPx5n2M-qAkzSw/exec"; // <-- Replace with your deployed web app URL

// Fetch learner data from Google Sheets
function fetchLearnerData(lrn) {
    fetch(`${scriptURL}?lrn=${encodeURIComponent(lrn)}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById("learner-data").innerHTML = `<p>${data.error}</p>`;
                return;
            }

            // Display the learner data
            document.getElementById("learner-data").innerHTML = `
                <p><strong>Grade Level & Section:</strong> ${data["GRADE LEVEL AND SECTION"]}</p>
                <p><strong>Name of Learner:</strong> ${data["NAME OF LEARNER"]}</p>
                <p><strong>Proficiency Level:</strong> ${data["PROFICIENCY LEVEL"]}</p>
                <p><strong>Time Updated:</strong> ${data["TIME UPDATED"]}</p>
                <p><strong>Remarks:</strong> ${data["REMARKS"]}</p>
            `;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById("learner-data").innerHTML = "<p>Error fetching data</p>";
        });
}

// Run fetch
if (lrn) {
    fetchLearnerData(lrn);
} else {
    document.getElementById("learner-data").innerHTML = "<p>No LRN provided</p>";
}

