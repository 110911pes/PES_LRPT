// ================= CONFIG =================
// Palitan mo ito ng "Publish to Web" CSV link ng sheet mo
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQHdNimtZb5EY9EhwDRzEcsUFONIJ2RhdKNFmmtZ0jymFbxcB_0-Mc1g8jyEbA1EJhK2ydj3gU7bip/pub?gid=2131981037&single=true&output=csv";

// ================= HELPERS =================
// CSV parser (mas matibay kaysa split lang)
function csvToJson(csv) {
  const rows = [];
  let current = "";
  let insideQuote = false;
  const cells = [];
  const headers = [];

  const lines = csv.split("\n");

  // Extract headers
  lines[0].split(",").forEach((h) => headers.push(h.trim()));

  // Parse each line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    let cell = "";
    let row = [];
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === "," && !insideQuote) {
        row.push(cell.trim());
        cell = "";
      } else {
        cell += char;
      }
    }
    row.push(cell.trim());
    if (row.length > 1 || row[0] !== "") {
      let obj = {};
      headers.forEach((h, idx) => {
        obj[h] = row[idx] || "";
      });
      rows.push(obj);
    }
  }
  return rows;
}

// Show/hide loader
function toggleLoader(show) {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = show ? "block" : "none";
}

// ================= MAIN LOGIC =================
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");

  // LOGIN PAGE
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const refNum = document.getElementById("username").value.trim();

      if (!refNum) {
        alert("Please enter a Learner Reference Number");
        return;
      }

      try {
        toggleLoader(true);

        const response = await fetch(SHEET_CSV_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        console.log("Raw CSV response:", text);

        const data = csvToJson(text);

        // Hanapin learner by LRN
        const student = data.find(
          (row) => String(row["LEARNER REFERENCE NUMBER"]) === refNum
        );

        if (student) {
          localStorage.setItem("studentData", JSON.stringify(student));
          window.location.href = "dashboard.html";
        } else {
          alert("Learner Reference Number not found.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Error fetching data. Please check console for details.");
      } finally {
        toggleLoader(false);
      }
    });
  }

  // DASHBOARD PAGE
  if (window.location.pathname.includes("dashboard.html")) {
    const student = JSON.parse(localStorage.getItem("studentData"));
    if (!student) {
      window.location.href = "index.html";
      return;
    }

    // Display learner info
    document.getElementById("studentId").textContent =
      student["LEARNER REFERENCE NUMBER"];
    document.getElementById("name").textContent = student["NAME OF LEARNER"];
    document.getElementById("gradeSection").textContent =
      student["GRADE LEVEL AND SECTION"];
    document.getElementById("proficiency").textContent =
      student["PROFICIENCY LEVEL"];
    document.getElementById("remarks").textContent = student["REMARKS"];
    document.getElementById("timestamp").textContent = student["TIME UPDATED"];
  }

  // LOGOUT BUTTON
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "index.html";
    });
  }
});
