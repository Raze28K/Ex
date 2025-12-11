const express = require("express");
const pool = require("./db");
const app = express()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
app.use(express.static("public"))

app.use(express.json())
const JWT_SECRET = "SUPER_SECRET_KEY_123456";



//ПРОВЕРЯЕТ ТОКЕН
function authMiddleware(req, res, next) {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader)
    return res.status(401).json({ message: "Нет токена" });

  const token = tokenHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Неверный токен" });
  }
}


app.post("/reg", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    await pool.query(`
      INSERT INTO users (username, password)
      VALUES ($1, $2)
    `, [username, hash]);

    res.json({ message: "Регистрация успешна" });

  } catch (err) {
    console.log(err); // ← покажет реальную ошибку

    if (err.code === "23505") {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.post("/api/update_level", async (req, res) => {
    const { user_id, level } = req.body;
    try {
        await pool.query(
            `UPDATE users SET level = $1 WHERE id = $2`,
            [level, user_id]
        );
        res.json({ message: "Уровень обновлён" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});



app.post("/log",async(req,res) =>{
    const { username, password } = req.body;

    const result = await pool.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );
        if (result.rows.length === 0)
            return res.status(400).json({ message: "Неверные данные" });

   const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(400).json({ message: "Неверный пароль" });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token, role: user.role });

})


app.get("/users", async(req, res) =>{
    const result = await pool.query(`
        SELECT * FROM users 
        `)
    res.json(result.rows)
})

// app.get("/users/:id", async(req, res) =>{
//     const result = await pool.query(`
//         SELECT * FROM users 
//         WHERE email = bob@gmail.com
//         `)
//     res.json(result.rows)
// })

app.post("/api/update_level", async (req, res) => {
    const { user_id, level } = req.body; // берём id пользователя и новый уровень
    try {
        await pool.query(
            `UPDATE users SET level = $1 WHERE id = $2`,
            [level, user_id]
        );
        res.json({ message: "Уровень обновлён" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.post("/api/update_xp", async (req, res) => {
    const { user_id, xp } = req.body;
    try {
        await pool.query(
            `UPDATE users SET xp = $1 WHERE id = $2`,
            [xp, user_id]
        );
        res.json({ message: "XP обновлён" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});


app.listen(3000, ()=>{
    console.log("Server is working, http://localhost:3000")
})