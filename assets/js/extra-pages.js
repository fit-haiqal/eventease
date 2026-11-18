/* EventEase separate Calendar and Notifications pages */
(() => {
  "use strict";
  const KEY = "eventEaseData";
  const DEMO = {
    events: [
      {id:1,name:"Technology Innovation Summit",date:"2026-12-15",venue:"Kuala Lumpur Convention Centre",status:"Upcoming"},
      {id:2,name:"Creative Design Workshop",date:"2026-11-20",venue:"Petaling Jaya",status:"Upcoming"},
      {id:3,name:"Business Networking Night",date:"2026-10-10",venue:"Shah Alam",status:"Completed"},
      {id:4,name:"Digital Marketing Conference",date:"2026-09-18",venue:"Putrajaya",status:"Completed"},
      {id:5,name:"Entrepreneurship Forum",date:"2026-12-28",venue:"Cyberjaya",status:"Upcoming"},
      {id:6,name:"Photography Masterclass",date:"2026-08-12",venue:"Kuala Lumpur",status:"Completed"}
    ],
    participants: [
      {id:1,name:"Sarah Johnson",date:"2026-10-20",status:"Active"},
      {id:2,name:"Daniel Lee",date:"2026-10-22",status:"Active"},
      {id:3,name:"Aisha Rahman",date:"2026-10-25",status:"Inactive"},
      {id:4,name:"Adam Tan",date:"2026-10-28",status:"Active"},
      {id:5,name:"Nur Izzah",date:"2026-11-01",status:"Active"},
      {id:6,name:"Amir Hakim",date:"2026-11-03",status:"Active"},
      {id:7,name:"Mei Ling",date:"2026-11-04",status:"Active"},
      {id:8,name:"Jason Wong",date:"2026-11-05",status:"Active"}
    ],
    registrations: [
      {id:1001,participant:"Sarah Johnson",event:"Technology Innovation Summit",date:"2026-11-01",ticket:"Standard",status:"Confirmed"},
      {id:1002,participant:"Daniel Lee",event:"Creative Design Workshop",date:"2026-11-03",ticket:"VIP",status:"Pending"},
      {id:1003,participant:"Aisha Rahman",event:"Business Networking Night",date:"2026-11-05",ticket:"Standard",status:"Confirmed"},
      {id:1004,participant:"Adam Tan",event:"Digital Marketing Conference",date:"2026-11-06",ticket:"Early Bird",status:"Confirmed"},
      {id:1005,participant:"Nur Izzah",event:"Technology Innovation Summit",date:"2026-11-07",ticket:"VIP",status:"Pending"}
    ]
  };
  const readData = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && Array.isArray(saved.events)) return {...DEMO, ...saved};
    } catch (e) { console.warn("EventEase data could not be read; using sample events.", e); }
    return JSON.parse(JSON.stringify(DEMO));
  };
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const dateLabel = value => {
    if (!value) return "Date not set";
    const d = new Date(value + "T00:00:00");
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
  };
  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  let viewDate = new Date();

  function initTheme() {
    let theme = "light";
    try { theme = localStorage.getItem("eventEaseTheme") || "light"; } catch(e) {}
    const apply = value => {
      document.documentElement.setAttribute("data-theme", value);
      document.querySelectorAll("[data-theme-toggle]").forEach(button => {
        const icon = button.querySelector("i");
        if (icon) icon.className = value === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
        button.setAttribute("aria-label", value === "dark" ? "Switch to light mode" : "Switch to dark mode");
        button.title = value === "dark" ? "Switch to light mode" : "Switch to dark mode";
      });
    };
    apply(theme);
    document.querySelectorAll("[data-theme-toggle]").forEach(button => button.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("eventEaseTheme", theme); } catch(e) {}
      apply(theme);
    }));
  }


  function initCalendar() {
    const grid = document.getElementById("calendarGrid");
    const label = document.getElementById("monthLabel");
    if (!grid || !label) return;
    const draw = () => {
      const data = readData(), y = viewDate.getFullYear(), m = viewDate.getMonth();
      label.textContent = viewDate.toLocaleDateString("en-US",{month:"long",year:"numeric"});
      const first = new Date(y,m,1).getDay(), count = new Date(y,m+1,0).getDate();
      const today = todayISO();
      let content = "";
      for (let i=0;i<first;i++) content += '<div class="ee-day"></div>';
      for (let day=1;day<=count;day++) {
        const date = `${y}-${String(m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
        const events = data.events.filter(e => e.date === date);
        content += `<div class="ee-day ${date===today?"today":""}"><strong>${day}</strong>${events.map(e=>`<span class="ee-event-chip" title="${esc(e.name)}">${esc(e.name)}</span>`).join("")}</div>`;
      }
      grid.innerHTML = content;
      const upcoming = data.events.filter(e=>e.date && e.date>=today).sort((a,b)=>a.date.localeCompare(b.date));
      const list = document.getElementById("upcomingEvents");
      if (list) list.innerHTML = upcoming.length ? upcoming.map(e=>`<div class="d-flex flex-wrap justify-content-between gap-2 py-3 border-bottom"><div><strong>${esc(e.name)}</strong><div class="small ee-muted"><i class="bi bi-geo-alt"></i> ${esc(e.venue || "Location not set")}</div></div><span class="badge text-bg-primary align-self-start">${dateLabel(e.date)}</span></div>`).join("") : '<p class="ee-muted mb-0">No upcoming events.</p>';
    };
    document.getElementById("prevMonth")?.addEventListener("click",()=>{viewDate.setMonth(viewDate.getMonth()-1);draw();});
    document.getElementById("nextMonth")?.addEventListener("click",()=>{viewDate.setMonth(viewDate.getMonth()+1);draw();});
    draw();
  }

  function initNotifications() {
    const list = document.getElementById("notificationList");
    if (!list) return;

    const storageKey = "eventEaseNotifications";
    const getItems = () => {
      try { return JSON.parse(localStorage.getItem(storageKey)) || []; }
      catch (e) { return []; }
    };
    const setItems = items => localStorage.setItem(storageKey, JSON.stringify(items));

    // Pull the current records from Event Management, Registrations and Participants.
    // This means notifications reflect the actual app data rather than a separate demo list.
    const syncNotifications = () => {
      const data = readData();
      const previous = getItems();
      const previousByKey = new Map(previous.filter(item => item.sourceKey).map(item => [item.sourceKey, item]));
      let dismissed = [];
      try { dismissed = JSON.parse(localStorage.getItem("eventEaseDismissedNotifications")) || []; } catch (e) {}

      const generated = [];

      (data.events || []).filter(event => String(event.status).toLowerCase() === "upcoming").forEach(event => {
        const sourceKey = `event-${event.id}`;
        const old = previousByKey.get(sourceKey);
        generated.push({
          sourceKey,
          title: `Upcoming Event: ${event.name}`,
          message: `${event.name} akan berlangsung pada ${dateLabel(event.date)} di ${event.venue || "lokasi belum ditetapkan"}. Semak persediaan dan maklumat event dalam Event Management.`,
          date: event.date ? dateLabel(event.date) : "Date not set",
          icon: "bi-calendar-event",
          read: old ? !!old.read : false
        });
      });

      (data.registrations || []).filter(reg => String(reg.status).toLowerCase() === "pending").forEach(reg => {
        const sourceKey = `registration-${reg.id}`;
        const old = previousByKey.get(sourceKey);
        generated.push({
          sourceKey,
          title: "Registration Needs Confirmation",
          message: `${reg.participant} mempunyai pendaftaran berstatus Pending untuk ${reg.event}. Semak rekod di halaman Registrations dan kemas kini status apabila disahkan.`,
          date: reg.date ? dateLabel(reg.date) : "Date not set",
          icon: "bi-ticket-perforated",
          read: old ? !!old.read : false
        });
      });

      (data.participants || [])
        .slice()
        .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
        .slice(0, 3)
        .forEach(participant => {
          const sourceKey = `participant-${participant.id}`;
          const old = previousByKey.get(sourceKey);
          generated.push({
            sourceKey,
            title: `Participant Added: ${participant.name}`,
            message: `${participant.name} disenaraikan dalam Participants. Buka halaman Participants untuk menyemak maklumat dan status peserta.`,
            date: participant.date ? dateLabel(participant.date) : "Date not set",
            icon: "bi-person-plus",
            read: old ? !!old.read : false
          });
        });

      // Keep any user-added notifications, while replacing the old hard-coded examples.
      const oldDemoTitles = new Set([
        "Workshop coming up soon", "Registration awaiting confirmation",
        "New participant added", "Technology Innovation Summit reminder",
        "Registration confirmed", "Upcoming event created"
      ]);
      const custom = previous.filter(item => !item.sourceKey && !oldDemoTitles.has(item.title));
      const activeGenerated = generated.filter(item => !dismissed.includes(item.sourceKey));
      setItems([...activeGenerated, ...custom]);
    };

    const draw = () => {
      const items = getItems();
      const total = document.getElementById("totalCount");
      const unread = document.getElementById("unreadCount");
      if (total) total.textContent = items.length;
      if (unread) unread.textContent = items.filter(item => !item.read).length;

      list.innerHTML = items.length
        ? items.map((item, index) => `
          <article class="ee-notification ${item.read ? "" : "unread"}">
            <div class="ee-notification-icon"><i class="bi ${esc(item.icon || "bi-bell")}"></i></div>
            <div class="flex-grow-1">
              <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <strong>${esc(item.title || "Event update")}</strong>
                <small class="ee-muted">${esc(item.date || "")}</small>
              </div>
              <p class="mb-2 mt-1 ee-muted">${esc(item.message || "")}</p>
              <div class="d-flex flex-wrap align-items-center gap-2">
                <span class="badge ${item.read ? "bg-secondary" : "bg-warning text-dark"}">${item.read ? "Read" : "Unread"}</span>
                <button class="btn btn-sm btn-outline-primary" data-read="${index}">${item.read ? "Mark unread" : "Mark as read"}</button>
                <button class="btn btn-sm btn-outline-secondary" data-delete="${index}">Delete</button>
              </div>
            </div>
          </article>`).join("")
        : '<p class="p-4 ee-muted mb-0">You are all caught up. No notifications yet.</p>';
    };

    syncNotifications();

    if (!list.dataset.notificationsBound) {
      list.addEventListener("click", event => {
        const readButton = event.target.closest("[data-read]");
        const deleteButton = event.target.closest("[data-delete]");
        if (readButton) {
          const items = getItems();
          const index = Number(readButton.dataset.read);
          if (items[index]) items[index].read = !items[index].read;
          setItems(items);
          draw();
        }
        if (deleteButton) {
          const items = getItems();
          const index = Number(deleteButton.dataset.delete);
          const removed = items[index];
          if (removed && removed.sourceKey) {
            let dismissed = [];
            try { dismissed = JSON.parse(localStorage.getItem("eventEaseDismissedNotifications")) || []; } catch (e) {}
            if (!dismissed.includes(removed.sourceKey)) dismissed.push(removed.sourceKey);
            localStorage.setItem("eventEaseDismissedNotifications", JSON.stringify(dismissed));
          }
          items.splice(index, 1);
          setItems(items);
          draw();
        }
      });
      list.dataset.notificationsBound = "true";
    }

    const markAll = document.getElementById("markAllRead");
    if (markAll && !markAll.dataset.notificationsBound) {
      markAll.addEventListener("click", () => {
        setItems(getItems().map(item => ({ ...item, read: true })));
        draw();
      });
      markAll.dataset.notificationsBound = "true";
    }
    draw();
  }

  window.EventEasePages = {initCalendar,initNotifications,initTheme};
})();
