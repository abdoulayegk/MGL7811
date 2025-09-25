/**
 * Storage Module - Handles localStorage operations for task persistence
 * Part of MGL7811 Personal Project by Abdoulaye GK
 */

class Storage {
    constructor() {
        this.STORAGE_KEY = 'mgl7811_tasks';
    }

    /**
     * Save tasks to localStorage
     * @param {Array} tasks - Array of task objects
     */
    saveTasks(tasks) {
        try {
            const tasksData = {
                tasks: tasks,
                lastUpdated: new Date().toISOString(),
                version: '1.0.0'
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasksData));
            return true;
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
            return false;
        }
    }

    /**
     * Load tasks from localStorage
     * @returns {Array} Array of task objects
     */
    loadTasks() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (!stored) {
                return [];
            }

            const data = JSON.parse(stored);
            
            // Handle different data formats for backward compatibility
            if (Array.isArray(data)) {
                // Old format - just an array of tasks
                return data;
            } else if (data.tasks && Array.isArray(data.tasks)) {
                // New format - object with metadata
                return data.tasks;
            }
            
            return [];
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
            return [];
        }
    }

    /**
     * Clear all tasks from localStorage
     * @returns {boolean} Success status
     */
    clearTasks() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing tasks from localStorage:', error);
            return false;
        }
    }

    /**
     * Get storage metadata
     * @returns {Object} Metadata about stored tasks
     */
    getMetadata() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (!stored) {
                return null;
            }

            const data = JSON.parse(stored);
            if (data.lastUpdated && data.version) {
                return {
                    lastUpdated: data.lastUpdated,
                    version: data.version,
                    taskCount: data.tasks ? data.tasks.length : 0
                };
            }
            
            return null;
        } catch (error) {
            console.error('Error getting metadata:', error);
            return null;
        }
    }

    /**
     * Check if localStorage is available
     * @returns {boolean} Whether localStorage is supported
     */
    isStorageAvailable() {
        try {
            const test = 'localStorage_test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Export tasks as JSON for backup
     * @returns {string} JSON string of all tasks and metadata
     */
    exportTasks() {
        try {
            const tasks = this.loadTasks();
            const exportData = {
                tasks: tasks,
                exportDate: new Date().toISOString(),
                version: '1.0.0',
                source: 'MGL7811 Personal Task Manager'
            };
            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            console.error('Error exporting tasks:', error);
            return null;
        }
    }

    /**
     * Import tasks from JSON backup
     * @param {string} jsonData - JSON string containing tasks
     * @returns {boolean} Success status
     */
    importTasks(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.tasks && Array.isArray(data.tasks)) {
                this.saveTasks(data.tasks);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error importing tasks:', error);
            return false;
        }
    }
}

// Create and export a singleton instance
const storage = new Storage();

// Make it available globally for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = storage;
} else {
    window.storage = storage;
}