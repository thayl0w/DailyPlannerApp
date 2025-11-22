// Daily Gospel Planner - Main JavaScript File

// Global variables to track current month and year
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let currentView = 'calendar'; // 'calendar' or 'timeline'
let searchQuery = '';
let checklistItemId = 0;

// Month names array for display
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Day names array for calendar headers
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Initialize the calendar when the page loads
 * Sets up event listeners and generates the initial calendar view
 */
async function init() {
    loadPreferences();
    await generateCalendar();
    setupEventListeners();
    updateMonthlySummary();
    checkReminders();
    setInterval(checkReminders, 60000); // Check reminders every minute
    await updateHourlySidebar(); // Update sidebar on load
    setInterval(async () => await updateHourlySidebar(), 3600000); // Update sidebar every hour
    // Also update every minute to catch hour changes
    setInterval(async () => await updateHourlySidebar(), 60000);
}

/**
 * Load user preferences from localStorage
 * Includes dark mode, theme, and other settings
 */
function loadPreferences() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const theme = localStorage.getItem('theme') || 'minimal';
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').textContent = '☀️ Light Mode';
    }
    
    if (theme) {
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        if (theme !== 'minimal') {
            document.body.classList.add(`theme-${theme}`);
        }
        const themeSelector = document.getElementById('themeSelector');
        if (themeSelector) {
            themeSelector.value = theme;
        }
    }
}

/**
 * Set up all event listeners for the calendar
 * Handles month navigation, modal interactions, and all new features
 */
function setupEventListeners() {
    // Month navigation buttons
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => changeMonth(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => changeMonth(1));
    }
    
    // Modal close button
    const closeBtn = document.querySelector('.btn-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside of it
    const modal = document.getElementById('noteModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Make modal draggable
        makeModalDraggable('noteModal', 'modal-header');
    }
    
    // Make daily plan modal draggable (will be set up in separate listener)
    const dailyPlanModalElement = document.getElementById('dailyPlanModal');
    if (dailyPlanModalElement) {
        dailyPlanModalElement.addEventListener('click', (e) => {
            if (e.target === dailyPlanModalElement) {
                closeDailyPlanModal();
            }
        });
        
        // Make daily plan modal draggable
        makeModalDraggable('dailyPlanModal', 'modal-header');
    }
    
    // Save note button
    const saveBtn = document.getElementById('saveNote');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveNote);
    }
    
    // Delete note button
    const deleteBtn = document.getElementById('deleteNote');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteNote);
    }
    
    // Color picker buttons
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
        });
    });
    
    // Emoji picker buttons
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            const emoji = e.target.dataset.emoji;
            const selectedEmoji = document.getElementById('selectedEmoji');
            if (selectedEmoji) {
                selectedEmoji.textContent = emoji !== 'none' ? emoji : '';
            }
        });
    });
    
    // Add checklist item button
    const addChecklistBtn = document.getElementById('addChecklistItem');
    if (addChecklistBtn) {
        addChecklistBtn.addEventListener('click', addChecklistItem);
    }
    
    // Image upload
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }
    
    // Remove image button
    const removeImageBtn = document.getElementById('removeImage');
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', removeImage);
    }
    
    // Reminder input
    const reminderTime = document.getElementById('reminderTime');
    if (reminderTime) {
        reminderTime.addEventListener('change', () => {
            const clearBtn = document.getElementById('clearReminder');
            if (clearBtn) {
                clearBtn.style.display = reminderTime.value ? 'inline-block' : 'none';
            }
        });
    }
    
    // Clear reminder button
    const clearReminderBtn = document.getElementById('clearReminder');
    if (clearReminderBtn) {
        clearReminderBtn.addEventListener('click', () => {
            if (reminderTime) {
                reminderTime.value = '';
                clearReminderBtn.style.display = 'none';
            }
        });
    }
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Theme selector
    const themeSelector = document.getElementById('themeSelector');
    if (themeSelector) {
        themeSelector.addEventListener('change', (e) => {
            changeTheme(e.target.value);
        });
    }
    
    // View toggle (Calendar/Timeline)
    const viewToggle = document.getElementById('viewToggle');
    if (viewToggle) {
        viewToggle.addEventListener('click', toggleView);
    }
    
    // Notes list button
    const notesListBtn = document.getElementById('notesListBtn');
    if (notesListBtn) {
        notesListBtn.addEventListener('click', toggleNotesList);
    }
    
    // Close notes list button
    const closeNotesListBtn = document.getElementById('closeNotesList');
    if (closeNotesListBtn) {
        closeNotesListBtn.addEventListener('click', toggleNotesList);
    }
    
    // Search bar
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            generateCalendar();
            if (currentView === 'timeline') {
                generateTimeline();
            }
        });
    }
    
    // Clear search button
    const clearSearchBtn = document.getElementById('clearSearch');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (searchBar) {
                searchBar.value = '';
                searchQuery = '';
                generateCalendar();
                if (currentView === 'timeline') {
                    generateTimeline();
                }
            }
        });
    }
    
    // Plan action buttons (Plan/Notes/Tasks) - use event delegation
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-plan-action')) {
            const mode = e.target.dataset.mode;
            switchPlanMode(mode);
        }
        // Add task button
        if (e.target.id === 'addTaskBtn') {
            addTaskItem();
        }
    });
    
    // Save plan button
    const savePlanBtn = document.getElementById('savePlan');
    if (savePlanBtn) {
        savePlanBtn.addEventListener('click', saveDailyPlan);
    }
    
    // Close plan button
    const closePlanBtn = document.getElementById('closePlan');
    if (closePlanBtn) {
        closePlanBtn.addEventListener('click', closeDailyPlanModal);
    }
}

/**
 * Generate the calendar grid for the current month
 * Creates day cells and populates them with day numbers, colors, emojis, and note indicators
 */
async function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const monthHeader = document.getElementById('monthYear');
    
    if (!calendarGrid || !monthHeader) {
        return;
    }
    
    // Update month/year header
    monthHeader.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear existing calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    dayNames.forEach(day => {
        const headerCell = document.createElement('div');
        headerCell.className = 'day-header';
        headerCell.textContent = day;
        calendarGrid.appendChild(headerCell);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyCell);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.draggable = true;
        
        // Day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);
        
        // Get date key for this day
        const dateKey = formatDateKey(currentYear, currentMonth, day);
        
        // Only highlight if search matches (but don't show any content indicators)
        // Use synchronous localStorage check for search highlighting (fast)
        const noteData = loadNoteFromLocalStorage(dateKey);
        if (searchQuery && noteData && (
            (noteData.text && noteData.text.toLowerCase().includes(searchQuery)) ||
            (noteData.checklist && noteData.checklist.some(item => 
                item.text && item.text.toLowerCase().includes(searchQuery)
            ))
        )) {
            dayCell.classList.add('search-highlight');
        }
        
        // Drag and drop events
        dayCell.addEventListener('dragstart', (e) => handleDragStart(e, dateKey));
        dayCell.addEventListener('dragover', handleDragOver);
        dayCell.addEventListener('drop', (e) => handleDrop(e, dateKey));
        dayCell.addEventListener('dragend', handleDragEnd);
        
        // Add action buttons for Notes and Plan
        const actionButtons = document.createElement('div');
        actionButtons.className = 'day-action-buttons';
        
        const notesBtn = document.createElement('button');
        notesBtn.className = 'day-btn notes-btn';
        notesBtn.textContent = '📝 Notes';
        notesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(currentYear, currentMonth, day);
        });
        
        const planBtn = document.createElement('button');
        planBtn.className = 'day-btn plan-btn';
        planBtn.textContent = '📅 Plan';
        planBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openDailyPlanModal(currentYear, currentMonth, day);
        });
        
        actionButtons.appendChild(notesBtn);
        actionButtons.appendChild(planBtn);
        dayCell.appendChild(actionButtons);
        
        // Click event to open daily plan modal (default)
        dayCell.addEventListener('click', () => {
            openDailyPlanModal(currentYear, currentMonth, day);
        });
        
        // Double-click for quick add notes
        dayCell.addEventListener('dblclick', () => {
            openModal(currentYear, currentMonth, day);
        });
        
        calendarGrid.appendChild(dayCell);
    }
    
    updateMonthlySummary();
}

