
document.getElementById("btn-preview").addEventListener("click", () => {
  const form = document.getElementById("formulaire");
  const data = new FormData(form);
  let html = "";
  for (const [key, value] of data.entries()) {
    html += `<p><strong>${key}:</strong> ${value}</p>`;
  }
  document.getElementById("resumeContent").innerHTML = html;
  form.classList.add("d-none");
  document.getElementById("resumeContainer").classList.remove("d-none");
});

document.getElementById("btn-confirm").addEventListener("click", () => {
  const formData = new FormData(document.getElementById("formulaire"));
  const data = {};
  formData.forEach((val, key) => data[key] = val);

  fetch("https://script.google.com/macros/s/AKfycbxakbBK9TUcJ5gQQ4nL3vuDoGw2kt9zY3fMVb1tImOvnWNXdNb3kYIIGRh-VLp5dkNi/exec", {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  });

  document.getElementById("resumeContainer").classList.add("d-none");
  document.getElementById("confirmationContainer").classList.remove("d-none");
});
