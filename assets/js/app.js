/* =========================================================
   EventEase - Event Management System
   Functional front-end prototype (Local Storage)
   Demo login: admin / event123
   ========================================================= */

"use strict";

const STORAGE_KEY = "eventEaseData";
const SESSION_KEY = "eventEaseLoggedIn";
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "event123";

const defaultData = {
  events: [
    { id: 1, name: "Technology Innovation Summit", category: "Technology", date: "2026-12-15", venue: "Kuala Lumpur Convention Centre", attendees: 250, status: "Upcoming", capacity: 300 },
    { id: 2, name: "Creative Design Workshop", category: "Workshop", date: "2026-11-20", venue: "Petaling Jaya", attendees: 80, status: "Upcoming", capacity: 100 },
    { id: 3, name: "Business Networking Night", category: "Networking", date: "2026-10-10", venue: "Shah Alam", attendees: 120, status: "Completed", capacity: 150 },
    { id: 4, name: "Digital Marketing Conference", category: "Conference", date: "2026-09-18", venue: "Putrajaya", attendees: 180, status: "Completed", capacity: 220 },
    { id: 5, name: "Entrepreneurship Forum", category: "Business", date: "2026-12-28", venue: "Cyberjaya", attendees: 95, status: "Upcoming", capacity: 120 },
    { id: 6, name: "Photography Masterclass", category: "Workshop", date: "2026-08-12", venue: "Kuala Lumpur", attendees: 60, status: "Completed", capacity: 80 }
  ],
  participants: [
    { id: 1, name: "Sarah Johnson", email: "sarah@email.com", phone: "0123456789", date: "2026-10-20", status: "Active" },
    { id: 2, name: "Daniel Lee", email: "daniel@email.com", phone: "0134567890", date: "2026-10-22", status: "Active" },
    { id: 3, name: "Aisha Rahman", email: "aisha@email.com", phone: "0145678901", date: "2026-10-25", status: "Inactive" },
    { id: 4, name: "Adam Tan", email: "adam@email.com", phone: "0167890123", date: "2026-10-28", status: "Active" },
    { id: 5, name: "Nur Izzah", email: "izzah@email.com", phone: "0178901234", date: "2026-11-01", status: "Active" },
    { id: 6, name: "Amir Hakim", email: "amir@email.com", phone: "0189012345", date: "2026-11-03", status: "Active" },
    { id: 7, name: "Mei Ling", email: "mei@email.com", phone: "0190123456", date: "2026-11-04", status: "Active" },
    { id: 8, name: "Jason Wong", email: "jason@email.com", phone: "0112233445", date: "2026-11-05", status: "Active" }
  ],
  registrations: [
    { id: 1001, participant: "Sarah Johnson", event: "Technology Innovation Summit", date: "2026-11-01", ticket: "Standard", status: "Confirmed" },
    { id: 1002, participant: "Daniel Lee", event: "Creative Design Workshop", date: "2026-11-03", ticket: "VIP", status: "Pending" },
    { id: 1003, participant: "Aisha Rahman", event: "Business Networking Night", date: "2026-11-05", ticket: "Standard", status: "Confirmed" },
    { id: 1004, participant: "Adam Tan", event: "Digital Marketing Conference", date: "2026-11-06", ticket: "Early Bird", status: "Confirmed" },
    { id: 1005, participant: "Nur Izzah", event: "Technology Innovation Summit", date: "2026-11-07", ticket: "VIP", status: "Pending" }
  ]
};

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.events) && Array.isArray(saved.participants) && Array.isArray(saved.registrations)) {
      return saved;
    }
  } catch (error) {
    console.warn("Could not read saved EventEase data. Loading sample data instead:", error);
  }

  // First-time visitors and browsers with invalid saved data receive demo records.
  return JSON.parse(JSON.stringify(defaultData));
}
let appData = loadData();

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  } catch (error) {
    console.error("Unable to save EventEase data:", error);
    showToast("Browser storage is unavailable. Changes may not be saved.");
  }
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}
function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
}
function showToast(message) {
  const toastEl = document.getElementById("appToast");
  const messageEl = document.getElementById("toastMessage");
  if (toastEl && messageEl && window.bootstrap) {
    messageEl.textContent = message;
    bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2600 }).show();
  } else {
    const notice = document.createElement("div");
    notice.className = "alert alert-dark position-fixed top-0 end-0 m-3";
    notice.style.zIndex = "2000";
    notice.textContent = message;
    document.body.appendChild(notice);
    setTimeout(() => notice.remove(), 2500);
  }
}
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function statusBadge(status) {
  const cls = status === "Confirmed" || status === "Active" || status === "Completed" ? "success" :
    status === "Pending" || status === "Upcoming" || status === "Ongoing" ? "warning text-dark" : "secondary";
  return `<span class="badge bg-${cls}">${escapeHTML(status)}</span>`;
}

