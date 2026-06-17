const API = "https://barman-wallpapers.onrender.com";
let activeCategory = "All";
let activeDevice = "All";
let selectedAmount = "10";
let selectedMethod = "payshap";
let currentLang = localStorage.getItem("barman-lang") || "en";

// ── TRANSLATIONS ───────────────────────────────
const T = {
  en:{
    donate:"💛 Donate",help:"❓ Help",dashboard:"Dashboard",
    hero1:"Premium",hero2:"Wallpapers",hero3:"Curated collection · Free to download · Always growing",
    categories:"📂 Categories",catall:"✦ All",stats:"📊 Stats",
    wallpapers:"wallpapers",freedl:"Free downloads",alwaysup:"Always updating",
    about:"ℹ️ About",abouttext:"Premium wallpapers, hand-curated and free.",
    supportus:"Support Us",donatedesc:"Keep BARMAN Solutions free!",
    donatenow:"Donate Now",popular:"🔥 Popular",share:"🔗 Share",
    copylink:"📋 Copy Link",needhelp:"Need Help?",helpcenter:"🆘 Help Center",
    donatedesc2:"Keep this platform free, ad-free and growing.",
    custom:"Custom",choosemethod:"Choose payment method:",
    donatethanks:"100% goes to BARMAN Solutions. Thank you! 🙏",
    helpsubtitle:"We're here to help 24/7",email:"Email",phone:"Phone",
    faq:"Frequently Asked Questions",
    faq1q:"How do I download a wallpaper?",faq1a:"Click the ⬇ Download button on any wallpaper card.",
    faq2q:"Are wallpapers free?",faq2a:"Yes! All wallpapers are 100% free to download and use.",
    faq3q:"PC vs Phone wallpapers?",faq3a:"PC = landscape (wide). Phone = portrait (tall). Use the device tabs to filter.",
    faq4q:"How do I donate?",faq4a:"Click 💛 Donate in the top bar and choose your preferred method.",
    faq5q:"How do I change language?",faq5a:"Click 🌐 in the top navigation and select your language.",
    supporthours:"Support Hours",supporthoursdesc:"Mon–Sat: 8am–8pm · Sun: 10am–4pm (SAST)",
    loading:"Loading wallpapers...",devall:"🖼️ All Devices",pcwall:"🖥️ PC Wallpapers",
    phonewall:"📱 Phone Wallpapers",devicefilter:"📱 Device",
    search:"Search wallpapers...",yourname:"Your name (optional)"
  },
  af:{
    donate:"💛 Skenk",help:"❓ Hulp",dashboard:"Kontroleskerm",
    hero1:"Premium",hero2:"Muurpapiere",hero3:"Gekureerde versameling · Gratis aflaai · Groei altyd",
    categories:"📂 Kategorieë",catall:"✦ Alles",stats:"📊 Statistieke",
    wallpapers:"muurpapiere",freedl:"Gratis aflaaie",alwaysup:"Altyd opdateer",
    supportus:"Ondersteun Ons",donatedesc:"Help om BARMAN Solutions gratis te hou!",
    donatenow:"Skenk Nou",popular:"🔥 Gewild",share:"🔗 Deel",
    copylink:"📋 Kopieer Skakel",needhelp:"Hulp Nodig?",helpcenter:"🆘 Hulpsentrum",
    donatedesc2:"Jou skenking hou hierdie platform gratis.",
    custom:"Aangepas",choosemethod:"Kies betalingsmetode:",
    donatethanks:"100% gaan na BARMAN Solutions. Dankie! 🙏",
    helpsubtitle:"Ons is hier om te help 24/7",email:"E-pos",phone:"Telefoon",
    faq:"Gereelde Vrae",
    faq1q:"Hoe laai ek 'n muurpapier af?",faq1a:"Klik die ⬇ Aflaai-knoppie op enige kaart.",
    faq2q:"Is muurpapiere gratis?",faq2a:"Ja! Alle muurpapiere is 100% gratis.",
    faq3q:"Rekenaar vs foon?",faq3a:"Rekenaar = breed. Foon = hoog. Gebruik die oortjies om te filter.",
    faq4q:"Hoe skenk ek?",faq4a:"Klik die Skenk-knoppie in die navigasie.",
    faq5q:"Hoe verander ek die taal?",faq5a:"Klik die 🌐 taalknoppie en kies jou taal.",
    supporthours:"Ondersteuningsure",supporthoursdesc:"Ma–Sa: 8vm–8nm · So: 10vm–4nm",
    loading:"Muurpapiere laai...",devall:"🖼️ Alles",pcwall:"🖥️ Rekenaar",
    phonewall:"📱 Foon",devicefilter:"📱 Toestel",
    search:"Soek muurpapiere...",yourname:"Jou naam (opsioneel)"
  },
  zh:{
    donate:"💛 捐款",help:"❓ 帮助",dashboard:"仪表板",
    hero1:"精品",hero2:"壁纸",hero3:"精心策划 · 免费下载 · 持续更新",
    categories:"📂 分类",catall:"✦ 全部",stats:"📊 统计",
    wallpapers:"壁纸",freedl:"免费下载",alwaysup:"持续更新",
    supportus:"支持我们",donatedesc:"帮助保持BARMAN Solutions免费！",
    donatenow:"立即捐款",popular:"🔥 热门",share:"🔗 分享",
    copylink:"📋 复制链接",needhelp:"需要帮助？",helpcenter:"🆘 帮助中心",
    donatedesc2:"您的捐款让平台保持免费和成长。",
    custom:"自定义",choosemethod:"选择支付方式：",
    donatethanks:"100%用于运营BARMAN Solutions。谢谢！🙏",
    helpsubtitle:"我们全天候为您服务",email:"电子邮件",phone:"电话",
    faq:"常见问题",
    faq1q:"如何下载壁纸？",faq1a:"点击壁纸卡片上的⬇下载按钮。",
    faq2q:"壁纸是免费的吗？",faq2a:"是的！所有壁纸均100%免费。",
    faq3q:"PC和手机壁纸的区别？",faq3a:"PC=横向，手机=竖向。使用设备标签筛选。",
    faq4q:"如何捐款？",faq4a:"点击顶部栏中的💛捐款按钮。",
    faq5q:"如何更改语言？",faq5a:"点击🌐按钮并选择您的语言。",
    supporthours:"支持时间",supporthoursdesc:"周一至周六: 8am–8pm · 周日: 10am–4pm",
    loading:"加载壁纸中...",devall:"🖼️ 全部",pcwall:"🖥️ 电脑壁纸",
    phonewall:"📱 手机壁纸",devicefilter:"📱 设备",
    search:"搜索壁纸...",yourname:"您的名字（可选）"
  },
  tn:{
    donate:"💛 Neela",help:"❓ Thuso",dashboard:"Lepokisi la Taolo",
    hero1:"Ya Godimo",hero2:"Dibokisi tsa Lebota",hero3:"Dikgoboko tse di tlhophilweng · Mahala · E a kula",
    categories:"📂 Mefuta",catall:"✦ Tsotlhe",stats:"📊 Dipalopalo",
    wallpapers:"dibokisi",freedl:"Dikereketso tsa mahala",alwaysup:"E a nna e ntshiwa",
    supportus:"Re Thuse",donatedesc:"Thusa go boloka BARMAN Solutions e le mahala!",
    donatenow:"Nee Jaanong",popular:"🔥 Tse di Tumileng",share:"🔗 Abelana",
    copylink:"📋 Kopiela Kgolagano",needhelp:"O Tlhoka Thuso?",helpcenter:"🆘 Lefelo la Thuso",
    donatedesc2:"Neelo ya gago e boloka setheo se le mahala.",
    custom:"E Khethilweng",choosemethod:"Kgetha mokgwa wa dituelo:",
    donatethanks:"100% e ya go tsamaisa BARMAN Solutions. Ke a leboga! 🙏",
    helpsubtitle:"Re gona go go thusa 24/7",email:"Imeile",phone:"Mogala",
    faq:"Dipotso tse di Botshiwang Gantsi",
    faq1q:"Ke tsaya jang sebokisi?",faq1a:"Tobetsa konopo ya ⬇ Kereketsa.",
    faq2q:"A dibokisi di mahala?",faq2a:"Ee! Di mahala 100%.",
    faq3q:"Phapano fa gare ga PC le fono?",faq3a:"PC ke bogodimo. Fono ke bokima.",
    faq4q:"Ke nee jang?",faq4a:"Tobetsa konopo ya 💛 Nee.",
    faq5q:"Ke fetola jang puo?",faq5a:"Tobetsa 🌐 mme o kgethe puo ya gago.",
    supporthours:"Dinako tsa Thuso",supporthoursdesc:"Mo–Mo: 8am–8pm · So: 10am–4pm",
    loading:"E laola dibokisi...",devall:"🖼️ Tsotlhe",pcwall:"🖥️ PC",
    phonewall:"📱 Fono",devicefilter:"📱 Sediriso",
    search:"Batla dibokisi...",yourname:"Leina la gago (ga go tlhokega)"
  },
  ts:{
    donate:"💛 Nyika",help:"❓ Pfuneto",dashboard:"Bodo ra Vuhlanganisi",
    hero1:"Ya Xehla",hero2:"Swifaniso swa Matiyelo",hero3:"Swikoxo leswi hlawulekeke · Mahala · A ya kula",
    categories:"📂 Mifumo",catall:"✦ Hinkwaswo",stats:"📊 Tinomboro",
    wallpapers:"swifaniso",freedl:"Ku xiya mahala",alwaysup:"A ya pfuxiwa",
    supportus:"Hi Pfuna",donatedesc:"Pfuna ku hlayisa BARMAN Solutions mahala!",
    donatenow:"Nyika Sweswi",popular:"🔥 Lawa ya Tivekaka",share:"🔗 Avela",
    copylink:"📋 Khopa Xivokelo",needhelp:"U Lava Pfuneto?",helpcenter:"🆘 Xivulavulo xa Pfuneto",
    donatedesc2:"Nyiko ya wena yi hlayisa xivulavulo mahala.",
    custom:"Loku Hlawuliweke",choosemethod:"Hlawula nhlayo wa ku hakela:",
    donatethanks:"100% yi ya eka ku aka BARMAN Solutions. Ndza khensa! 🙏",
    helpsubtitle:"Hi kona ku ku pfuna 24/7",email:"Imeyili",phone:"Xitingitingi",
    faq:"Swivutiso leswi Vutiwaka Gantsi",
    faq1q:"Ndzi xiya njhani xifaniso?",faq1a:"Tshovela konopo ya ⬇ Xiya.",
    faq2q:"Swifaniso i mahala?",faq2a:"Ina! Mahala 100%.",
    faq3q:"Phambano vhukati ha PC na foni?",faq3a:"PC i wide. Foni i tall.",
    faq4q:"Ndzi nyika njhani?",faq4a:"Tshovela konopo ya 💛 Nyika.",
    faq5q:"Ndzi cinca njhani ririmi?",faq5a:"Tshovela 🌐 u hlawule ririmi.",
    supporthours:"Tiawara ta Pfuneto",supporthoursdesc:"Mu–Mu: 8am–8pm · So: 10am–4pm",
    loading:"Yi xiya swifaniso...",devall:"🖼️ Hinkwaswo",pcwall:"🖥️ PC",
    phonewall:"📱 Foni",devicefilter:"📱 Xitiriso",
    search:"Lava swifaniso...",yourname:"Vito ra wena (a swi laveki)"
  },
  ve:{
    donate:"💛 Ṋea",help:"❓ Thuso",dashboard:"Bodo ḽa Vhulanguli",
    hero1:"Ya Nṱha",hero2:"Mifananiso ya Mutsho",hero3:"Yo nanguluswa · Mahala · Yo ḓi khwatha",
    categories:"📂 Mifhuwi",catall:"✦ Yoṱhe",stats:"📊 Tshivhalo",
    wallpapers:"mifananiso",freedl:"Daunilodo ya mahala",alwaysup:"Yo ḓi pfuxiswa",
    supportus:"Ri Thuse",donatedesc:"Thusa u dzudzanya BARMAN Solutions mahala!",
    donatenow:"Ṋea Zwino",popular:"🔥 Yo Divhea",share:"🔗 Kovhela",
    copylink:"📋 Khopitha Vhukalo",needhelp:"No Ṱoḓa Thuso?",helpcenter:"🆘 Tshiimiswa tsha Thuso",
    donatedesc2:"Ṋeo yavho i dzudzanya lupfumo mahala.",
    custom:"Yo Nanguluswa",choosemethod:"Nanga nzila ya u badelela:",
    donatethanks:"100% yo ya u dzhia BARMAN Solutions. Ndo livhuwa! 🙏",
    helpsubtitle:"Ri hone u ni thusa 24/7",email:"Imeyili",phone:"Mugagano",
    faq:"Mbudziso Yo Botshiwa Gantsi",
    faq1q:"Ndi khetha hani mufananiso?",faq1a:"Tikedza konopo ya ⬇ Khethela.",
    faq2q:"Mifananiso ndi ya mahala?",faq2a:"Iya! Mahala 100%.",
    faq3q:"PC na foni phambano?",faq3a:"PC = wide. Foni = tall.",
    faq4q:"Ndi ṋea hani?",faq4a:"Tikedza 💛 Ṋea.",
    faq5q:"Ndi shandukisa hani luambo?",faq5a:"Tikedza 🌐 u nange luambo.",
    supporthours:"Awara dza Thuso",supporthoursdesc:"Mu–Mu: 8am–8pm · So: 10am–4pm",
    loading:"Yo khetha mifananiso...",devall:"🖼️ Yoṱhe",pcwall:"🖥️ PC",
    phonewall:"📱 Foni",devicefilter:"📱 Zwitiriso",
    search:"Ṱoḓa mifananiso...",yourname:"Dzina ḽavho (a ḽi ḓivhadziwi)"
  },
  zu:{
    donate:"💛 Nikela",help:"❓ Usizo",dashboard:"Ibhodi Lokulawula",
    hero1:"Ezezinga",hero2:"Imidwebo Yodonga",hero3:"Iqoqwe ngokhétha · Mahhala · Ikhula njalo",
    categories:"📂 Izinhlobo",catall:"✦ Konke",stats:"📊 Izinombolo",
    wallpapers:"imidwebo",freedl:"Ukulanda mahhala",alwaysup:"Ihlaziywa njalo",
    supportus:"Sisekele",donatedesc:"Siza ukugcina BARMAN Solutions imahhala!",
    donatenow:"Nikela Manje",popular:"🔥 Edumile",share:"🔗 Yabelana",
    copylink:"📋 Kopisha Ixhosa",needhelp:"Udinga Usizo?",helpcenter:"🆘 Iziko Losizo",
    donatedesc2:"Umnikelo wakho ugcina leli hlelo limahhala.",
    custom:"Okukhethiwe",choosemethod:"Khetha indlela yokukhokha:",
    donatethanks:"100% iya ekuqhubeni BARMAN Solutions. Ngiyabonga! 🙏",
    helpsubtitle:"Silapha ukukusiza 24/7",email:"I-imeyili",phone:"Ucingo",
    faq:"Imibuzo Evame Ukubuzwa",
    faq1q:"Ngiklanda kanjani umfanekiso?",faq1a:"Chofoza inkinobho ethi ⬇ Landa.",
    faq2q:"Imidwebo imahhala?",faq2a:"Yebo! Mahhala 100%.",
    faq3q:"PC nezingcingo?",faq3a:"PC = wide. Izingcingo = tall.",
    faq4q:"Nginikelela kanjani?",faq4a:"Chofoza 💛 Nikela phezulu.",
    faq5q:"Ngishintsha kanjani ulimi?",faq5a:"Chofoza 🌐 bese ukhetha ulimi.",
    supporthours:"Amahora Oxhaso",supporthoursdesc:"UMso–UMgs: 8am–8pm · ISo: 10am–4pm",
    loading:"Ilayisha imidwebo...",devall:"🖼️ Konke",pcwall:"🖥️ I-PC",
    phonewall:"📱 Izingcingo",devicefilter:"📱 Idivayisi",
    search:"Sesha imidwebo...",yourname:"Igama lakho (ukhetho)"
  }
};

