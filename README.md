# Daily Planner - Web Application

## Project Information

**Project Name:** Daily Planner  
**Author:** [Your Name]  
**Date:** 2024  
**Course:** [Your Course Name]  
**Module:** [Module Number/Name]

## Description

Daily Planner is a comprehensive web application for daily planning and note-taking. It provides a calendar-based interface that allows users to organize their daily activities, notes, and tasks. The application features hourly planning, task management with priority levels, and a real-time sidebar that displays current hour information.

The application is built using pure HTML, CSS, and JavaScript with no external frameworks or dependencies. All data is stored locally in the browser using localStorage, ensuring privacy and offline functionality.

## Features

### Core Features
- **Monthly Calendar View**: Interactive calendar grid showing all days of the month
- **Daily Notes**: Add, edit, and delete notes for any day with rich formatting options
- **Hourly Planning**: Plan your day hour by hour (12 AM to 11 PM)
- **Task Management**: Create to-do lists with checkboxes and priority marking
- **Current Hour Sidebar**: Real-time display of current hour's notes and tasks
- **Urgent Task Highlighting**: Mark tasks as urgent for priority tracking
- **Search Functionality**: Search across all notes and tasks
- **Multiple Themes**: Choose from Minimal, Neon, Pastel, or Dark Glass themes
- **Dark Mode**: Toggle between light and dark themes
- **Timeline View**: View all notes and plans in chronological order
- **Monthly Summary**: Statistics showing total notes, important notes, and task completion

### Interactive Features
- Click any calendar day to add notes or create plans
- Drag and drop notes between dates
- Double-click for quick note entry
- Real-time sidebar updates every hour
- Browser notification reminders
- Image attachments for notes

## Technical Requirements

### ✅ Module-Specific Requirements

**All of these are required:**
- ✅ **At least two HTML pages**: The application includes three HTML pages:
  - `calendar.html` - Main calendar interface
  - `about.html` - About page with app information
  - `help.html` - Help and user guide page
