# EventEase – Event Management System

**Live website:** https://USERNAME.github.io/REPO/
**Repository:** https://github.com/fit-haiqal/eventease.git

IMS566 Advanced Web Design Development and Content Management · Individual Project
Muhammad Fitri Haiqal bin Jasam · UiTM

---

## 1. Project title & description

**EventEase – Event Management System**

EventEase is a responsive front-end prototype of an event management system. An administrator can
manage events, participants and registrations in one place, follow registration activity through a
dashboard and analytics charts, view events on a monthly calendar and keep track of notifications.

This is an academic front-end prototype. Login is simulated, and data is stored in the browser's
Local Storage instead of a database.

## 2. Features included

**Authentication**
- Demo administrator login (simulated, hardcoded credentials)

**Navigation & layout**
- Responsive sidebar navigation with a hamburger menu on smaller screens
- Same sidebar, top navigation and layout on the Dashboard, Calendar and Notifications pages, with the active page highlighted
- Light and Dark Mode toggle (moon/sun button), remembered across pages
- Custom EventEase logo and browser tab icon (favicon)

**Dashboard**
- Summary of key information
- Registration chart

**Data management pages**
- **Events:** add, edit, delete, search and filter
- **Participants:** add, edit, delete, search and filter
- **Registrations:** manage registrations and update their status

**Data visualisation**
- Analytics charts built with Chart.js
- Export data to CSV

**Extra pages**
- **Calendar:** monthly view of events
- **Notifications:** unread counts, mark as read and delete

**Data storage**
- Sample data loads automatically when the browser has no saved EventEase data
- Changes are saved in the browser's Local Storage

## 3. Instructions to test login

1. Open the live website link above in **Google Chrome**.
2. Sign in with the demo administrator account:

| Role | Username | Password |
|---|---|---|
| Administrator | `admin` | `event123` |

3. After logging in, the Dashboard opens. Use the sidebar to visit Events, Participants, Registrations, Analytics, Calendar and Notifications.

**Notes**
- Login is simulated for demonstration only and is not secure production authentication.
- Changes are saved in this browser's Local Storage. They are not shared between different computers or browsers.
- Built-in sample records appear the first time the app is opened.

## 4. Frameworks / libraries used

| Framework / library | Version | Used for |
|---|---|---|
| [Bootstrap](https://getbootstrap.com) | 5.3.3 | Responsive layout and UI components |
| [Bootstrap Icons](https://icons.getbootstrap.com) | – | Icons |
| [Chart.js](https://www.chartjs.org) | 4.4.3 | Dashboard and analytics charts |
| Browser Local Storage | – | Saving data and the selected theme |

Written with **HTML5, CSS3 and JavaScript**. Bootstrap, Bootstrap Icons and Chart.js are loaded from
a CDN, so an internet connection is needed.

---

## Running locally

1. Open the project folder in Visual Studio Code.
2. Install or enable the **Live Server** extension.
3. Right-click `index.html` and select **Open with Live Server**.
4. Sign in with the demo login above.

## Project structure

```
index.html                    Main app and login
assets/css/style.css          Main application styles
assets/css/extra-pages.css    Calendar and Notifications styles
assets/js/app.js              Main application logic
assets/js/extra-pages.js      Calendar and Notifications logic
assets/images/                EventEase logo and favicon
README.md                     Project documentation
```