/**
 * Format date as YYYY-MM-DD for localStorage key
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @param {number} day - The day of the month
 * @returns {string} Formatted date string
 */
function formatDateKey(year, month, day) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `planner-${year}-${monthStr}-${dayStr}`;
}

/**
 * Format date for display in modal
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @param {number} day - The day of the month
 * @returns {string} Formatted date string for display
 */
function formatDateDisplay(year, month, day) {
    return `${monthNames[month]} ${day}, ${year}`;
}

/**
 * Open the modal for a specific date
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @param {number} day - The day of the month
 */
async function openModal(year, month, day) {
    const modal = document.getElementById('noteModal');
    const modalDate = document.getElementById('modalDate');
    const noteTextarea = document.getElementById('noteText');
    
    if (!modal || !modalDate || !noteTextarea) {
        return;
    }
    
    // Set the date in the modal
    modalDate.textContent = formatDateDisplay(year, month, day);
    
    // Store the current date being edited
    const dateKey = formatDateKey(year, month, day);
    modal.dataset.dateKey = dateKey;
    
    // Load existing note if any
    const existingNote = await loadNote(dateKey);
    
    if (existingNote) {
        // Load text
        noteTextarea.value = existingNote.text || '';
        
        // Load color
        if (existingNote.color) {
            const colorBtn = document.querySelector(`.color-btn[data-color="${existingNote.color}"]`);
            if (colorBtn) {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
                colorBtn.classList.add('selected');
            }
        }
        
        // Load emoji
        if (existingNote.emoji) {
            const emojiBtn = document.querySelector(`.emoji-btn[data-emoji="${existingNote.emoji}"]`);
            if (emojiBtn) {
                document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
                emojiBtn.classList.add('selected');
                const selectedEmoji = document.getElementById('selectedEmoji');
                if (selectedEmoji) {
                    selectedEmoji.textContent = existingNote.emoji !== 'none' ? existingNote.emoji : '';
                }
            }
        }
        
        // Load checklist
        if (existingNote.checklist && existingNote.checklist.length > 0) {
            const checklistContainer = document.getElementById('checklistContainer');
            if (checklistContainer) {
                checklistContainer.innerHTML = '';
                existingNote.checklist.forEach(item => {
                    addChecklistItem(item.text, item.completed, item.id);
                });
            }
        } else {
            const checklistContainer = document.getElementById('checklistContainer');
            if (checklistContainer) {
                checklistContainer.innerHTML = '';
            }
        }
        
        // Load image
        if (existingNote.image) {
            const imagePreview = document.getElementById('imagePreview');
            const removeImageBtn = document.getElementById('removeImage');
            if (imagePreview) {
                imagePreview.innerHTML = `<img src="${existingNote.image}" alt="Note attachment">`;
            }
            if (removeImageBtn) {
                removeImageBtn.style.display = 'inline-block';
            }
        } else {
            const imagePreview = document.getElementById('imagePreview');
            const removeImageBtn = document.getElementById('removeImage');
            if (imagePreview) {
                imagePreview.innerHTML = '';
            }
            if (removeImageBtn) {
                removeImageBtn.style.display = 'none';
            }
        }
        
        // Load time
        if (existingNote.time !== undefined) {
            const noteTime = document.getElementById('noteTime');
            if (noteTime) {
                noteTime.value = existingNote.time !== null ? String(existingNote.time) : '';
            }
        } else {
            const noteTime = document.getElementById('noteTime');
            if (noteTime) {
                noteTime.value = '';
            }
        }
        
        // Load reminder
        if (existingNote.reminder) {
            const reminderTime = document.getElementById('reminderTime');
            const clearReminderBtn = document.getElementById('clearReminder');
            if (reminderTime) {
                // Convert ISO string to datetime-local format
                const reminderDate = new Date(existingNote.reminder);
                const localDateTime = new Date(reminderDate.getTime() - reminderDate.getTimezoneOffset() * 60000)
                    .toISOString().slice(0, 16);
                reminderTime.value = localDateTime;
            }
            if (clearReminderBtn) {
                clearReminderBtn.style.display = 'inline-block';
            }
        } else {
            const reminderTime = document.getElementById('reminderTime');
            const clearReminderBtn = document.getElementById('clearReminder');
            if (reminderTime) {
                reminderTime.value = '';
            }
            if (clearReminderBtn) {
                clearReminderBtn.style.display = 'none';
            }
        }
    } else {
        // Reset all fields
        noteTextarea.value = '';
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
        document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
        const selectedEmoji = document.getElementById('selectedEmoji');
        if (selectedEmoji) {
            selectedEmoji.textContent = '';
        }
        const checklistContainer = document.getElementById('checklistContainer');
        if (checklistContainer) {
            checklistContainer.innerHTML = '';
        }
        const imagePreview = document.getElementById('imagePreview');
        const removeImageBtn = document.getElementById('removeImage');
        if (imagePreview) {
            imagePreview.innerHTML = '';
        }
        if (removeImageBtn) {
            removeImageBtn.style.display = 'none';
        }
        const reminderTime = document.getElementById('reminderTime');
        const clearReminderBtn = document.getElementById('clearReminder');
        if (reminderTime) {
            reminderTime.value = '';
        }
        if (clearReminderBtn) {
            clearReminderBtn.style.display = 'none';
        }
        const noteTime = document.getElementById('noteTime');
        if (noteTime) {
            noteTime.value = '';
        }
    }
    
    checklistItemId = 0;
    
    // Show the modal
    modal.style.display = 'block';
}

/**
 * Close the modal
 * Clears all fields and hides the modal
 */
function closeModal() {
    const modal = document.getElementById('noteModal');
    const noteTextarea = document.getElementById('noteText');
    
    if (modal) {
        modal.style.display = 'none';
    }
    
    if (noteTextarea) {
        noteTextarea.value = '';
    }
}

/**
 * Save a note to the database API (with localStorage fallback)
 * Uses the date key pattern: planner-YYYY-MM-DD
 * Stores note as JSON object with text, color, emoji, checklist, image, and reminder
 */
