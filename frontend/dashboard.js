if (localStorage.getItem("admin") !== "true") {
    window.location.href = "login.html";
}

const API = "https://barman-wallpapers.onrender.com";


let dashDeviceFilter = "All";

window.addEventListener("DOMContentLoaded", () => {
    applyTranslations();
    loadDashboard();
});

// re-render when language changes
window.addEventListener("languageChanged", () => {
    renderDashTable();
});

async function loadDashboard() {
    try {
        const res = await fetch(`${API}/wallpapers`);
        const data = await res.json();
        allWallpapers = data;

        document.getElementById("stat-total").textContent = data.length;
        document.getElementById("stat-pc").textContent = data.filter(w => (w.device || "PC") === "PC").length;
        document.getElementById("stat-phone").textContent = data.filter(w => w.device === "Phone").length;

        renderDashTable();
    } catch (err) {
        console.error("Dashboard load failed:", err);
        document.getElementById("dash-tbody").innerHTML =
            `<tr><td colspan="6" style="text-align:center;padding:30px;color:#e05555">${t('dash.table.fail')}</td></tr>`;
    }
}

function renderDashTable() {
    const tbody = document.getElementById("dash-tbody");

   const filtered = dashDeviceFilter === "All"
    ? allWallpapers
    : allWallpapers.filter(w => {
        const wpDevice = (w.device || "PC").toString().trim();
        return wpDevice === dashDeviceFilter;
    });

    if (filtered.length === 0) {
        const empty = dashDeviceFilter === "All"
            ? t('dash.table.empty')
            : t('dash.table.empty.filtered', { device: dashDeviceFilter });
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:#555">${empty}</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(wp => {
        const device = wp.device || "PC";
        const deviceBadge = device === "Phone"
            ? `<span class="device-badge device-phone">${t('dash.device.phone')}</span>`
            : `<span class="device-badge device-pc">${t('dash.device.pc')}</span>`;
        const dateStr = wp.created_at ? new Date(wp.created_at).toLocaleDateString() : '—';

        return `
            <tr>
                <td><img class="dash-thumb" src="${API}/uploads/${wp.filename}" alt="${wp.title}" onerror="this.style.background='#222'"></td>
                <td>${wp.title || 'Untitled'}</td>
                <td>${wp.category || '—'}</td>
                <td>${deviceBadge}</td>
                <td>${dateStr}</td>
                <td><button class="btn-del" onclick="deleteWallpaper(${wp.id})">${t('dash.table.delete')}</button></td>
            </tr>
        `;
    }).join("");
}

function setDashDeviceFilter(device, btn) {
    dashDeviceFilter = device;
    document.querySelectorAll(".dash-stat-clickable").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderDashTable();
}

function previewDashUpload() {
    const file = document.getElementById("image").files[0];
    if (!file) return;
    document.getElementById("file-name").textContent = file.name;
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById("dash-upload-img").src = e.target.result;
        document.getElementById("dash-upload-preview").style.display = "block";
    };
    reader.readAsDataURL(file);
}

async function uploadWallpaper() {
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const device = document.getElementById("device").value;
    const image = document.getElementById("image").files[0];
    const msg = document.getElementById("upload-msg");

    if (!title) { msg.textContent = t('dash.upload.fail.title'); msg.style.color = "#e05555"; return; }
    if (!image) { msg.textContent = t('dash.upload.fail.image'); msg.style.color = "#e05555"; return; }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("device", device);
    formData.append("image", image);

    msg.textContent = t('dash.upload.uploading');
    msg.style.color = "#888";

    try {
        const res = await fetch(`${API}/upload`, { method: "POST", body: formData });
        if (res.ok) {
            msg.textContent = t('dash.upload.success', { device });
            msg.style.color = "#5cb85c";
            document.getElementById("title").value = "";
            document.getElementById("image").value = "";
            document.getElementById("file-name").textContent = t('dash.upload.file');
            document.getElementById("dash-upload-preview").style.display = "none";
            loadDashboard();
        } else {
            msg.textContent = t('upload.msg.fail');
            msg.style.color = "#e05555";
        }
    } catch (err) {
        msg.textContent = t('upload.msg.error');
        msg.style.color = "#e05555";
    }
}

async function deleteWallpaper(id) {
    if (!confirm(t('dash.table.delete.confirm'))) return;
    await fetch(`${API}/wallpapers/${id}`, { method: "DELETE" });
    loadDashboard();
}

function logout() {
    localStorage.removeItem("admin");
    window.location.href = "login.html";
}

loadDashboard();
