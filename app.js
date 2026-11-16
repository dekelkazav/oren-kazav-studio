/* ===== Helpers ===== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const catName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || "";
const waLink = (text) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

const ICONS = {
  holidays: '<svg viewBox="0 0 48 48"><rect x="8" y="18" width="32" height="22" rx="2"/><path d="M6 12h36v6H6zM24 12v28M24 12c-3-6-11-6-10 0M24 12c3-6 11-6 10 0"/></svg>',
  events: '<svg viewBox="0 0 48 48"><circle cx="18" cy="28" r="10"/><circle cx="30" cy="28" r="10"/><path d="M14 10l4 6 4-6M26 10l4 6 4-6"/></svg>',
  corporate: '<svg viewBox="0 0 48 48"><rect x="8" y="16" width="32" height="24" rx="3"/><path d="M18 16v-5h12v5M8 26h32M22 26v4h4v-4"/></svg>',
  personal: '<svg viewBox="0 0 48 48"><path d="M24 40S8 30 8 19a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 11-16 21-16 21z"/></svg>',
};

function media(item, alt) {
  if (item.image) return `<img src="${esc(item.image)}" alt="${esc(alt)}" loading="lazy">`;
  return `<div class="ph ph-${item.category}" role="img" aria-label="${esc(alt)}">${ICONS[item.category] || ICONS.holidays}</div>`;
}

/* ===== Site info ===== */
function fillSiteInfo() {
  $$("[data-site]").forEach((el) => (el.textContent = SITE[el.dataset.site] || ""));
  $$("[data-site-href]").forEach((el) => {
    const k = el.dataset.siteHref;
    if (k === "tel") el.href = "tel:" + SITE.phone.replace(/\D/g, "");
    else if (k === "mailto") el.href = "mailto:" + SITE.email;
    else if (SITE[k]) el.href = SITE[k];
    else el.remove();
  });
  $$("[data-wa]").forEach((el) => {
    el.href = waLink(el.dataset.wa);
    el.target = "_blank";
    el.rel = "noopener";
  });
  $("#year").textContent = new Date().getFullYear();
}

/* ===== Selection list (persisted per viewer) ===== */
const STORE_KEY = "oren-studio-list";
let list = [];
try { list = JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { list = []; }
list = list.filter((i) => PRODUCTS.some((p) => p.id === i.id));

function saveList() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch {}
  const count = list.length;
  const badge = $("#listCount");
  badge.textContent = count;
  badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
  renderList();
  $$(".btn-add").forEach(syncAddBtn);
}

const inList = (id) => list.some((i) => i.id === id);

function toggleItem(id) {
  if (inList(id)) {
    list = list.filter((i) => i.id !== id);
    toast("הוסר מהרשימה");
  } else {
    list.push({ id, qty: 1 });
    toast("נוסף לרשימת הבחירות ✓");
  }
  saveList();
}

function syncAddBtn(btn) {
  const on = inList(btn.dataset.id);
  btn.classList.toggle("added", on);
  btn.textContent = on ? "✓ ברשימה" : "הוספה לרשימה";
}

function renderList() {
  const box = $("#listItems");
  if (!list.length) {
    box.innerHTML = `<div class="drawer-empty"><p>הרשימה ריקה כרגע.</p><p>הוסיפו מוצרים מהקטלוג ושלחו לי אותם יחד לקבלת הצעת מחיר.</p></div>`;
    $("#sendList").disabled = true;
    return;
  }
  $("#sendList").disabled = false;
  box.innerHTML = list.map((i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    return `<div class="list-item" data-id="${p.id}">
      <div class="list-thumb">${media(p, p.name)}</div>
      <div>
        <strong>${esc(p.name)}</strong>
        <div class="qty">
          <button type="button" data-step="1" aria-label="הוספה">+</button>
          <input type="number" min="1" value="${i.qty}" aria-label="כמות">
          <button type="button" data-step="-1" aria-label="הפחתה">−</button>
        </div>
      </div>
      <button class="remove" type="button">הסרה</button>
    </div>`;
  }).join("");
}

function setQty(id, qty) {
  const item = list.find((i) => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, parseInt(qty, 10) || 1);
  try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch {}
}

function initList() {
  const drawer = $("#listDrawer");
  const open = () => { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); };
  const close = () => { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); };
  $("#openList").addEventListener("click", open);
  $$("[data-close-list]").forEach((b) => b.addEventListener("click", close));

  $("#listItems").addEventListener("click", (e) => {
    const row = e.target.closest(".list-item");
    if (!row) return;
    if (e.target.matches(".remove")) { toggleItem(row.dataset.id); return; }
    const step = e.target.dataset.step;
    if (step) {
      const input = $("input", row);
      input.value = Math.max(1, (parseInt(input.value, 10) || 1) + Number(step));
      setQty(row.dataset.id, input.value);
    }
  });
  $("#listItems").addEventListener("change", (e) => {
    const row = e.target.closest(".list-item");
    if (row && e.target.matches("input")) { setQty(row.dataset.id, e.target.value); e.target.value = list.find((i) => i.id === row.dataset.id).qty; }
  });

  $("#sendList").addEventListener("click", () => {
    const lines = list.map((i) => `• ${PRODUCTS.find((p) => p.id === i.id).name} – ${i.qty} יח'`);
    const notes = $("#listNotes").value.trim();
    const msg = `שלום אורן! הגעתי מהאתר ואשמח להצעת מחיר על:\n\n${lines.join("\n")}${notes ? `\n\nהערות: ${notes}` : ""}`;
    window.open(waLink(msg), "_blank", "noopener");
  });

  saveList();
  $("#listCount").classList.remove("bump");
  return { open, close };
}

