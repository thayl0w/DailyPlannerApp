# Overview

The **Daily Planner** is a web application I built to strengthen my skills in front-end development using pure **HTML, CSS, and JavaScript**. Its purpose is to help users organize their day with an integrated calendar, hourly plans, notes, tasks, and reminders—all stored directly in the browser using **localStorage**, ensuring privacy and offline usage.

The program is simple to use:  
1. Open the monthly calendar and select any day.  
2. Add daily notes, tasks, or hourly plans using interactive modals.  
3. Set reminders, attach images, and organize tasks with urgency levels.  
4. View everything chronologically through the timeline feature and track progress using the monthly summary.

My purpose for writing this software was to improve my understanding of DOM manipulation, UI/UX design, browser storage, and real-time interface updates—all without relying on external frameworks.

<!-- [Software Demo Video](http://youtube.link.goes.here) -->

# Local Storage System

This project uses the browser’s built-in **localStorage** API to save all user-created information. This ensures data persistence even after closing the browser, without requiring servers or external databases.

### Data Structure:
- **Notes**: Stored by date using keys like `planner-YYYY-MM-DD`.  
- **Daily Plans**: Hour-by-hour plans stored with keys like `plan-YYYY-MM-DD`.  
- **Preferences**: Theme, dark mode, and view preferences stored with simple keys such as `darkMode` and `theme`.

CRUD operations are fully supported:
- **Create**: Add notes, plans, images, tasks, reminders.  
- **Read**: Retrieve and display notes or hourly plans for any date.  
- **Update**: Edit notes, rearrange items, change tasks, or modify reminders.  
- **Delete**: Remove notes, clear daily plans, or delete specific tasks.

# Development Environment

- **HTML5** – Base structure for calendar, modals, and layout  
- **CSS3** – Custom styling (over 1,200+ lines), multiple themes, animations, responsive design  
- **JavaScript (ES6+)** – Core logic, DOM manipulation, event handling (over 1,600+ lines)  
- **LocalStorage API** – Persistent storage of all notes, tasks, and settings  
- **Browser Notifications API** – Real-time reminders for important tasks  

I developed and tested the application using **VS Code**, the **Live Server extension**, and multiple modern browsers (Chrome, Firefox, Edge).

# Useful Websites

- https://developer.mozilla.org/  
- https://www.w3schools.com/js/  
- https://css-tricks.com/  
- https://javascript.info/  
- https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage  

# Future Work

- Integrate IndexedDB for more advanced storage  
- Add user authentication and cloud sync  
- Create export/import functionality (JSON or CSV)  
- Add print-friendly daily/weekly reports  
- Build a mobile app version  
- Add collaborative planning features  
- Improve accessibility and screen reader support  
<<<<<<< HEAD
=======

>>>>>>> 1c40a01c7aa3094b3a04df859f38eaeb0ca9fae7