const LANG_LABELS = {en:"🌐 EN",af:"🌐 AF",zh:"🌐 中文",tn:"🌐 TN",ts:"🌐 TS",ve:"🌐 VE",zu:"🌐 ZU"};

// ── LANGUAGE ───────────────────────────────────
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("barman-lang", lang);
  const t = T[lang] || T.en;

  // Update all data-i18n elements
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // Update placeholders
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const key = el.getAttribute("data-i18n-ph");
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // Update lang button
  const btn = document.getElementById("lang-btn");
  if (btn) btn.textContent = LANG_LABELS[lang] || "🌐";

  // Close menu
  const menu = document.getElementById("lang-menu");
  if (menu) menu.classList.remove("open");
}

function toggleLangMenu() {
  document.getElementById("lang-menu").classList.toggle("open");
}

document.addEventListener("click", e => {
  const wrap = document.querySelector(".lang-wrap");
  if (wrap && !wrap.contains(e.target)) {
    const menu = document.getElementById("lang-menu");
    if (menu) menu.classList.remove("open");
  }
});

// ── THEME ──────────────────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("barman-theme", newTheme);
  const btn = document.getElementById("theme-btn");
  if (btn) btn.textContent = newTheme === "dark" ? "🌙" : "☀️";
}

// ── MOBILE SIDEBAR ─────────────────────────────
function openMobileSidebar() {
  document.getElementById("mobile-sidebar").classList.add("open");
  document.getElementById("sidebar-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeMobileSidebar() {
  document.getElementById("mobile-sidebar").classList.remove("open");
  document.getElementById("sidebar-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

// ── WALLPAPERS ─────────────────────────────────
async function loadWallpapers() {
  try {
    const res = await fetch(`${API}/wallpapers`);
    const data = await res.json();
    const gallery = document.getElementById("gallery");
    const searchText = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const t = T[currentLang] || T.en;

    const countEl = document.getElementById("total-count");
    if (countEl) countEl.textContent = data.length;

    // FIXED: exact case-insensitive match for both category and device
    const filtered = data.filter(wp => {
      const matchSearch = (wp.title || "").toLowerCase().includes(searchText);
      const matchCat = activeCategory === "All" ||
        (wp.category || "").trim().toLowerCase() === activeCategory.toLowerCase();
      const matchDev = activeDevice === "All" ||
        (wp.device || "").trim().toLowerCase() === activeDevice.toLowerCase();
      return matchSearch && matchCat && matchDev;
    });

    gallery.innerHTML = "";

    if (!filtered.length) {
      gallery.innerHTML = `<div class="empty-state"><div class="empty-icon">🖼️</div><p>No wallpapers found.</p></div>`;
      return;
    }

    filtered.forEach((wp, i) => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.animationDelay = `${i * 0.05}s`;
      // Use imageUrl if from Cloudinary, else local uploads
      const imgSrc = wp.imageUrl || `${API}/uploads/${wp.filename}`;
      card.innerHTML = `
        <div class="card-img-wrap">
          <img src="${imgSrc}" alt="${wp.title}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'145\'%3E%3Crect width=\'200\' height=\'145\' fill=\'%23222\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23555\' text-anchor=\'middle\' dy=\'.3em\'%3E🖼️%3C/text%3E%3C/svg%3E'">
          <span class="card-category">${wp.category || 'General'}</span>
          <span class="card-device-badge">${wp.device === 'PC' ? '🖥️' : wp.device === 'Phone' ? '📱' : '📦'}</span>
        </div>
        <div class="card-body">
          <div class="card-title">${wp.title}</div>
          <div class="card-owner">✓ BARMAN Solutions</div>
        </div>
        <div class="card-footer">
          <a class="btn-download" href="${imgSrc}" download="${wp.title}">⬇ Download</a>
        </div>`;
      gallery.appendChild(card);
    });

  } catch {
    document.getElementById("gallery").innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p>Server waking up — refresh in 30 seconds.</p>
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

function setDevice(device, btn) {
  activeDevice = device;
  document.querySelectorAll(".device-tab").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".side-dev").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  loadWallpapers();
}

document.addEventListener("input", e => {
  if (e.target.id === "searchInput") loadWallpapers();
});

// ── DONATE ─────────────────────────────────────
function openDonate() {
  document.getElementById("donate-modal").classList.add("open");
  document.body.style.overflow = "hidden";
  showMethodInfo("payshap");
  // Set first amount active
  document.querySelectorAll(".amount-btn")[0]?.classList.add("active");
}

function closeDonate() {
  document.getElementById("donate-modal").classList.remove("open");
  document.body.style.overflow = "";
}

function selectAmount(btn, val) {
  document.querySelectorAll(".amount-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  selectedAmount = val;
  document.getElementById("custom-amount-wrap").style.display = val === "custom" ? "block" : "none";
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
  const details = {
    payshap:`<div class="bank-detail"><div class="bank-name">📱 PayShap</div><div class="bank-row"><span>Number</span><b>060 366 0391</b></div><div class="bank-row"><span>Name</span><b>Mr Mashaba</b></div><div class="bank-row"><span>Reference</span><b>BARMAN DONATION</b></div></div>`,
    capitec:`<div class="bank-detail"><div class="bank-name">🏦 Capitec Bank</div><div class="bank-row"><span>Account Name</span><b>Mr Mashaba</b></div><div class="bank-row"><span>Account Number</span><b>1980500736</b></div><div class="bank-row"><span>Account Type</span><b>Savings</b></div><div class="bank-row"><span>Reference</span><b>BARMAN DONATION</b></div></div>`,
    fnb:`<div class="bank-detail"><div class="bank-name">🏦 FNB — First National Bank</div><div class="bank-row"><span>Account Name</span><b>Mr Mashaba</b></div><div class="bank-row"><span>Account Number</span><b>63143121430</b></div><div class="bank-row"><span>Branch Code</span><b>250655</b></div><div class="bank-row"><span>Reference</span><b>BARMAN DONATION</b></div></div>`,
    crypto:`<div class="bank-detail"><div class="bank-name">🔗 Crypto</div><div class="bank-row"><span>WhatsApp for wallet address:</span><b>083 288 0154</b></div></div>`
  };
  info.innerHTML = details[method] || "";
}

function confirmDonate() {
  const amount = selectedAmount === "custom"
    ? document.getElementById("custom-amount")?.value : selectedAmount;
  const name = document.getElementById("donor-name")?.value.trim() || "Anonymous";
  if (!amount || amount <= 0) { alert("Please select or enter an amount."); return; }
  const methods = {payshap:"PayShap (060 366 0391)",capitec:"Capitec (1980500736)",fnb:"FNB (63143121430)",crypto:"Crypto"};
  alert(`Thank you ${name}! 💛\n\nPlease send R${amount} to:\n${methods[selectedMethod]}\nReference: BARMAN DONATION\n\nThank you for supporting BARMAN Solutions!`);
  closeDonate();
}

document.addEventListener("click", e => {
  if (e.target.id === "donate-modal") closeDonate();
});

// ── HELP ───────────────────────────────────────
function openHelp() {
  document.getElementById("help-modal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeHelp() {
  document.getElementById("help-modal").classList.remove("open");
  document.body.style.overflow = "";
}

function toggleFaq(el) {
  const ans = el.nextElementSibling;
  const isOpen = ans.classList.contains("open");
  document.querySelectorAll(".faq-a").forEach(a => a.classList.remove("open"));
  document.querySelectorAll(".faq-q").forEach(q => q.classList.remove("active"));
  if (!isOpen) { ans.classList.add("open"); el.classList.add("active"); }
}

document.addEventListener("click", e => {
  if (e.target.id === "help-modal") closeHelp();
});

// ── SHARE ──────────────────────────────────────
function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const msg = document.getElementById("copy-msg");
    if (msg) { msg.textContent = "✓ Link copied!"; setTimeout(() => msg.textContent = "", 2500); }
  });
}

// ── INIT ───────────────────────────────────────
(function init() {
  // Theme
  const savedTheme = localStorage.getItem("barman-theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  const themeBtn = document.getElementById("theme-btn");
  if (themeBtn) themeBtn.textContent = savedTheme === "dark" ? "🌙" : "☀️";

  // Language
  const savedLang = localStorage.getItem("barman-lang") || "en";
  setLang(savedLang);

  // Load wallpapers
  loadWallpapers();
})();
