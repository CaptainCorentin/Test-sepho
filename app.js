// Renfo Tracker — logique de l'application (vanilla JS, persistance localStorage).

const STORAGE_KEY = "renfo-tracker-v1";

const Store = {
  load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = {
        program: DEFAULT_PROGRAM,
        history: [], // { date: 'YYYY-MM-DD', dayId, dayName, doneExerciseIds: [] }
        progress: {}, // { [dateISO]: { [dayId]: [exerciseIds checked] } }
      };
      this.save(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Corrupted storage, resetting.", e);
      return this.load();
    }
  },
  save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
};

let state = Store.load();

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---------------- Tabs ---------------- */

document.getElementById("tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab-btn");
  if (!btn) return;
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(`panel-${btn.dataset.tab}`).classList.add("active");
  if (btn.dataset.tab === "program") renderProgram();
  if (btn.dataset.tab === "history") renderHistory();
  if (btn.dataset.tab === "ideas") renderIdeas();
});

/* ---------------- Today ---------------- */

let selectedDayId = null;

function getProgressFor(dateISO, dayId) {
  return (state.progress[dateISO] && state.progress[dateISO][dayId]) || [];
}

function setProgressFor(dateISO, dayId, doneIds) {
  if (!state.progress[dateISO]) state.progress[dateISO] = {};
  state.progress[dateISO][dayId] = doneIds;
  Store.save(state);
}

function renderToday() {
  const card = document.getElementById("today-session-card");
  const program = state.program;

  if (program.length === 0) {
    card.innerHTML = `
      <div class="empty-state">
        <span class="emoji">🏋️</span>
        <p>Aucun jour dans ton programme pour l'instant.<br/>Va dans l'onglet <b>Programme</b> pour créer ta première séance.</p>
      </div>`;
    return;
  }

  if (!selectedDayId || !program.find((d) => d.id === selectedDayId)) {
    selectedDayId = program[0].id;
  }

  const date = todayISO();
  const dayPicker = program
    .map((d) => {
      const done = getProgressFor(date, d.id);
      const isFullyDone = done.length > 0 && done.length === d.exercises.length;
      return `<button class="day-pill ${d.id === selectedDayId ? "active" : ""} ${isFullyDone ? "done-today" : ""}" data-day="${d.id}">${escapeHtml(d.name)}${isFullyDone ? " ✅" : ""}</button>`;
    })
    .join("");

  const day = program.find((d) => d.id === selectedDayId);
  const doneIds = getProgressFor(date, day.id);
  const total = day.exercises.length;
  const doneCount = doneIds.length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  const rows = day.exercises
    .map((ex) => {
      const checked = doneIds.includes(ex.id);
      return `
        <div class="exercise-row">
          <button class="exercise-check ${checked ? "checked" : ""}" data-ex="${ex.id}">${checked ? "✓" : ""}</button>
          <div class="exercise-info">
            <div class="exercise-name ${checked ? "done" : ""}">${escapeHtml(ex.name)}</div>
            <div class="exercise-target">${escapeHtml(ex.target || "")}</div>
          </div>
        </div>`;
    })
    .join("");

  card.innerHTML = `
    <div class="day-picker">${dayPicker}</div>
    <div class="session-head">
      <div>
        <h2 class="session-title">${escapeHtml(day.name)}</h2>
        <p class="session-date">${formatDateFr(date)}</p>
      </div>
    </div>
    <div class="progress-bar"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
    <div>${total ? rows : '<p style="color:var(--text-dim)">Aucun exercice dans ce jour.</p>'}</div>
    <div class="session-actions">
      <button class="btn btn-primary" id="complete-session-btn" ${doneCount === 0 ? "disabled" : ""}>Valider la séance (${doneCount}/${total})</button>
      <button class="btn btn-ghost" id="reset-session-btn">Réinitialiser</button>
    </div>
  `;

  card.querySelectorAll(".day-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      selectedDayId = pill.dataset.day;
      renderToday();
    });
  });

  card.querySelectorAll(".exercise-check").forEach((btn) => {
    btn.addEventListener("click", () => {
      const exId = btn.dataset.ex;
      let ids = getProgressFor(date, day.id);
      ids = ids.includes(exId) ? ids.filter((i) => i !== exId) : [...ids, exId];
      setProgressFor(date, day.id, ids);
      renderToday();
    });
  });

  const completeBtn = document.getElementById("complete-session-btn");
  if (completeBtn) {
    completeBtn.addEventListener("click", () => {
      const already = state.history.find((h) => h.date === date && h.dayId === day.id);
      if (!already) {
        state.history.unshift({
          date,
          dayId: day.id,
          dayName: day.name,
          doneCount: doneIds.length,
          total,
        });
      } else {
        already.doneCount = doneIds.length;
        already.total = total;
      }
      Store.save(state);
      showToast("Séance validée 💪 Bien joué !");
      renderStreak();
      renderToday();
    });
  }

  document.getElementById("reset-session-btn").addEventListener("click", () => {
    setProgressFor(date, day.id, []);
    renderToday();
  });
}

