// Simple Express Server for Daily Planner App
// This server provides API endpoints for CRUD operations on notes

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Database file path
const DB_FILE = path.join(__dirname, 'data', 'database.json');

/**
 * Initialize database file if it doesn't exist
 */
function initializeDatabase() {
    if (!fs.existsSync(DB_FILE)) {
        const initialData = {
            notes: {},
            plans: {},
            preferences: {}
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
        console.log('Database file created:', DB_FILE);
    }
}

/**
 * Read database from JSON file
 * @returns {Object} Database object
 */
function readDatabase() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return { notes: {}, plans: {}, preferences: {} };
    }
}

/**
 * Write database to JSON file
 * @param {Object} data - Database object to write
 */
function writeDatabase(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing database:', error);
        return false;
    }
}

// Initialize database on server start
initializeDatabase();

// ========== NOTES API ENDPOINTS ==========

/**
 * GET /api/notes/:dateKey
 * Load a note for a specific date
 */
app.get('/api/notes/:dateKey', (req, res) => {
    const { dateKey } = req.params;
    const db = readDatabase();
    
    if (db.notes[dateKey]) {
        res.json({ success: true, data: db.notes[dateKey] });
    } else {
        res.json({ success: true, data: null });
    }
});

/**
 * GET /api/notes
 * Get all notes (for timeline view or search)
 */
app.get('/api/notes', (req, res) => {
    const db = readDatabase();
    res.json({ success: true, data: db.notes });
});

/**
 * POST /api/notes/:dateKey
 * Create or update a note for a specific date
 */
app.post('/api/notes/:dateKey', (req, res) => {
    const { dateKey } = req.params;
    const noteData = req.body;
    
    const db = readDatabase();
    
    // Check if note has content
    const hasContent = noteData.text || 
        (noteData.color && noteData.color !== 'none') || 
        (noteData.emoji && noteData.emoji !== 'none') || 
        (noteData.checklist && noteData.checklist.length > 0) || 
        noteData.image || 
        noteData.reminder || 
        noteData.time !== null;
    
    if (hasContent) {
        // Add timestamp if not present
        if (!noteData.createdAt) {
            noteData.createdAt = new Date().toISOString();
        }
        noteData.updatedAt = new Date().toISOString();
        
        // Save note
        db.notes[dateKey] = noteData;
    } else {
        // If no content, delete the note
        delete db.notes[dateKey];
    }
    
    if (writeDatabase(db)) {
        res.json({ success: true, message: 'Note saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Error saving note' });
    }
});

/**
 * PUT /api/notes/:dateKey
 * Update a note for a specific date
 */
app.put('/api/notes/:dateKey', (req, res) => {
    const { dateKey } = req.params;
    const noteData = req.body;
    
    const db = readDatabase();
    
    if (db.notes[dateKey]) {
        // Update existing note
        noteData.updatedAt = new Date().toISOString();
        db.notes[dateKey] = { ...db.notes[dateKey], ...noteData };
        
        if (writeDatabase(db)) {
            res.json({ success: true, message: 'Note updated successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Error updating note' });
        }
    } else {
        res.status(404).json({ success: false, message: 'Note not found' });
    }
});

/**
 * DELETE /api/notes/:dateKey
 * Delete a note for a specific date
 */
app.delete('/api/notes/:dateKey', (req, res) => {
    const { dateKey } = req.params;
    const db = readDatabase();
    
    if (db.notes[dateKey]) {
        delete db.notes[dateKey];
        
        if (writeDatabase(db)) {
            res.json({ success: true, message: 'Note deleted successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Error deleting note' });
        }
    } else {
        res.status(404).json({ success: false, message: 'Note not found' });
    }
});

// ========== PLANS API ENDPOINTS ==========

/**
 * GET /api/plans/:dateKey
 * Load a daily plan for a specific date
 */
app.get('/api/plans/:dateKey', (req, res) => {
    const { dateKey } = req.params;
    const db = readDatabase();
    
    if (db.plans[dateKey]) {
        res.json({ success: true, data: db.plans[dateKey] });
    } else {
        res.json({ success: true, data: null });
    }
});

/**
 * POST /api/plans/:dateKey
 * Create or update a daily plan for a specific date
 */
app.post('/api/plans/:dateKey', (req, res) => {
    const { dateKey } = req.params;
    const planData = req.body;
    
    const db = readDatabase();
    
    // Check if plan has content
    const hasContent = Object.keys(planData.hourlyPlans || {}).length > 0 || 
                       (planData.tasks && planData.tasks.length > 0) || 
                       (planData.notes && planData.notes);
    
    if (hasContent) {
        // Add timestamp if not present
        if (!planData.createdAt) {
            planData.createdAt = new Date().toISOString();
        }
        planData.updatedAt = new Date().toISOString();
        
        // Save plan
        db.plans[dateKey] = planData;
    } else {
        // If no content, delete the plan
        delete db.plans[dateKey];
    }
    
    if (writeDatabase(db)) {
        res.json({ success: true, message: 'Plan saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Error saving plan' });
    }
});

/**
 * PUT /api/plans/:dateKey
 * Update a daily plan (also used for task completion)
 */
app.put('/api/plans/:dateKey', (req, res) => {
    const { dateKey } = req.params;
    const updateData = req.body;
    
    const db = readDatabase();
    
    if (db.plans[dateKey]) {
        // Update existing plan
        updateData.updatedAt = new Date().toISOString();
        db.plans[dateKey] = { ...db.plans[dateKey], ...updateData };
        
        if (writeDatabase(db)) {
            res.json({ success: true, message: 'Plan updated successfully', data: db.plans[dateKey] });
        } else {
            res.status(500).json({ success: false, message: 'Error updating plan' });
        }
    } else {
        res.status(404).json({ success: false, message: 'Plan not found' });
    }
});

/**
 * DELETE /api/plans/:dateKey
 * Delete a daily plan for a specific date
 */
app.delete('/api/plans/:dateKey', (req, res) => {
    const { dateKey } = req.params;
    const db = readDatabase();
    
    if (db.plans[dateKey]) {
        delete db.plans[dateKey];
        
        if (writeDatabase(db)) {
            res.json({ success: true, message: 'Plan deleted successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Error deleting plan' });
        }
    } else {
        res.status(404).json({ success: false, message: 'Plan not found' });
    }
});

// ========== PREFERENCES API ENDPOINTS ==========

/**
 * GET /api/preferences
 * Get user preferences (dark mode, theme, etc.)
 */
app.get('/api/preferences', (req, res) => {
    const db = readDatabase();
    res.json({ success: true, data: db.preferences || {} });
});

/**
 * POST /api/preferences
 * Save user preferences
 */
app.post('/api/preferences', (req, res) => {
    const preferences = req.body;
    const db = readDatabase();
    
    db.preferences = { ...db.preferences, ...preferences };
    
    if (writeDatabase(db)) {
        res.json({ success: true, message: 'Preferences saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Error saving preferences' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\n====================================`);
    console.log(`Daily Planner Server Running!`);
    console.log(`====================================`);
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Calendar: http://localhost:${PORT}/calendar.html`);
    console.log(`Database: ${DB_FILE}`);
    console.log(`\nPress Ctrl+C to stop the server\n`);
});

