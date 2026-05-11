/* ============================================================
   OPERATION PRIME — CORE APPLICATION JAVASCRIPT
   Joseph | Start: May 11, 2026
   ============================================================ */

const OP = {
  startDate: new Date('2026-05-11'),
  userName: 'Joseph',
  targetWeight: 172.5,
  startWeight: 190.5,

  /* ── Day Calculator ── */
  getDayNumber() {
    const today = new Date();
    const diff = Math.floor((today - this.startDate) / 86400000);
    return Math.max(1, diff + 1);
  },

  getPhase() {
    const day = this.getDayNumber();
    if (day <= 30)  return { num: 1, name: 'Foundation & Rehab', weeks: 'Weeks 1–4' };
    if (day <= 60)  return { num: 1, name: 'Build & Activate', weeks: 'Weeks 5–8' };
    if (day <= 90)  return { num: 1, name: 'Strength Foundation', weeks: 'Weeks 9–12' };
    if (day <= 180) return { num: 2, name: 'Athletic Development', weeks: 'Months 4–6' };
    if (day <= 270) return { num: 3, name: 'Peak Performance', weeks: 'Months 7–9' };
    return { num: 4, name: 'Elite Integration', weeks: 'Months 10–12' };
  },

  getWeekNumber() {
    return Math.ceil(this.getDayNumber() / 7);
  },

  formatDate(d) {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  },

  getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  },

  /* ── LocalStorage Helpers ── */
  store: {
    get(key, fallback = null) {
      try { const v = localStorage.getItem('op_' + key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('op_' + key, JSON.stringify(value)); } catch {}
    }
  },

  /* ── Habits System ── */
  HABITS: [
    // Morning (category, id, label, points, icon)
    { cat: 'Morning', id: 'wake_early',    label: 'Wake by 6:30 AM',               pts: 5,  icon: '🌅' },
    { cat: 'Morning', id: 'morning_water', label: '500ml water on wake',            pts: 5,  icon: '💧' },
    { cat: 'Morning', id: 'mobility_am',   label: '10-min morning mobility',        pts: 10, icon: '🧘' },
    { cat: 'Morning', id: 'cold_water',    label: 'Cold water face splash / shower', pts: 5,  icon: '🚿' },
    // Nutrition
    { cat: 'Nutrition', id: 'if_window',   label: 'Maintained IF window (16:8)',    pts: 10, icon: '⏰' },
    { cat: 'Nutrition', id: 'protein_hit', label: 'Hit protein target (175g+)',     pts: 15, icon: '🥩' },
    { cat: 'Nutrition', id: 'no_gluten',   label: 'Gluten-free all day',            pts: 5,  icon: '✅' },
    { cat: 'Nutrition', id: 'veggies',     label: '3+ servings vegetables',         pts: 5,  icon: '🥦' },
    { cat: 'Nutrition', id: 'hydration',   label: '3L+ water total',               pts: 10, icon: '🫙' },
    // Training
    { cat: 'Training', id: 'workout',      label: 'Completed today\'s workout',     pts: 20, icon: '💪' },
    { cat: 'Training', id: 'mcgill',       label: 'McGill Big 3 done',             pts: 10, icon: '🦴' },
    { cat: 'Training', id: 'steps',        label: '8,000+ steps',                  pts: 10, icon: '🚶' },
    { cat: 'Training', id: 'zone2',        label: 'Zone 2 cardio (20+ min)',        pts: 10, icon: '❤️' },
    // Desk / Posture
    { cat: 'Posture',  id: 'desk_breaks',  label: 'Desk break every 45 min',       pts: 10, icon: '🖥️' },
    { cat: 'Posture',  id: 'chin_tucks',   label: 'Chin tucks (3×10 done)',        pts: 5,  icon: '🎯' },
    { cat: 'Posture',  id: 'standing',     label: '2+ hrs standing at desk',       pts: 5,  icon: '🧍' },
    // Recovery
    { cat: 'Recovery', id: 'mobility_pm',  label: 'Evening mobility routine',      pts: 10, icon: '🌙' },
    { cat: 'Recovery', id: 'sleep_8',      label: 'In bed by 10:30 PM',            pts: 10, icon: '😴' },
    { cat: 'Recovery', id: 'no_alcohol',   label: 'No alcohol',                    pts: 5,  icon: '🚫' },
    { cat: 'Recovery', id: 'supplements',  label: 'Supplements taken',             pts: 5,  icon: '💊' },
  ],

  getHabitsForDate(dateKey) {
    return this.store.get('habits_' + dateKey, {});
  },

  toggleHabit(dateKey, habitId) {
    const habits = this.getHabitsForDate(dateKey);
    habits[habitId] = !habits[habitId];
    this.store.set('habits_' + dateKey, habits);
    return habits[habitId];
  },

  getHabitScore(dateKey) {
    const habits = this.getHabitsForDate(dateKey);
    const maxPts = this.HABITS.reduce((s, h) => s + h.pts, 0);
    const earned = this.HABITS.filter(h => habits[h.id]).reduce((s, h) => s + h.pts, 0);
    return { earned, max: maxPts, pct: Math.round((earned / maxPts) * 100) };
  },

  getStreak() {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const score = this.getHabitScore(key);
      if (score.pct >= 50) { streak++; } else { break; }
    }
    return streak;
  },

  /* ── Progress Tracker ── */
  addMeasurement(data) {
    const entries = this.store.get('measurements', []);
    entries.push({ ...data, date: this.getTodayKey(), ts: Date.now() });
    this.store.set('measurements', entries);
  },

  getMeasurements() {
    return this.store.get('measurements', []);
  },

  getLatestMeasurement() {
    const m = this.getMeasurements();
    return m.length ? m[m.length - 1] : null;
  },

  /* ── Workout Logger ── */
  logWorkout(dateKey, data) {
    const log = this.store.get('workouts', {});
    log[dateKey] = { ...data, ts: Date.now() };
    this.store.set('workouts', log);
  },

  isWorkoutDone(dateKey) {
    const log = this.store.get('workouts', {});
    return !!log[dateKey];
  },

  /* ── UI Utilities ── */
  updateDayBadges() {
    const day = this.getDayNumber();
    const phase = this.getPhase();
    document.querySelectorAll('[data-day-number]').forEach(el => el.textContent = `Day ${day}`);
    document.querySelectorAll('[data-phase-name]').forEach(el => el.textContent = phase.name);
    document.querySelectorAll('[data-week-number]').forEach(el => el.textContent = `Week ${this.getWeekNumber()}`);
  },

  /* ── Sidebar / Nav ── */
  initNav() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('navOverlay');

    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay?.classList.toggle('show');
      });
      overlay?.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
      });
    }

    // Active nav link
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href')?.split('/').pop();
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  },

  /* ── Accordion ── */
  initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const acc = header.closest('.accordion');
        acc.classList.toggle('open');
      });
    });
  },

  /* ── Tabs ── */
  initTabs() {
    document.querySelectorAll('.tabs').forEach(tabGroup => {
      tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;
          const container = tabGroup.closest('[data-tabs-container]') || document;
          tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          container.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === target);
          });
        });
      });
    });
  },
    /* ── Toast (keep) ── */

    /* ── Accordion with ID ── */
    initAccordions(id) {
      const root = id ? document.getElementById(id) : document;
      if (!root) return;
      root.querySelectorAll('.accordion-item .accordion-header').forEach(header => {
        header.addEventListener('click', () => {
          const item = header.closest('.accordion-item');
          item.classList.toggle('open');
          const icon = header.querySelector('.accordion-icon');
          if (icon) icon.textContent = item.classList.contains('open') ? '▲' : '▼';
        });
      });
    },

    /* ── Tabs with ID ── */
    initTabs(tabsId, panelClass) {
      const tabsEl = tabsId ? document.getElementById(tabsId) : null;
      if (tabsEl) {
        tabsEl.querySelectorAll('.tab').forEach(btn => {
          btn.addEventListener('click', () => {
            tabsEl.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const target = btn.dataset.tab;
            document.querySelectorAll('.' + (panelClass || 'tab-panel')).forEach(p => {
              p.classList.toggle('active', p.id === 'panel-' + target);
            });
          });
        });
        return;
      }
      // fallback: legacy
      document.querySelectorAll('.tabs').forEach(tabGroup => {
        tabGroup.querySelectorAll('.tab').forEach(btn => {
          btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            tabGroup.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-panel').forEach(panel => {
              panel.classList.toggle('active', panel.id === 'panel-' + target);
            });
          });
        });
      });
    },
  /* ── Toast ── */
  toast(message, type = 'success') {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</span> ${message}`;
    t.style.cssText = `
      position:fixed; bottom:24px; right:24px; z-index:999;
      background:var(--bg-card); border:1px solid var(--border);
      padding:12px 20px; border-radius:var(--radius); box-shadow:var(--shadow);
      display:flex; gap:10px; align-items:center; font-size:.875rem;
      animation: slideIn .3s ease; max-width:320px;
    `;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  },

  /* ── Habit Renderer ── */
  renderHabits(containerId, dateKey) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const state = this.getHabitsForDate(dateKey);
    const categories = [...new Set(this.HABITS.map(h => h.cat))];

    container.innerHTML = categories.map(cat => {
      const habits = this.HABITS.filter(h => h.cat === cat);
      return `
        <div class="mb-16">
          <div class="label mb-8">${cat}</div>
          ${habits.map(h => `
            <div class="habit-item ${state[h.id] ? 'completed' : ''}" 
                 onclick="OP.toggleHabitUI('${containerId}', '${dateKey}', '${h.id}', this)">
              <div class="habit-checkbox">${state[h.id] ? '✓' : ''}</div>
              <span class="habit-label">${h.icon} ${h.label}</span>
              <span class="habit-points">+${h.pts}pts</span>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');

    this.updateHabitScore(dateKey);
  },

  toggleHabitUI(containerId, dateKey, habitId, el) {
    const done = this.toggleHabit(dateKey, habitId);
    el.classList.toggle('completed', done);
    el.querySelector('.habit-checkbox').textContent = done ? '✓' : '';
    if (done) this.toast('Habit logged! 🔥');
    this.updateHabitScore(dateKey);
  },

  updateHabitScore(dateKey) {
    const score = this.getHabitScore(dateKey);
    document.querySelectorAll('[data-habit-score]').forEach(el => {
      el.textContent = `${score.earned}/${score.max} pts`;
    });
    document.querySelectorAll('[data-habit-pct]').forEach(el => {
      el.textContent = `${score.pct}%`;
    });
    document.querySelectorAll('[data-habit-bar]').forEach(bar => {
      bar.style.width = score.pct + '%';
    });
  },

  /* ── Weight Chart (canvas-free sparkline) ── */
  renderWeightChart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const entries = this.getMeasurements().slice(-20);
    if (!entries.length) { container.innerHTML = '<p class="text-muted text-sm text-center">Log measurements to see chart</p>'; return; }

    const weights = entries.map(e => parseFloat(e.weight)).filter(Boolean);
    if (!weights.length) return;
    const min = Math.min(...weights) - 2;
    const max = Math.max(...weights) + 2;
    const range = max - min;

    container.innerHTML = `
      <div class="chart-placeholder">
        ${weights.map((w, i) => {
          const h = Math.max(8, ((w - min) / range) * 140);
          const isToday = i === weights.length - 1;
          return `<div class="chart-bar ${isToday ? 'today' : ''}" style="height:${h}px" title="${w} lbs"></div>`;
        }).join('')}
      </div>
      <div class="flex justify-between mt-8 text-xs text-muted">
        <span>${entries[0]?.date || ''}</span>
        <span>${entries[entries.length-1]?.date || ''}</span>
      </div>
    `;
  },

  /* ── Today's Workout Lookup ── */
  SCHEDULE: {
    // day-of-week: 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
    // For Phase 1 (Days 1-90)
    0: { type: 'rest',     label: 'Rest & Prep',        desc: 'Meal prep, light walk, weekly review', icon: '😴' },
    1: { type: 'lower',    label: 'Lower Body + Rehab', desc: 'Glutes, hips, ankle rehab, McGill Big 3', icon: '🦵' },
    2: { type: 'upper',    label: 'Upper Body + Posture', desc: 'Shoulders, back, neck posture protocol', icon: '💪' },
    3: { type: 'cardio',   label: 'Zone 2 + Mobility',  desc: '40-min incline walk or row + full mobility', icon: '❤️' },
    4: { type: 'lower',    label: 'Lower Body + Core',  desc: 'Squat pattern, core stability, hip work', icon: '🦵' },
    5: { type: 'upper',    label: 'Push/Pull + Carry',  desc: 'Press, row, farmer carry, shoulder health', icon: '💪' },
    6: { type: 'active',   label: 'Active Recovery',    desc: '30-min walk, foam roll, stretch session', icon: '🧘' },
  },

  getTodaySchedule() {
    const dow = new Date().getDay();
    return this.SCHEDULE[dow];
  },

  /* ── Init ── */
  init() {
    this.initNav();
    this.initAccordions();
    this.initTabs();
    this.updateDayBadges();

    // Update today's date displays
    const today = new Date();
    document.querySelectorAll('[data-today-date]').forEach(el => {
      el.textContent = this.formatDate(today);
    });

    // Streak
    const streak = this.getStreak();
    document.querySelectorAll('[data-streak]').forEach(el => el.textContent = streak);

    // Today's workout card
    const sched = this.getTodaySchedule();
    document.querySelectorAll('[data-today-workout]').forEach(el => {
      el.innerHTML = `${sched.icon} ${sched.label}`;
    });
    document.querySelectorAll('[data-today-workout-desc]').forEach(el => {
      el.textContent = sched.desc;
    });

    // Habits
    const dateKey = this.getTodayKey();
    if (document.getElementById('habitContainer')) {
      this.renderHabits('habitContainer', dateKey);
    }

    // Charts
    this.renderWeightChart('weightChart');

    // Measurement form
    const mForm = document.getElementById('measureForm');
    if (mForm) {
      mForm.addEventListener('submit', e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(mForm));
        this.addMeasurement(data);
        this.toast('Measurement saved! 📊');
        mForm.reset();
        this.renderWeightChart('weightChart');
        this.renderMeasurementLog();
      });
    }

    this.renderMeasurementLog();
  },

  renderMeasurementLog() {
    const container = document.getElementById('measureLog');
    if (!container) return;
    const entries = this.getMeasurements().slice(-10).reverse();
    if (!entries.length) { container.innerHTML = '<p class="text-muted text-sm">No measurements logged yet.</p>'; return; }
    container.innerHTML = `
      <table class="workout-table">
        <thead><tr><th>Date</th><th>Weight</th><th>Waist</th><th>Notes</th></tr></thead>
        <tbody>
          ${entries.map(e => `
            <tr>
              <td>${e.date}</td>
              <td><strong>${e.weight || '—'} lbs</strong></td>
              <td>${e.waist || '—'} in</td>
              <td class="text-muted text-sm">${e.notes || '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  },

  /* ── Calendar ── */
  renderCalendar(containerId, year, month) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const d = new Date(year, month, 1);
    const today = new Date();
    const days = [];
    const startDow = d.getDay();

    for (let i = 0; i < startDow; i++) days.push(null);
    while (d.getMonth() === month) {
      days.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }

    const headers = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    container.innerHTML = `
      <div class="flex justify-between items-center mb-16">
        <button class="btn btn-secondary btn-sm" onclick="OP.calNav(-1)">← Prev</button>
        <h3 style="font-size:1rem">${monthName}</h3>
        <button class="btn btn-secondary btn-sm" onclick="OP.calNav(1)">Next →</button>
      </div>
      <div class="calendar-grid">
        ${headers.map(h => `<div class="cal-day-header">${h}</div>`).join('')}
        ${days.map(day => {
          if (!day) return '<div class="cal-day empty"></div>';
          const isToday = day.toDateString() === today.toDateString();
          const key = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
          const score = this.getHabitScore(key);
          const hasWorkout = this.isWorkoutDone(key);
          const dow = day.getDay();
          const sched = this.SCHEDULE[dow];
          const isRest = sched?.type === 'rest';
          let cls = 'cal-day';
          if (isToday) cls += ' today';
          else if (score.pct >= 50) cls += ' completed';
          else if (isRest) cls += ' rest';
          if (hasWorkout || score.pct >= 50) cls += ' has-workout';
          return `<div class="${cls}" title="${sched?.label || ''}">${day.getDate()}</div>`;
        }).join('')}
      </div>
    `;
  },

  _calYear: new Date().getFullYear(),
  _calMonth: new Date().getMonth(),

  calNav(dir) {
    this._calMonth += dir;
    if (this._calMonth > 11) { this._calMonth = 0; this._calYear++; }
    if (this._calMonth < 0)  { this._calMonth = 11; this._calYear--; }
    this.renderCalendar('calendarContainer', this._calYear, this._calMonth);
  },
};

// ── Boot ──
document.addEventListener('DOMContentLoaded', () => OP.init());
// ── Post-definition patches ──
// Add .name alias for each habit (habits.html uses h.name)
OP.HABITS = OP.HABITS.map(h => ({ ...h, name: h.label || h.name, desc: h.desc || '' }));

// Override renderCalendar to support the calendar.html page (container=calGrid, update labels)
OP.renderCalendar = function(containerId, year, month) {
  const cid = containerId || 'calGrid';
  const container = document.getElementById(cid);
  if (!container) return;
  const _year = year !== undefined ? year : this._calYear;
  const _month = month !== undefined ? month : this._calMonth;
  const labelEl = document.getElementById('calMonthLabel');
  const phaseEl = document.getElementById('calPhaseLabel');
  if (labelEl) labelEl.textContent = new Date(_year, _month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date();
  const d = new Date(_year, _month, 1);
  const days = [];
  const startDow = d.getDay();
  for (let i = 0; i < startDow; i++) days.push(null);
  while (d.getMonth() === _month) { days.push(new Date(d)); d.setDate(d.getDate() + 1); }
  const headers = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  container.innerHTML = `<div class="calendar-grid">
    ${headers.map(h => `<div class="cal-day-header">${h}</div>`).join('')}
    ${days.map(day => {
      if (!day) return '<div class="cal-day empty"></div>';
      const isToday = day.toDateString() === today.toDateString();
      const key = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
      const score = OP.getHabitScore(key);
      const hasWorkout = OP.isWorkoutDone(key);
      const dow = day.getDay();
      const sched = OP.SCHEDULE[dow];
      let cls = 'cal-day';
      if (isToday) cls += ' today';
      else if (score.pct >= 80) cls += ' completed';
      else if (score.pct >= 50) cls += ' has-workout';
      else if (sched?.type === 'rest') cls += ' rest';
      return '<div class="' + cls + '" title="' + (sched?.label || '') + '">' + day.getDate() + '</div>';
    }).join('')}
  </div>`;
  if (phaseEl) { const p = OP.getPhase(); phaseEl.textContent = 'Phase ' + p.num + ': ' + p.name; }
};

OP.calNav = function(dir) {
  OP._calMonth += dir;
  if (OP._calMonth > 11) { OP._calMonth = 0; OP._calYear++; }
  if (OP._calMonth < 0)  { OP._calMonth = 11; OP._calYear--; }
  OP.renderCalendar('calGrid', OP._calYear, OP._calMonth);
};
