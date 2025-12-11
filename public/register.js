const form = document.getElementById("regForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById("reg_username");
    const passwordInput = document.getElementById("reg_password");
    const msgDiv = document.getElementById("reg_msg");

    let valid = true;

    // Очистка ошибок
    document.querySelectorAll(".input-group").forEach(g => g.classList.remove("error"));

    // Валидация
    if (!usernameInput.value.trim()) {
        usernameInput.parentElement.classList.add("error");
        usernameInput.nextElementSibling.textContent = "Введите логин";
        valid = false;
    }
    if (passwordInput.value.length < 4) {
        passwordInput.parentElement.classList.add("error");
        passwordInput.nextElementSibling.textContent = "Пароль минимум 4 символа";
        valid = false;
    }

    if (!valid) return;

    // Отправка на сервер
    try {
        
        const res = await fetch("/reg", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        });
        const data = await res.json();
        msgDiv.textContent = data.message;
        if (res.ok) setTimeout(() => window.location = "login.html", 1000);
    } catch (err) {
        msgDiv.textContent = "Ошибка сервера";
    }
    
});
