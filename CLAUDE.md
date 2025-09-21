# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Plannah** is a single-file HTML application that serves as an interactive Manufacturing Master Plan Checklist for electronic product manufacturing. It helps teams track the complex journey from prototype to mass production through structured phases and tasks.

## Architecture

This is a **single-file React application** (`index.html`) that contains:
- Complete React 18 application with embedded JavaScript
- Self-contained UI components built with Tailwind CSS
- Dark-themed manufacturing checklist interface
- Local storage-based data persistence
- YAML/JSON import/export functionality

The application uses a **master-detail layout**:
- Left panel (1/3): Phase navigation with task hierarchy and progress indicators
- Right panel (2/3): Detailed task editing with status tracking, notes, and file management

## Key Components

### Main Application Structure
- `ManufacturingChecklist`: Root component managing overall state and layout
- `PhaseSection`: Collapsible phase containers with progress tracking
- `TaskItem`: Individual task entries in left navigation
- `TaskDetailPanel`: Comprehensive task editing interface
- `ImportExportModal`: Data import/export functionality

### UI Components
- Custom styled components using Tailwind CSS classes
- `Button`, `Card`, `Badge`, `Input`, `Textarea` with variant-based styling
- Dark theme with semantic color tokens throughout

### Data Management
- Manufacturing plan data structure with phases and tasks
- Task properties: status, assignee, dates, notes, files, dependencies, tags
- Real-time progress calculation and persistence via localStorage
- YAML and JSON serialization for plan import/export

## Development Commands

**This is a static single-file application** - no build system is configured yet.

Current deployment: Simply open `index.html` in a web browser.

**Planned development setup** (as documented in `docs/llm-todos.md`):
- Future migration to proper React project structure
- GitHub Pages deployment with `npm run deploy`
- Standard React development workflow with build/test/lint commands

## File Structure

```
/
├── index.html              # Complete single-file application
├── docs/
│   ├── llm-context.md     # Detailed project context and requirements
│   └── llm-todos.md       # Migration roadmap to proper React project
├── .gitignore             # Basic git ignore (excludes .aider files)
└── .aider.chat.history.md # AI conversation history
```

## Working with This Codebase

### Making Changes
- All application code is embedded within `index.html` in the `<script type="text/babel">` section
- UI styling uses Tailwind CSS utility classes with custom dark theme configuration
- Data persistence relies on browser localStorage API
- External dependencies loaded via CDN (React, Babel, Tailwind, js-yaml)

### Key Features to Understand
- **Phase-based workflow**: 4 main manufacturing phases with sequential task dependencies
- **Status management**: Tasks have pending/in-progress/completed/blocked states
- **Progress tracking**: Real-time calculation of phase and overall completion percentages
- **Data import/export**: Full manufacturing plan and progress data serialization
- **File management**: Task-associated document upload and management

### Future Development Notes
The `docs/llm-todos.md` contains a comprehensive migration plan to transform this single-file application into a proper React project with modern development tooling, GitHub Pages deployment, and maintainable component structure.