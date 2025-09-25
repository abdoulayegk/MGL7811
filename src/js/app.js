/**
 * Main Application Logic - Task Manager
 * Part of MGL7811 Personal Project by Abdoulaye GK
 */

class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.editingTaskId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadTasks();
        this.render();
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        // Input elements
        this.taskInput = document.getElementById('taskInput');
        this.dueDateInput = document.getElementById('dueDateInput');
        this.priorityInput = document.getElementById('priorityInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.searchInput = document.getElementById('searchInput');

        // Filter elements
        this.filterButtons = document.querySelectorAll('.filter-btn');

        // Display elements
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.totalTasks = document.getElementById('totalTasks');
        this.activeTasks = document.getElementById('activeTasks');
        this.completedTasks = document.getElementById('completedTasks');

        // Modal elements
        this.taskModal = document.getElementById('taskModal');
        this.editTaskForm = document.getElementById('editTaskForm');
        this.editTaskId = document.getElementById('editTaskId');
        this.editTaskText = document.getElementById('editTaskText');
        this.editTaskDueDate = document.getElementById('editTaskDueDate');
        this.editTaskPriority = document.getElementById('editTaskPriority');
        this.closeModal = document.querySelector('.close');
        this.cancelEdit = document.getElementById('cancelEdit');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Add task
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Filter tasks
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Search tasks
        this.searchInput.addEventListener('input', (e) => {
            this.setSearchQuery(e.target.value);
        });

        // Modal events
        this.closeModal.addEventListener('click', () => this.closeEditModal());
        this.cancelEdit.addEventListener('click', () => this.closeEditModal());
        this.editTaskForm.addEventListener('submit', (e) => this.saveTaskEdit(e));
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.taskModal) {
                this.closeEditModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeEditModal();
            }
        });
    }

    /**
     * Load tasks from storage
     */
    loadTasks() {
        try {
            const tasksData = storage.loadTasks();
            this.tasks = Task.fromJSONArray(tasksData);
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = [];
        }
    }

    /**
     * Save tasks to storage
     */
    saveTasks() {
        try {
            const tasksData = this.tasks.map(task => task.toJSON());
            storage.saveTasks(tasksData);
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }

    /**
     * Add a new task
     */
    addTask() {
        const text = this.taskInput.value.trim();
        const dueDate = this.dueDateInput.value || null;
        const priority = this.priorityInput.value;

        if (!text) {
            this.showNotification('Please enter a task description', 'error');
            this.taskInput.focus();
            return;
        }

        try {
            const task = new Task(text, dueDate, priority);
            this.tasks.unshift(task); // Add to beginning of array
            this.saveTasks();
            this.clearInputs();
            this.render();
            this.showNotification('Task added successfully!', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    /**
     * Clear input fields
     */
    clearInputs() {
        this.taskInput.value = '';
        this.dueDateInput.value = '';
        this.priorityInput.value = 'medium';
        this.taskInput.focus();
    }

    /**
     * Delete a task
     * @param {string} taskId - ID of task to delete
     */
    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex > -1) {
            const task = this.tasks[taskIndex];
            if (confirm(`Are you sure you want to delete "${task.text}"?`)) {
                this.tasks.splice(taskIndex, 1);
                this.saveTasks();
                this.render();
                this.showNotification('Task deleted successfully!', 'success');
            }
        }
    }

    /**
     * Toggle task completion
     * @param {string} taskId - ID of task to toggle
     */
    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.toggleCompleted();
            this.saveTasks();
            this.render();
        }
    }

    /**
     * Open edit modal for a task
     * @param {string} taskId - ID of task to edit
     */
    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.editingTaskId = taskId;
            this.editTaskId.value = taskId;
            this.editTaskText.value = task.text;
            this.editTaskDueDate.value = task.dueDate || '';
            this.editTaskPriority.value = task.priority;
            this.taskModal.style.display = 'block';
            this.editTaskText.focus();
        }
    }

    /**
     * Save task edit
     * @param {Event} e - Form submit event
     */
    saveTaskEdit(e) {
        e.preventDefault();
        
        const taskId = this.editTaskId.value;
        const text = this.editTaskText.value.trim();
        const dueDate = this.editTaskDueDate.value || null;
        const priority = this.editTaskPriority.value;

        if (!text) {
            this.showNotification('Please enter a task description', 'error');
            return;
        }

        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            try {
                task.update({ text, dueDate, priority });
                this.saveTasks();
                this.closeEditModal();
                this.render();
                this.showNotification('Task updated successfully!', 'success');
            } catch (error) {
                this.showNotification(error.message, 'error');
            }
        }
    }

    /**
     * Close edit modal
     */
    closeEditModal() {
        this.taskModal.style.display = 'none';
        this.editingTaskId = null;
    }

    /**
     * Set active filter
     * @param {string} filter - Filter type: 'all', 'active', or 'completed'
     */
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update filter button states
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.render();
    }

    /**
     * Set search query
     * @param {string} query - Search query
     */
    setSearchQuery(query) {
        this.searchQuery = query.toLowerCase().trim();
        this.render();
    }

    /**
     * Get filtered tasks based on current filter and search query
     * @returns {Array} Filtered tasks
     */
    getFilteredTasks() {
        let filtered = this.tasks;

        // Apply status filter
        switch (this.currentFilter) {
            case 'active':
                filtered = filtered.filter(task => !task.completed);
                break;
            case 'completed':
                filtered = filtered.filter(task => task.completed);
                break;
            default:
                // 'all' - no filtering needed
                break;
        }

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(task =>
                task.text.toLowerCase().includes(this.searchQuery)
            );
        }

        // Sort tasks (completed tasks at bottom, then by creation date)
        filtered.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed - b.completed;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return filtered;
    }

    /**
     * Render the application
     */
    render() {
        this.updateStats();
        this.renderTasks();
    }

    /**
     * Update task statistics
     */
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const active = total - completed;

        this.totalTasks.textContent = total;
        this.activeTasks.textContent = active;
        this.completedTasks.textContent = completed;
    }

    /**
     * Render task list
     */
    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            this.taskList.style.display = 'none';
            this.emptyState.style.display = 'block';
            
            // Update empty state message based on filter/search
            const emptyStateTitle = this.emptyState.querySelector('h3');
            const emptyStateText = this.emptyState.querySelector('p');
            
            if (this.searchQuery) {
                emptyStateTitle.textContent = 'No matching tasks found';
                emptyStateText.textContent = `No tasks match "${this.searchQuery}"`;
            } else if (this.currentFilter === 'active') {
                emptyStateTitle.textContent = 'No active tasks!';
                emptyStateText.textContent = 'All your tasks are completed. Great job!';
            } else if (this.currentFilter === 'completed') {
                emptyStateTitle.textContent = 'No completed tasks yet';
                emptyStateText.textContent = 'Complete some tasks to see them here.';
            } else {
                emptyStateTitle.textContent = 'No tasks yet!';
                emptyStateText.textContent = 'Add your first task using the input above.';
            }
        } else {
            this.taskList.style.display = 'block';
            this.emptyState.style.display = 'none';
            
            this.taskList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
        }
    }

    /**
     * Create HTML for a task item
     * @param {Task} task - Task object
     * @returns {string} HTML string
     */
    createTaskHTML(task) {
        const priorityInfo = task.getPriorityInfo();
        const formattedDate = task.getFormattedDueDate();
        const isOverdue = task.isOverdue();
        const isDueToday = task.isDueToday();
        
        let dueDateDisplay = '';
        if (formattedDate) {
            let dueDateClass = '';
            if (isOverdue) dueDateClass = 'overdue';
            else if (isDueToday) dueDateClass = 'due-today';
            
            dueDateDisplay = `<span class="due-date ${dueDateClass}">
                <i class="fas fa-calendar"></i> ${formattedDate}
            </span>`;
        }

        return `
            <div class="task-item ${task.completed ? 'completed' : ''} fade-in" data-task-id="${task.id}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="taskManager.toggleTask('${task.id}')">
                
                <div class="task-content" onclick="taskManager.editTask('${task.id}')">
                    <div class="task-text">${this.escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span class="priority ${task.priority}">${priorityInfo.icon} ${priorityInfo.label}</span>
                        ${dueDateDisplay}
                        <span class="created-date">
                            <i class="fas fa-clock"></i> ${this.formatDate(task.createdAt)}
                        </span>
                    </div>
                </div>
                
                <div class="task-actions">
                    <button class="edit-btn" onclick="taskManager.editTask('${task.id}')" title="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="taskManager.deleteTask('${task.id}')" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Format date for display
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        }
    }

    /**
     * Show notification message
     * @param {string} message - Message to show
     * @param {string} type - Notification type: 'success' or 'error'
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : '#f56565'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Export tasks as JSON
     */
    exportTasks() {
        const exportData = storage.exportTasks();
        if (exportData) {
            const blob = new Blob([exportData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tasks_backup_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Tasks exported successfully!', 'success');
        }
    }

    /**
     * Clear all tasks
     */
    clearAllTasks() {
        if (this.tasks.length === 0) {
            this.showNotification('No tasks to clear', 'info');
            return;
        }
        
        if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
            this.tasks = [];
            this.saveTasks();
            this.render();
            this.showNotification('All tasks cleared!', 'success');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if storage is available
    if (!storage.isStorageAvailable()) {
        alert('Warning: Local storage is not available. Your tasks will not be saved between sessions.');
    }
    
    // Create global instance
    window.taskManager = new TaskManager();
    
    // Add keyboard shortcuts info
    console.log('Keyboard shortcuts:');
    console.log('- Enter: Add task (when input is focused)');
    console.log('- Escape: Close modal');
    console.log('- Click on task text: Edit task');
});