if (localStorage.getItem("admin") !== "true") {
    window.location.href = "login.html";
}

const API = "https://barman-wallpapers.onrender.com";

async function loadDashboard() {
    try {
        const res = await fetch(`${API}/wallpapers`);
        const data = await res.json();

        document.getElementById("stat-total").textContent = data.length;

        const tbody = document.getElementById("dash-tbody");

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;color:#555">No wallpapers yet. Upload one above!</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(wp => `
            <tr>
                <td><img class="dash-thumb" src="${API}/uploads/${wp.filename}" alt="${wp.title}" onerror="this.style.background='#222'"></td>
                <td>${wp.title || 'Untitled'}</td>
                <td>${wp.category || '—'}</td>
                <td>${wp.created_at ? new Date(wp.created_at).toLocaleDateString() : '—'}</td>
                <td><button class="btn-del" onclick="deleteWallpaper(${wp.id})">🗑 Delete</button></td>
            </tr>
        `).join("");

    } catch (err) {
        console.error("Dashboard load failed:", err);
        document.getElementById("dash-tbody").innerHTML =
            `<tr><td colspan="5" style="text-align:center;padding:30px;color:#e05555">Failed to load. Server may be waking up — refresh in 30 seconds.</td></tr>`;
    }
}

async function uploadWallpaper() {
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").files[0];
    const msg = document.getElementById("upload-msg");

    if (!title) { msg.textContent = "Please enter a title."; msg.style.color = "#e05555"; return; }
    if (!image) { msg.textContent = "Please select an image."; msg.style.color = "#e05555"; return; }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);

    msg.textContent = "Uploading...";
    msg.style.color = "#888";

    try {
        const res = await fetch(`${API}/upload`, { method: "POST", body: formData });
        if (res.ok) {
            msg.textContent = "✓ Uploaded successfully!";
            msg.style.color = "#5cb85c";
            document.getElementById("title").value = "";
            document.getElementById("image").value = "";
            document.getElementById("file-name").textContent = "Choose image...";
            loadDashboard();
        } else {
            msg.textContent = "Upload failed. Try again.";
            msg.style.color = "#e05555";
        }
    } catch (err) {
        msg.textContent = "Server error. Try again.";
        msg.style.color = "#e05555";
    }
}

async function deleteWallpaper(id) {
    if (!confirm("Delete this wallpaper permanently?")) return;
    await fetch(`${API}/wallpapers/${id}`, { method: "DELETE" });
    loadDashboard();
}

function logout() {
    localStorage.removeItem("admin");
    window.location.href = "login.html";
}

loadDashboard();