async function saveNote() {
    const modal = document.getElementById('noteModal');
    const noteTextarea = document.getElementById('noteText');
    
    if (!modal || !noteTextarea) {
        return;
    }
    
    const dateKey = modal.dataset.dateKey;
    const noteText = noteTextarea.value.trim();
    
    if (!dateKey) {
        return;
    }
    
    // Get selected color
    const selectedColorBtn = document.querySelector('.color-btn.selected');
    const color = selectedColorBtn ? selectedColorBtn.dataset.color : 'none';
    
    // Get selected emoji
    const selectedEmojiBtn = document.querySelector('.emoji-btn.selected');
    const emoji = selectedEmojiBtn ? selectedEmojiBtn.dataset.emoji : 'none';
    
    // Get checklist items
    const checklistItems = [];
    document.querySelectorAll('.checklist-item').forEach(item => {
        const textInput = item.querySelector('input[type="text"]');
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (textInput && textInput.value.trim()) {
            checklistItems.push({
                id: item.dataset.itemId || Date.now(),
                text: textInput.value.trim(),
                completed: checkbox ? checkbox.checked : false
            });
        }
    });
    
    // Get image
    const imagePreview = document.getElementById('imagePreview');
    const image = imagePreview && imagePreview.querySelector('img') 
        ? imagePreview.querySelector('img').src 
        : null;
    
    // Get time
    const noteTimeSelect = document.getElementById('noteTime');
    const time = noteTimeSelect && noteTimeSelect.value 
        ? parseInt(noteTimeSelect.value) 
        : null;
    
    // Get reminder
    const reminderTime = document.getElementById('reminderTime');
    const reminder = reminderTime && reminderTime.value 
        ? new Date(reminderTime.value).toISOString() 
        : null;
    
    // Create note object
    const noteData = {
        text: noteText,
        color: color,
        emoji: emoji,
        checklist: checklistItems,
        image: image,
        time: time,
        reminder: reminder,
        createdAt: new Date().toISOString()
    };
    
    // Check if note has any content
    const hasContent = noteText || 
        (color && color !== 'none') || 
        (emoji && emoji !== 'none') || 
        checklistItems.length > 0 || 
        image || 
        reminder;
    
    // Save note to database API (with localStorage fallback)
    if (hasContent) {
        await saveNoteToAPI(dateKey, noteData);
    } else {
        await deleteNoteFromAPI(dateKey);
    }
    
    // Regenerate calendar to show updated note indicator
    await generateCalendar();
    if (currentView === 'timeline') {
        await generateTimeline();
    }
    
    // Refresh notes list if it's currently open
    const notesListView = document.getElementById('notesListView');
    if (notesListView && notesListView.style.display === 'block') {
        await generateNotesList();
    }
    
    // Update sidebar to show notes for current hour
    await updateHourlySidebar();
    
    // Close the modal
    closeModal();
}

/**
 * Load a note from the database API (with localStorage fallback)
 * @param {string} dateKey - The date key in format planner-YYYY-MM-DD
 * @returns {Promise<object|null>} The note data object or null if not found
 */
async function loadNote(dateKey) {
    try {
        return await loadNoteFromAPI(dateKey);
    } catch (error) {
        // Fallback to localStorage if API fails
        return loadNoteFromLocalStorage(dateKey);
    }
}

/**
 * Delete a note from the database API (with localStorage fallback)
 * Removes the note and regenerates the calendar
 */
async function deleteNote() {
    const modal = document.getElementById('noteModal');
    
    if (!modal) {
        return;
    }
    
    const dateKey = modal.dataset.dateKey;
    
    if (!dateKey) {
        return;
    }
    
    // Confirm deletion
    if (confirm('Are you sure you want to delete this note?')) {
        // Remove note from localStorage
        localStorage.removeItem(dateKey);
        
        // Clear all fields
        const noteTextarea = document.getElementById('noteText');
        if (noteTextarea) {
            noteTextarea.value = '';
        }
        
        // Regenerate calendar to remove note indicator
        generateCalendar();
        if (currentView === 'timeline') {
            generateTimeline();
        }
        
        // Close the modal
        closeModal();
    }
}

/**
 * Change the displayed month
 * @param {number} direction - 1 for next month, -1 for previous month
 */
function changeMonth(direction) {
    currentMonth += direction;
    
    // Handle year rollover
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    
    // Regenerate calendar with new month
    if (currentView === 'calendar') {
        generateCalendar();
    } else {
        generateTimeline();
    }
}

/**
 * Add a checklist item to the modal
 * @param {string} text - Initial text for the item
 * @param {boolean} completed - Whether the item is completed
 * @param {string} itemId - Optional ID for the item
 */
function addChecklistItem(text = '', completed = false, itemId = null) {
    const checklistContainer = document.getElementById('checklistContainer');
    if (!checklistContainer) {
        return;
    }
    
    const itemIdValue = itemId || `item-${Date.now()}-${checklistItemId++}`;
    
    const item = document.createElement('div');
    item.className = 'checklist-item';
    item.dataset.itemId = itemIdValue;
    if (completed) {
        item.classList.add('completed');
    }
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            item.classList.add('completed');
        } else {
            item.classList.remove('completed');
        }
    });
    
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Enter task...';
    textInput.value = text;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-remove-task';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
        item.remove();
    });
    
    item.appendChild(checkbox);
    item.appendChild(textInput);
    item.appendChild(removeBtn);
    checklistContainer.appendChild(item);
}

/**
 * Handle image upload
 * Converts image to base64 and displays preview
 */
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const imagePreview = document.getElementById('imagePreview');
        const removeImageBtn = document.getElementById('removeImage');
        if (imagePreview) {
            imagePreview.innerHTML = `<img src="${event.target.result}" alt="Note attachment">`;
        }
        if (removeImageBtn) {
            removeImageBtn.style.display = 'inline-block';
        }
    };
    reader.readAsDataURL(file);
}

/**
 * Remove image from note
 */
function removeImage() {
    const imagePreview = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImage');
    const imageUpload = document.getElementById('imageUpload');
    
    if (imagePreview) {
        imagePreview.innerHTML = '';
    }
    if (removeImageBtn) {
        removeImageBtn.style.display = 'none';
    }
    if (imageUpload) {
        imageUpload.value = '';
    }
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
}

/**
 * Change theme
 * @param {string} theme - Theme name (minimal, neon, pastel, darkglass)
 */
function changeTheme(theme) {
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    if (theme !== 'minimal') {
        document.body.classList.add(`theme-${theme}`);
    }
    localStorage.setItem('theme', theme);
}

/**
 * Toggle between calendar and timeline view
 */
