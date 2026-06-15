const API = "http://localhost:3000";

let activeCategory = "All";
let activeDeviceType = "All";
let selectedAmount = "5";
let selectedMethod = "payshap";
let currentLightboxWallpaper = null;

// ── INITIALIZATION ─────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    applyTranslations();   // <-- new: applies current language to all data-i18n elements
    loadWallpapers();
    showMethodInfo("payshap");
});

window.addEventListener("load", () => {
    const modal = document.getElementById("donate-modal");
    if (modal) modal.style.display = "none";
    const upModal = document.getElementById("upload-modal");
    if (upModal) upModal.style.display = "none";
    document.body.style.overflow = "";
});

// ── THEME TOGGLE ───────────────────────────────
function toggleTheme() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    document.getElementById("theme-icon").textContent = newTheme === "dark" ? "🌙" : "☀️";
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.getElementById("theme-icon").textContent = savedTheme === "dark" ? "🌙" : "☀️";
}

// ── HELP CENTER ────────────────────────────────
function openHelpCenter() {
    document.getElementById("helpModal").style.display = "block";
    document.body.style.overflow = "hidden";
}
function closeHelpCenter() {
    document.getElementById("helpModal").style.display = "none";
    document.body.style.overflow = "";
}
window.addEventListener("click", e => {
    const modal = document.getElementById("helpModal");
    if (e.target === modal) closeHelpCenter();
});

