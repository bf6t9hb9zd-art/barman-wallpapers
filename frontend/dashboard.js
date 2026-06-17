if (localStorage.getItem("admin") !== "true") {
    window.location.href = "login.html";
}

const API = "https://barman-wallpapers.onrender.com";

// Update the UI with the logged-in admin name
document.addEventListener("DOMContentLoaded", () => {
    const adminName = localStorage.getItem("adminName") || "BARMAN";
    const adminEl = document.getElementById("current-admin");
    if (adminEl) adminEl.textContent = adminName;
    
    loadDashboard();
});

async function loadDashboard() {
    try {
        const res = await fetch(`${API}/wallpapers`);
        const data = await res.json();

        // Update Stats
        document.getElementById("stat-total").textContent = data.length;

        const tbody = document.getElementById("dash-tbody");

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:#555">No wallpapers yet. Upload one above!</td></tr>`;
            return;
        }

        // Render table rows
        tbody.innerHTML = data.map(wp => {
            const wallpaperId = wp.id;
            // UPDATED: Use wp.imageUrl directly from Cloudinary
            const imgSrc = wp.imageUrl || `${API}/uploads/${wp.filename}`; 
            
            return `
                <tr>
                    <td><img class="dash-thumb" src="${imgSrc}" alt="${wp.title}" onerror="this.style.background='#222'"></td>
                    <td>${wp.title || 'Untitled'}</td>
                    <td><span class="cat-badge">${wp.category || '—'}</span></td>
                    <td><strong>${wp.device || 'All'}</strong></td>
                    <td>${wp.created_at ? new Date(wp.created_at).toLocaleDateString() : '—'}</td>
                    <td><button class="btn-del" onclick="deleteWallpaper('${wallpaperId}')">🗑 Delete</button></td>
                </tr>
            `;
        }).join("");

    } catch (err) {
        console.error("Dashboard load failed:", err);
        document.getElementById("dash-tbody").innerHTML =
            `<tr><td colspan="6" style="text-align:center;padding:30px;color:#e05555">Failed to load.</td></tr>`;
    }
}

async function uploadWallpaper() {
    const titleInput = document.getElementById("title");
    const categoryInput = document.getElementById("category");
    const deviceInput = document.getElementById("device");
    const imageInput = document.getElementById("image");
    const msg = document.getElementById("upload-msg");

    if (!titleInput.value.trim()) { msg.textContent = "Please enter a title."; msg.style.color = "#e05555"; return; }
    if (!imageInput.files[0]) { msg.textContent = "Please select an image."; msg.style.color = "#e05555"; return; }

    const formData = new FormData();
    formData.append("title", titleInput.value.trim());
    formData.append("category", categoryInput.value);
    formData.append("device", deviceInput.value);
    formData.append("image", imageInput.files[0]);

    msg.textContent = "Uploading (Cloudinary)...";
    msg.style.color = "#888";

    try {
        const res = await fetch(`${API}/upload`, { method: "POST", body: formData });
        
        if (res.ok) {
            msg.textContent = "✓ Uploaded successfully!";
            msg.style.color = "#5cb85c";
            titleInput.value = "";
            imageInput.value = "";
            document.getElementById("file-name").textContent = "Choose image...";
            loadDashboard(); 
        } else {
            msg.textContent = "Upload failed.";
            msg.style.color = "#e05555";
        }
    } catch (err) {
        msg.textContent = "Server error.";
        msg.style.color = "#e05555";
    }
}

async function deleteWallpaper(id) {
    if (!id) return;
    if (!confirm("Delete this wallpaper permanently?")) return;
    
    try {
        const res = await fetch(`${API}/wallpapers/${id}`, { method: "DELETE" });
        if (res.ok) {
            loadDashboard();
        } else {
            alert("Could not delete wallpaper.");
        }
    } catch (err) {
        console.error("Delete call failed:", err);
    }
}

function logout() {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminName");
    window.location.href = "login.html";
}