- ✅ **Interactive content based on user input**: All calendar interactions, note creation, task management, and planning features are driven by user input
- ✅ **Runs on local test server**: Can be run using any local web server (Python's http.server, Node.js http-server, or Live Server extension)

**One of these is required:**
- ✅ **Additional (third) dynamically generated web page**: The `help.html` page is dynamically accessible and provides comprehensive user guidance

### Code Requirements
- ✅ **At least 100 lines of code**: The JavaScript file (`planner.js`) contains over 1,600 lines of code
- ✅ **Function-level comments**: All functions include comprehensive JSDoc-style comments explaining their purpose, parameters, and functionality

## How to Run

### Method 1: Direct File Opening
1. Download or clone the repository
2. Open `calendar.html` directly in any modern web browser
3. No server required for basic functionality

### Method 2: Local Web Server (Recommended)

**Using Python:**
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000/calendar.html`

**Using Node.js:**
```bash
npx http-server
```
Then navigate to the provided localhost URL

**Using VS Code Live Server:**
1. Install the "Live Server" extension
2. Right-click `calendar.html`
3. Select "Open with Live Server"

## Project Structure

```
DailyPlannerApp/
│
├── css/
│   └── style.css          # All styling (1,289 lines)
│
├── js/
│   └── planner.js         # Main JavaScript logic (1,646 lines)
│
├── calendar.html          # Main calendar page
├── about.html             # About page
├── help.html             # Help and user guide page
└── README.md             # This file
```

## Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling, animations, responsive design, themes
- **JavaScript (ES6+)**: Application logic, DOM manipulation, localStorage API
- **localStorage API**: Client-side data persistence
- **Browser Notifications API**: Reminder functionality

## Key Functions

### Calendar Functions
- `generateCalendar()` - Creates the monthly calendar grid
- `changeMonth()` - Navigates between months
- `formatDateKey()` - Formats dates for localStorage keys
- `formatDateDisplay()` - Formats dates for display

### Note Management Functions
- `openModal()` - Opens note editing modal
- `closeModal()` - Closes modal and clears fields
- `saveNote()` - Saves note to localStorage
- `loadNote()` - Loads note from localStorage
- `deleteNote()` - Removes note from localStorage

### Daily Plan Functions
- `openDailyPlanModal()` - Opens daily plan modal
- `generateHourlySlots()` - Creates hourly time slots
- `switchPlanMode()` - Switches between Plan/Notes/Tasks modes
- `addTaskItem()` - Adds task to list with urgent option
- `saveDailyPlan()` - Saves daily plan to localStorage
- `loadDailyPlan()` - Loads daily plan from localStorage

### Sidebar Functions
- `updateHourlySidebar()` - Updates sidebar with current hour data
- Auto-updates every hour and minute

### Additional Functions
- `toggleDarkMode()` - Toggles dark/light theme
- `changeTheme()` - Changes application theme
- `toggleView()` - Switches between Calendar and Timeline views
- `generateTimeline()` - Creates timeline view of all notes
- `updateMonthlySummary()` - Updates monthly statistics
- `checkReminders()` - Checks and displays reminder notifications

## User Interactions

The application is highly interactive with the following user-driven features:

1. **Calendar Interactions:**
   - Click day → Opens daily plan modal
   - Click Notes button → Opens notes modal
   - Click Plan button → Opens daily plan modal
   - Double-click day → Quick notes entry
   - Drag and drop days → Move notes between dates

2. **Note Creation:**
   - Text input
   - Color tag selection
   - Emoji selection
   - Checklist creation
   - Image upload
   - Reminder setting

3. **Task Management:**
   - Add/remove tasks
   - Mark as complete
   - Mark as urgent
   - Edit task text

4. **Navigation:**
   - Month navigation (Previous/Next)
   - View switching (Calendar/Timeline)
   - Theme selection
   - Dark mode toggle
   - Search functionality

## Data Storage

All data is stored in browser localStorage using the following key patterns:
- Notes: `planner-YYYY-MM-DD`
- Daily Plans: `plan-YYYY-MM-DD`
- Preferences: `darkMode`, `theme`

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Edge
- Safari
- Any modern browser with ES6+ support

## Screenshots

_Add screenshots of your application here showing:_
- Main calendar view
- Note creation modal
- Daily plan with hourly slots
- Sidebar with current hour information
- Timeline view
- Dark mode
- Different themes

## Video Demonstration

_Link to your video demonstration (upload to YouTube, Vimeo, or similar platform and include link here)_

**Video Link:** [Your Video URL Here]

## What I Learned

While building this application, I learned and practiced:

- **Advanced DOM Manipulation**: Creating and managing complex UI elements dynamically
- **localStorage API**: Implementing persistent client-side data storage
- **Event Handling**: Managing multiple event types (click, drag, input, etc.)
- **CSS Grid and Flexbox**: Creating responsive layouts
- **Modal Design**: Building accessible modal interfaces
- **Date/Time Handling**: Working with JavaScript Date objects and time calculations
- **Real-time Updates**: Implementing auto-updating UI elements
- **Code Organization**: Writing modular, maintainable JavaScript
- **User Experience Design**: Creating intuitive interfaces
- **Responsive Design**: Making applications work on different screen sizes
- **Theme System**: Implementing multiple visual themes
- **Browser APIs**: Using Notification API for reminders

## Challenges and Solutions

1. **Challenge**: Managing complex state across multiple modals and views
   - **Solution**: Used localStorage for persistence and clear function separation

2. **Challenge**: Real-time sidebar updates
   - **Solution**: Implemented interval-based updates with hour change detection

3. **Challenge**: Responsive design for sidebar and calendar
   - **Solution**: Used CSS Flexbox and media queries for mobile adaptation

4. **Challenge**: Drag and drop functionality
   - **Solution**: Implemented HTML5 drag and drop API with visual feedback

## Future Enhancements

Potential future improvements:
- Database integration (SQLite, IndexedDB)
- User authentication
- Cloud synchronization
- Export/import functionality
- Print functionality
- Mobile app version
- Collaborative planning features

## License

This project is created for educational purposes.

## Contact

[Your Contact Information]

---

**Version**: 2.0.0  
**Last Updated**: 2024
