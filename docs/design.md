# Personal Task Manager - Design Document

**MGL7811 Course Project by Abdoulaye GK**

---

## Project Overview

The Personal Task Manager is a modern, responsive web application designed to help users manage their daily tasks efficiently. Built as part of the MGL7811 course project, it demonstrates key software development principles and best practices.

## Architecture

### Frontend Architecture

The application follows a modular JavaScript architecture with clear separation of concerns:

```
Frontend Architecture
├── View Layer (HTML + CSS)
│   ├── index.html - Main application structure
│   └── styles.css - Responsive styling and animations
├── Business Logic Layer (JavaScript)
│   ├── app.js - Main application controller
│   ├── task.js - Task model and operations
│   └── storage.js - Data persistence layer
└── Test Layer
    ├── setup.js - Test configuration
    └── task.test.js - Unit tests for Task class
```

### Design Patterns Used

1. **Module Pattern**: Each JavaScript file represents a specific module with clear responsibilities
2. **MVC Pattern**: Separation between data (Task), view (HTML/CSS), and controller (TaskManager)
3. **Observer Pattern**: Event-driven architecture for user interactions
4. **Factory Pattern**: Task creation and serialization methods

## Core Components

### 1. Task Class (`task.js`)

**Purpose**: Represents individual tasks with all business logic

**Key Features**:
- Task validation and data integrity
- Date calculations (overdue, due today, days until due)
- Priority management with visual indicators
- Serialization for storage persistence
- Comparison methods for sorting

**API**:
```javascript
// Create new task
const task = new Task(text, dueDate, priority);

// Task operations
task.toggleCompleted();
task.update({ text: 'New text', priority: 'high' });
task.isOverdue();
task.isDueToday();

// Serialization
const json = task.toJSON();
const task2 = Task.fromJSON(json);
```

### 2. Storage Module (`storage.js`)

**Purpose**: Handles data persistence using browser localStorage

**Key Features**:
- Automatic data validation and error handling
- Backup and export functionality
- Version management for data compatibility
- Storage availability detection

**API**:
```javascript
storage.saveTasks(tasks);
const tasks = storage.loadTasks();
const exportData = storage.exportTasks();
storage.importTasks(jsonData);
```

### 3. TaskManager Class (`app.js`)

**Purpose**: Main application controller managing UI and business logic

**Key Features**:
- Task CRUD operations
- Filtering and searching
- Real-time statistics
- Modal-based editing
- Responsive notifications
- Keyboard shortcuts

## User Interface Design

### Design Principles

1. **Simplicity**: Clean, uncluttered interface focusing on essential features
2. **Accessibility**: Proper contrast ratios, keyboard navigation, semantic HTML
3. **Responsiveness**: Mobile-first design that works on all screen sizes
4. **Visual Hierarchy**: Clear information architecture with proper typography
5. **Feedback**: Immediate visual feedback for all user actions

### Color Scheme

- **Primary**: `#667eea` (Modern purple-blue)
- **Success**: `#48bb78` (Green for positive actions)
- **Error**: `#f56565` (Red for errors/deletion)
- **Warning**: `#dd6b20` (Orange for medium priority)
- **Text**: `#333` (Dark gray for readability)
- **Background**: Linear gradient from `#667eea` to `#764ba2`

### Typography

- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Heading**: 2.5rem, bold, with text shadow
- **Body**: 16px, line-height 1.6
- **Small Text**: 14px for metadata and secondary information

## Features Specification

### Core Features

1. **Task Management**
   - Add tasks with description, due date, and priority
   - Edit tasks inline with modal interface
   - Mark tasks as complete/incomplete
   - Delete tasks with confirmation

2. **Organization**
   - Filter by status (All, Active, Completed)
   - Search tasks by text content
   - Visual priority indicators
   - Automatic sorting (incomplete first, then by creation date)

