# MGL7811 - Personal Project: Task Manager

A simple and elegant personal task management web application built as part of the MGL7811 course project.

## Features

- ✅ Add, edit, and delete tasks
- 📅 Set due dates and priorities
- 🔍 Filter and search tasks
- 📊 Progress tracking
- 💾 Local storage persistence
- 📱 Responsive design

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser LocalStorage
- **Testing**: Jest
- **Build Tools**: npm
- **Version Control**: Git

## Project Structure

```
├── src/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js
│   │   ├── task.js
│   │   └── storage.js
│   └── index.html
├── tests/
│   └── task.test.js
├── docs/
│   └── design.md
├── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/abdoulayegk/MGL7811.git
cd MGL7811
```

2. Install dependencies
```bash
npm install
```

3. Open the application
```bash
npm start
```

Or simply open `src/index.html` in your browser.

### Running Tests

```bash
npm test
```

## Usage

1. **Add a Task**: Click the "+" button and fill in the task details
2. **Edit a Task**: Click on any task to edit its details
3. **Mark Complete**: Check the checkbox next to completed tasks
4. **Delete a Task**: Click the delete button (🗑️) next to any task
5. **Filter Tasks**: Use the filter buttons to view all, active, or completed tasks

## Author

**Abdoulaye GK** - MGL7811 Personal Project

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.