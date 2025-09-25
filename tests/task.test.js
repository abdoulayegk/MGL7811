/**
 * Task Class Tests
 * Part of MGL7811 Personal Project by Abdoulaye GK
 */

// Import the Task class
const Task = require('../src/js/task.js');

describe('Task Class', () => {
    beforeEach(() => {
        // Mock the current date for consistent testing
        mockDate('2024-01-15T10:00:00.000Z');
    });

    afterEach(() => {
        restoreDate();
    });

    describe('Constructor', () => {
        test('creates a task with basic properties', () => {
            const task = new Task('Test task');
            
            expect(task.text).toBe('Test task');
            expect(task.completed).toBe(false);
            expect(task.priority).toBe('medium');
            expect(task.dueDate).toBeNull();
            expect(task.id).toBeDefined();
            expect(task.createdAt).toBeDefined();
            expect(task.updatedAt).toBeDefined();
        });

        test('creates a task with all properties', () => {
            const task = new Task('Test task', '2024-02-01', 'high', 'custom_id');
            
            expect(task.text).toBe('Test task');
            expect(task.dueDate).toBe('2024-02-01');
            expect(task.priority).toBe('high');
            expect(task.id).toBe('custom_id');
        });

        test('trims whitespace from task text', () => {
            const task = new Task('  Test task  ');
            expect(task.text).toBe('Test task');
        });

        test('generates unique IDs when not provided', () => {
            const task1 = new Task('Task 1');
            const task2 = new Task('Task 2');
            
            expect(task1.id).toBeDefined();
            expect(task2.id).toBeDefined();
            expect(task1.id).not.toBe(task2.id);
        });
    });

    describe('Validation', () => {
        test('throws error for empty task text', () => {
            expect(() => new Task('')).toThrow('Task text cannot be empty');
            expect(() => new Task('   ')).toThrow('Task text cannot be empty');
        });

        test('throws error for task text exceeding 100 characters', () => {
            const longText = 'a'.repeat(101);
            expect(() => new Task(longText)).toThrow('Task text cannot exceed 100 characters');
        });

        test('throws error for invalid priority', () => {
            expect(() => new Task('Test', null, 'invalid')).toThrow('Priority must be low, medium, or high');
        });

        test('throws error for invalid due date format', () => {
            expect(() => new Task('Test', 'invalid-date')).toThrow('Due date must be in YYYY-MM-DD format');
            expect(() => new Task('Test', '2024-13-01')).toThrow('Due date must be in YYYY-MM-DD format');
        });

        test('accepts valid due dates', () => {
            expect(() => new Task('Test', '2024-02-01')).not.toThrow();
            expect(() => new Task('Test', '2024-12-31')).not.toThrow();
        });
    });

    describe('Task Operations', () => {
        let task;

        beforeEach(() => {
            task = new Task('Test task', '2024-02-01', 'medium');
        });

        test('toggles completion status', () => {
            expect(task.completed).toBe(false);
            
            task.toggleCompleted();
            expect(task.completed).toBe(true);
            
            task.toggleCompleted();
            expect(task.completed).toBe(false);
        });

        test('sets completion status directly', () => {
            task.setCompleted(true);
            expect(task.completed).toBe(true);
            
            task.setCompleted(false);
            expect(task.completed).toBe(false);
        });

        test('updates task properties', () => {
            const originalUpdatedAt = task.updatedAt;
            
            // Wait a bit to ensure timestamp changes
            setTimeout(() => {
                task.update({
                    text: 'Updated task',
                    dueDate: '2024-03-01',
                    priority: 'high'
                });
                
                expect(task.text).toBe('Updated task');
                expect(task.dueDate).toBe('2024-03-01');
                expect(task.priority).toBe('high');
                expect(task.updatedAt).not.toBe(originalUpdatedAt);
            }, 10);
        });

        test('validates updates', () => {
            expect(() => task.update({ text: '' })).toThrow('Task text cannot be empty');
            expect(() => task.update({ text: 'Valid text', priority: 'invalid' })).toThrow('Priority must be low, medium, or high');
        });
    });

    describe('Date Operations', () => {
        test('detects overdue tasks', () => {
            const overdueTask = new Task('Overdue', '2024-01-10'); // Before mocked current date
            const futureTask = new Task('Future', '2024-01-20');
            const completedOverdueTask = new Task('Completed Overdue', '2024-01-10');
            completedOverdueTask.setCompleted(true);
            
            expect(overdueTask.isOverdue()).toBe(true);
            expect(futureTask.isOverdue()).toBe(false);
            expect(completedOverdueTask.isOverdue()).toBe(false); // Completed tasks are not overdue
        });

        test('detects tasks due today', () => {
            const todayTask = new Task('Today', '2024-01-15'); // Same as mocked current date
            const tomorrowTask = new Task('Tomorrow', '2024-01-16');
            
            expect(todayTask.isDueToday()).toBe(true);
            expect(tomorrowTask.isDueToday()).toBe(false);
        });

        test('calculates days until due', () => {
            const todayTask = new Task('Today', '2024-01-15');
            const futureTask = new Task('Future', '2024-01-20');
            const pastTask = new Task('Past', '2024-01-10');
            const noDateTask = new Task('No date');
            
            expect(todayTask.getDaysUntilDue()).toBe(0);
            expect(futureTask.getDaysUntilDue()).toBe(5);
            expect(pastTask.getDaysUntilDue()).toBe(-5);
            expect(noDateTask.getDaysUntilDue()).toBeNull();
        });

        test('formats due dates', () => {
            const task = new Task('Test', '2024-02-15');
            const noDateTask = new Task('No date');
            
            expect(task.getFormattedDueDate()).toBe('Feb 15, 2024');
            expect(noDateTask.getFormattedDueDate()).toBe('');
        });
    });

    describe('Priority Operations', () => {
        test('returns priority information', () => {
            const lowTask = new Task('Low', null, 'low');
            const mediumTask = new Task('Medium', null, 'medium');
            const highTask = new Task('High', null, 'high');
            
            expect(lowTask.getPriorityInfo().label).toBe('Low');
            expect(mediumTask.getPriorityInfo().label).toBe('Medium');
            expect(highTask.getPriorityInfo().label).toBe('High');
            
            expect(lowTask.getPriorityInfo().icon).toBe('🟢');
            expect(mediumTask.getPriorityInfo().icon).toBe('🟡');
            expect(highTask.getPriorityInfo().icon).toBe('🔴');
        });
    });

    describe('Serialization', () => {
        test('converts to JSON', () => {
            const task = new Task('Test task', '2024-02-01', 'high');
            const json = task.toJSON();
            
            expect(json).toHaveProperty('id');
            expect(json).toHaveProperty('text', 'Test task');
            expect(json).toHaveProperty('completed', false);
            expect(json).toHaveProperty('dueDate', '2024-02-01');
            expect(json).toHaveProperty('priority', 'high');
            expect(json).toHaveProperty('createdAt');
            expect(json).toHaveProperty('updatedAt');
        });

        test('creates task from JSON', () => {
            const data = {
                id: 'test_id',
                text: 'Test task',
                completed: true,
                dueDate: '2024-02-01',
                priority: 'high',
                createdAt: '2024-01-15T10:00:00.000Z',
                updatedAt: '2024-01-15T10:00:00.000Z'
            };
            
            const task = Task.fromJSON(data);
            
            expect(task.id).toBe('test_id');
            expect(task.text).toBe('Test task');
            expect(task.completed).toBe(true);
            expect(task.dueDate).toBe('2024-02-01');
            expect(task.priority).toBe('high');
        });

        test('creates tasks from JSON array', () => {
            const dataArray = [
                { text: 'Task 1', priority: 'low' },
                { text: 'Task 2', priority: 'high' },
                { text: '', priority: 'medium' } // Invalid task
            ];
            
            const tasks = Task.fromJSONArray(dataArray);
            
            expect(tasks).toHaveLength(2); // Invalid task should be filtered out
            expect(tasks[0].text).toBe('Task 1');
            expect(tasks[1].text).toBe('Task 2');
        });
    });

    describe('Comparison', () => {
        let task1, task2, task3;

        beforeEach(() => {
            task1 = new Task('A Task', '2024-01-20', 'low');
            task2 = new Task('B Task', '2024-01-15', 'high');
            task3 = new Task('C Task', '2024-01-25', 'medium');
        });

        test('compares by text', () => {
            expect(task1.compare(task2, 'text', true)).toBeLessThan(0); // A < B
            expect(task2.compare(task1, 'text', true)).toBeGreaterThan(0); // B > A
        });

        test('compares by due date', () => {
            expect(task1.compare(task2, 'dueDate', true)).toBeGreaterThan(0); // Jan 20 > Jan 15
            expect(task2.compare(task3, 'dueDate', true)).toBeLessThan(0); // Jan 15 < Jan 25
        });

        test('compares by priority', () => {
            expect(task1.compare(task2, 'priority', true)).toBeGreaterThan(0); // low < high (high priority first)
            expect(task2.compare(task3, 'priority', true)).toBeLessThan(0); // high > medium
        });

        test('handles descending sort', () => {
            expect(task1.compare(task2, 'text', false)).toBeGreaterThan(0); // Reverse order
        });
    });
});