/* Authentication */
function showLogin() {
  document.getElementById("loginScreen")?.classList.remove("d-none");
  document.getElementById("appShell")?.classList.add("d-none");
}
function showApplication() {
  document.getElementById("loginScreen")?.classList.add("d-none");
  document.getElementById("appShell")?.classList.remove("d-none");
  showPage("dashboard");
}
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("username")?.value.trim();
  const password = document.getElementById("password")?.value;
  const alertBox = document.getElementById("loginAlert");
  const alertText = document.getElementById("loginAlertText");
  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "true");
    alertBox?.classList.add("d-none");
    showApplication();
    showToast("Welcome to EventEase!");
  } else {
    if (alertText) alertText.textContent = "Invalid username or password. Please try again.";
    alertBox?.classList.remove("d-none");
  }
}
function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  showLogin();
  document.getElementById("loginForm")?.reset();
  showToast("You have been logged out.");
}

/* Navigation */
function showPage(name) {
  document.querySelectorAll(".page-section").forEach(section => {
    section.classList.toggle("active", section.id === `page-${name}`);
  });
  document.querySelectorAll("[data-page]").forEach(link => {
    link.classList.toggle("active", link.dataset.page === name);
  });
  const pageNames = { dashboard:"Dashboard", events:"Event Management", participants:"Participants", registrations:"Registrations", calendar:"Calendar", notifications:"Notifications", analytics:"Analytics", settings:"Settings" };
  setText("breadcrumbCurrent", pageNames[name] || "Dashboard");
  closeSidebar();
  if (name === "dashboard") renderDashboard();
  if (name === "events") renderEvents();
  if (name === "participants") renderParticipants();
  if (name === "registrations") renderRegistrations();
  if (name === "analytics") renderAnalytics();
  if (name === "calendar") window.EventEasePages?.initCalendar();
  if (name === "notifications") window.EventEasePages?.initNotifications();
}
function openSidebar() {
  document.getElementById("sidebar")?.classList.add("open");
  document.getElementById("sidebarOverlay")?.classList.add("show");
}
function closeSidebar() {
  document.getElementById("sidebar")?.classList.remove("open");
  document.getElementById("sidebarOverlay")?.classList.remove("show");
}