function toggleView() {
    const calendarView = document.getElementById('calendarView');
    const timelineView = document.getElementById('timelineView');
    const notesListView = document.getElementById('notesListView');
    const viewToggle = document.getElementById('viewToggle');
    
    // Hide notes list if open
    if (notesListView) {
        notesListView.style.display = 'none';
    }
    
    if (currentView === 'calendar') {
        currentView = 'timeline';
        if (calendarView) {
            calendarView.style.display = 'none';
        }
        if (timelineView) {
            timelineView.style.display = 'block';
        }
        if (viewToggle) {
            viewToggle.textContent = '📅 Calendar View';
        }
        generateTimeline();
    } else {
        currentView = 'calendar';
        if (calendarView) {
            calendarView.style.display = 'block';
        }
        if (timelineView) {
            timelineView.style.display = 'none';
        }
        if (viewToggle) {
            viewToggle.textContent = '📅 Timeline View';
        }
        generateCalendar();
    }
}

/**
 * Toggle notes list view
 * Shows all notes in a list format
 */
async function toggleNotesList() {
    const calendarView = document.getElementById('calendarView');
    const timelineView = document.getElementById('timelineView');
    const notesListView = document.getElementById('notesListView');
    
    // Hide other views
    if (calendarView) {
        calendarView.style.display = 'none';
    }
    if (timelineView) {
        timelineView.style.display = 'none';
    }
    
    // Toggle notes list
    if (notesListView) {
        const isVisible = notesListView.style.display === 'block';
        if (isVisible) {
            // Hide notes list and show calendar
            notesListView.style.display = 'none';
            if (calendarView) {
                calendarView.style.display = 'block';
            }
            currentView = 'calendar';
        } else {
            // Show notes list
            notesListView.style.display = 'block';
            await generateNotesList();
        }
    }
}

/**
 * Generate notes list view showing all notes
 */
async function generateNotesList() {
    const notesListContent = document.getElementById('notesListContent');
    if (!notesListContent) {
        return;
    }
    
    notesListContent.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">Loading notes...</p>';
    
    // Get all notes from database/localStorage
    const allNotes = [];
    
    // Try to get all notes from API first
    let apiSuccess = false;
    try {
        const response = await fetch('/api/notes');
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
                apiSuccess = true;
                Object.keys(result.data).forEach(dateKey => {
                    const noteData = result.data[dateKey];
                    if (noteData && (
                        noteData.text || 
                        (noteData.color && noteData.color !== 'none') || 
                        (noteData.emoji && noteData.emoji !== 'none') || 
                        (noteData.checklist && noteData.checklist.length > 0) || 
                        noteData.image || 
                        noteData.reminder || 
                        noteData.time !== null
                    )) {
                        const dateStr = dateKey.replace('planner-', '');
                        const [year, month, day] = dateStr.split('-').map(Number);
                        allNotes.push({
                            dateKey: dateKey,
                            date: new Date(year, month - 1, day),
                            year,
                            month: month - 1,
                            day,
                            data: noteData
                        });
                    }
                });
            }
        }
    } catch (error) {
        console.log('API failed, using localStorage fallback');
    }
    
    // Always check localStorage as well (for fallback or notes not yet synced)
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('planner-') && !key.startsWith('plan-') && !key.includes('reminder-shown')) {
            // Skip if already added from API
            if (apiSuccess && allNotes.find(n => n.dateKey === key)) {
                continue;
            }
            
            // Load note from localStorage
            let noteData;
            try {
                const stored = localStorage.getItem(key);
                if (stored) {
                    noteData = JSON.parse(stored);
                    // Ensure time property exists
                    if (noteData.time === undefined) {
                        noteData.time = null;
                    }
                }
            } catch (e) {
                // Old format, convert
                noteData = {
                    text: stored,
                    color: 'none',
                    emoji: 'none',
                    checklist: [],
                    image: null,
                    time: null,
                    reminder: null
                };
            }
            
            if (noteData && (
                noteData.text || 
                (noteData.color && noteData.color !== 'none') || 
                (noteData.emoji && noteData.emoji !== 'none') || 
                (noteData.checklist && noteData.checklist.length > 0) || 
                noteData.image || 
                noteData.reminder || 
                noteData.time !== null
            )) {
                const dateStr = key.replace('planner-', '');
                const [year, month, day] = dateStr.split('-').map(Number);
                
                // Avoid duplicates
                if (!allNotes.find(n => n.dateKey === key)) {
                    allNotes.push({
                        dateKey: key,
                        date: new Date(year, month - 1, day),
                        year,
                        month: month - 1,
                        day,
                        data: noteData
                    });
                }
            }
        }
    }
    
    // Sort by date (newest first)
    allNotes.sort((a, b) => b.date - a.date);
    
    if (allNotes.length === 0) {
        notesListContent.innerHTML = '<p style="text-align: center; padding: 40px; color: #999; font-style: italic;">No notes found. Start adding notes by clicking on any calendar day!</p>';
        return;
    }
    
    // Generate notes list HTML
    let notesHTML = '<div class="notes-list-grid">';
    
    allNotes.forEach(note => {
        const dateDisplay = formatDateDisplay(note.year, note.month, note.day);
        const noteItem = document.createElement('div');
        noteItem.className = 'note-list-item';
        
        // Apply color if set
        if (note.data.color && note.data.color !== 'none') {
            noteItem.classList.add(`color-${note.data.color}`);
        }
        
        let itemHTML = `<div class="note-list-item-header">`;
        itemHTML += `<div class="note-list-date">${dateDisplay}</div>`;
        
        // Show emoji if set
        if (note.data.emoji && note.data.emoji !== 'none') {
            itemHTML += `<span class="note-list-emoji">${note.data.emoji}</span>`;
        }
        
        // Show time if set
        if (note.data.time !== null && note.data.time !== undefined) {
            const hour = parseInt(note.data.time);
            const hour12 = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            itemHTML += `<span class="note-list-time">${hour12}:00 ${ampm}</span>`;
        }
        
        itemHTML += `</div>`;
        
        // Show note text
        if (note.data.text) {
            itemHTML += `<div class="note-list-text">${note.data.text}</div>`;
        }
        
        // Show checklist if any
        if (note.data.checklist && note.data.checklist.length > 0) {
            itemHTML += `<div class="note-list-checklist">`;
            note.data.checklist.forEach(item => {
                const completedClass = item.completed ? 'completed' : '';
                itemHTML += `<div class="note-list-checklist-item ${completedClass}">${item.completed ? '✓' : '○'} ${item.text}</div>`;
            });
            itemHTML += `</div>`;
        }
        
        // Show image if any
        if (note.data.image) {
            itemHTML += `<div class="note-list-image"><img src="${note.data.image}" alt="Attachment" style="max-width: 200px; border-radius: 4px; margin-top: 10px;"></div>`;
        }
        
        itemHTML += `<div class="note-list-actions">
            <button class="note-list-edit-btn" data-year="${note.year}" data-month="${note.month}" data-day="${note.day}" data-date-key="${note.dateKey}">✏️ Edit</button>
            <button class="note-list-delete-btn" data-date-key="${note.dateKey}" data-date-display="${dateDisplay}">🗑️ Delete</button>
        </div>`;
        
        noteItem.innerHTML = itemHTML;
        notesHTML += noteItem.outerHTML;
    });
    
    notesHTML += '</div>';
    notesListContent.innerHTML = notesHTML;
    
    // Use event delegation for all buttons in the notes list
    notesListContent.addEventListener('click', async (e) => {
        // Handle edit button clicks
        if (e.target.classList.contains('note-list-edit-btn') || e.target.closest('.note-list-edit-btn')) {
            e.preventDefault();
            e.stopPropagation();
            
            const btn = e.target.classList.contains('note-list-edit-btn') ? e.target : e.target.closest('.note-list-edit-btn');
            const year = parseInt(btn.dataset.year);
            const month = parseInt(btn.dataset.month);
            const day = parseInt(btn.dataset.day);
            
            // Hide notes list
            const notesListView = document.getElementById('notesListView');
            if (notesListView) {
                notesListView.style.display = 'none';
            }
            // Show calendar
            const calendarView = document.getElementById('calendarView');
            if (calendarView) {
                calendarView.style.display = 'block';
            }
            // Navigate to the month and open modal
            currentYear = year;
            currentMonth = month;
            await generateCalendar();
            await openModal(year, month, day);
        }
        
        // Handle delete button clicks
        if (e.target.classList.contains('note-list-delete-btn') || e.target.closest('.note-list-delete-btn')) {
            e.preventDefault();
            e.stopPropagation();
            
            const btn = e.target.classList.contains('note-list-delete-btn') ? e.target : e.target.closest('.note-list-delete-btn');
            const dateKey = btn.dataset.dateKey;
            const dateDisplay = btn.dataset.dateDisplay;
            const noteItem = btn.closest('.note-list-item');
            
            if (confirm(`Are you sure you want to delete the note for ${dateDisplay}?`)) {
                // Delete the note
                await deleteNoteFromAPI(dateKey);
                
                // Remove the note item from the list
                if (noteItem) {
                    noteItem.remove();
                }
                
                // If no notes left, show message
                const remainingNotes = notesListContent.querySelectorAll('.note-list-item');
                if (remainingNotes.length === 0) {
                    notesListContent.innerHTML = '<p style="text-align: center; padding: 40px; color: #999; font-style: italic;">No notes found. Start adding notes by clicking on any calendar day!</p>';
                }
                
                // Update calendar and sidebar
                await generateCalendar();
                await updateHourlySidebar();
                await updateMonthlySummary();
            }
        }
    });
}

