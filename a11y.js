/* =========================================================
   תפריט נגישות – נטען בכל עמודי האתר.
   ההגדרות נשמרות בדפדפן של הגולש ומוחלות מיד בטעינה.
   ========================================================= */
(() => {
  "use strict";
  const KEY = "ok-a11y";
  const root = document.documentElement;
  const TOGGLES = [
    { id: "contrast", label: "ניגודיות גבוהה", icon: "◐" },
    { id: "links",    label: "הדגשת קישורים",  icon: "🔗" },
    { id: "font",     label: "גופן קריא",      icon: "Aa" },
    { id: "still",    label: "עצירת אנימציות", icon: "⏸" },
    { id: "cursor",   label: "סמן עכבר רגיל",  icon: "➚" },
  ];

  let state = {};
  try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { state = {}; }

  function apply() {
    root.classList.remove("a11y-text-1", "a11y-text-2");
    if (state.text) root.classList.add("a11y-text-" + state.text);
    TOGGLES.forEach((t) => root.classList.toggle("a11y-" + t.id, !!state[t.id]));
  }
  apply(); // runs before the page paints, so saved settings never flash

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
    apply();
    sync();
    dispatchEvent(new CustomEvent("a11y:change"));
  }

  let btn, panel;
  const textLabel = () => ["הגדלת טקסט", "טקסט גדול", "טקסט גדול מאוד"][state.text || 0];

  function sync() {
    if (!panel) return;
    panel.querySelectorAll("[data-a11y]").forEach((b) => {
      const k = b.dataset.a11y;
      const on = k === "text" ? !!state.text : !!state[k];
      b.setAttribute("aria-pressed", on);
      if (k === "text") b.querySelector("span").textContent = textLabel();
    });
  }

  function build() {
    btn = document.createElement("button");
    btn.className = "a11y-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "תפריט נגישות");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "a11yPanel");
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4" r="2.1" fill="currentColor"/><path d="M4 8.6c2.7.8 5.3 1.2 8 1.2s5.3-.4 8-1.2M12 9.8v5.2m0 0-3.2 6M12 15l3.2 6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    panel = document.createElement("div");
    panel.className = "a11y-panel";
    panel.id = "a11yPanel";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "התאמות נגישות");
    const statement = document.querySelector('meta[name="a11y-statement"]')?.content || "accessibility.html";
    panel.innerHTML = `
      <h2>התאמות נגישות</h2>
      <div class="a11y-grid">
        <button type="button" class="a11y-opt" data-a11y="text" aria-pressed="false"><b aria-hidden="true">A+</b><span>${textLabel()}</span></button>
        ${TOGGLES.map((t) => `<button type="button" class="a11y-opt" data-a11y="${t.id}" aria-pressed="false"><b aria-hidden="true">${t.icon}</b><span>${t.label}</span></button>`).join("")}
      </div>
      <div class="a11y-foot">
        <a href="${statement}">הצהרת נגישות</a>
        <button type="button" data-a11y-reset>איפוס הגדרות</button>
      </div>`;

    document.body.append(btn, panel);
    sync();

    btn.addEventListener("click", () => (panel.hidden ? open() : close()));
    panel.addEventListener("click", (e) => {
      const opt = e.target.closest("[data-a11y]");
      if (opt) {
        const k = opt.dataset.a11y;
        if (k === "text") state.text = ((state.text || 0) + 1) % 3;
        else state[k] = !state[k];
        save();
      }
      if (e.target.closest("[data-a11y-reset]")) { state = {}; save(); }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !panel.hidden) { e.stopPropagation(); close(); btn.focus(); }
    }, true);
    document.addEventListener("click", (e) => {
      if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) close();
    });
  }

  function open() {
    panel.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    panel.querySelector(".a11y-opt").focus();
  }
  function close() {
    panel.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