3. **Visual Feedback**
   - Real-time statistics dashboard
   - Overdue task indicators
   - Due today highlighting
   - Completion animations
   - Success/error notifications

4. **Data Persistence**
   - Automatic saving to localStorage
   - Export/import functionality
   - Data validation and error recovery

### Advanced Features

1. **Responsive Design**
   - Mobile-first approach
   - Flexible layouts for all screen sizes
   - Touch-friendly interface elements

2. **Keyboard Shortcuts**
   - Enter: Add task (when input focused)
   - Escape: Close modals
   - Click on task: Edit task

3. **Accessibility**
   - Semantic HTML structure
   - Proper ARIA labels
   - Keyboard navigation support
   - High contrast color scheme

## Technical Specifications

### Browser Requirements

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript**: ES6+ features (classes, arrow functions, template literals)
- **Storage**: localStorage API support
- **CSS**: CSS Grid, Flexbox, Custom Properties

### Performance Considerations

1. **Efficient DOM Updates**: Minimal DOM manipulation with batch updates
2. **Event Delegation**: Efficient event handling for dynamic content
3. **Memory Management**: Proper cleanup of event listeners
4. **Storage Optimization**: Compact JSON serialization

### Security Considerations

1. **Input Validation**: All user inputs are validated and sanitized
2. **XSS Prevention**: HTML escaping for user-generated content
3. **Data Validation**: Type checking and format validation
4. **Error Handling**: Graceful degradation for storage failures

## Testing Strategy

### Unit Testing

- **Framework**: Jest with jsdom for DOM simulation
- **Coverage**: Task class methods and edge cases
- **Mocking**: localStorage and Date objects for consistent testing

### Test Categories

1. **Constructor Tests**: Validate task creation with various parameters
2. **Validation Tests**: Ensure proper error handling for invalid inputs
3. **Operation Tests**: Test task state changes and updates
4. **Date Logic Tests**: Verify overdue, due today, and date calculations
5. **Serialization Tests**: Test JSON conversion and reconstruction

### Quality Assurance

1. **Code Standards**: Consistent formatting and naming conventions
2. **Error Handling**: Comprehensive error catching and user feedback
3. **Browser Testing**: Cross-browser compatibility verification
4. **Accessibility Testing**: Screen reader and keyboard navigation testing

## Future Enhancements

### Potential Features

1. **Data Sync**: Cloud storage integration for multi-device access
2. **Categories/Tags**: Organize tasks by project or category
3. **Recurring Tasks**: Support for daily, weekly, monthly repeating tasks
4. **Collaboration**: Share tasks with team members
5. **Analytics**: Task completion statistics and productivity insights
6. **Themes**: Multiple color schemes and dark mode
7. **Notifications**: Browser notifications for due tasks
8. **Drag & Drop**: Reorder tasks by dragging

### Technical Improvements

1. **Progressive Web App**: Offline functionality and app-like experience
2. **Performance Optimization**: Virtual scrolling for large task lists
3. **Advanced Search**: Full-text search with filters and operators
4. **Undo/Redo**: Action history with reversal capability
5. **Bulk Operations**: Select and modify multiple tasks at once

## Development Practices

### Code Organization

- **Modular Structure**: Clear separation of concerns across files
- **Consistent Naming**: Descriptive variable and function names
- **Documentation**: Comprehensive JSDoc comments
- **Error Handling**: Graceful failure with user feedback

### Version Control

- **Git Workflow**: Feature branches with descriptive commit messages
- **Code Reviews**: Pull request workflow for quality assurance
- **Issue Tracking**: GitHub issues for bug reports and feature requests

### Deployment

- **Static Hosting**: Can be deployed to any static web host
- **Build Process**: Simple npm scripts for development and testing
- **CI/CD**: Automated testing and deployment workflows

---

This design document serves as a comprehensive guide for understanding the Personal Task Manager's architecture, features, and implementation decisions. It demonstrates the application of software engineering principles learned in the MGL7811 course.