/**
 * Generate timeline view showing all notes sorted by date
 */
function generateTimeline() {
    const timelineContent = document.getElementById('timelineContent');
    if (!timelineContent) {
        return;
    }
    
    timelineContent.innerHTML = '';
    
    // Get all notes from localStorage
    const allNotes = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('planner-')) {
            const noteData = loadNote(key);
            if (noteData) {
                const dateStr = key.replace('planner-', '');
                const [year, month, day] = dateStr.split('-').map(Number);
                allNotes.push({
                    dateKey: key,
                    date: new Date(year, month - 1, day),
                    year,
                    month: month - 1,
                    day,
                    data: noteData
                });
            }
        }
    }
    
    // Filter by search query if present
    let filteredNotes = allNotes;
    if (searchQuery) {
        filteredNotes = allNotes.filter(note => {
            return (note.data.text && note.data.text.toLowerCase().includes(searchQuery)) ||
                   (note.data.checklist && note.data.checklist.some(item => 
                       item.text && item.text.toLowerCase().includes(searchQuery)
                   ));
        });
    }
    
    // Sort by date
    filteredNotes.sort((a, b) => a.date - b.date);
    
    if (filteredNotes.length === 0) {
        timelineContent.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">No notes found.</p>';
        return;
    }
    
    // Create timeline items
    filteredNotes.forEach(note => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        if (note.data.color && note.data.color !== 'none') {
            item.classList.add(`color-${note.data.color}`);
        }
        
        const dateDisplay = formatDateDisplay(note.year, note.month, note.day);
        let html = `<div class="timeline-date">${dateDisplay}`;
        if (note.data.emoji && note.data.emoji !== 'none') {
            html += ` <span class="timeline-emoji">${note.data.emoji}</span>`;
        }
        html += `</div>`;
        
        if (note.data.text) {
            html += `<div class="timeline-note">${note.data.text}</div>`;
        }
        
        if (note.data.checklist && note.data.checklist.length > 0) {
            html += '<div class="timeline-checklist">';
            note.data.checklist.forEach(checkItem => {
                const completedClass = checkItem.completed ? 'completed' : '';
                html += `<div class="timeline-checklist-item ${completedClass}">${checkItem.completed ? '✓' : '○'} ${checkItem.text}</div>`;
            });
            html += '</div>';
        }
        
        if (note.data.image) {
            html += `<div class="timeline-image"><img src="${note.data.image}" alt="Attachment" style="max-width: 200px; border-radius: 4px; margin-top: 10px;"></div>`;
        }
        
        item.innerHTML = html;
        item.addEventListener('click', () => {
            openModal(note.year, note.month, note.day);
        });
        
        timelineContent.appendChild(item);
    });
}

/**
 * Update monthly summary statistics
 */
async function updateMonthlySummary() {
    let totalNotes = 0;
    let importantNotes = 0;
    let tasksCompleted = 0;
    let totalTasks = 0;
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = formatDateKey(currentYear, currentMonth, day);
        const noteData = await loadNote(dateKey);
        
        // Only count notes that have actual content
        if (noteData && (
            noteData.text || 
            (noteData.color && noteData.color !== 'none') || 
            (noteData.emoji && noteData.emoji !== 'none') || 
            (noteData.checklist && noteData.checklist.length > 0) || 
            noteData.image || 
            noteData.reminder || 
            noteData.time !== null
        )) {
            totalNotes++;
            
            if (noteData.color === 'red') {
                importantNotes++;
            }
            
            if (noteData.checklist && noteData.checklist.length > 0) {
                noteData.checklist.forEach(item => {
                    totalTasks++;
                    if (item.completed) {
                        tasksCompleted++;
                    }
                });
            }
        }
        
        // Also check daily plans for tasks
        const planData = await loadDailyPlan(dateKey);
        if (planData && planData.tasks && planData.tasks.length > 0) {
            planData.tasks.forEach(item => {
                totalTasks++;
                if (item.completed) {
                    tasksCompleted++;
                }
            });
        }
    }
    
    const totalNotesEl = document.getElementById('totalNotes');
    const importantNotesEl = document.getElementById('importantNotes');
    const tasksCompletedEl = document.getElementById('tasksCompleted');
    
    if (totalNotesEl) {
        totalNotesEl.textContent = totalNotes;
    }
    if (importantNotesEl) {
        importantNotesEl.textContent = importantNotes;
    }
    if (tasksCompletedEl) {
        tasksCompletedEl.textContent = `${tasksCompleted} / ${totalTasks}`;
    }
}

/**
 * Handle drag start for drag-and-drop
 */
function handleDragStart(e, dateKey) {
    e.dataTransfer.setData('text/plain', dateKey);
    e.target.classList.add('dragging');
}

/**
 * Handle drag over for drag-and-drop
 */
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

/**
 * Handle drop for drag-and-drop
 */
