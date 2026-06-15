const API = "https://barman-wallpapers.onrender.com";
let activeCategory = "All";
let activeDeviceType = "All";
let selectedAmount = "5";
let selectedMethod = "payshap";
let currentLanguage = localStorage.getItem("language") || "en";

// ── INITIALIZATION ─────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    changeLanguage(currentLanguage);
    loadWallpapers();
});

// ── THEME TOGGLE ───────────────────────────────
function toggleTheme() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    
    const themeIcon = document.getElementById("theme-icon");
    themeIcon.textContent = newTheme === "dark" ? "🌙" : "☀️";
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    const themeIcon = document.getElementById("theme-icon");
    themeIcon.textContent = savedTheme === "dark" ? "🌙" : "☀️";
}

// ── LANGUAGE CHANGE ────────────────────────────
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem("language", lang);
    
    const elements = document.querySelectorAll("[data-en]");
    elements.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            if (el.tagName === "INPUT") {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        }
    });
    
    document.getElementById("languageSelect").value = lang;
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

window.addEventListener("click", function(event) {
    const modal = document.getElementById("helpModal");
    if (event.target === modal) {
        closeHelpCenter();
    }
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
            const matchDevice = activeDeviceType === "All" || (wp.device && wp.device === activeDeviceType);
            return matchSearch && matchCat && matchDevice;
        });

        gallery.innerHTML = "";

        if (filtered.length === 0) {
            gallery.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🖼️</div>
                    <p data-en="No wallpapers found in this category." data-af="Geen agtergronde gevind in hierdie kategorie." data-zh="在此类别中未找到壁纸。" data-tn="Wallpapers E Se Fumanwe Go Lekgoro Le." data-ts="Wallpapers E Se Fumanwe Go Lekgoro Le." data-ve="Wallpapers E Se Fumanwe Go Lekgoro Le." data-zu="Izithombe Azitholakali Kulesigaba.">No wallpapers found in this category.</p>
                </div>`;
            changeLanguage(currentLanguage);
            return;
        }

        filtered.forEach((wp, i) => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.animationDelay = `${i * 0.055}s`;
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
        document.getElementById("gallery").innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <p data-en="Server waking up — please refresh in 30 seconds." data-af="Bediener word wakker — vernieuw in 30 sekondes." data-zh="服务器正在唤醒 — 请在 30 秒内刷新。" data-tn="Serbare Go Amoga — Akanya Gape Go Dikhutso Tse 30." data-ts="Serbare Go Amoga — Akanya Gape Go Dikhutso Tse 30." data-ve="Serbare Go Amoga — Akanya Gape Go Dikhutso Tse 30." data-zu="Iseva Iyokunqoba — Ngifuna Hla Amasekwundu Angu-30.">Server waking up — please refresh in 30 seconds.</p>
            </div>`;
        changeLanguage(currentLanguage);
    }
}

function setCategory(cat, btn) {
    activeCategory = cat;
    document.querySelectorAll(".side-cat").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    loadWallpapers();
}

document.addEventListener("input", (e) => {
    if (e.target.id === "searchInput") loadWallpapers();
});

// ── DONATE MODAL ───────────────────────────────
function openDonate() {
    document.getElementById("donate-modal").style.display = "flex";
    document.body.style.overflow = "hidden";
    showMethodInfo("payshap");
}

function closeDonate() {
    document.getElementById("donate-modal").style.display = "none";
    document.body.style.overflow = "";
}

function selectAmount(btn, val) {
    document.querySelectorAll(".amount-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedAmount = val;
    document.getElementById("custom-amount-wrap").style.display =
        val === "custom" ? "block" : "none";
}

function selectMethod(btn, method) {
    document.querySelectorAll(".method-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedMethod = method;
    showMethodInfo(method);
}

function showMethodInfo(method) {
    const info = document.getElementById("method-info");
    const details = {
        payshap: `
            <div class="bank-detail">
                <div class="bank-name">📱 PayShap</div>
                <div class="bank-row"><span>Number</span><b>0603660391</b></div>
                <div class="bank-row"><span>Name</span><b>Mr Mashaba</b></div>
                <div class="bank-row copy-row">
                    <span>Reference</span><b>BARMAN DONATION</b>
                </div>
            </div>`,
        capitec: `
            <div class="bank-detail">
                <div class="bank-name">🏦 Capitec Bank</div>
                <div class="bank-row"><span>Account Name</span><b>Mr Mashaba</b></div>
                <div class="bank-row"><span>Account Number</span><b>1980500736</b></div>
                <div class="bank-row"><span>Account Type</span><b>Savings</b></div>
                <div class="bank-row"><span>Reference</span><b>BARMAN DONATION</b></div>
            </div>`,
        fnb: `
            <div class="bank-detail">
                <div class="bank-name">🏦 FNB — First National Bank</div>
                <div class="bank-row"><span>Account Name</span><b>Mr Mashaba</b></div>
                <div class="bank-row"><span>Account Number</span><b>63143121430</b></div>
                <div class="bank-row"><span>Branch Code</span><b>250655</b></div>
                <div class="bank-row"><span>Account Type</span><b>Cheque</b></div>
                <div class="bank-row"><span>Reference</span><b>BARMAN DONATION</b></div>
            </div>`,
        crypto: `
            <div class="bank-detail">
                <div class="bank-name">🔗 Crypto</div>
                <div class="bank-row"><span>Contact us on the site for wallet address.</span></div>
            </div>`
    };
    info.innerHTML = details[method] || "";
}

function confirmDonate() {
    const amount = selectedAmount === "custom"
        ? document.getElementById("custom-amount").value
        : selectedAmount;
    const name = document.getElementById("donor-name").value.trim() || "Anonymous";

    if (!amount || amount <= 0) {
        alert("Please select or enter a donation amount.");
        return;
    }

    const methodNames = {
        payshap: "PayShap (0603660391)",
        capitec: "Capitec (1980500736)",
        fnb: "FNB (63143121430)",
        crypto: "Crypto"
    };

    alert(`Thank you ${name}! 💛\n\nPlease send R${amount} to:\n${methodNames[selectedMethod]}\nReference: BARMAN DONATION\n\nThank you for supporting BARMAN Solutions!`);
    closeDonate();
}

document.addEventListener("DOMContentLoaded", () => {
    const donateModal = document.getElementById("donate-modal");
    if (donateModal) {
        donateModal.addEventListener("click", function(e) {
            if (e.target === this) closeDonate();
        });
    }
});

// ── SHARE ──────────────────────────────────────
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const msg = document.getElementById("copy-msg");
        msg.textContent = "✓ Link copied!";
        setTimeout(() => msg.textContent = "", 2500);
    });
}
