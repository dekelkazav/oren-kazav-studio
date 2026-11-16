(() => {
  "use strict";

  /* ===== helpers ===== */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isDesktop = () => innerWidth > 980;
  const catName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || "";
  const waLink = (text) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
  const img = (name, size = "sm") => `images/works/${name}${size === "sm" ? "-sm" : ""}.webp`;
  const PH = `<div class="ph"><svg><use href="#mark"/></svg><span>תמונה בקרוב</span></div>`;

  function media(name, alt, sizes = "(max-width: 600px) 50vw, 25vw", eager = false) {
    if (!name) return PH;
    return `<img src="${img(name)}" srcset="${img(name)} 700w, ${img(name, "lg")} 1400w" sizes="${sizes}" alt="${esc(alt)}" ${eager ? "" : 'loading="lazy"'} decoding="async">`;
  }

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (!location.hash) scrollTo(0, 0);

  /* ===== site info ===== */
  $$("[data-site]").forEach((el) => (el.textContent = SITE[el.dataset.site] || ""));
  $$("[data-href]").forEach((el) => {
    const k = el.dataset.href;
    if (k === "tel") el.href = "tel:" + SITE.phone.replace(/\D/g, "");
    else if (SITE[k]) el.href = SITE[k];
  });
  $$("[data-wa]").forEach((el) => { el.href = waLink(el.dataset.wa); el.target = "_blank"; el.rel = "noopener"; });
  $("#year").textContent = new Date().getFullYear();
  $$(".modal-dialog, .drawer-items, .menu").forEach((el) => el.setAttribute("data-lenis-prevent", ""));

  /* ===== smooth scroll (Lenis) ===== */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
  }
  function scrollToTarget(target) {
    const el = target === "#top" ? 0 : $(target);
    if (el === null) return;
    if (lenis) lenis.scrollTo(el, { offset: el === 0 ? 0 : -10, duration: 1.6 });
    else if (el === 0) scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute("href").length < 2) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(a.getAttribute("href"));
  });
  const lockScroll = (on) => {
    document.documentElement.style.overflow = on ? "hidden" : "";
    if (lenis) on ? lenis.stop() : lenis.start();
  };

  /* ===== preloader ===== */
  const loader = $("#loader");
  const seen = (() => { try { return sessionStorage.getItem("ok-seen") === "1"; } catch { return false; } })();
  function ready() {
    loader.classList.add("done");
    setTimeout(() => {
      document.body.classList.remove("is-loading");
      document.body.classList.add("is-ready");
    }, seen || reduce ? 0 : 350);
    setTimeout(() => loader.remove(), 1300);
    try { sessionStorage.setItem("ok-seen", "1"); } catch {}
  }
  if (reduce || seen) { loader.style.transition = "none"; ready(); }
  else {
    const minTime = new Promise((r) => setTimeout(r, 2100));
    const loaded = new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r, { once: true })));
    Promise.all([minTime, Promise.race([loaded, new Promise((r) => setTimeout(r, 4000))])]).then(ready);
  }

  /* ===== reveal on scroll ===== */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -12% 0px" });
  const observeReveals = (root = document) => $$("[data-reveal], .contact-title, .card:not(.in)", root).forEach((el) => revealIO.observe(el));

  /* ===== manifesto words ===== */
  const manifesto = $("#manifesto");
  const words = [];
  if (manifesto) {
    manifesto.innerHTML = manifesto.textContent.trim().split(/\s+/).map((w) => `<span class="w">${esc(w)}</span>`).join(" ");
    words.push(...$$(".w", manifesto));
  }

  /* ===== marquee ===== */
  const marquee = $("#marquee");
  let mqX = 0, mqHalf = 0, mqDir = 1;
  function setupMarquee() {
    if (!marquee) return;
    const base = marquee.dataset.base || marquee.innerHTML;
    marquee.dataset.base = base;
    marquee.innerHTML = base;
    let guard = 0;
    while (marquee.scrollWidth < innerWidth * 2.2 && guard++ < 8) marquee.innerHTML += base;
    marquee.innerHTML += marquee.innerHTML;
    mqHalf = marquee.scrollWidth / 2;
    mqX = -mqHalf;
  }

  /* ===== catalog ===== */
  let activeCat = "all";
  const STORE = "ok-list";
  let list = [];
  try { list = JSON.parse(localStorage.getItem(STORE)) || []; } catch { list = []; }
  list = list.filter((i) => PRODUCTS.some((p) => p.id === i.id));
  const inList = (id) => list.some((i) => i.id === id);

  function renderFilters() {
    const wrap = $("#filters");
    const cats = [{ id: "all", name: "הכל" }, ...CATEGORIES];
    $$(".filter", wrap).forEach((b) => b.remove());
    wrap.insertAdjacentHTML("beforeend", cats.map((c) => {
      const n = c.id === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c.id).length;
      return `<button class="filter${c.id === activeCat ? " active" : ""}" role="tab" aria-selected="${c.id === activeCat}" data-cat="${c.id}" data-cursor="hover">${esc(c.name)}<sup>${n}</sup></button>`;
    }).join(""));
    moveFilterIndicator();
  }
  function moveFilterIndicator() {
    const wrap = $("#filters"), act = $(".filter.active", wrap), ind = $(".filters-indicator", wrap);
    if (!act) return;
    ind.style.width = act.offsetWidth + "px";
    ind.style.transform = `translate(${act.offsetLeft}px, ${act.offsetTop}px)`;
  }

  function cardHTML(p, i) {
    const on = inList(p.id);
    return `<article class="card" style="--d:${(i % 4) * 0.08}s">
      <div class="card-media" data-open="${p.id}" data-cursor="view" data-label="לפרטים">
        ${media(p.image, p.name)}
        <span class="card-tag">${esc(catName(p.category))}</span>
        <button class="add${on ? " added" : ""}" data-add="${p.id}" aria-pressed="${on}" aria-label="${on ? "הסרה מהרשימה" : "הוספה לרשימה"}: ${esc(p.name)}"><i></i><span>${on ? "נבחר" : "הוספה"}</span></button>
      </div>
      <div class="card-info">
        <h3 data-open="${p.id}">${esc(p.name)}</h3>
        <p>${p.techniques.map((t) => esc(TECHNIQUES[t])).join(" · ")}</p>
      </div>
    </article>`;
  }

  function renderProducts(animate) {
    const grid = $("#products");
    const items = activeCat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCat);
    const draw = () => {
      grid.innerHTML = items.length ? items.map(cardHTML).join("") : `<p class="products-empty">בקרוב יתווספו כאן מוצרים.</p>`;
      observeReveals(grid);
    };
    if (!animate) return draw();
    $$(".card", grid).forEach((c) => { c.style.transitionDelay = "0s"; c.classList.remove("in"); });
    setTimeout(draw, 380);
  }

  function syncAddButtons(id) {
    const on = inList(id);
    $$(`[data-add="${id}"]`).forEach((b) => {
      b.classList.toggle("added", on);
      b.setAttribute("aria-pressed", on);
      const span = $("span", b);
      if (b.classList.contains("add")) { span.textContent = on ? "נבחר" : "הוספה"; }
      else span.textContent = on ? "✓ ברשימה – לחצו להסרה" : "הוספה לרשימת הבחירות";
    });
  }

  function toggleItem(id) {
    if (inList(id)) { list = list.filter((i) => i.id !== id); toast("הוסר מהרשימה"); }
    else { list.push({ id, qty: 1 }); toast("נוסף לרשימת הבחירות ✓"); }
    saveList(true);
    syncAddButtons(id);
  }

  function saveList(bump) {
    try { localStorage.setItem(STORE, JSON.stringify(list)); } catch {}
    const c = $("#listCount");
    c.textContent = list.length;
    if (bump) { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
    renderList();
  }

  /* ===== drawer (selection list) ===== */
  const drawer = $("#drawer");
  function openDrawer() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); lockScroll(true); }
  function closeDrawer() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); if (!modal.classList.contains("open")) lockScroll(false); }

  function renderList() {
    const box = $("#listItems");
    $("#sendList").disabled = !list.length;
    if (!list.length) {
      box.innerHTML = `<div class="drawer-empty"><svg><use href="#bag"/></svg><p>הרשימה עדיין ריקה.</p><p>הוסיפו מוצרים מהקטלוג ושלחו לי אותם יחד לקבלת הצעת מחיר.</p><a href="#catalog" class="btn btn-line" data-close-list><span>לקטלוג</span></a></div>`;
      return;
    }
    box.innerHTML = list.map((i) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      return `<div class="list-item" data-id="${p.id}">
        <div class="list-thumb">${media(p.image, p.name, "76px")}</div>
        <div><strong>${esc(p.name)}</strong>
          <div class="qty"><button type="button" data-step="1" aria-label="הוספת יחידה">+</button><input type="number" min="1" value="${i.qty}" aria-label="כמות"><button type="button" data-step="-1" aria-label="הפחתת יחידה">−</button></div>
        </div>
        <button class="remove" type="button">הסרה</button>
      </div>`;
    }).join("");
  }
  function setQty(id, v) {
    const it = list.find((i) => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, parseInt(v, 10) || 1);
    try { localStorage.setItem(STORE, JSON.stringify(list)); } catch {}
    return it.qty;
  }
  $("#openList").addEventListener("click", openDrawer);
  drawer.addEventListener("click", (e) => { if (e.target.closest("[data-close-list]")) closeDrawer(); });
  $("#listItems").addEventListener("click", (e) => {
    const row = e.target.closest(".list-item");
    if (!row) return;
    if (e.target.closest(".remove")) return toggleItem(row.dataset.id);
    const step = e.target.closest("[data-step]");
    if (step) { const inp = $("input", row); inp.value = setQty(row.dataset.id, (parseInt(inp.value, 10) || 1) + Number(step.dataset.step)); }
  });
  $("#listItems").addEventListener("change", (e) => {
    const row = e.target.closest(".list-item");
    if (row && e.target.matches("input")) e.target.value = setQty(row.dataset.id, e.target.value);
  });
  $("#sendList").addEventListener("click", () => {
    const lines = list.map((i) => `• ${PRODUCTS.find((p) => p.id === i.id).name} – ${i.qty} יח'`);
    const notes = $("#listNotes").value.trim();
    open(waLink(`שלום אורן! הגעתי מהאתר ואשמח להצעת מחיר על:\n\n${lines.join("\n")}${notes ? `\n\nהערות: ${notes}` : ""}`), "_blank", "noopener");
  });

  /* ===== product modal ===== */
  const modal = $("#modal");
  function openProduct(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    const on = inList(p.id);
    $("#modalBody").innerHTML = `<div class="modal-grid">
      <div class="modal-media">${media(p.image, p.name, "(max-width: 980px) 100vw, 540px", true)}</div>
      <div class="modal-info">
        <span class="eyebrow">${esc(catName(p.category))}</span>
        <h3 id="modalTitle">${esc(p.name)}</h3>
        <p>${esc(p.desc)}</p>
        <h4>מה במארז</h4>
        <ul>${p.includes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <div class="chips">${p.techniques.map((t) => `<span class="chip">${esc(TECHNIQUES[t])}</span>`).join("")}</div>
        <p class="modal-meta">כמות מינימלית: ${esc(p.minQty)} · הכל ניתן להתאמה אישית</p>
        <div class="modal-actions">
          <button class="btn btn-ink${on ? " added" : ""}" data-add="${p.id}" aria-pressed="${on}"><span>${on ? "✓ ברשימה – לחצו להסרה" : "הוספה לרשימת הבחירות"}</span></button>
          <a class="btn btn-line" target="_blank" rel="noopener" href="${waLink(`שלום אורן, אשמח לפרטים על "${p.name}" מהאתר`)}"><svg><use href="#wa"/></svg><span>שאלה על המוצר בוואטסאפ</span></a>
        </div>
      </div></div>`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    lockScroll(true);
    setTimeout(() => $(".x-btn", modal).focus({ preventScroll: true }), 50);
  }
  function closeModal() {
    if (!modal.classList.contains("open")) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if (!drawer.classList.contains("open")) lockScroll(false);
  }
  modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) { e.stopPropagation(); toggleItem(add.dataset.add); return; }
    const opener = e.target.closest("[data-open]");
    if (opener) openProduct(opener.dataset.open);
    const f = e.target.closest(".filter");
    if (f && f.dataset.cat !== activeCat) {
      activeCat = f.dataset.cat;
      $$(".filter").forEach((b) => { const on = b === f; b.classList.toggle("active", on); b.setAttribute("aria-selected", on); });
      moveFilterIndicator();
      renderProducts(true);
    }
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeDrawer(); closeMenu(); } });

  /* ===== works + instagram ===== */
  $("#worksTrack").innerHTML = GALLERY.map((g, i) => `
    <figure class="work" data-cursor="view" data-label="${esc(g.tag)}">
      <div class="work-media">${media(g.image, g.title, "(max-width: 980px) 72vw, 26vw")}</div>
      <figcaption><b><small>${String(i + 1).padStart(2, "0")}</small>${esc(g.title)}</b><span>${esc(g.tag)}</span></figcaption>
    </figure>`).join("");
  $("#instaGrid").innerHTML = INSTAGRAM_FEED.map((n) =>
    `<a href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="לאינסטגרם של אורן" data-cursor="hover">${media(n, "עבודה מהסטודיו", "(max-width: 980px) 33vw, 16vw")}<svg><use href="#ig"/></svg></a>`).join("");

  /* ===== contact form → WhatsApp ===== */
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const msg = [
      `שלום אורן, שמי ${f.get("name")}.`,
      `סוג הפנייה: ${f.get("type")}`,
      f.get("qty") && `כמות משוערת: ${f.get("qty")}`,
      f.get("date") && `מתי צריך: ${f.get("date")}`,
      f.get("msg") && `\n${f.get("msg")}`,
    ].filter(Boolean).join("\n");
    open(waLink(msg), "_blank", "noopener");
  });

  /* ===== mobile menu ===== */
  const burger = $("#burger");
  function closeMenu() {
    if (!document.body.classList.contains("menu-open")) return;
    document.body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    $("#menu").setAttribute("aria-hidden", "true");
    lockScroll(false);
  }
  burger.addEventListener("click", () => {
    const open = !document.body.classList.contains("menu-open");
    if (!open) return closeMenu();
    document.body.classList.add("menu-open");
    burger.setAttribute("aria-expanded", "true");
    $("#menu").setAttribute("aria-hidden", "false");
    lockScroll(true);
  });

  /* ===== nav: hover pill + scroll spy ===== */
  const nav = $("#nav"), navInd = $(".nav-indicator", nav), navLinks = $$("a", nav);
  function placeNavInd(a) {
    if (!a) { navInd.style.opacity = 0; return; }
    navInd.style.opacity = 1;
    navInd.style.width = a.offsetWidth + "px";
    navInd.style.transform = `translateX(${a.offsetLeft}px)`;
  }
  let activeLink = null;
  navLinks.forEach((a) => a.addEventListener("mouseenter", () => { navLinks.forEach((l) => l.classList.toggle("active", l === a)); placeNavInd(a); }));
  nav.addEventListener("mouseleave", () => { navLinks.forEach((l) => l.classList.toggle("active", l === activeLink)); placeNavInd(activeLink); });
  const spyIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      activeLink = navLinks.find((a) => a.getAttribute("href") === "#" + en.target.id) || null;
      if (!nav.matches(":hover")) { navLinks.forEach((l) => l.classList.toggle("active", l === activeLink)); placeNavInd(activeLink); }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => spyIO.observe(s));
  const hero = $(".hero");
  new IntersectionObserver(([en]) => { if (en.isIntersecting) { activeLink = null; if (!nav.matches(":hover")) { navLinks.forEach((l) => l.classList.remove("active")); placeNavInd(null); } } }, { rootMargin: "-45% 0px -50% 0px" }).observe(hero);

  /* ===== custom cursor ===== */
  const cursor = $(".cursor"), ring = $(".cursor-ring"), dot = $(".cursor-dot"), cLabel = $(".cursor-label");
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 }, ringPos = { x: mouse.x, y: mouse.y };
  if (fine && !reduce) {
    document.body.classList.add("has-cursor");
    addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; cursor.classList.remove("is-hidden"); }, { passive: true });
    document.addEventListener("pointerleave", () => cursor.classList.add("is-hidden"));
    document.addEventListener("pointerover", (e) => {
      const view = e.target.closest('[data-cursor="view"]');
      const hov = e.target.closest('a, button, [data-cursor="hover"], label, select');
      cursor.classList.toggle("is-view", !!view && !e.target.closest("button"));
      cursor.classList.toggle("is-hover", !view && !!hov);
      if (view) cLabel.textContent = view.dataset.label || "צפייה";
    });
  }

  /* ===== magnetic buttons ===== */
  if (fine && !reduce) {
    $$("[data-magnetic]").forEach((el) => {
      el.style.transition = getComputedStyle(el).transition + ", transform .7s cubic-bezier(.22,1,.36,1)";
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.32}px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  /* ===== hero parallax ===== */
  const floats = $$(".float");
  const par = { x: 0, y: 0, tx: 0, ty: 0 };
  if (fine && !reduce) {
    hero.addEventListener("pointermove", (e) => { par.tx = e.clientX / innerWidth - 0.5; par.ty = e.clientY / innerHeight - 0.5; });
    hero.addEventListener("pointerleave", () => { par.tx = 0; par.ty = 0; });
  }

  /* ===== service hover preview ===== */
  const preview = $("#servicePreview"), previewImg = $("img", preview);
  const pv = { x: 0, y: 0, tx: 0, ty: 0, rot: 0 };
  if (fine) {
    $$(".service").forEach((s) => s.addEventListener("pointerenter", () => { previewImg.src = s.dataset.img; preview.classList.add("show"); }));
    $("#serviceList").addEventListener("pointerleave", () => preview.classList.remove("show"));
    $("#serviceList").addEventListener("pointermove", (e) => { pv.tx = e.clientX; pv.ty = e.clientY; });
  }

  /* ===== horizontal works ===== */
  const works = $("#works"), track = $("#worksTrack"), worksBar = $("#worksBar");
  let worksDist = 0;
  function sizeWorks() {
    if (!isDesktop() || reduce) { works.style.height = ""; track.style.transform = ""; worksDist = 0; return; }
    worksDist = Math.max(0, track.scrollWidth - innerWidth);
    works.style.height = innerHeight + worksDist + "px";
  }

  /* ===== main loop ===== */
  const header = $("#header"), waFloat = $(".wa-float"), steps = $$("#steps li"), processLine = $("#processLine");
  const darkZones = [works, $("#contact"), $(".footer")];
  let lastY = scrollY, velocity = 0;

  function tick() {
    const y = scrollY, vh = innerHeight;
    const dy = y - lastY; lastY = y;
    velocity = lenis ? lenis.velocity : lerp(velocity, dy, 0.2);

    // header: hide on scroll down, show on scroll up, invert over dark areas
    if (!document.body.classList.contains("menu-open")) {
      if (y > 240 && dy > 2) header.classList.add("hide");
      else if (dy < -2 || y < 240) header.classList.remove("hide");
    }
    header.classList.toggle("scrolled", y > 80);
    header.classList.toggle("on-dark", darkZones.some((z) => { const r = z.getBoundingClientRect(); return r.top <= 44 && r.bottom >= 44; }));
    const contactTop = $("#contact").getBoundingClientRect().top;
    waFloat.classList.toggle("hide", contactTop < vh * 0.6);

    if (!reduce) {
      // marquee
      if (mqHalf) {
        if (Math.abs(velocity) > 0.5) mqDir = velocity > 0 ? 1 : -1;
        mqX += (0.6 + Math.min(Math.abs(velocity), 40) * 0.25) * mqDir;
        if (mqX > 0) mqX -= mqHalf;
        if (mqX < -mqHalf) mqX += mqHalf;
        marquee.style.transform = `translate3d(${mqX}px,0,0)`;
      }

      // hero floats: mouse + scroll parallax
      par.x = lerp(par.x, par.tx, 0.06); par.y = lerp(par.y, par.ty, 0.06);
      if (y < vh * 1.2) floats.forEach((f) => {
        const d = +f.dataset.depth;
        f.style.translate = `${(par.x * d * -1.4).toFixed(2)}px ${(par.y * d * -1.4 - y * d * (isDesktop() ? 0.01 : 0.004)).toFixed(2)}px`;
      });

      // manifesto word fill
      if (words.length) {
        const r = manifesto.getBoundingClientRect();
        const p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.35));
        const n = Math.round(p * words.length);
        words.forEach((w, i) => w.classList.toggle("on", i < n));
      }

      // horizontal works
      if (worksDist) {
        const r = works.getBoundingClientRect();
        const p = clamp(-r.top / (r.height - vh));
        track.style.transform = `translate3d(${p * worksDist}px,0,0)`;
        worksBar.style.transform = `scaleX(${p})`;
      }

      // process steps
      if (isDesktop()) {
        steps.forEach((s) => s.classList.toggle("on", s.getBoundingClientRect().top < vh * 0.62));
        const sr = $("#steps").getBoundingClientRect();
        processLine.style.transform = `scaleY(${clamp((vh * 0.62 - sr.top) / sr.height)})`;
      }

      // service preview follows cursor
      if (preview.classList.contains("show")) {
        const px = pv.x; pv.x = lerp(pv.x, pv.tx, 0.14); pv.y = lerp(pv.y, pv.ty, 0.14);
        pv.rot = lerp(pv.rot, clamp((pv.x - px) * 0.6, -12, 12), 0.1);
        preview.style.transform = `translate3d(${pv.x - 140}px, ${pv.y - 175}px, 0) rotate(${pv.rot}deg)`;
      } else { pv.x = pv.tx; pv.y = pv.ty; }
    }

    // cursor
    if (fine && !reduce) {
      ringPos.x = lerp(ringPos.x, mouse.x, 0.18); ringPos.y = lerp(ringPos.y, mouse.y, 0.18);
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    }
  }

  function raf(t) {
    if (lenis) lenis.raf(t);
    tick();
    requestAnimationFrame(raf);
  }

  /* ===== toast ===== */
  let toastT;
  function toast(text) {
    const t = $("#toast");
    t.textContent = text; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1900);
  }

  /* ===== init ===== */
  renderFilters();
  renderProducts(false);
  saveList(false);
  observeReveals();
  setupMarquee();
  sizeWorks();
  requestAnimationFrame(raf);
  addEventListener("load", () => { sizeWorks(); moveFilterIndicator(); });
  if (document.fonts) document.fonts.ready.then(() => { setupMarquee(); moveFilterIndicator(); placeNavInd(activeLink); sizeWorks(); });
  let rT;
  addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => { setupMarquee(); sizeWorks(); moveFilterIndicator(); placeNavInd(activeLink); }, 150); });
})();