function formatDateFr(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function renderStreak() {
  const count = state.history.length;
  document.getElementById("streak-count").textContent = count;
}

/* ---------------- Program ---------------- */

function renderProgram() {
  const container = document.getElementById("program-days");
  if (state.program.length === 0) {
    container.innerHTML = `<div class="empty-state"><span class="emoji">📋</span><p>Aucun jour pour l'instant. Clique sur "+ Ajouter un jour" pour commencer.</p></div>`;
    return;
  }
  container.innerHTML = state.program
    .map(
      (day) => `
    <div class="program-day-card" data-day-id="${day.id}">
      <div class="program-day-head">
        <h3>${escapeHtml(day.name)}</h3>
        <div class="day-card-actions">
          <button class="icon-btn" data-action="edit-day" title="Renommer">✏️</button>
          <button class="icon-btn" data-action="delete-day" title="Supprimer le jour">🗑️</button>
        </div>
      </div>
      <ul class="program-ex-list">
        ${day.exercises
          .map(
            (ex) => `
          <li>
            <span>${escapeHtml(ex.name)}</span>
            <span class="ex-target">
              ${escapeHtml(ex.target || "")}
              <button class="icon-btn" data-action="delete-ex" data-ex-id="${ex.id}" title="Retirer">✕</button>
            </span>
          </li>`
          )
          .join("")}
      </ul>
      <button class="btn btn-sm" data-action="add-ex">+ Exercice</button>
    </div>`
    )
    .join("");

  container.querySelectorAll(".program-day-card").forEach((card) => {
    const dayId = card.dataset.dayId;
    const day = state.program.find((d) => d.id === dayId);

    card.querySelector('[data-action="edit-day"]').addEventListener("click", () => openEditDayModal(day));
    card.querySelector('[data-action="delete-day"]').addEventListener("click", () => {
      if (confirm(`Supprimer "${day.name}" du programme ?`)) {
        state.program = state.program.filter((d) => d.id !== dayId);
        Store.save(state);
        renderProgram();
        renderToday();
      }
    });
    card.querySelector('[data-action="add-ex"]').addEventListener("click", () => openAddExerciseModal(day));
    card.querySelectorAll('[data-action="delete-ex"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        day.exercises = day.exercises.filter((ex) => ex.id !== btn.dataset.exId);
        Store.save(state);
        renderProgram();
        renderToday();
      });
    });
  });
}

document.getElementById("add-day-btn").addEventListener("click", openAddDayModal);

/* ---------------- Modal helpers ---------------- */

const overlay = document.getElementById("modal-overlay");
const modalContent = document.getElementById("modal-content");

function openModal(html) {
  modalContent.innerHTML = html;
  overlay.classList.add("open");
}
function closeModal() {
  overlay.classList.remove("open");
  modalContent.innerHTML = "";
}
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

function openAddDayModal() {
  openModal(`
    <h3>Nouveau jour de séance</h3>
    <div class="form-field">
      <label>Nom du jour (ex: Push, Legs, Full Body...)</label>
      <input type="text" id="new-day-name" placeholder="Ex: Push (Pecs / Épaules)" />
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="cancel-modal">Annuler</button>
      <button class="btn btn-primary" id="save-day">Créer</button>
    </div>
  `);
  document.getElementById("cancel-modal").addEventListener("click", closeModal);
  document.getElementById("save-day").addEventListener("click", () => {
    const name = document.getElementById("new-day-name").value.trim();
    if (!name) return showToast("Donne un nom à ce jour.");
    state.program.push({ id: uid("day"), name, exercises: [] });
    Store.save(state);
    closeModal();
    renderProgram();
    renderToday();
    showToast("Jour ajouté !");
  });
}