function handleDrop(e, targetDateKey) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const sourceDateKey = e.dataTransfer.getData('text/plain');
    
    if (sourceDateKey && sourceDateKey !== targetDateKey) {
        const sourceNote = loadNote(sourceDateKey);
        if (sourceNote) {
            // Save note to new date
            localStorage.setItem(targetDateKey, JSON.stringify(sourceNote));
            // Remove note from old date
            localStorage.removeItem(sourceDateKey);
            // Regenerate calendar
            generateCalendar();
            if (currentView === 'timeline') {
                generateTimeline();
            }
        }
    }
}

/**
 * Handle drag end for drag-and-drop
 */
function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('drag-over');
    });
}

/**
 * Check for reminders and show notifications
 */
function checkReminders() {
    const now = new Date();
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('planner-')) {
            const noteData = loadNote(key);
            if (noteData && noteData.reminder) {
                const reminderTime = new Date(noteData.reminder);
                const timeDiff = reminderTime - now;
                
                // Show notification if reminder is within the next minute and hasn't been shown
                if (timeDiff > 0 && timeDiff <= 60000) {
                    const reminderKey = `reminder-shown-${key}`;
                    if (!localStorage.getItem(reminderKey)) {
                        showReminderNotification(key, noteData);
                        localStorage.setItem(reminderKey, 'true');
                        // Remove the flag after 5 minutes
                        setTimeout(() => {
                            localStorage.removeItem(reminderKey);
                        }, 300000);
                    }
                }
            }
        }
    }
}

/**
 * Show browser notification for reminder
 */
function showReminderNotification(dateKey, noteData) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const dateStr = dateKey.replace('planner-', '');
        const [year, month, day] = dateStr.split('-').map(Number);
        const dateDisplay = formatDateDisplay(year, month - 1, day);
        
        new Notification('Daily Gospel Planner Reminder', {
            body: `${dateDisplay}: ${noteData.text || 'You have a reminder!'}`,
            icon: '/favicon.ico'
        });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showReminderNotification(dateKey, noteData);
            }
        });
    }
}

/**
 * Open the daily plan modal for a specific date
 * Shows hourly time slots from 12 AM to 11 PM
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @param {number} day - The day of the month
 */
async function openDailyPlanModal(year, month, day) {
    const modal = document.getElementById('dailyPlanModal');
    const planModalDate = document.getElementById('planModalDate');
    
    if (!modal || !planModalDate) {
        return;
    }
    
    // Set the date in the modal
    planModalDate.textContent = formatDateDisplay(year, month, day);
    
    // Store the current date being edited
    const dateKey = formatDateKey(year, month, day);
    modal.dataset.dateKey = dateKey;
    
    // Generate hourly slots
    generateHourlySlots();
    
    // Load existing plan if any
    const existingPlan = await loadDailyPlan(dateKey);
    if (existingPlan) {
        // Load hourly plans
        if (existingPlan.hourlyPlans) {
            Object.keys(existingPlan.hourlyPlans).forEach(hour => {
                const slot = document.querySelector(`[data-hour="${hour}"]`);
                if (slot) {
                    const textarea = slot.querySelector('textarea');
                    if (textarea) {
                        textarea.value = existingPlan.hourlyPlans[hour] || '';
                    }
                }
            });
        }
        
        // Load tasks
        if (existingPlan.tasks && existingPlan.tasks.length > 0) {
            const tasksContainer = document.getElementById('tasksContainer');
            if (tasksContainer) {
                tasksContainer.innerHTML = '';
                existingPlan.tasks.forEach(task => {
                    addTaskItem(task.text, task.completed, task.id, task.urgent || false);
                });
            }
        }
        
        // Load notes
        if (existingPlan.notes) {
            const notesTextarea = document.getElementById('planNotes');
            if (notesTextarea) {
                notesTextarea.value = existingPlan.notes;
            }
        }
    }
    
    // Show the modal
    modal.style.display = 'block';
    switchPlanMode('plan');
}

/**
 * Generate hourly time slots from 12 AM to 11 PM
 */
function generateHourlySlots() {
    const hourlySlots = document.getElementById('hourlySlots');
    if (!hourlySlots) {
        return;
    }
    
    hourlySlots.innerHTML = '';
    
    const hours = [
        '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM',
        '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
        '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
        '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
    ];
    
    hours.forEach((hourLabel, index) => {
        const hourSlot = document.createElement('div');
        hourSlot.className = 'hour-slot';
        hourSlot.dataset.hour = index;
        
        const hourLabelEl = document.createElement('div');
        hourLabelEl.className = 'hour-label';
        hourLabelEl.textContent = hourLabel;
        
        const textarea = document.createElement('textarea');
        textarea.className = 'hour-input';
        textarea.placeholder = `Plan for ${hourLabel.toLowerCase()}...`;
        textarea.rows = 2;
        
        hourSlot.appendChild(hourLabelEl);
        hourSlot.appendChild(textarea);
        hourlySlots.appendChild(hourSlot);
    });
}

/**
 * Save current mode's data before switching
 */
async function saveCurrentPlanMode() {
    const modal = document.getElementById('dailyPlanModal');
    if (!modal || !modal.dataset.dateKey) {
        return;
    }
    
    const dateKey = modal.dataset.dateKey;
    const existingPlan = (await loadDailyPlan(dateKey)) || {};
    
    // Save current hourly plans if in plan mode
    const hourlySlots = document.querySelectorAll('.hour-slot');
    if (hourlySlots.length > 0) {
        const hourlyPlans = {};
        hourlySlots.forEach(slot => {
            const hour = slot.dataset.hour;
            const textarea = slot.querySelector('textarea');
            if (textarea && textarea.value.trim()) {
                hourlyPlans[hour] = textarea.value.trim();
            }
        });
        existingPlan.hourlyPlans = hourlyPlans;
    }
    
    // Save current notes if in notes mode
    const notesTextarea = document.getElementById('planNotes');
    if (notesTextarea) {
        existingPlan.notes = notesTextarea.value.trim();
    }
    
    // Save current tasks if in tasks mode
    const taskItems = document.querySelectorAll('.task-item');
    if (taskItems.length > 0) {
        const tasks = [];
        taskItems.forEach(item => {
            const textInput = item.querySelector('.task-input');
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (textInput && textInput.value.trim()) {
            tasks.push({
                id: item.dataset.taskId,
                text: textInput.value.trim(),
                completed: checkbox ? checkbox.checked : false,
                urgent: item.classList.contains('urgent')
            });
            }
        });
        existingPlan.tasks = tasks;
    }
    
    // Save to database API (with localStorage fallback)
    const hasContent = Object.keys(existingPlan.hourlyPlans || {}).length > 0 || 
                       (existingPlan.tasks && existingPlan.tasks.length > 0) || 
                       (existingPlan.notes && existingPlan.notes);
    
    if (hasContent) {
        await savePlanToAPI(dateKey, existingPlan);
    } else {
        // If no content, delete plan via API (with localStorage fallback)
        // This will be handled by savePlanToAPI when hasContent is false
        await savePlanToAPI(dateKey, existingPlan);
    }
}

/**
 * Switch between Plan, Notes, and Tasks modes in daily plan modal
 * @param {string} mode - The mode to switch to ('plan', 'notes', 'tasks')
 */
