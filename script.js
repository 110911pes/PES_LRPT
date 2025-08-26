// ================= CONFIG =================
// Palitan ng tamang SHEET_ID at GID ng Google Sheet mo
const SHEET_JSON_URL =
  "https://docs.google.com/spreadsheets/d/1vOBRjLDjvFaCdtc8-sE_4kzVpGsTq795OkAscxYj8xI/gviz/tq?tqx=out:json&gid=2131981037";

// ================= HELPERS =================
async function fetchSheetData() {
  const response = await fetch(SHEET_JSON_URL);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const text = await response.text();

  // Google Sheets JSON feed comes wrapped in a function call (JSONP style)
  const json = JSON.parse(text.substr(47).slice(0, -2));

  // Extract headers
  const headers = json.table.cols.map((c) => c.label);

  // Extract rows
  const rows = json.table.rows.map((r) =>
    r.c.map((c) => (c ? c.v : "")) // handle nulls
  );

  // Convert to array of objects
  return rows.map((r) => {
    let obj = {};
    headers.forEach((h, i) => (obj[h] = r[i]));
    return obj;
  });
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

        const data = await fetchSheetData();

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
