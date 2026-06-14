if (localStorage.getItem("admin") !== "true") {
    window.location.href = "login.html";
}
const API = "https://barman-wallpapers.onrender.com";

async function loadDashboard() {
    const res = await fetch(`${API}/wallpapers`);
    const data = await res.json();

    document.getElementById("count").innerText = data.length;

    const gallery = document.getElementById("adminGallery");
    gallery.innerHTML = "";

    data.forEach(wp => {
        gallery.innerHTML += `
            <div class="card">
                <img src="${API}/uploads/${wp.filename}" />
                <h3>${wp.title}</h3>

                <button onclick="deleteWallpaper(${wp.id})">
                    🗑 Delete
                </button>
            </div>
        `;
    });
}

async function deleteWallpaper(id) {
    await fetch(`${API}/wallpapers/${id}`, {
        method: "DELETE"
    });

    loadDashboard();
}

loadDashboard();