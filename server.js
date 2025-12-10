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


app.post("/reg",async(req,res) =>{
    const { username, password } = req.body;

    const hash = await bcrypt.hash(password, 10);
    try {
       const result = await pool.query(`
            INSERT INTO users (user_name, password)
            VALUES ($1, $2)
            
        `,
        // ДОЛЛАРЫ ОБОЗНАЧАЮТ ЗНАЧЕНИЕ ИЗ СТРОК(имя пароль и тд)
            [username, hash]
        );
        res.json({ message: "Регистрация успешна" });
    }
    catch (err) {
        res.status(400).json({ message: "Пользователь уже существует" });
    }
    
})

app.post("/level",async(req,res) =>{
    const {level, Experience } = req.body;

    
    try {
       const result = await pool.query(`
            SELECT FROM users (level, Experience)
            VALUES ($1, $2)
            
        `,
        // ДОЛЛАРЫ ОБОЗНАЧАЮТ ЗНАЧЕНИЕ ИЗ СТРОК(имя пароль и тд)
            [level,Experience]
        );
        
    }
    catch (err) {
        res.status(400).json({ message: "Данные не найдены!" });
    }
    
})

app.post("/log",async(req,res) =>{
    const { username, password } = req.body;

    const result = await pool.query(
    `SELECT * FROM users WHERE user_name = $1`,
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



app.listen(3000, ()=>{
    console.log("Server is working, http://localhost:3000")
})