// API Helper Module for Daily Planner
// This module provides functions to interact with the backend database API

const API_BASE_URL = window.location.origin;

/**
 * Make an API request
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Optional data to send
 * @returns {Promise} Promise that resolves with response data
 */
async function apiRequest(method, endpoint, data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            console.error('API Error:', result.message);
            throw new Error(result.message || 'API request failed');
        }

        return result;
    } catch (error) {
        console.error('API Request Error:', error);
        // Fallback to localStorage if API fails
        console.warn('Falling back to localStorage');
        throw error;
    }
}

/**
 * Load a note from the database
 * @param {string} dateKey - The date key in format planner-YYYY-MM-DD
 * @returns {Promise<Object|null>} The note data object or null if not found
 */
async function loadNoteFromAPI(dateKey) {
    try {
        const result = await apiRequest('GET', `/api/notes/${dateKey}`);
        return result.data;
    } catch (error) {
        // Fallback to localStorage
        return loadNoteFromLocalStorage(dateKey);
    }
}

/**
 * Save a note to the database
 * @param {string} dateKey - The date key in format planner-YYYY-MM-DD
 * @param {Object} noteData - The note data to save
 * @returns {Promise<boolean>} True if successful
 */
async function saveNoteToAPI(dateKey, noteData) {
    try {
        await apiRequest('POST', `/api/notes/${dateKey}`, noteData);
        return true;
    } catch (error) {
        // Fallback to localStorage
        saveNoteToLocalStorage(dateKey, noteData);
        return false;
    }
}

/**
 * Delete a note from the database
 * @param {string} dateKey - The date key in format planner-YYYY-MM-DD
 * @returns {Promise<boolean>} True if successful
 */
async function deleteNoteFromAPI(dateKey) {
    try {
        await apiRequest('DELETE', `/api/notes/${dateKey}`);
        return true;
    } catch (error) {
        // Fallback to localStorage
        deleteNoteFromLocalStorage(dateKey);
        return false;
    }
}

/**
 * Load a daily plan from the database
 * @param {string} dateKey - The date key in format planner-YYYY-MM-DD
 * @returns {Promise<Object|null>} The plan data object or null if not found
 */
async function loadPlanFromAPI(dateKey) {
    try {
        const result = await apiRequest('GET', `/api/plans/${dateKey}`);
        return result.data;
    } catch (error) {
        // Fallback to localStorage
        return loadPlanFromLocalStorage(dateKey);
    }
}

/**
 * Save a daily plan to the database
 * @param {string} dateKey - The date key in format planner-YYYY-MM-DD
 * @param {Object} planData - The plan data to save
 * @returns {Promise<boolean>} True if successful
 */
async function savePlanToAPI(dateKey, planData) {
    try {
        await apiRequest('POST', `/api/plans/${dateKey}`, planData);
        return true;
    } catch (error) {
        // Fallback to localStorage
        savePlanToLocalStorage(dateKey, planData);
        return false;
    }
}

/**
 * Update task completion in the database
 * @param {string} dateKey - The date key in format planner-YYYY-MM-DD
 * @param {string} taskId - The task ID to update
 * @param {boolean} completed - The new completion status
 * @returns {Promise<boolean>} True if successful
 */
async function updateTaskCompletionInAPI(dateKey, taskId, completed) {
    try {
        // First load the plan
        const plan = await loadPlanFromAPI(dateKey);
        if (!plan || !plan.tasks) {
            return false;
        }
        
        // Update the task
        const task = plan.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = completed;
            await savePlanToAPI(dateKey, plan);
            return true;
        }
        return false;
    } catch (error) {
        // Fallback handled in savePlanToAPI
        return false;
    }
}

// ========== FALLBACK: LocalStorage Functions ==========
// These functions are used when API is unavailable

function loadNoteFromLocalStorage(dateKey) {
    const note = localStorage.getItem(dateKey);
    if (!note) {
        return null;
    }
    try {
        const parsedNote = JSON.parse(note);
        if (parsedNote.time === undefined) {
            parsedNote.time = null;
        }
        return parsedNote;
    } catch (e) {
        return {
            text: note,
            color: 'none',
            emoji: 'none',
            checklist: [],
            image: null,
            time: null,
            reminder: null
        };
    }
}

function saveNoteToLocalStorage(dateKey, noteData) {
    const hasContent = noteData.text || 
        (noteData.color && noteData.color !== 'none') || 
        (noteData.emoji && noteData.emoji !== 'none') || 
        (noteData.checklist && noteData.checklist.length > 0) || 
        noteData.image || 
        noteData.reminder || 
        noteData.time !== null;
    
    if (hasContent) {
        localStorage.setItem(dateKey, JSON.stringify(noteData));
    } else {
        localStorage.removeItem(dateKey);
    }
}

function deleteNoteFromLocalStorage(dateKey) {
    localStorage.removeItem(dateKey);
}

function loadPlanFromLocalStorage(dateKey) {
    const plan = localStorage.getItem(`plan-${dateKey}`);
    if (!plan) {
        return null;
    }
    try {
        return JSON.parse(plan);
    } catch (e) {
        return null;
    }
}

function savePlanToLocalStorage(dateKey, planData) {
    const hasContent = Object.keys(planData.hourlyPlans || {}).length > 0 || 
                       (planData.tasks && planData.tasks.length > 0) || 
                       (planData.notes && planData.notes);
    
    if (hasContent) {
        localStorage.setItem(`plan-${dateKey}`, JSON.stringify(planData));
    } else {
        localStorage.removeItem(`plan-${dateKey}`);
    }
}

function deletePlanFromLocalStorage(dateKey) {
    localStorage.removeItem(`plan-${dateKey}`);
}