/* Dashboard */
function renderDashboard() {
  setText("statEvents", appData.events.length);
  setText("statParticipants", appData.participants.length);
  setText("statRegistrations", appData.registrations.length);
  setText("statUpcoming", appData.events.filter(e => e.status === "Upcoming").length);
  setText("eventNavCount", appData.events.length);
  const rows = appData.events.slice().sort((a,b) => b.date.localeCompare(a.date)).slice(0,5);
  const body = document.getElementById("dashboardEvents");
  if (body) body.innerHTML = rows.map(e => `<tr>
    <td><strong>${escapeHTML(e.name)}</strong></td><td>${formatDate(e.date)}</td>
    <td>${escapeHTML(e.venue)}</td><td>${e.attendees}</td><td>${statusBadge(e.status)}</td>
  </tr>`).join("");
  const popular = document.getElementById("popularEvents");
  if (popular) {
    const ranking = appData.events.slice().sort((a,b) => b.attendees-a.attendees).slice(0,4);
    popular.innerHTML = ranking.map((e,i) => `<div class="popular-item">
      <div><strong>${i+1}. ${escapeHTML(e.name)}</strong><small>${escapeHTML(e.category)}</small></div>
      <span class="popular-number">${e.attendees}</span>
    </div>`).join("") || `<p class="muted small">No events available.</p>`;
  }
  renderDashboardChart();
}
function renderDashboardChart() {
  const canvas = document.getElementById("dashboardChart");
  if (!canvas || !window.Chart) return;
  if (window.eventEaseDashboardChart) window.eventEaseDashboardChart.destroy();
  window.eventEaseDashboardChart = new Chart(canvas, {
    type: "line",
    data: {
      labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      datasets: [{ label:"Registrations", data:[12,19,15,27,24,35,31,42,38,52,48,64], borderColor:"#6857e8", backgroundColor:"rgba(104,87,232,.12)", fill:true, tension:.38, pointRadius:3 }]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true, ticks:{ precision:0 } } } }
  });
}

/* Dynamic reusable modal forms */
function openRecordModal(type, record = null) {
  const form = document.getElementById("dataForm");
  const title = document.getElementById("dataModalTitle");
  const modalEl = document.getElementById("dataModal");
  if (!form || !modalEl || !window.bootstrap) return;
  const isEdit = Boolean(record);
  const value = key => escapeHTML(record?.[key] ?? "");
  const fields = {
    event: `
      <input type="hidden" name="id" value="${value("id")}">
      <label class="form-label">Event Name</label><input class="form-control mb-3" name="name" required value="${value("name")}" placeholder="Enter event name">
      <label class="form-label">Category</label><select class="form-select mb-3" name="category" required>${["Technology","Workshop","Networking","Conference","Business","Other"].map(x=>`<option ${record?.category===x?"selected":""}>${x}</option>`).join("")}</select>
      <label class="form-label">Date</label><input class="form-control mb-3" type="date" name="date" required value="${value("date")}">
      <label class="form-label">Location</label><input class="form-control mb-3" name="venue" required value="${value("venue")}" placeholder="Event location">
      <label class="form-label">Expected Participants</label><input class="form-control mb-3" type="number" min="0" name="attendees" value="${value("attendees") || 0}">
      <label class="form-label">Capacity</label><input class="form-control mb-3" type="number" min="1" name="capacity" value="${value("capacity") || 100}">
      <label class="form-label">Status</label><select class="form-select" name="status">${["Upcoming","Ongoing","Completed"].map(x=>`<option ${record?.status===x?"selected":""}>${x}</option>`).join("")}</select>`,
    participant: `
      <input type="hidden" name="id" value="${value("id")}">
      <label class="form-label">Full Name</label><input class="form-control mb-3" name="name" required value="${value("name")}">
      <label class="form-label">Email</label><input class="form-control mb-3" type="email" name="email" required value="${value("email")}">
      <label class="form-label">Phone Number</label><input class="form-control mb-3" name="phone" value="${value("phone")}">
      <label class="form-label">Registration Date</label><input class="form-control mb-3" type="date" name="date" value="${value("date")}">
      <label class="form-label">Status</label><select class="form-select" name="status">${["Active","Inactive"].map(x=>`<option ${record?.status===x?"selected":""}>${x}</option>`).join("")}</select>`,
    registration: `
      <input type="hidden" name="id" value="${value("id")}">
      <label class="form-label">Participant</label><select class="form-select mb-3" name="participant" required><option value="">Select participant</option>${appData.participants.map(p=>`<option ${record?.participant===p.name?"selected":""}>${escapeHTML(p.name)}</option>`).join("")}</select>
      <label class="form-label">Event</label><select class="form-select mb-3" name="event" required><option value="">Select event</option>${appData.events.map(e=>`<option ${record?.event===e.name?"selected":""}>${escapeHTML(e.name)}</option>`).join("")}</select>
      <label class="form-label">Registration Date</label><input class="form-control mb-3" type="date" name="date" required value="${value("date") || new Date().toISOString().slice(0,10)}">
      <label class="form-label">Ticket Type</label><select class="form-select mb-3" name="ticket">${["Standard","VIP","Early Bird"].map(x=>`<option ${record?.ticket===x?"selected":""}>${x}</option>`).join("")}</select>
      <label class="form-label">Status</label><select class="form-select" name="status">${["Confirmed","Pending"].map(x=>`<option ${record?.status===x?"selected":""}>${x}</option>`).join("")}</select>`
  };
  title.textContent = `${isEdit ? "Edit" : "Add"} ${type.charAt(0).toUpperCase()+type.slice(1)}`;
  form.dataset.type = type;
  form.innerHTML = fields[type];
  bootstrap.Modal.getOrCreateInstance(modalEl).show();
}
function saveModalRecord() {
  const form = document.getElementById("dataForm");
  if (!form || !form.reportValidity()) return;
  const type = form.dataset.type;
  const data = Object.fromEntries(new FormData(form).entries());
  const id = data.id ? Number(data.id) : Date.now();
  data.id = id;
  if (type === "event") {
    data.attendees = Number(data.attendees) || 0;
    data.capacity = Number(data.capacity) || 100;
    upsert(appData.events, data);
  } else if (type === "participant") {
    upsert(appData.participants, data);
  } else if (type === "registration") {
    upsert(appData.registrations, data);
  }
  saveData();
  bootstrap.Modal.getOrCreateInstance(document.getElementById("dataModal")).hide();
  form.reset();
  renderAll();
  showToast(`${type.charAt(0).toUpperCase()+type.slice(1)} saved successfully.`);
}
function upsert(list, item) {
  const index = list.findIndex(x => Number(x.id) === Number(item.id));
  if (index >= 0) list[index] = item; else list.push(item);
}
function deleteRecord(type, id) {
  if (!confirm("Are you sure you want to delete this record?")) return;
  const key = `${type}s`;
  appData[key] = appData[key].filter(item => Number(item.id) !== Number(id));
  saveData(); renderAll(); showToast("Record deleted.");
}

