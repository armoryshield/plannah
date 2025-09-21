# llm-context.txt

## Project Context: Manufacturing Master Plan Checklist

### 1. MOTIVATION FOR THE TOOL

The user needed a digital solution to track and manage the complex journey of transitioning an electronic product from prototype to mass manufacturing. Traditional project management tools don't capture the specific phases, dependencies, and detailed documentation requirements inherent in hardware manufacturing processes. The tool needed to:

- Provide a visual, interactive way to track manufacturing phases and tasks
- Maintain detailed documentation and file management for each step
- Persist progress data across browser sessions
- Allow teams to collaborate and track individual task ownership
- Support import/export of manufacturing plans for different projects
- Handle complex dependencies between manufacturing tasks

The manufacturing process involves critical phases (DFM/DFA, Supply Chain, Tooling, Production) where missing steps or incomplete documentation can cause costly delays and quality issues.

### 2. INITIAL REQUIREMENTS

**Core Requirements:**
- Single-page website functioning as an interactive checklist
- Sequential layout showing manufacturing phases (Phase 1, Phase 2, etc.)
- Accordion-style sections for each phase with expand/collapse functionality
- Green checkmark indicators when all tasks in a phase are completed
- Per-task functionality including:
  - Task title and completion checkbox
  - Multi-line text area for notes/progress tracking
  - Multiple document upload capability with file name display
- Data persistence using localStorage to maintain progress across sessions
- Self-contained HTML file with embedded CSS and JavaScript

**Technical Constraints:**
- Use React, shadcn-ui, and Tailwind CSS for frontend
- Single HTML file deployment (no external dependencies)
- Manufacturing plan based on provided document structure

### 3. IMPLEMENTED VERSION FEATURES

**Enhanced Architecture:**
- Two-pane layout: Left navigation panel (1/3) + Right detail panel (2/3)
- Left panel shows hierarchical Phase > Task structure with always-visible progress
- Right panel provides comprehensive task detail editing
- Dark mode design throughout the application

**Task Management:**
- Multiple task statuses: Pending, In Progress, Completed, Blocked
- Visual status indicators: ✓ (completed), ⏳ (in-progress), 🚫 (blocked), ○ (pending)
- Task dependencies tracking and display
- Assignee management with input fields
- Schedule date and completion date tracking
- SOP (Standard Operating Procedure) document URL management
- Tag-based categorization system
- Time estimation display

**Data Management:**
- YAML and JSON import/export functionality
- Manufacturing plan structure import with validation
- Progress data export including all task details and uploaded files
- Real-time data persistence to localStorage
- Plan structure validation and error handling

**User Experience:**
- Real-time progress bars at both phase and overall project levels
- Collapsible phase sections in left navigation
- File upload and management with remove capability
- Interactive task selection with detailed editing panel
- Responsive design with professional dark theme
- Progress percentage calculations and visual feedback

**Advanced Features:**
- Manufacturing plan schema support with full YAML structure
- Task dependency visualization
- Comprehensive export options (plan structure + progress data)
- Modal-based import/export interface
- File upload validation and management
- Error handling for import operations

### 4. FRONTEND LIBRARIES, TOOLS AND PATTERNS

**Core Libraries:**
- **React 18** (via CDN): Component-based UI framework using hooks (useState, useEffect, useRef)
- **React DOM 18**: DOM rendering and manipulation
- **Babel Standalone**: In-browser JSX transpilation
- **Tailwind CSS** (via CDN): Utility-first CSS framework with custom dark theme configuration
- **js-yaml 4.1.0** (via CDN): YAML parsing and stringification for import/export

**Architecture Patterns:**
- **Component Composition**: Modular UI components (Button, Card, Badge, Input, Textarea)
- **Custom Hooks Pattern**: State management using React hooks throughout
- **Prop Drilling**: Data flow from parent components to children
- **Event Delegation**: Click handlers and form submissions managed at component level
- **State Lifting**: Shared state managed in parent components and passed down

**State Management:**
- **Local Component State**: useState for component-specific state
- **Browser Storage**: localStorage for data persistence
- **Computed State**: useEffect for derived state calculations
- **State Synchronization**: Real-time updates between left panel and right detail panel

**UI/UX Patterns:**
- **Master-Detail Interface**: Left navigation + right detail panel layout
- **Accordion Navigation**: Collapsible sections with visual indicators
- **Modal Dialogs**: Overlay interfaces for import/export functionality
- **Form Handling**: Controlled components with real-time validation
- **Progress Visualization**: Progress bars and completion indicators
- **File Management**: Drag-drop and file input handling

**Styling Architecture:**
- **Design System**: Consistent component styling with variant-based props
- **Dark Theme**: Custom Tailwind configuration with semantic color tokens
- **Responsive Design**: Mobile-first approach with flexible layouts
- **Component Variants**: Styled components with multiple visual states
- **CSS-in-JS**: Tailwind utility classes for styling

**Data Patterns:**
- **Schema Validation**: Manufacturing plan structure validation
- **Serialization**: JSON/YAML conversion for import/export
- **Local Storage API**: Browser-based data persistence
- **File API**: Browser file reading and blob creation for downloads
- **Event Handling**: Form submissions, file uploads, and user interactions

**Performance Considerations:**
- **Single Bundle**: All code in one HTML file for fast loading
- **Lazy Loading**: Components render only when needed
- **Efficient Re-renders**: Proper dependency arrays in useEffect hooks
- **Memory Management**: Cleanup of event listeners and file URLs
