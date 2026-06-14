const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ----------------- FILE STORAGE -----------------
const uploadsPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
}

app.use("/uploads", express.static(uploadsPath));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// ----------------- DATABASE -----------------
const db = new sqlite3.Database(
    path.join(__dirname, "barman.db")
);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS wallpapers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            filename TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// ----------------- ADMIN -----------------
const ADMIN_USER = "barman";
const ADMIN_PASS = "1234";

// ----------------- ROUTES -----------------

app.get("/", (req, res) => {
    res.send("BARMAN Backend Running (SQLite Active)");
});

// GET WALLPAPERS
app.get("/wallpapers", (req, res) => {
    db.all(
        "SELECT * FROM wallpapers ORDER BY id DESC",
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(rows);
        }
    );
});

// UPLOAD WALLPAPER (FIXED)
app.post("/upload", upload.single("image"), (req, res) => {
    const { title } = req.body;

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded"
        });
    }

    db.run(
        "INSERT INTO wallpapers (title, filename) VALUES (?, ?)",
        [title, req.file.filename],
        function (err) {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                id: this.lastID
            });
        }
    );
});

// DELETE WALLPAPER
app.delete("/wallpapers/:id", (req, res) => {
    const id = req.params.id;

    db.run(
        "DELETE FROM wallpapers WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                message: "Wallpaper deleted permanently"
            });
        }
    );
});

// LOGIN

   
app.post("/login", (req, res) => {
    console.log("LOGIN HIT:", req.body);

    const { username, password } = req.body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        return res.json({
            success: true,
            message: "Login successful"
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid credentials"
    });
});

// ----------------- START SERVER -----------------
app.listen(PORT, () => {
    console.log("=================================");
    console.log(" BARMAN WALLPAPER SERVER");
    console.log(" SQLite DATABASE ACTIVE");
    console.log(" http://localhost:" + PORT);
    console.log("=================================");
});