/* Event image helpers: thumbnails open the matching Google Images search. */
function eventImageDetails(event) {
  const name = (event.name || "").toLowerCase();
  const images = [
    { match: "technology innovation", photo: "photo-1519389950473-47ba0277781c", alt: "Technology team collaborating" },
    { match: "creative design", photo: "photo-1558655146-9f40138edfeb", alt: "Creative design workspace" },
    { match: "business networking", photo: "photo-1521737711867-e3b97375f902", alt: "Professional networking event" },
    { match: "digital marketing", photo: "photo-1460925895917-afdab827c52f", alt: "Digital marketing analytics" },
    { match: "entrepreneurship", photo: "photo-1556761175-b413da4baf72", alt: "Entrepreneurs in a business meeting" },
    { match: "photography", photo: "photo-1516035069371-29a1b244cc32", alt: "Photography camera" }
  ];
  const item = images.find(image => name.includes(image.match));
  const query = encodeURIComponent(`${event.name} event`);
  return {
    src: item ? `https://images.unsplash.com/${item.photo}?auto=format&fit=crop&w=240&h=180&q=80` : `https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=240&h=180&q=80`,
    alt: item ? item.alt : `${event.name} event photo`,
    href: `https://www.google.com/search?tbm=isch&q=${query}`
  };
}