// ── DEVICE TYPE FILTER ─────────────────────────
function setDeviceType(type, btn) {
    activeDeviceType = type;
    document.querySelectorAll(".device-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadWallpapers();
}

// ── WALLPAPERS ─────────────────────────────────
async function loadWallpapers() {
    try {
        const res = await fetch(`${API}/wallpapers`);
        const data = await res.json();
        const gallery = document.getElementById("gallery");
        const searchText = document.getElementById("searchInput")?.value.toLowerCase() || "";

        const countEl = document.getElementById("total-count");
        if (countEl) countEl.textContent = data.length;

        const filtered = data.filter(wp => {
    const matchSearch = wp.title.toLowerCase().includes(searchText);
    const matchCat = activeCategory === "All" || wp.category === activeCategory;
    // forgiving device match: handle missing device field
    const wpDevice = (wp.device || "PC").toString().trim();
    const matchDevice = activeDeviceType === "All" || wpDevice === activeDeviceType;
    return matchSearch && matchCat && matchDevice;
});


        gallery.innerHTML = "";

        if (filtered.length === 0) {
            gallery.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🖼️</div>
                    <p>${t('gallery.empty')}</p>
                </div>`;
            return;
        }

        filtered.forEach((wp, i) => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.animationDelay = `${i * 0.055}s`;
            const wpJson = JSON.stringify(wp).replace(/'/g, "\\'").replace(/"/g, "&quot;");
            card.innerHTML = `
                <div class="card-img-wrap" onclick="openLightbox('${wpJson.replace(/&quot;/g, '\\&quot;')}')">
                    <img src="${API}/uploads/${wp.filename}" alt="${wp.title}" loading="lazy">
                    <span class="card-category">${wp.category || t('cat.all').replace('✦ ', '')}</span>
                    <span class="card-device-badge">${wp.device === 'Phone' ? '📱' : '💻'}</span>
                </div>
                <div class="card-body">
                    <div class="card-title">${wp.title}</div>
                    <div class="card-owner">${t('gallery.card.owner')}</div>
                </div>
                <div class="card-footer">
                    <button class="btn-download" onclick="openLightbox('${wpJson.replace(/&quot;/g, '\\&quot;')}')">${t('gallery.preview.btn')}</button>
                </div>
            `;
            gallery.appendChild(card);
        });
    } catch (error) {
        document.getElementById("gallery").innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <p>${t('gallery.empty.server')}</p>
            </div>`;
    }
}

function setCategory(cat, btn) {
    activeCategory = cat;
    document.querySelectorAll(".side-cat").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    loadWallpapers();
}

document.addEventListener("input", e => {
    if (e.target.id === "searchInput") loadWallpapers();
});

// ── LIGHTBOX PREVIEW ───────────────────────────
function openLightbox(wpJson) {
    let wp;
    try { wp = JSON.parse(wpJson); } catch(e) {
        wp = JSON.parse(wpJson.replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
    }
    currentLightboxWallpaper = wp;
    document.getElementById("lightbox-img").src = `${API}/uploads/${wp.filename}`;
    document.getElementById("lightbox-title").textContent = wp.title;
    document.getElementById("lightbox-cat").textContent = (wp.category || 'General');
    document.getElementById("lightbox-device").textContent = (wp.device === 'Phone' ? t('device.phone') : t('device.pc'));
    document.getElementById("lightbox-dl-text").textContent = t('lightbox.download');
    document.getElementById("lightbox-progress").style.display = "none";
    document.getElementById("lightbox-progress-bar").style.width = "0%";
    document.getElementById("lightbox-status").textContent = "";
    document.getElementById("lightbox-download-btn").disabled = false;
    document.getElementById("lightbox").classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    document.getElementById("lightbox").classList.remove("active");
    document.body.style.overflow = "";
    currentLightboxWallpaper = null;
}

document.addEventListener("keydown", e => {
    if (e.key === "Escape" && document.getElementById("lightbox").classList.contains("active")) closeLightbox();
});

// ── REAL DOWNLOAD ──────────────────────────────
async function downloadLightbox() {
    if (!currentLightboxWallpaper) return;
    const wp = currentLightboxWallpaper;
    const btn = document.getElementById("lightbox-download-btn");
    const txt = document.getElementById("lightbox-dl-text");
    const progress = document.getElementById("lightbox-progress");
    const bar = document.getElementById("lightbox-progress-bar");
    const status = document.getElementById("lightbox-status");

    btn.disabled = true;
    txt.textContent = t('lightbox.downloading');
    progress.style.display = "block";
    bar.style.width = "0%";
    status.textContent = t('lightbox.status.fetch');
    status.style.color = "#888";

    try {
        const url = `${API}/uploads/${wp.filename}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network error");

        const contentLength = +response.headers.get("Content-Length");
        const reader = response.body.getReader();
        const chunks = [];
        let received = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.length;
            if (contentLength) {
                const pct = Math.round((received / contentLength) * 100);
                bar.style.width = pct + "%";
                txt.textContent = `${t('lightbox.downloading')} ${pct}%`;
                const mb = (received / 1024 / 1024).toFixed(1);
                const totalMb = (contentLength / 1024 / 1024).toFixed(1);
                status.textContent = `${mb} MB / ${totalMb} MB`;
            }
        }

        const blob = new Blob(chunks);
        const blobUrl = URL.createObjectURL(blob);
        const ext = (wp.filename.split('.').pop() || 'jpg').toLowerCase().split('?')[0];
        const safeTitle = (wp.title || 'wallpaper').replace(/[^a-z0-9_\- ]/gi, '').trim().replace(/\s+/g, '_').slice(0, 40) || 'wallpaper';
        const deviceTag = wp.device === 'Phone' ? '_phone' : '_pc';
        const finalName = `${safeTitle}${deviceTag}_BARMAN.${ext}`;

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = finalName;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { a.remove(); URL.revokeObjectURL(blobUrl); }, 1500);

        txt.textContent = t('lightbox.saved');
        bar.style.width = "100%";
        status.textContent = `${t('lightbox.status.saved')} ${finalName}`;
        status.style.color = "#5cb85c";

        setTimeout(() => {
            txt.textContent = t('lightbox.download');
            progress.style.display = "none";
            bar.style.width = "0%";
            status.textContent = "";
            btn.disabled = false;
        }, 3500);
    } catch (err) {
        console.error(err);
        txt.textContent = t('lightbox.failed');
        status.textContent = "Please try again or check your connection.";
        status.style.color = "#e05555";
        progress.style.display = "none";
        btn.disabled = false;
    }
}

// ── UPLOAD MODAL ───────────────────────────────
function openUploadModal() {
    document.getElementById("upload-modal").style.display = "flex";
    document.body.style.overflow = "hidden";
    document.getElementById("up-msg").textContent = "";
}
function closeUploadModal() {
    document.getElementById("upload-modal").style.display = "none";
    document.body.style.overflow = "";
    document.getElementById("up-title").value = "";
    document.getElementById("up-image").value = "";
    document.getElementById("up-file-name").textContent = t('upload.placeholder.file');
    document.getElementById("upload-preview-wrap").style.display = "none";
    document.getElementById("up-msg").textContent = "";
    const btn = document.getElementById("up-btn");
    btn.disabled = false;
    btn.textContent = t('upload.btn');
}

function previewUploadImage() {
    const file = document.getElementById("up-image").files[0];
    if (!file) return;
    document.getElementById("up-file-name").textContent = file.name;
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById("upload-preview-img").src = e.target.result;
        document.getElementById("upload-preview-wrap").style.display = "block";
    };
    reader.readAsDataURL(file);
}

async function uploadFromModal() {
    const title = document.getElementById("up-title").value.trim();
    const category = document.getElementById("up-category").value;
    const device = document.getElementById("up-device").value;
    const image = document.getElementById("up-image").files[0];
    const msg = document.getElementById("up-msg");
    const btn = document.getElementById("up-btn");

    if (!title) { msg.style.color = "#e05555"; msg.textContent = t('upload.msg.empty.title'); return; }
    if (!image) { msg.style.color = "#e05555"; msg.textContent = t('upload.msg.empty.file'); return; }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("device", device);
    formData.append("image", image);

    btn.disabled = true;
    btn.textContent = t('upload.btn.uploading');
    msg.style.color = "#888";
    msg.textContent = t('upload.msg.uploading');

    try {
        const res = await fetch(`${API}/upload`, { method: "POST", body: formData });
        if (res.ok) {
            msg.style.color = "#5cb85c";
            msg.textContent = t('upload.msg.success');
            btn.textContent = t('upload.btn.published');
            setTimeout(() => { closeUploadModal(); loadWallpapers(); }, 1200);
        } else {
            msg.style.color = "#e05555";
            msg.textContent = t('upload.msg.fail');
            btn.disabled = false;
            btn.textContent = t('upload.btn');
        }
    } catch (err) {
        msg.style.color = "#e05555";
        msg.textContent = t('upload.msg.error');
        btn.disabled = false;
        btn.textContent = t('upload.btn');
    }
}

// ── DONATE MODAL ───────────────────────────────
function openDonate() {
    const modal = document.getElementById("donate-modal");
    if (!modal) return;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    showMethodInfo("payshap");
}
function closeDonate() {
    const modal = document.getElementById("donate-modal");
    if (!modal) return;
    modal.style.display = "none";
    document.body.style.overflow = "";
}

function selectAmount(btn, val) {
    document.querySelectorAll(".amount-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedAmount = val;
    const customWrap = document.getElementById("custom-amount-wrap");
    if (customWrap) customWrap.style.display = val === "custom" ? "block" : "none";
}

function selectMethod(btn, method) {
    document.querySelectorAll(".method-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedMethod = method;
    showMethodInfo(method);
}

function showMethodInfo(method) {
    const info = document.getElementById("method-info");
    if (!info) return;
    switch (method) {
        case "payshap": info.innerHTML = `<p><strong>PayShap</strong></p><p>Number: 0832880154</p>`; break;
        case "capitec": info.innerHTML = `<p><strong>Capitec Bank</strong></p><p>Account Number: 1234567890</p>`; break;
        case "fnb": info.innerHTML = `<p><strong>FNB Bank</strong></p><p>Account Number: 1234567890</p>`; break;
        case "crypto": info.innerHTML = `<p><strong>Crypto Wallet</strong></p><p>Wallet Address:</p><small>YOUR_WALLET_ADDRESS_HERE</small>`; break;
    }
}

function confirmDonate() {
    let amount = selectedAmount;
    if (amount === "custom") {
        amount = document.getElementById("custom-amount").value;
        if (!amount || Number(amount) <= 0) { alert(t('donate.alert.fail')); return; }
    }
    const donorName = document.getElementById("donor-name").value || "Anonymous";
    alert(t('donate.alert.thanks', { name: donorName, amount, method: selectedMethod }));
    closeDonate();
}

// ── SHARE ──────────────────────────────────────
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const msg = document.getElementById("copy-msg");
        msg.textContent = t('copy.success');
        setTimeout(() => msg.textContent = "", 2500);
    });
}

// ── RE-TRANSLATE DYNAMIC CONTENT ───────────────
window.addEventListener("languageChanged", () => {
    loadWallpapers();   // re-render cards with new language
    if (currentLightboxWallpaper) openLightbox(JSON.stringify(currentLightboxWallpaper));
});
