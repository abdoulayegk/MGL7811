/**
 * Task Class - Represents a single task in the task manager
 * Part of MGL7811 Personal Project by Abdoulaye GK
 */

class Task {
    /**
     * Create a new Task
     * @param {string} text - The task description
     * @param {string} dueDate - Due date in YYYY-MM-DD format (optional)
     * @param {string} priority - Priority level: 'low', 'medium', or 'high'
     * @param {string} id - Unique identifier (optional, will be generated if not provided)
     */
    constructor(text, dueDate = null, priority = 'medium', id = null) {
        this.id = id || this.generateId();
        this.text = text.trim();
        this.completed = false;
        this.dueDate = dueDate;
        this.priority = priority;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        
        this.validate();
    }

    /**
     * Generate a unique ID for the task
     * @returns {string} Unique identifier
     */
    generateId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Validate task properties
     * @throws {Error} If validation fails
     */
    validate() {
        if (!this.text || this.text.length === 0) {
            throw new Error('Task text cannot be empty');
        }
        
        if (this.text.length > 100) {
            throw new Error('Task text cannot exceed 100 characters');
        }
        
        if (!['low', 'medium', 'high'].includes(this.priority)) {
            throw new Error('Priority must be low, medium, or high');
        }
        
        if (this.dueDate && !this.isValidDate(this.dueDate)) {
            throw new Error('Due date must be in YYYY-MM-DD format');
        }
    }

    /**
     * Check if a date string is valid
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @returns {boolean} Whether the date is valid
     */
    isValidDate(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;
        
        // Parse the date components
        const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
        
        // Check if it's a valid date by creating a new Date object directly with components
        const date = new Date(year, month - 1, day); // month is 0-indexed
        
        return date.getFullYear() === year &&
               date.getMonth() === month - 1 &&
               date.getDate() === day;
    }

    /**
     * Mark task as completed or uncompleted
     * @param {boolean} completed - Completion status
     */
    setCompleted(completed) {
        this.completed = Boolean(completed);
        this.updatedAt = new Date().toISOString();
    }

    /**
     * Toggle task completion status
     */
    toggleCompleted() {
        this.setCompleted(!this.completed);
    }

    /**
     * Update task properties
     * @param {Object} updates - Object containing properties to update
     */
    update(updates) {
        const allowedUpdates = ['text', 'dueDate', 'priority'];
        
        for (const key of allowedUpdates) {
            if (updates.hasOwnProperty(key)) {
                this[key] = updates[key];
            }
        }
        
        this.updatedAt = new Date().toISOString();
        this.validate();
    }

    /**
     * Check if task is overdue
     * @returns {boolean} Whether the task is overdue
     */
    isOverdue() {
        if (!this.dueDate || this.completed) {
            return false;
        }
        
        const today = new Date().toISOString().slice(0, 10);
        return this.dueDate < today;
    }

    /**
     * Check if task is due today
     * @returns {boolean} Whether the task is due today
     */
    isDueToday() {
        if (!this.dueDate) {
            return false;
        }
        
        const today = new Date().toISOString().slice(0, 10);
        return this.dueDate === today;
    }

    /**
     * Get the number of days until due date
     * @returns {number} Days until due (negative if overdue)
     */
    getDaysUntilDue() {
        if (!this.dueDate) {
            return null;
        }
        
        const today = new Date();
        const dueDate = new Date(this.dueDate);
        const diffTime = dueDate - today;
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return days === 0 ? 0 : days; // Convert -0 to 0
    }

    /**
     * Get formatted due date string
     * @returns {string} Human-readable due date
     */
    getFormattedDueDate() {
        if (!this.dueDate) {
            return '';
        }
        
        const date = new Date(this.dueDate);
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Get priority display information
     * @returns {Object} Priority information with label and color
     */
    getPriorityInfo() {
        const priorityMap = {
            low: { label: 'Low', color: '#38a169', icon: '🟢' },
            medium: { label: 'Medium', color: '#dd6b20', icon: '🟡' },
            high: { label: 'High', color: '#c53030', icon: '🔴' }
        };
        
        return priorityMap[this.priority] || priorityMap.medium;
    }

    /**
     * Convert task to plain object for storage
     * @returns {Object} Plain object representation
     */
    toJSON() {
        return {
            id: this.id,
            text: this.text,
            completed: this.completed,
            dueDate: this.dueDate,
            priority: this.priority,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Create Task instance from plain object
     * @param {Object} data - Plain object with task data
     * @returns {Task} New Task instance
     */
    static fromJSON(data) {
        const task = new Task(data.text, data.dueDate, data.priority, data.id);
        task.completed = data.completed || false;
        task.createdAt = data.createdAt || new Date().toISOString();
        task.updatedAt = data.updatedAt || new Date().toISOString();
        return task;
    }

    /**
     * Create multiple Task instances from array of objects
     * @param {Array} dataArray - Array of plain objects
     * @returns {Array} Array of Task instances
     */
    static fromJSONArray(dataArray) {
        if (!Array.isArray(dataArray)) {
            return [];
        }
        
        return dataArray.map(data => {
            try {
                return Task.fromJSON(data);
            } catch (error) {
                console.error('Error creating task from data:', data, error);
                return null;
            }
        }).filter(task => task !== null);
    }

    /**
     * Compare tasks for sorting
     * @param {Task} other - Another task to compare with
     * @param {string} sortBy - Property to sort by
     * @param {boolean} ascending - Sort direction
     * @returns {number} Comparison result
     */
    compare(other, sortBy = 'createdAt', ascending = true) {
        let result = 0;
        
        switch (sortBy) {
            case 'text':
                result = this.text.localeCompare(other.text);
                break;
            case 'dueDate':
                if (!this.dueDate && !other.dueDate) result = 0;
                else if (!this.dueDate) result = 1;
                else if (!other.dueDate) result = -1;
                else result = this.dueDate.localeCompare(other.dueDate);
                break;
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                result = priorityOrder[other.priority] - priorityOrder[this.priority];
                break;
            case 'completed':
                result = Number(this.completed) - Number(other.completed);
                break;
            default:
                result = new Date(this.createdAt) - new Date(other.createdAt);
        }
        
        return ascending ? result : -result;
    }
}

// Make Task class available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Task;
} else {
    window.Task = Task;
}