/* Events */
function renderEvents() {
  const body = document.getElementById("eventsTable");
  if (!body) return;
  const search = (document.getElementById("eventSearch")?.value || "").toLowerCase();
  const status = document.getElementById("eventStatusFilter")?.value || "all";
  const filtered = appData.events.filter(e =>
    (e.name.toLowerCase().includes(search) || e.category.toLowerCase().includes(search) || e.venue.toLowerCase().includes(search)) &&
    (status === "all" || e.status === status)
  );
  body.innerHTML = filtered.map(e => {
    const image = eventImageDetails(e);
    return `<tr>
    <td><div class="event-name-with-image">
      <a class="event-image-link" href="${image.href}" target="_blank" rel="noopener noreferrer" aria-label="View ${escapeHTML(e.name)} images on Google">
        <img class="event-list-thumbnail" src="${image.src}" alt="${escapeHTML(image.alt)}" loading="lazy">
      </a>
      <strong>${escapeHTML(e.name)}</strong>
    </div></td><td>${escapeHTML(e.category)}</td><td>${formatDate(e.date)}</td>
    <td>${escapeHTML(e.venue)}</td><td>${e.attendees}</td><td>${statusBadge(e.status)}</td>
    <td><button class="btn btn-sm btn-outline-primary me-1" data-edit="event" data-id="${e.id}">Edit</button>
    <button class="btn btn-sm btn-outline-danger" data-delete="event" data-id="${e.id}">Delete</button></td>
  </tr>`;
  }).join("") || `<tr><td colspan="7" class="text-center muted py-4">No events found.</td></tr>`;
  setText("eventCountText", `Showing ${filtered.length} of ${appData.events.length} events`);
}

/* Participants */
function renderParticipants() {
  const body = document.getElementById("participantsTable");
  if (!body) return;
  const search = (document.getElementById("participantSearch")?.value || "").toLowerCase();
  const status = document.getElementById("participantStatusFilter")?.value || "all";
  const filtered = appData.participants.filter(p =>
    (p.name.toLowerCase().includes(search) || p.email.toLowerCase().includes(search)) &&
    (status === "all" || p.status === status)
  );
  body.innerHTML = filtered.map(p => {
    const initials = p.name.trim().split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join("").toUpperCase();
    return `<tr>
    <td><div class="participant-identity"><span class="participant-avatar" aria-hidden="true">${escapeHTML(initials)}</span><strong>${escapeHTML(p.name)}</strong></div></td><td><span class="participant-email"><i class="bi bi-envelope"></i>${escapeHTML(p.email)}</span></td><td><span class="participant-phone"><i class="bi bi-telephone"></i>${escapeHTML(p.phone)}</span></td>
    <td><span class="participant-date"><i class="bi bi-calendar3"></i>${formatDate(p.date)}</span></td><td>${statusBadge(p.status)}</td>
    <td><div class="participant-actions"><button class="btn btn-sm btn-outline-primary me-1" data-edit="participant" data-id="${p.id}">Edit</button>
    <button class="btn btn-sm btn-outline-danger" data-delete="participant" data-id="${p.id}">Delete</button></div></td>
  </tr>`;
  }).join("") || `<tr><td colspan="6" class="text-center muted py-4">No participants found.</td></tr>`;
  setText("participantTotal", appData.participants.length);
  setText("participantActive", appData.participants.filter(p=>p.status==="Active").length);
  setText("participantNew", appData.participants.filter(p=>p.date >= new Date(Date.now()-30*86400000).toISOString().slice(0,10)).length);
  setText("participantCountText", `Showing ${filtered.length} of ${appData.participants.length} participants`);
}

