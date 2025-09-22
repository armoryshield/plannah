# Surge Master Plan

A comprehensive React application for managing electronic product manufacturing workflows from prototype to mass production, powered by Surge.

![Surge Master Plan Screenshot](https://via.placeholder.com/800x400/1f2937/ffffff?text=Surge+Master+Plan)

## 🚀 Features

### ✅ **Task Management**
- **Create & Edit Tasks**: Add new tasks with title, description, time estimates, and tags
- **Drag & Drop Reordering**: Move tasks within phases or between phases seamlessly
- **Task Status Tracking**: Pending, In Progress, Completed, and Blocked states
- **Progress Visualization**: Real-time progress bars at task and phase levels

### 📋 **Phase Organization**
- **Create Custom Phases**: Add manufacturing phases tailored to your workflow
- **Collapsible Sections**: Organized hierarchy with expand/collapse functionality
- **Dependency Tracking**: Visual task dependencies and relationships

### 💾 **Data Management**
- **Local Storage**: Automatic progress saving across browser sessions
- **Import/Export**: YAML and JSON format support for sharing plans
- **Progress Export**: Complete data export including all customizations

### 🎨 **User Experience**
- **Dark Theme**: Professional dark mode interface
- **Responsive Design**: Works on desktop and mobile devices
- **Intuitive Controls**: Hover actions, keyboard shortcuts, and smooth animations

## 🛠 Technologies Used

- **React 19** - Modern React with hooks and latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom dark theme
- **@hello-pangea/dnd** - Smooth drag-and-drop functionality
- **js-yaml** - YAML parsing and stringification
- **LocalStorage API** - Browser-based data persistence

## 🏗 Development

### Prerequisites
- Node.js (v20+ recommended)
- npm or yarn

### Local Development
```bash
# Clone the repository
git clone https://github.com/armoryshield/plannah.git
cd plannah/plannah-react

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

## 📚 Usage

1. **Create Phases**: Click "+ Add New Phase" to create manufacturing phases
2. **Add Tasks**: Within each phase, click "+ Add Task" to create new tasks
3. **Edit Content**: Hover over tasks to see edit options, or click to view details
4. **Reorder Items**: Drag and drop tasks between phases or reorder within phases
5. **Track Progress**: Check off completed tasks and monitor overall progress
6. **Export Data**: Use Import/Export to save your manufacturing plan

## 🏭 Default Manufacturing Phases

The application comes with a comprehensive 4-phase manufacturing workflow:

1. **Phase 1: Design for Manufacturing (DFM/DFA)**
   - Schematic review and optimization
   - PCB layout optimization
   - Mechanical design refinement
   - Bill of Materials creation

2. **Phase 2: Sourcing and Supply Chain Management**
   - Manufacturing partner selection
   - Supply chain strategy development
   - Contract negotiation

3. **Phase 3: Pre-Production and Tooling**
   - Tooling and fixture creation
   - Engineering Validation Testing (EVT)
   - Design Validation Testing (DVT)

4. **Phase 4: Production and Quality Control**
   - First Article Inspection (FAI)
   - Production line optimization
   - Quality control implementation

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Issues

Found a bug or have a feature request? Please open an issue on [GitHub Issues](https://github.com/armoryshield/plannah/issues).

---

**Built with ❤️ for hardware engineers and manufacturing teams**