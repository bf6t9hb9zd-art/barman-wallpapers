const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uploadsPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath);
app.use("/uploads", express.static(uploadsPath));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsPath),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

const db = new Database(path.join(__dirname, "barman.db"));

db.exec(`
    CREATE TABLE IF NOT EXISTS wallpapers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        filename TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

const ADMIN_USER = "barman";
const ADMIN_PASS = "1234";

app.get("/", (req, res) => res.send("BARMAN Backend Running"));

app.get("/wallpapers", (req, res) => {
    const rows = db.prepare("SELECT * FROM wallpapers ORDER BY id DESC").all();
    res.json(rows);
});

app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const { title } = req.body;
    const result = db.prepare("INSERT INTO wallpapers (title, filename) VALUES (?, ?)").run(title, req.file.filename);
    res.json({ success: true, id: result.lastInsertRowid });
});

app.delete("/wallpapers/:id", (req, res) => {
    db.prepare("DELETE FROM wallpapers WHERE id = ?").run(req.params.id);
    res.json({ success: true, message: "Deleted" });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        return res.json({ success: true, message: "Login successful" });
    }
    res.status(401).json({ success: false, message: "Invalid credentials" });
});

app.listen(PORT, () => {
    console.log("=================================");
    console.log(" BARMAN WALLPAPER SERVER RUNNING");
    console.log(" http://localhost:" + PORT);
    console.log("=================================");
});