/* Registrations */
function renderRegistrations() {
  const body = document.getElementById("registrationsTable");
  if (!body) return;
  const search = (document.getElementById("registrationSearch")?.value || "").toLowerCase();
  const status = document.getElementById("registrationFilter")?.value || "all";
  const filtered = appData.registrations.filter(r =>
    (r.participant.toLowerCase().includes(search) || r.event.toLowerCase().includes(search)) &&
    (status === "all" || r.status === status)
  );
  body.innerHTML = filtered.map(r => {
    const initials = String(r.participant || "?").trim().split(/\\s+/).slice(0, 2).map(part => part.charAt(0)).join("").toUpperCase();
    return `<tr>
    <td><span class="registration-id"><i class="bi bi-ticket-perforated"></i>#${r.id}</span></td>
    <td><div class="registration-identity"><span class="registration-avatar" aria-hidden="true">${escapeHTML(initials)}</span><strong>${escapeHTML(r.participant)}</strong></div></td>
    <td><span class="registration-event"><i class="bi bi-calendar-event"></i>${escapeHTML(r.event)}</span></td>
    <td><span class="registration-date"><i class="bi bi-calendar3"></i>${formatDate(r.date)}</span></td>
    <td><span class="registration-ticket"><i class="bi bi-tag"></i>${escapeHTML(r.ticket || "Standard")}</span></td>
    <td>${statusBadge(r.status)}</td>
    <td><div class="registration-actions"><button class="btn btn-sm btn-outline-primary me-1" data-toggle-registration="${r.id}">Change Status</button>
    <button class="btn btn-sm btn-outline-danger" data-delete="registration" data-id="${r.id}">Delete</button></div></td>
  </tr>`;
  }).join("") || `<tr><td colspan="7" class="text-center muted py-4">No registrations found.</td></tr>`;
  setText("registrationTotal", appData.registrations.length);
  setText("registrationConfirmed", appData.registrations.filter(r=>r.status==="Confirmed").length);
  setText("registrationPending", appData.registrations.filter(r=>r.status==="Pending").length);
  setText("registrationCountText", `Showing ${filtered.length} of ${appData.registrations.length} registrations`);
}