/* ===== Catalog ===== */
let activeCat = "all";

function renderFilters() {
  const cats = [{ id: "all", name: "הכל" }, ...CATEGORIES];
  $("#catalogFilters").innerHTML = cats.map((c) =>
    `<button class="filter${c.id === activeCat ? " active" : ""}" data-cat="${c.id}" role="tab" aria-selected="${c.id === activeCat}">${esc(c.name)}</button>`
  ).join("");
}

function renderProducts() {
  const items = activeCat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCat);
  $("#productsGrid").innerHTML = items.map((p, idx) => `
    <article class="product" style="animation-delay:${idx * 40}ms">
      <div class="product-media" data-open="${p.id}">${media(p, p.name)}</div>
      <div class="product-body">
        <span class="product-cat">${esc(catName(p.category))}</span>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.desc)}</p>
        <div class="tags">${p.techniques.map((t) => `<span class="tag">${esc(TECHNIQUES[t])}</span>`).join("")}</div>
        <div class="product-actions">
          <button class="btn btn-ghost" data-open="${p.id}">פרטים</button>
          <button class="btn btn-primary btn-add" data-id="${p.id}"></button>
        </div>
      </div>
    </article>`).join("");
  $$("#productsGrid .btn-add").forEach(syncAddBtn);
}

function initCatalog() {
  renderFilters();
  renderProducts();
  $("#catalogFilters").addEventListener("click", (e) => {
    const b = e.target.closest(".filter");
    if (!b) return;
    activeCat = b.dataset.cat;
    renderFilters();
    renderProducts();
  });
  document.addEventListener("click", (e) => {
    const add = e.target.closest(".btn-add");
    if (add) { toggleItem(add.dataset.id); return; }
    const opener = e.target.closest("[data-open]");
    if (opener) openProduct(opener.dataset.open);
  });
}

/* ===== Product modal ===== */
function openProduct(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  $("#modalBody").innerHTML = `
    <div class="modal-grid">
      <div class="modal-media">${media(p, p.name)}</div>
      <div class="modal-info">
        <span class="product-cat">${esc(catName(p.category))}</span>
        <h3 id="modalTitle">${esc(p.name)}</h3>
        <p>${esc(p.desc)}</p>
        <strong>מה במארז:</strong>
        <ul>${p.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
        <div class="tags">${p.techniques.map((t) => `<span class="tag">${esc(TECHNIQUES[t])}</span>`).join("")}</div>
        <p class="meta">כמות מינימלית: ${esc(p.minQty)} · ניתן להתאים תכולה ועיצוב</p>
        <div class="product-actions">
          <button class="btn btn-primary btn-add" data-id="${p.id}"></button>
          <a class="btn btn-ghost" target="_blank" rel="noopener" href="${waLink(`שלום אורן, אשמח לפרטים על "${p.name}" מהאתר`)}">שאלה על המוצר בוואטסאפ</a>
        </div>
      </div>
    </div>`;
  $$("#modalBody .btn-add").forEach(syncAddBtn);
  const m = $("#productModal");
  m.classList.add("open");
  m.setAttribute("aria-hidden", "false");
  $(".modal-close", m).focus();
}

function closeModal() {
  const m = $("#productModal");
  m.classList.remove("open");
  m.setAttribute("aria-hidden", "true");
}

/* ===== Gallery ===== */
function renderGallery() {
  $("#galleryGrid").innerHTML = GALLERY.map((g) =>
    `<figure class="gallery-item">${media(g, g.title)}<figcaption>${esc(g.title)}</figcaption></figure>`
  ).join("");
}

/* ===== Contact form → WhatsApp ===== */
function initContact() {
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const parts = [
      `שלום אורן, שמי ${f.get("name")}.`,
      `סוג הפנייה: ${f.get("type")}`,
      f.get("qty") ? `כמות משוערת: ${f.get("qty")}` : "",
      f.get("msg") ? `\n${f.get("msg")}` : "",
    ].filter(Boolean);
    window.open(waLink(parts.join("\n")), "_blank", "noopener");
  });
}

/* ===== Misc ===== */
let toastTimer;
function toast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

function initNav() {
  const nav = $("#mainNav");
  const btn = $("#menuToggle");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", (e) => { if (e.target.matches("a")) nav.classList.remove("open"); });
}

/* ===== Init ===== */
fillSiteInfo();
initNav();
initCatalog();
renderGallery();
initContact();
const drawer = initList();
$$("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeModal(); drawer.close(); }
});
