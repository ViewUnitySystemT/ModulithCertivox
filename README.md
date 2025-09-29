# 📡 RF UI Portal - Professional RF Communication System Interface

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **The world's first unified RF Communication System UI Portal - Professional, Modular, Auditable**

A centralized web portal that unifies all GUI/UX components from the auditable RF stack. Users can switch between different UI styles, control modes, and visualizations - everything modular, auditable, and fully configurable.

## 🎯 Features

- 🔀 **Modular UI Switching** - Switch between Classic, Minimal, Hardware, and Neuro interfaces
- 🧠 **Chat Canvas Integration** - Interactive RF command interface
- 📡 **Real-time Signal Visualization** - Live RF signal path monitoring
- 📜 **Audit Certification System** - Complete traceability and certification
- ⚙️ **Professional Customization** - Full user configuration capabilities
- 🧬 **Neurointerface Ready** - EEG/EMG integration preparation
- 🏗️ **Hardware Integration** - Real RF hardware control via WebSocket/API
- 🎨 **Professional Themes** - Dark, Light, Legacy, and Custom themes

## 🏛️ UI Variants

| Variant | Focus | Use Case |
|---------|-------|----------|
| **Classic** | Full Audit View | Complete RF system monitoring with certifications |
| **Minimal** | Embedded Systems | Essential controls for limited hardware |
| **Hardware** | Real-time Hardware Status | GPIO, RF levels, transceiver monitoring |
| **Neuro** | Neurointerface Integration | EEG/EMG visualization, BCI mode |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.9+ (for RF backend)
- RF Hardware (optional, simulation available)

### Installation

```bash
# Clone the repository
git clone https://github.com/YourOrg/rf-ui-portal.git
cd rf-ui-portal

# Install dependencies
npm install

# Setup RF backend (optional)
pip install -r requirements.txt

# Start development server
npm run dev

# Start RF backend (in separate terminal)
npm run rf-server
```

Navigate to [http://localhost:3000](http://localhost:3000) to access the portal.

## 🏗️ Architecture

```
rf-ui-portal/
├── src/
│   ├── pages/                     # Next.js pages
│   ├── components/                # Reusable UI components
│   │   ├── canvas/               # Dynamic UI canvas system
│   │   ├── variants/             # UI variant implementations
│   │   ├── chat/                 # Chat canvas components
│   │   ├── visualization/        # Signal & audit visualization
│   │   └── settings/             # Configuration components
│   ├── stores/                   # Zustand state management
│   ├── lib/                      # Utilities and API wrappers
│   ├── server/                   # Python RF backend
│   ├── styles/                   # TailwindCSS + custom themes
│   └── types/                    # TypeScript definitions
├── public/                       # Static assets
├── docs/                        # Documentation
└── tests/                       # Test suites
```

## 🧩 Core Technologies

- **Frontend**: React 18 + Next.js 14 + TypeScript
- **Styling**: TailwindCSS + Framer Motion animations
- **State**: Zustand for state management
- **Backend**: Python Flask/FastAPI for RF hardware
- **Real-time**: Socket.IO for live communication
- **Charts**: Chart.js for signal visualization
- **Testing**: Jest + Cypress

## ⚙️ Configuration

### User Settings

All settings are stored in `src/stores/settingsStore.ts` and persist across sessions:

```typescript
interface UserSettings {
  theme: 'dark' | 'light' | 'legacy' | 'custom';
  uiMode: 'classic' | 'minimal' | 'hardware' | 'neuro';
  rfHardware: {
    enabled: boolean;
    endpoint: string;
    apiKey: string;
  };
  notifications: boolean;
  auditLevel: 'basic' | 'full' | 'certified';
}
```

### Theme Customization

Themes are defined in `src/styles/themes/`:

```css
/* Custom theme example */
:root[data-theme="custom"] {
  --primary: 255 107 53;
  --secondary: 139 92 246;
  --background: 15 20 25;
  --foreground: 0 255 136;
}
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run rf-server` - Start RF backend server
- `npm run audit-export` - Export audit data

### Adding New UI Variants

1. Create component in `src/components/variants/NewVariant.tsx`
2. Add to variant switcher in `src/stores/uiStore.ts`
3. Define theme in `src/styles/themes/`
4. Add tests in `tests/variants/`

## 🔐 Security & Audit

- All RF communications are logged and auditable
- User actions are traceable with timestamps
- Hardware access is authenticated and secured
- Export functionality for compliance reporting

## 📊 Professional Features

- **Real-time Signal Monitoring**: Live RF signal visualization
- **Hardware Control**: GPIO, transceiver status, frequency tuning
- **Audit Trail**: Complete operation logging and certification
- **Multi-device Support**: Desktop, tablet, mobile, embedded
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized for real-time RF operations

## 🌍 Community & Support

- **Documentation**: [Wiki](https://github.com/YourOrg/rf-ui-portal/wiki)
- **Issues**: [GitHub Issues](https://github.com/YourOrg/rf-ui-portal/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YourOrg/rf-ui-portal/discussions)
- **Roadmap**: [Project Board](https://github.com/YourOrg/rf-ui-portal/projects)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ by **R.D.TEL** & **Gentlyoverdone**

*"The future of RF technology lies in transparency, auditability, and the power of community."*

---

## 🚀 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

For more information, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

**Ready to revolutionize RF communication interfaces? Let's build the future together!** 🚀📡