/* Analytics */
function renderAnalytics() {
  const line = document.getElementById("analyticsLineChart");
  if (line && window.Chart) {
    if (window.eventEaseLineChart) window.eventEaseLineChart.destroy();
    window.eventEaseLineChart = new Chart(line, {
      type:"line",
      data:{ labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets:[{label:"Registrations",data:[18,24,20,35,31,42,39,50,47,58,63,72],borderColor:"#6857e8",backgroundColor:"rgba(104,87,232,.12)",fill:true,tension:.35}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}
    });
  }
  const category = document.getElementById("categoryChart");
  if (category && window.Chart) {
    if (window.eventEaseCategoryChart) window.eventEaseCategoryChart.destroy();
    const counts = {};
    appData.events.forEach(e => counts[e.category] = (counts[e.category] || 0) + 1);
    window.eventEaseCategoryChart = new Chart(category, {
      type:"doughnut",
      data:{labels:Object.keys(counts),datasets:[{data:Object.values(counts),backgroundColor:["#6857e8","#55a6e8","#f0a45b","#45bd96","#e879a8","#8b8da5"],borderWidth:0}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom"}}}
    });
  }
  const performance = document.getElementById("eventPerformance");
  if (performance) performance.innerHTML = appData.events.map(e => {
    const pct = Math.min(100, Math.round((e.attendees / Math.max(1,e.capacity || 100))*100));
    return `<div class="performance-row"><strong>${escapeHTML(e.name)}</strong><div class="progress"><div class="progress-bar" style="width:${pct}%"></div></div><span>${pct}%</span></div>`;
  }).join("");
}

/* CSV export */
function exportEventsCSV() {
  const headers = ["Event Name","Category","Date","Location","Participants","Capacity","Status"];
  const rows = appData.events.map(e => [e.name,e.category,e.date,e.venue,e.attendees,e.capacity,e.status]);
  const csv = [headers,...rows].map(row => row.map(v => `"${String(v ?? "").replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob = new Blob(["\ufeff"+csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "eventease-events.csv"; a.click();
  URL.revokeObjectURL(url);
}

/* Event listeners and startup */
function renderAll() {
  renderDashboard(); renderEvents(); renderParticipants(); renderRegistrations();
  if (document.getElementById("page-analytics")?.classList.contains("active")) renderAnalytics();
}

/* Light and Dark Mode */
const EVENTEASE_THEME_KEY = "eventEaseTheme";

function applyEventEaseTheme(theme) {
  const selectedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", selectedTheme);
  document.body.classList.toggle("dark-mode", selectedTheme === "dark");

  document.querySelectorAll("[data-theme-toggle]").forEach(button => {
    const icon = button.querySelector("i");
    if (icon) icon.className = selectedTheme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
    button.setAttribute("aria-label", selectedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    button.setAttribute("title", selectedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  });
}

function initializeEventEaseTheme() {
  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem(EVENTEASE_THEME_KEY) || "light";
  } catch (error) {
    console.warn("Theme preference could not be loaded.", error);
  }

  applyEventEaseTheme(savedTheme);

  document.querySelectorAll("[data-theme-toggle]").forEach(button => {
    button.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(EVENTEASE_THEME_KEY, nextTheme);
      } catch (error) {
        console.warn("Theme preference could not be saved.", error);
      }
      applyEventEaseTheme(nextTheme);
    });
  });
}


function openPageFromHash() {
  const requestedPage = window.location.hash.replace("#", "").trim().toLowerCase();
  const allowedPages = ["dashboard", "events", "participants", "registrations", "calendar", "notifications", "analytics", "settings"];
  if (allowedPages.includes(requestedPage)) {
    showPage(requestedPage);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeEventEaseTheme();
  window.EventEasePages?.initNotifications();
  document.querySelectorAll(".current-year").forEach(el => el.textContent = new Date().getFullYear());
  openPageFromHash();

  document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
  document.getElementById("logoutBtn")?.addEventListener("click", logout);
  document.getElementById("togglePassword")?.addEventListener("click", () => {
    const input = document.getElementById("password");
    const icon = document.querySelector("#togglePassword i");
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
    if (icon) icon.className = input.type === "password" ? "bi bi-eye" : "bi bi-eye-slash";
  });
  document.querySelectorAll("[data-page]").forEach(link => link.addEventListener("click", event => {
    event.preventDefault(); showPage(link.dataset.page);
  }));
  document.getElementById("menuToggle")?.addEventListener("click", openSidebar);
  document.getElementById("sidebarOverlay")?.addEventListener("click", closeSidebar);

  document.querySelectorAll("[data-action]").forEach(button => button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "add-event") openRecordModal("event");
    if (action === "add-participant") openRecordModal("participant");
    if (action === "add-registration") openRecordModal("registration");
  }));
  document.getElementById("saveRecordBtn")?.addEventListener("click", saveModalRecord);
  document.getElementById("eventSearch")?.addEventListener("input", renderEvents);
  document.getElementById("eventStatusFilter")?.addEventListener("change", renderEvents);
  document.getElementById("participantSearch")?.addEventListener("input", renderParticipants);
  document.getElementById("participantStatusFilter")?.addEventListener("change", renderParticipants);
  document.getElementById("registrationSearch")?.addEventListener("input", renderRegistrations);
  document.getElementById("registrationFilter")?.addEventListener("change", renderRegistrations);
  document.getElementById("exportReport")?.addEventListener("click", exportEventsCSV);

  document.addEventListener("click", event => {
    const edit = event.target.closest("[data-edit]");
    const del = event.target.closest("[data-delete]");
    const toggle = event.target.closest("[data-toggle-registration]");
    if (edit) {
      const type = edit.dataset.edit;
      const item = appData[`${type}s`].find(x => Number(x.id) === Number(edit.dataset.id));
      if (item) openRecordModal(type, item);
    }
    if (del) deleteRecord(del.dataset.delete, del.dataset.id);
    if (toggle) {
      const item = appData.registrations.find(x => Number(x.id) === Number(toggle.dataset.toggleRegistration));
      if (item) { item.status = item.status === "Confirmed" ? "Pending" : "Confirmed"; saveData(); renderRegistrations(); showToast("Registration status updated."); }
    }
  });

  if (sessionStorage.getItem(SESSION_KEY) === "true") showApplication();
  else showLogin();
  renderAll();
});
