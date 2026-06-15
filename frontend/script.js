const API = "https://barman-wallpapers.onrender.com";
let activeCategory = "All";

async function loadWallpapers() {
    try {
        const res = await fetch(`${API}/wallpapers`);
        const data = await res.json();

        const gallery = document.getElementById("gallery");
        const searchText = document.getElementById("searchInput")?.value.toLowerCase() || "";

        // Update count
        document.getElementById("total-count").textContent = data.length;

        // Filter by search + category
        const filtered = data.filter(wp => {
            const matchSearch = wp.title.toLowerCase().includes(searchText);
            const matchCat = activeCategory === "All" || wp.category === activeCategory;
            return matchSearch && matchCat;
        });

        gallery.innerHTML = "";

        if (filtered.length === 0) {
            gallery.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🖼️</div>
                    <p>No wallpapers found in this category.</p>
                </div>`;
            return;
        }

        filtered.forEach((wp, i) => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.animationDelay = `${i * 0.06}s`;
            card.innerHTML = `
                <div class="card-img-wrap">
                    <img src="${API}/uploads/${wp.filename}" alt="${wp.title}" loading="lazy">
                    <span class="card-category">${wp.category || 'General'}</span>
                </div>
                <div class="card-body">
                    <div class="card-title">${wp.title}</div>
                    <div class="card-owner">✓ BARMAN Solutions</div>
                </div>
                <div class="card-footer">
                    <a class="btn-download" href="${API}/uploads/${wp.filename}" download>⬇ Download</a>
                </div>
            `;
            gallery.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading wallpapers:", error);
        document.getElementById("gallery").innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <p>Could not load wallpapers. Server may be waking up — try again in 30 seconds.</p>
            </div>`;
    }
}

function setCategory(cat, btn) {
    activeCategory = cat;
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadWallpapers();
}

document.addEventListener("input", (e) => {
    if (e.target.id === "searchInput") loadWallpapers();
});

loadWallpapers();
