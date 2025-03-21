const token = localStorage.getItem("access");
const params = new URLSearchParams(window.location.search);
const recordId = params.get("id");
const headers = { Authorization: `Bearer ${token}` };
const deleteBtn = document.getElementById("deleteBtn");
const updateSubmitBtn = document.getElementById("updateSubmitBtn");
const formTitle = document.getElementById("formTitle");
const recordForm = document.getElementById("recordForm");

if (!token) window.location = "/";

if (recordId) {
  formTitle.innerText = "Update Record";
  updateSubmitBtn.innerHTML = `<i class="fas fa-edit"></i> Update Record`;
  deleteBtn.style.display = "inline-block";

  axios.get(`/api/records/${recordId}/`, { headers }).then(res => {
    const data = res.data;
    for (const key in data) {
      if (document.getElementById(key)) {
        document.getElementById(key).value = data[key];
      }
    }
  });


  function deleteRecord() {
    if (!confirm("Are you sure you want to delete this record?")) return;
    axios.delete(`/api/records/${recordId}/`, { headers }).then(() => {
      window.location = "/";
    });
  }
  deleteBtn.addEventListener("click", deleteRecord);
}

recordForm.addEventListener("submit", handleSubutAndUpdate);

async function handleSubutAndUpdate(e) {
    e.preventDefault();
    const data = {};
    Array.from(e.target.elements).forEach((el) => {
      if (el.id) data[el.id] = el.value;
    });
  
    if (recordId) {
      await axios.put(`/api/records/${recordId}/`, data, { headers });
    } else {
      await axios.post("/api/records/", data, { headers });
    }
    window.location = "/";
}