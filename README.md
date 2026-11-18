# EventEase – Event Management System

A responsive front-end event management prototype developed for IMS566.

## Features
- Demo administrator login
- Dashboard summary and registration chart
- Event management: add, edit, delete, search and filter
- Participant management: add, edit, delete, search and filter
- Registration management and status updates
- Analytics charts and CSV export
- Responsive sidebar navigation
- Separate Calendar page with monthly event view
- Separate Notifications page with unread counts, mark-as-read and delete controls
- Automatic sample data when the browser has no saved EventEase data
- Local Storage persistence in the current browser

## Demo Login
- Username: `admin`
- Password: `event123`

## Technologies
- HTML5, CSS3 and JavaScript
- Bootstrap 5.3.3
- Bootstrap Icons
- Chart.js 4.4.3
- Browser Local Storage

## Run in Visual Studio Code
1. Extract the ZIP file.
2. Open the extracted `EventEase-Submission-Ready` folder in Visual Studio Code.
3. Install or enable the **Live Server** extension.
4. Right-click `index.html` and select **Open with Live Server**.
5. Sign in with the demo credentials above.

You can also open `index.html` directly in Google Chrome. Live Server is recommended for testing.

## Important Notes
- The application is a front-end academic prototype. Login is simulated and is not production authentication.
- Sample records are built into the application and appear even when the browser has no previous EventEase Local Storage data.
- Changes made in the application are saved in the browser's Local Storage. They are not shared between different computers or browsers.
- An internet connection is required to load the CDN-hosted Bootstrap, Bootstrap Icons and Chart.js libraries.


## New Separate Pages
- Both pages use `assets/js/extra-pages.js` and the shared assets folder. Open them from the links in the dashboard sidebar.

## Appearance
Use the moon/sun button in the top bar (or the standalone page header) to switch between Light Mode and Dark Mode. The selected theme is saved in browser Local Storage as `eventEaseTheme` and is shared by the dashboard, Calendar, and Notifications pages.

## Project File Checklist
- `index.html` – main app and login
- `assets/css/style.css` – main application styles
- `assets/css/extra-pages.css` – Calendar/Notifications styles
- `assets/js/app.js` – main application logic
- `assets/js/extra-pages.js` – Calendar/Notifications logic
- `README.md` – setup and project notes

Open the extracted project folder in VS Code and run `index.html` with Live Server. The standalone pages are linked from the main sidebar. Bootstrap assets use CDN links and require an internet connection.

## Custom Logo
- `assets/images/eventease-logo.svg` – EventEase calendar image logo used in the login screen, sidebar, Calendar and Notifications pages.


## Browser Tab Icon (Favicon)
The EventEase purple calendar icon is configured for the Dashboard, Calendar and Notifications browser tabs using `assets/images/favicon.ico` and `assets/images/favicon.png`.

## Consistent Page Layout
Calendar and Notifications now use the same EventEase sidebar, top navigation, typography, theme toggle and responsive app shell as the Dashboard. Their active sidebar item is highlighted, and the hamburger menu works on smaller screens.

## Cross-page navigation
The Analytics and Settings items in the Calendar and Notifications sidebars now link to the matching sections in `index.html`. URL hash handling opens the requested section when the main app loads.

## Sidebar navigation across all pages
From Calendar and Notifications, every sidebar item now opens its matching section in the main EventEase app: Dashboard, Event Management, Participants, Registrations, Analytics and Settings. Calendar and Notifications link directly to each other.

Calendar and Notifications are integrated as sections inside index.html; no separate HTML pages are required.