async function switchPlanMode(mode) {
    // Save current mode's data before switching
    await saveCurrentPlanMode();
    
    // Update button states
    document.querySelectorAll('.btn-plan-action').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
    
    const planContent = document.getElementById('planContent');
    if (!planContent) {
        return;
    }
    
    const modal = document.getElementById('dailyPlanModal');
    const dateKey = modal ? modal.dataset.dateKey : null;
    const existingPlan = dateKey ? (await loadDailyPlan(dateKey)) : null;
    
    if (mode === 'plan') {
        // Show hourly slots
        planContent.innerHTML = '<div id="hourlySlots" class="hourly-slots"></div>';
        generateHourlySlots();
        
        // Load existing hourly plans
        if (existingPlan && existingPlan.hourlyPlans) {
            Object.keys(existingPlan.hourlyPlans).forEach(hour => {
                const slot = document.querySelector(`[data-hour="${hour}"]`);
                if (slot) {
                    const textarea = slot.querySelector('textarea');
                    if (textarea) {
                        textarea.value = existingPlan.hourlyPlans[hour] || '';
                    }
                }
            });
        }
    } else if (mode === 'notes') {
        // Show notes textarea
        planContent.innerHTML = `
            <div class="plan-notes-section">
                <label>Daily Notes:</label>
                <textarea id="planNotes" class="plan-notes-textarea" placeholder="Write your daily notes here..."></textarea>
            </div>
        `;
        
        // Load existing notes
        if (existingPlan && existingPlan.notes) {
            const notesTextarea = document.getElementById('planNotes');
            if (notesTextarea) {
                notesTextarea.value = existingPlan.notes;
            }
        }
    } else if (mode === 'tasks') {
        // Show tasks list
        planContent.innerHTML = `
            <div class="plan-tasks-section">
                <label>Daily Tasks:</label>
                <div id="tasksContainer" class="tasks-container"></div>
                <button id="addTaskBtn" class="btn-add-task">+ Add Task</button>
            </div>
        `;
        
        // Load existing tasks
        if (existingPlan && existingPlan.tasks && existingPlan.tasks.length > 0) {
            existingPlan.tasks.forEach(task => {
                addTaskItem(task.text, task.completed, task.id);
            });
        }
    }
}

/**
 * Add a task item to the tasks list
 * @param {string} text - Initial text for the task
 * @param {boolean} completed - Whether the task is completed
 * @param {string} taskId - Optional ID for the task
 */
function addTaskItem(text = '', completed = false, taskId = null, urgent = false) {
    const tasksContainer = document.getElementById('tasksContainer');
    if (!tasksContainer) {
        return;
    }
    
    const taskIdValue = taskId || `task-${Date.now()}-${Math.random()}`;
    
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.dataset.taskId = taskIdValue;
    if (completed) {
        taskItem.classList.add('completed');
    }
    if (urgent) {
        taskItem.classList.add('urgent');
    }
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            taskItem.classList.add('completed');
        } else {
            taskItem.classList.remove('completed');
        }
    });
    
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Enter task...';
    textInput.value = text;
    textInput.className = 'task-input';
    
    const urgentBtn = document.createElement('button');
    urgentBtn.className = `btn-urgent ${urgent ? 'active' : ''}`;
    urgentBtn.textContent = urgent ? '🚨' : '⚪';
    urgentBtn.title = urgent ? 'Urgent - Click to remove' : 'Click to mark urgent';
    urgentBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isUrgent = taskItem.classList.contains('urgent');
        if (isUrgent) {
            taskItem.classList.remove('urgent');
            urgentBtn.classList.remove('active');
            urgentBtn.textContent = '⚪';
            urgentBtn.title = 'Click to mark urgent';
        } else {
            taskItem.classList.add('urgent');
            urgentBtn.classList.add('active');
            urgentBtn.textContent = '🚨';
            urgentBtn.title = 'Urgent - Click to remove';
        }
    });
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-remove-task';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
        taskItem.remove();
    });
    
    taskItem.appendChild(checkbox);
    taskItem.appendChild(textInput);
    taskItem.appendChild(urgentBtn);
    taskItem.appendChild(removeBtn);
    tasksContainer.appendChild(taskItem);
}

/**
 * Save the daily plan to localStorage
 */
async function saveDailyPlan() {
    const modal = document.getElementById('dailyPlanModal');
    if (!modal) {
        return;
    }
    
    const dateKey = modal.dataset.dateKey;
    if (!dateKey) {
        return;
    }
    
    // Collect hourly plans
    const hourlyPlans = {};
    document.querySelectorAll('.hour-slot').forEach(slot => {
        const hour = slot.dataset.hour;
        const textarea = slot.querySelector('textarea');
        if (textarea && textarea.value.trim()) {
            hourlyPlans[hour] = textarea.value.trim();
        }
    });
    
    // Collect tasks
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(item => {
        const textInput = item.querySelector('.task-input');
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (textInput && textInput.value.trim()) {
            tasks.push({
                id: item.dataset.taskId,
                text: textInput.value.trim(),
                completed: checkbox ? checkbox.checked : false,
                urgent: item.classList.contains('urgent')
            });
        }
    });
    
    // Get notes
    const notesTextarea = document.getElementById('planNotes');
    const notes = notesTextarea ? notesTextarea.value.trim() : '';
    
    // Create plan object
    const planData = {
        hourlyPlans: hourlyPlans,
        tasks: tasks,
        notes: notes,
        createdAt: new Date().toISOString()
    };
    
    // Save plan to database API (with localStorage fallback)
    await savePlanToAPI(dateKey, planData);
    
    // Regenerate calendar to show updated plan indicator
    await generateCalendar();
    
    // Update sidebar
    await updateHourlySidebar();
    
    // Close the modal
    closeDailyPlanModal();
}

/**
 * Load daily plan from the database API (with localStorage fallback)
 * @param {string} dateKey - The date key in format planner-YYYY-MM-DD
 * @returns {Promise<object|null>} The plan data object or null if not found
 */
async function loadDailyPlan(dateKey) {
    try {
        return await loadPlanFromAPI(dateKey);
    } catch (error) {
        // Fallback to localStorage if API fails
        return loadPlanFromLocalStorage(dateKey);
    }
}

/**
 * Close the daily plan modal
 */
