const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "20mb" }));

const uploadsPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsPath),
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^\w.-]/g, "_");
        cb(null, `${Date.now()}-${safeName}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg","image/png","image/webp","image/jpg","image/gif"];
        cb(null, allowed.includes(file.mimetype));
    }
});

const db = new Database(path.join(__dirname, "barman.db"));

db.exec(`
CREATE TABLE IF NOT EXISTS wallpapers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    device TEXT DEFAULT 'All',
    filename TEXT NOT NULL,
    image_data BLOB,
    imageUrl TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

["category TEXT DEFAULT 'General'","device TEXT DEFAULT 'All'","image_data BLOB","imageUrl TEXT"].forEach(col => {
    try { db.prepare(`ALTER TABLE wallpapers ADD COLUMN ${col}`).run(); } catch {}
});

// KEY FIX: Restore images from DB blob on every startup (survives Render restarts)
function restoreImages() {
    try {
        const rows = db.prepare("SELECT id, filename, image_data FROM wallpapers WHERE image_data IS NOT NULL").all();
        let restored = 0;
        rows.forEach(row => {
            const filePath = path.join(uploadsPath, row.filename);
            if (!fs.existsSync(filePath) && row.image_data) {
                fs.writeFileSync(filePath, row.image_data);
                restored++;
            }
        });
        if (restored > 0) console.log(`Restored ${restored} images from DB`);
    } catch (err) {
        console.error("Restore error:", err.message);
    }
}

app.get("/", (req, res) => res.send("BARMAN Backend Running"));

app.get("/wallpapers", (req, res) => {
    try {
        restoreImages();
        const rows = db.prepare("SELECT id, title, category, device, filename, imageUrl, created_at FROM wallpapers ORDER BY id DESC").all();
        
        // Convert image_data to base64 for frontend use
        const wallpapers = rows.map(wp => {
            let imgUrl = wp.imageUrl; // Cloudinary URL if available
            
            // If no Cloudinary URL, use base64 encoded blob from DB
            if (!imgUrl) {
                const blobData = db.prepare("SELECT image_data FROM wallpapers WHERE id = ?").get(wp.id);
                if (blobData && blobData.image_data) {
                    imgUrl = `data:image/jpeg;base64,${blobData.image_data.toString('base64')}`;
                }
            }
            
            return {
                ...wp,
                imageUrl: imgUrl
            };
        });
        
        res.json(wallpapers);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/upload", upload.single("image"), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });
        const title = (req.body.title || "Untitled").trim();
        const category = (req.body.category || "General").trim();
        const device = (req.body.device || "All").trim();
        const imageData = fs.readFileSync(req.file.path);
        const cloudinaryUrl = req.body.imageUrl || null; // If frontend sends Cloudinary URL
        
        const result = db.prepare(
            "INSERT INTO wallpapers (title, category, device, filename, image_data, imageUrl) VALUES (?, ?, ?, ?, ?, ?)"
        ).run(title, category, device, req.file.filename, imageData, cloudinaryUrl);
        
        res.json({ success: true, id: result.lastInsertRowid });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete("/wallpapers/:id", (req, res) => {
    try {
        const wp = db.prepare("SELECT * FROM wallpapers WHERE id = ?").get(req.params.id);
        if (!wp) return res.status(404).json({ success: false, message: "Not found" });
        const imgPath = path.join(uploadsPath, wp.filename);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        db.prepare("DELETE FROM wallpapers WHERE id = ?").run(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const admins = ["SWISS","MAPHEKS","NKWEIK","BARMAN"];
    const PASS = "1234";
    const user = (username || "").trim().toUpperCase();
    if (admins.includes(user) && password === PASS) {
        return res.json({ success: true, message: "Login successful" });
    }
    res.status(401).json({ success: false, message: "Invalid credentials" });
});

restoreImages();
app.listen(PORT, () => {
    console.log("BARMAN WALLPAPER SERVER RUNNING on port", PORT);
});
