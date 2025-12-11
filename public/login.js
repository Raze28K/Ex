const formLogin = document.getElementById("loginForm");

formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById("login_username");
    const passwordInput = document.getElementById("login_password");
    const msgDiv = document.getElementById("login_msg");

    let valid = true;
    document.querySelectorAll(".input-group").forEach(g => g.classList.remove("error"));

    if (!usernameInput.value.trim()) {
        usernameInput.parentElement.classList.add("error");
        usernameInput.nextElementSibling.textContent = "Введите логин";
        valid = false;
    }
    if (!passwordInput.value) {
        passwordInput.parentElement.classList.add("error");
        passwordInput.nextElementSibling.textContent = "Введите пароль";
        valid = false;
    }
    if (!valid) return;

    try {
        const res = await fetch("/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        });

        const data = await res.json();
        if (!res.ok) {
            msgDiv.textContent = data.message;
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.id || data.user_id);

        window.location = "index.html";
    } catch (err) {
        msgDiv.textContent = "Ошибка сервера";
    }
});
