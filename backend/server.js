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
        category TEXT DEFAULT 'General',
        device TEXT DEFAULT 'PC',
        filename TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

try {
    db.exec(`ALTER TABLE wallpapers ADD COLUMN category TEXT DEFAULT 'General'`);
} catch (e) {}

try {
    db.exec(`ALTER TABLE wallpapers ADD COLUMN device TEXT DEFAULT 'PC'`);
    db.prepare(`UPDATE wallpapers SET device = 'PC' WHERE device IS NULL OR device = ''`).run();
} catch (e) {}

const ADMIN_USER = "barman";
const ADMIN_PASS = "1234";

app.get("/", (req, res) => res.send("BARMAN Backend Running"));

app.get("/wallpapers", (req, res) => {
    const rows = db.prepare("SELECT * FROM wallpapers ORDER BY id DESC").all();
    res.json(rows);
});

app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const { title, category, device } = req.body;

    console.log("=== UPLOAD RECEIVED ===");
    console.log("title:", title);
    console.log("category:", category);
    console.log("device (raw):", device, "(type:", typeof device, ")");

    let validDevice = "PC";
    if (device && String(device).trim().toLowerCase() === "phone") {
        validDevice = "Phone";
    } else if (device && String(device).trim().toLowerCase() === "pc") {
        validDevice = "PC";
    }

    const validCategory = (category && String(category).trim() !== "") ? String(category).trim() : "General";

    console.log("device (saved):", validDevice);
    console.log("category (saved):", validCategory);
    console.log("filename:", req.file.filename);
    console.log("========================");

    try {
        const result = db.prepare(
            "INSERT INTO wallpapers (title, category, device, filename) VALUES (?, ?, ?, ?)"
        ).run(title || "Untitled", validCategory, validDevice, req.file.filename);

        console.log("✓ Inserted with id:", result.lastInsertRowid);
        res.json({ success: true, id: result.lastInsertRowid, device: validDevice });
    } catch (err) {
        console.error("✗ DB insert failed:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
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

app.get("/debug/db", (req, res) => {
    const rows = db.prepare("SELECT id, title, category, device, filename FROM wallpapers ORDER BY id DESC").all();
    const summary = {
        total: rows.length,
        pc: rows.filter(r => r.device === "PC").length,
        phone: rows.filter(r => r.device === "Phone").length,
        other: rows.filter(r => r.device !== "PC" && r.device !== "Phone").length,
        latest_5: rows.slice(0, 5)
    };
    res.json(summary);
});

app.listen(PORT, () => {
    console.log("=================================");
    console.log(" BARMAN WALLPAPER SERVER RUNNING");
    console.log(" http://localhost:" + PORT);
    console.log("=================================");
});