function closeDailyPlanModal() {
    const modal = document.getElementById('dailyPlanModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Update the hourly sidebar with current hour's tasks and notes
 * Updates every hour automatically
 */
async function updateHourlySidebar() {
    const currentHourDisplay = document.getElementById('currentHourDisplay');
    const currentHourNotes = document.getElementById('currentHourNotes');
    const currentHourTasks = document.getElementById('currentHourTasks');
    const urgentTasks = document.getElementById('urgentTasks');
    
    if (!currentHourDisplay || !currentHourNotes || !currentHourTasks || !urgentTasks) {
        return;
    }
    
    // Get current date and hour
    const now = new Date();
    const currentHour = now.getHours();
    const currentDate = now.getDate();
    const currentMonthIndex = now.getMonth();
    const currentYearValue = now.getFullYear();
    
    // Format current hour display
    const hour12 = currentHour === 0 ? 12 : (currentHour > 12 ? currentHour - 12 : currentHour);
    const ampm = currentHour >= 12 ? 'PM' : 'AM';
    const hourLabel = `${hour12}:00 ${ampm}`;
    currentHourDisplay.textContent = hourLabel;
    
    // Get date key for today
    const dateKey = formatDateKey(currentYearValue, currentMonthIndex, currentDate);
    const planData = await loadDailyPlan(dateKey);
    
    // Get hour index (0-23 for 12 AM to 11 PM)
    const hourIndex = currentHour;
    
    // Display notes for current hour
    // First check hourly plans from daily plan
    let hourNotes = [];
    if (planData && planData.hourlyPlans && planData.hourlyPlans[hourIndex]) {
        hourNotes.push({
            text: planData.hourlyPlans[hourIndex],
            source: 'plan'
        });
    }
    
    // Also check notes with time selection
    const noteData = await loadNote(dateKey);
    if (noteData && noteData.time !== null && noteData.time !== undefined && parseInt(noteData.time) === hourIndex) {
        if (noteData.text) {
            hourNotes.push({
                text: noteData.text,
                source: 'note',
                emoji: noteData.emoji,
                color: noteData.color
            });
        }
    }
    
    // Display all notes for this hour
    if (hourNotes.length > 0) {
        let notesHTML = '';
        hourNotes.forEach(note => {
            let noteContent = '';
            if (note.emoji && note.emoji !== 'none') {
                noteContent += `<span style="font-size: 18px; margin-right: 5px;">${note.emoji}</span>`;
            }
            noteContent += note.text;
            const borderColor = note.color === 'red' ? '#e74c3c' : note.color === 'blue' ? '#4a90e2' : note.color === 'green' ? '#2ecc71' : '#4a90e2';
            notesHTML += `<p class="hour-content" style="border-left-color: ${borderColor};">${noteContent}</p>`;
        });
        currentHourNotes.innerHTML = notesHTML;
    } else {
        currentHourNotes.innerHTML = '<p class="no-content">No notes for this hour</p>';
    }
    
    // Display tasks for current hour (all tasks from today's plan)
    const allTasks = planData && planData.tasks ? planData.tasks : [];
    const urgentTasksList = [];
    const regularTasksList = [];
    
    // Show all tasks (both completed and incomplete) so users can toggle them
    allTasks.forEach(task => {
        if (task.urgent) {
            urgentTasksList.push(task);
        } else {
            regularTasksList.push(task);
        }
    });
    
    // Display regular tasks
    if (regularTasksList.length > 0) {
        currentHourTasks.innerHTML = '';
        regularTasksList.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'sidebar-task-item';
            taskItem.dataset.taskId = task.id;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed || false;
            checkbox.addEventListener('change', () => {
                toggleTaskCompletion(dateKey, task.id, checkbox.checked);
            });
            
            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            if (checkbox.checked) {
                taskText.style.textDecoration = 'line-through';
                taskText.style.color = '#999';
            }
            
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            currentHourTasks.appendChild(taskItem);
        });
    } else {
        currentHourTasks.innerHTML = '<p class="no-content">No tasks for this hour</p>';
    }
    
    // Display urgent tasks
    if (urgentTasksList.length > 0) {
        urgentTasks.innerHTML = '';
        urgentTasksList.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'sidebar-task-item urgent';
            taskItem.dataset.taskId = task.id;
            
            const urgentIcon = document.createElement('span');
            urgentIcon.className = 'urgent-icon';
            urgentIcon.textContent = '🚨';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed || false;
            checkbox.addEventListener('change', () => {
                toggleTaskCompletion(dateKey, task.id, checkbox.checked);
            });
            
            const taskText = document.createElement('span');
            taskText.className = 'urgent-text';
            taskText.textContent = task.text;
            if (checkbox.checked) {
                taskText.style.textDecoration = 'line-through';
                taskText.style.opacity = '0.7';
            }
            
            taskItem.appendChild(urgentIcon);
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            urgentTasks.appendChild(taskItem);
        });
    } else {
        urgentTasks.innerHTML = '<p class="no-content">No urgent tasks</p>';
    }
}

/**
 * Toggle task completion status and save to localStorage
 * @param {string} dateKey - The date key for the plan
 * @param {string} taskId - The task ID to toggle
 * @param {boolean} completed - The new completion status
 */
async function toggleTaskCompletion(dateKey, taskId, completed) {
    const planData = await loadDailyPlan(dateKey);
    if (!planData || !planData.tasks) {
        return;
    }
    
    // Find and update the task
    const task = planData.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = completed;
        
        // Save updated plan to database API (with localStorage fallback)
        await savePlanToAPI(dateKey, planData);
        
        // Update sidebar to reflect changes
        await updateHourlySidebar();
        
        // Update monthly summary
        updateMonthlySummary();
    }
}

/**
 * Make a modal draggable by its header
 * @param {string} modalId - The ID of the modal element
 * @param {string} headerSelector - The selector for the draggable header
 */
function makeModalDraggable(modalId, headerSelector) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        return;
    }
    
    const modalContent = modal.querySelector('.modal-content');
    const header = modal.querySelector(`.${headerSelector}`);
    
    if (!modalContent || !header) {
        return;
    }
    
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    // Reset position when modal opens
    const originalDisplay = modal.style.display;
    const observer = new MutationObserver(() => {
        if (modal.style.display === 'block' && modal.style.display !== originalDisplay) {
            // Reset position when modal opens
            modalContent.style.transform = 'translate(0, 0)';
            xOffset = 0;
            yOffset = 0;
        }
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['style'] });
    
    // Mouse down event on header
    header.addEventListener('mousedown', dragStart);
    
    // Mouse move event
    document.addEventListener('mousemove', drag);
    
    // Mouse up event
    document.addEventListener('mouseup', dragEnd);
    
    // Touch events for mobile support
    header.addEventListener('touchstart', dragStartTouch);
    document.addEventListener('touchmove', dragTouch);
    document.addEventListener('touchend', dragEnd);
    
    function dragStart(e) {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return; // Don't drag if clicking on buttons
        }
        
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        
        if (e.target === header || header.contains(e.target)) {
            isDragging = true;
            header.style.cursor = 'grabbing';
        }
    }
    
    function dragStartTouch(e) {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }
        
        const touch = e.touches[0];
        initialX = touch.clientX - xOffset;
        initialY = touch.clientY - yOffset;
        
        if (e.target === header || header.contains(e.target)) {
            isDragging = true;
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            xOffset = currentX;
            yOffset = currentY;
            
            setTranslate(currentX, currentY, modalContent);
        }
    }
    
    function dragTouch(e) {
        if (isDragging) {
            e.preventDefault();
            
            const touch = e.touches[0];
            currentX = touch.clientX - initialX;
            currentY = touch.clientY - initialY;
            
            xOffset = currentX;
            yOffset = currentY;
            
            setTranslate(currentX, currentY, modalContent);
        }
    }
    
    function dragEnd() {
        if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            header.style.cursor = 'grab';
        }
    }
    
    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }
}

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Initialize the calendar when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
