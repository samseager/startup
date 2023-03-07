function login() {
    const nameEl = document.querySelector("#name");
    const passEl = document.querySelector("#password");
    localStorage.setItem("userName", nameEl.value);
    localStorage.setItem("userPass", passEl.value);
    window.location.href = "vote.html";
  }