function openEditDayModal(day) {
  openModal(`
    <h3>Renommer le jour</h3>
    <div class="form-field">
      <label>Nom du jour</label>
      <input type="text" id="edit-day-name" value="${escapeHtml(day.name)}" />
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="cancel-modal">Annuler</button>
      <button class="btn btn-primary" id="save-day">Enregistrer</button>
    </div>
  `);
  document.getElementById("cancel-modal").addEventListener("click", closeModal);
  document.getElementById("save-day").addEventListener("click", () => {
    const name = document.getElementById("edit-day-name").value.trim();
    if (!name) return showToast("Le nom ne peut pas être vide.");
    day.name = name;
    Store.save(state);
    closeModal();
    renderProgram();
    renderToday();
  });
}

function openAddExerciseModal(day) {
  openModal(`
    <h3>Ajouter un exercice</h3>
    <div class="form-field">
      <label>Nom de l'exercice</label>
      <input type="text" id="new-ex-name" placeholder="Ex: Développé couché barre" />
    </div>
    <div class="form-field">
      <label>Objectif (séries x reps)</label>
      <input type="text" id="new-ex-target" placeholder="Ex: 4 x 10" />
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="cancel-modal">Annuler</button>
      <button class="btn btn-primary" id="save-ex">Ajouter</button>
    </div>
  `);
  document.getElementById("cancel-modal").addEventListener("click", closeModal);
  document.getElementById("save-ex").addEventListener("click", () => {
    const name = document.getElementById("new-ex-name").value.trim();
    const target = document.getElementById("new-ex-target").value.trim();
    if (!name) return showToast("Donne un nom à l'exercice.");
    day.exercises.push({ id: uid("ex"), name, target });
    Store.save(state);
    closeModal();
    renderProgram();
    renderToday();
    showToast("Exercice ajouté !");
  });
}

/* ---------------- History ---------------- */

function renderHistory() {
  const list = document.getElementById("history-list");
  const stats = document.getElementById("history-stats");

  const totalSessions = state.history.length;
  const uniqueDays = new Set(state.history.map((h) => h.date)).size;
  const last7 = state.history.filter((h) => {
    const d = new Date(h.date + "T00:00:00");
    const diff = (Date.now() - d.getTime()) / 86400000;
    return diff <= 7;
  }).length;

  stats.innerHTML = `
    <div class="stat-pill"><b>${totalSessions}</b>séances totales</div>
    <div class="stat-pill"><b>${uniqueDays}</b>jours actifs</div>
    <div class="stat-pill"><b>${last7}</b>sur 7 derniers jours</div>
  `;

  if (totalSessions === 0) {
    list.innerHTML = `<div class="empty-state"><span class="emoji">🕐</span><p>Pas encore de séance validée. Coche tes exercices dans l'onglet "Aujourd'hui" puis valide la séance !</p></div>`;
    return;
  }

  list.innerHTML = state.history
    .map(
      (h) => `
    <div class="history-item">
      <div>
        <div class="hi-date">${formatDateFr(h.date)}</div>
        <div class="hi-name">${escapeHtml(h.dayName)}</div>
      </div>
      <div class="hi-count">${h.doneCount}/${h.total} exos ✅</div>
    </div>`
    )
    .join("");
}

/* ---------------- Ideas ---------------- */

function renderIdeas() {
  const container = document.getElementById("ideas-groups");

  const sessionIdeasHtml = `
    <div class="session-ideas">
      ${SESSION_IDEAS_TEXT.map(
        (s) => `
        <div class="session-idea-card">
          <h4>${escapeHtml(s.title)}</h4>
          <p>${escapeHtml(s.detail)}</p>
        </div>`
      ).join("")}
    </div>
  `;

  const groupsHtml = EXERCISE_IDEAS.map(
    (g) => `
    <div class="idea-group-card" data-group="${escapeHtml(g.group.toLowerCase())}">
      <h3>${g.icon} ${escapeHtml(g.group)}</h3>
      <div class="idea-chip-list">
        ${g.items.map((item) => `<span class="idea-chip" data-text="${escapeHtml(item.toLowerCase())}">${escapeHtml(item)}</span>`).join("")}
      </div>
    </div>`
  ).join("");

  container.innerHTML = sessionIdeasHtml + `<div class="ideas-groups" style="grid-column:1/-1; display:contents">${groupsHtml}</div>`;
}

document.getElementById("ideas-search").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll(".idea-group-card").forEach((card) => {
    const groupMatch = card.dataset.group.includes(q);
    let anyVisible = groupMatch;
    card.querySelectorAll(".idea-chip").forEach((chip) => {
      const match = groupMatch || chip.dataset.text.includes(q);
      chip.classList.toggle("hidden", !match);
      if (match) anyVisible = true;
    });
    card.style.display = anyVisible || q === "" ? "" : "none";
  });
});

/* ---------------- Init ---------------- */

renderToday();
renderStreak();
