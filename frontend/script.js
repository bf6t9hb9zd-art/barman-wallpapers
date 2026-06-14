const API = "https://barman-wallpapers.onrender.com";

async function loadWallpapers() {
    try {
        const res = await fetch(`${API}/wallpapers`);
        const data = await res.json();

        const gallery = document.getElementById("gallery");
        const searchInput = document.getElementById("searchInput");
        const searchText = searchInput?.value.toLowerCase() || "";

        gallery.innerHTML = "";

        data.filter(wp => wp.title.toLowerCase().includes(searchText))
            .forEach(wp => {
                gallery.innerHTML += `
                    <div class="card">
                        <img src="${API}/uploads/${wp.filename}" alt="${wp.title}">
                        <h3>${wp.title}</h3>
                        <p class="owner-badge">✓ Uploaded by BARMAN (Owner)</p>
                        <a class="download-btn" href="${API}/uploads/${wp.filename}" download>
                            ⬇ Download
                        </a>
                    </div>
                `;
            });
    } catch (error) {
        console.error("Error loading wallpapers:", error);
    }
}

async function uploadWallpaper() {
    const title = document.getElementById("title").value;
    const image = document.getElementById("image").files[0];

    if (!image) { alert("Please select an image."); return; }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    try {
        const response = await fetch(`${API}/upload`, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            document.getElementById("title").value = "";
            document.getElementById("image").value = "";
            loadWallpapers();
        } else {
            alert("Upload failed.");
        }
    } catch (error) {
        console.error(error);
        alert("Could not connect to server.");
    }
}

document.addEventListener("input", (e) => {
    if (e.target.id === "searchInput") loadWallpapers();
});

loadWallpapers();