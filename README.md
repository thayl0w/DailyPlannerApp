Overview

The Daily Planner is a web application I built to strengthen my skills in front-end web development while solving a practical problem: helping users organize their daily tasks, notes, and schedules in one place. The application provides an interactive monthly calendar, hourly scheduling, task lists, and notes with reminders. All data is stored locally in the browser, allowing users to access their plans offline without needing a server or database.

The program is simple to use:

Open the calendar and select any day to begin planning.

Add notes, tasks, or hourly schedules for that specific date.

Mark tasks as complete, urgent, or edit/delete them at any time.

View all notes in the timeline, check monthly summaries, or switch between themes and dark mode.

My purpose for writing this software was to improve my understanding of JavaScript, DOM manipulation, UI design, state management, and browser APIs while meeting the requirements of the Web Apps module.

<!-- [Software Demo Video](YOUR VIDEO LINK HERE) -->
Web Application Features

This project uses pure HTML, CSS, and JavaScript to build a fully interactive web application that runs entirely in the browser. The app functions without any backend by leveraging the browser’s built-in storage capabilities.

Feature Overview:

Calendar System: Interactive monthly calendar with clickable days.

Notes: Add, edit, delete, color-tag, and attach images to notes.

Daily Planner: Hour-by-hour scheduling for all 24 hours.

Task Lists: Create tasks with checkboxes, urgent flags, and completion tracking.

Themes & Dark Mode: Choose between multiple themes and toggle dark mode.

Timeline View: Browse all notes and plans in chronological order.

Monthly Summary: View total notes, tasks completed, and important entries.

Reminders: Browser notifications for time-sensitive notes.

Drag & Drop: Move notes between days interactively.

CRUD-like operations are supported through localStorage:

Create: Notes, tasks, hourly plans

Read: Load saved data from localStorage

Update: Modify tasks, notes, plans, themes

Delete: Remove notes, tasks, or entire day plans

All data remains stored on the user’s device for privacy and security.

Development Environment

Frontend: HTML5, CSS3, JavaScript (ES6+)

Storage: Browser localStorage for client-side persistence

Tools: VS Code, Live Server, Chrome DevTools

APIs Used:

DOM API

LocalStorage API

Notification API

Drag and Drop API

Date & Time functions

I developed and tested the entire application using a local web server (VS Code Live Server and Python http.server).

Useful Websites

https://developer.mozilla.org/

https://www.w3schools.com/

https://css-tricks.com/

https://stackoverflow.com/

https://javascript.info/

Future Work

Add cloud database support (Firebase, MongoDB Atlas, or SQL backend).

Implement user authentication so multiple users can save their own planners.

Add export/import abilities (JSON, CSV, PDF).

Add mobile layout improvements and release as a PWA/mobile app.

Add collaboration features for shared planning.

Improve UI animations and transitions.
