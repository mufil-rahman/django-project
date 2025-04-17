const token = localStorage.getItem("access");
const usernameElement = document.getElementById("username");
const passwordElement = document.getElementById("password");
const newusernameElement = document.getElementById("newUsername");
const newpasswordElement = document.getElementById("newPassword");

const recordSection = document.getElementById("recordSection");
const homeContent = document.getElementById("homeContent");
const addRecordNav = document.getElementById("addRecordNav");
const recordBody = document.getElementById("recordBody");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const registerBtn = document.getElementById("registerBtn");

const headers = { Authorization: `Bearer ${token}` };
const askBtn = document.getElementById("askBtn");
const questionInput = document.getElementById("questionInput");
const answerContainer = document.getElementById("answerContainer");
const answerText = document.getElementById("answerText");
const assistantBtn = document.getElementById("assistantBtn");

logoutBtn.addEventListener("click", handleLogout);

async function handleLogin() {
  const username = usernameElement.value;
  const password = passwordElement.value;
  try {
    const response = await axios.post("/api/auth/token/", { username, password });
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    // bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
    $("#loginModal").modal("hide");
    
    loadRecords();
    assistantBtn.style.display = "block";
  } catch (err) {
    alert("Invalid login");
  }
}

async function handleRegister() {
  const username = newusernameElement.value;
  const password = newpasswordElement.value;
  try {
     await axios.post("/api/users/register/", { username, password
    });
    
    $("#registerModal").modal("hide");
    const response = await axios.post("/api/auth/token/", { username, password });
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    alert("User registered successfully");
    location.reload();
    
  }
  catch (err) {
    alert("Invalid register");
  }
}

async function loadRecords() {
  try {
    const res = await axios.get("/api/records/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
    });
    homeContent.style.display = "none";
    recordSection.style.display = "block";
    addRecordNav.style.display = "block";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";

    recordBody.innerHTML = "";
    res.data.forEach((record) => {
      const row = `<tr style='cursor: pointer;' onclick="window.location='record?id=${record.id}'">
        <td>${record.first_name}</td>
        <td>${record.last_name}</td>
        <td>${record.email}</td>
        <td>${record.phone}</td>
        <td>${record.city}</td>
      </tr>`;
      recordBody.innerHTML += row;
    });
  } catch {
    localStorage.clear();
  }
}

function handleLogout(e) {
  localStorage.clear();
  location.reload();
};

if (token) {
  loadRecords();
  assistantBtn.style.display = "block";
} else {
  assistantBtn.style.display = "none";
}

askBtn.addEventListener("click", async () => {
  const question = questionInput.value.trim();
  if (!question) {
    alert("Please enter a question.");
    return;
  }

  try {
    const response = await axios.post("/api/crm/question/", { question }, { headers });
    answerText.textContent = response.data.answer;
    answerContainer.style.display = "block";
  } catch (error) {
    console.error("Error fetching answer:", error);
    alert("Failed to get an answer. Please try again later.");
  }
});