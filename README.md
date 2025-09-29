# 📡 ModulithCertivox - Professional RF Communication System UI Portal

> **The world's first unified RF Communication System UI Portal - Professional, Modular, Auditable**

A centralized web portal that unifies all GUI/UX components from the auditable RF stack. Users can switch between different UI styles, control modes, and visualizations - everything modular, auditable, and fully configurable.

## 🚀 **LIVE DEMO**

**🌐 [ModulithFunkCore RF System - LIVE NOW!](https://viewunitysystemt.github.io/ModulithCertivox/)**

The complete ModulithFunkCore implementation is now live with:
- ✅ **Yaesu FTDX101D Reference Implementation**
- ✅ **Real-time Frequency Control** (26.965-27.405 MHz)
- ✅ **AM/FM/SSB Modulation Switching**
- ✅ **Live Spectrum Display**
- ✅ **Complete Audit Trail with Hash Certification**
- ✅ **Hardware Connection Simulation**
- ✅ **Canvas-Only Execution** (No Build Required)

## 🎯 Features

* 🔀 **Modular UI Switching** - Switch between Classic, Minimal, Hardware, and Neuro interfaces
* 🧠 **Chat Canvas Integration** - Interactive RF command interface
* 📡 **Real-time Signal Visualization** - Live RF signal path monitoring
* 📜 **Audit Certification System** - Complete traceability and certification
* ⚙️ **Professional Customization** - Full user configuration capabilities
* 🧬 **Neurointerface Ready** - EEG/EMG integration preparation
* 🏗️ **Hardware Integration** - Real RF hardware control via WebSocket/API
* 🎨 **Professional Themes** - Dark, Light, Legacy, and Custom themes
* ⌨️ **Command Palette** - Global search and quick actions (Ctrl+K)
* 🔍 **Advanced Search** - Fuzzy search across all components
* 📊 **Real-time Monitoring** - Live hardware status and performance metrics
* 🔐 **Security Hardened** - Environment validation, secure logging, audit trails

## 🏛️ UI Variants

| Variant            | Focus                      | Use Case                                          |
| ------------------ | -------------------------- | ------------------------------------------------- |
| **Classic**        | Full Audit View            | Complete RF system monitoring with certifications |
| **Minimal**        | Embedded Systems           | Essential controls for limited hardware           |
| **Hardware**       | Real-time Hardware Status  | GPIO, RF levels, transceiver monitoring           |
| **Neuro**          | Neurointerface Integration | EEG/EMG visualization, BCI mode                   |
| **Satellite**      | Ground Station Operations  | Satellite tracking and communication management   |
| **Transceiver**    | RF Transceiver Control     | Channel management and signal processing          |
| **Ground Station** | Mission Control            | Multi-station coordination and monitoring         |
| **🆕 ModulithFunkCore** | Yaesu FTDX101D Reference | Complete RF System with Canvas-Only Execution    |

## 🧠 **ModulithFunkCore - The Revolutionary RF System**

The **ModulithFunkCore** is our flagship implementation featuring:

### **📡 RF Capabilities:**
- **Frequency Range:** 26.965 - 27.405 MHz (CB Band)
- **Modulations:** AM, FM, SSB (Single Side Band)
- **Hardware Support:** Yaesu FTDX101D, Icom IC-7300, Kenwood TS-590
- **Real-time Spectrum:** Canvas-based visualization
- **WebUSB/WebSerial:** Direct hardware integration

### **🔍 Audit & Certification:**
- **Hash Certification:** SHA256 for every action
- **Complete Traceability:** Timestamp, Hash, Metadata
- **Export Functions:** JSON, Markdown, Canvas-Snapshot
- **Real-time Monitoring:** Signal Strength, Noise Level

### **🎨 Pixel-Perfect UI:**
- **Yaesu FTDX101D Reference:** Exact replica implementation
- **Dual-Screen Layout:** Frequency + Spectrum left, Controls right
- **Rotary Dial Emulation:** Touch/Mouse-based frequency selection
- **Modulation Switcher:** AM/FM/SSB buttons
- **Audit Trail Panel:** Real-time log display

## 🚀 Quick Start

### Prerequisites

* Node.js 18+
* Python 3.9+ (for RF backend)
* RF Hardware (optional, simulation available)

### Installation

```bash
# Clone the repository
git clone https://github.com/ViewUnitySystemT/ModulithCertivox.git
cd ModulithCertivox

# Install dependencies
npm install

# Copy environment configuration
cp env.example .env.local

# Configure your environment variables
# Edit .env.local with your settings

# Start development server
npm run dev

# Start RF backend (in separate terminal)
npm run rf-server
```

Navigate to [http://localhost:3000](http://localhost:3000) to access the portal.

## 🏗️ Architecture

```
ModulithCertivox/
├── src/
│   ├── pages/                     # Next.js pages
│   ├── components/                # Reusable UI components
│   │   ├── canvas/               # Dynamic UI canvas system
│   │   ├── variants/             # UI variant implementations
│   │   ├── chat/                 # Chat canvas components
│   │   ├── ui/                   # Core UI components
│   │   ├── visualization/        # Signal & audit visualization
│   │   └── settings/             # Configuration components
│   ├── stores/                   # Zustand state management
│   ├── lib/                      # Utilities and API wrappers
│   │   ├── logger.ts             # Professional logging system
│   │   ├── env.ts                # Environment validation
│   │   └── services.ts           # Real data services
│   ├── styles/                   # TailwindCSS + custom themes
│   ├── types/                    # TypeScript definitions
│   └── test/                     # Test utilities
├── public/                       # Static assets
├── docs/                        # Documentation
├── .github/workflows/           # CI/CD pipelines
└── tests/                       # Test suites
```

## 🧩 Core Technologies

* **Frontend**: React 18 + Next.js 14 + TypeScript
* **Styling**: TailwindCSS + Framer Motion animations
* **State**: Zustand for state management
* **Backend**: Python Flask/FastAPI for RF hardware
* **Real-time**: Socket.IO for live communication
* **Charts**: Chart.js for signal visualization
* **Search**: Fuse.js for fuzzy search
* **Logging**: Custom logger with remote capabilities
* **Testing**: Vitest + Playwright + Jest
* **CI/CD**: GitHub Actions with quality gates

## ⚙️ Configuration

### Environment Variables

Copy `env.example` to `.env.local` and configure:

```bash
# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=RF UI Portal
NEXT_PUBLIC_APP_VERSION=1.0.0

# RF Hardware Configuration
RF_HARDWARE_ENDPOINT=http://localhost:8080/api/rf
RF_HARDWARE_API_KEY=your-api-key-here
RF_HARDWARE_TIMEOUT=5000

# Logging Configuration
LOG_LEVEL=debug
LOG_REMOTE_ENDPOINT=http://localhost:3001/api/logs

# Feature Flags
ENABLE_RF_HARDWARE=true
ENABLE_NEURAL_INTERFACE=false
ENABLE_AUDIT_EXPORT=true
ENABLE_REAL_TIME_MONITORING=true
```

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

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run typecheck       # Run TypeScript check
npm run format          # Format code with Prettier
npm run format:check     # Check code formatting

# Testing
npm run test            # Run unit tests
npm run test:ui         # Run tests with UI
npm run test:coverage   # Run tests with coverage
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Run E2E tests with UI

# Analysis
npm run analyze         # Bundle analysis
npm run clean           # Clean build artifacts
```

### Adding New UI Variants

1. Create component in `src/components/variants/NewVariant.tsx`
2. Add to variant switcher in `src/stores/uiStore.ts`
3. Define theme in `src/styles/themes/`
4. Add tests in `tests/variants/`
5. Update command palette in `src/components/ui/CommandPalette.tsx`

## 🔐 Security & Audit

* **Environment Validation**: Zod schema validation for all environment variables
* **Secure Logging**: Structured logging with remote capabilities
* **Audit Trail**: Complete operation logging and certification
* **Hardware Access**: Authenticated and secured hardware control
* **Export Functionality**: Compliance reporting capabilities
* **No Console Logs**: All logging goes through professional logger
* **Type Safety**: Strict TypeScript configuration with no `any` types

## 📊 Professional Features

* **Real-time Signal Monitoring**: Live RF signal visualization
* **Hardware Control**: GPIO, transceiver status, frequency tuning
* **Audit Trail**: Complete operation logging and certification
* **Multi-device Support**: Desktop, tablet, mobile, embedded
* **Accessibility**: WCAG 2.1 AA compliance
* **Performance**: Optimized for real-time RF operations
* **Command Palette**: Global search and quick actions
* **Error Handling**: Graceful degradation and retry mechanisms
* **Loading States**: Professional loading and error states
* **Responsive Design**: Works on all screen sizes

## 🧪 Testing Strategy

### Unit Tests (Vitest)

* Component testing with React Testing Library
* Store testing with Zustand
* Service testing with mocked APIs
* Coverage target: 90%+

### E2E Tests (Playwright)

* Happy path testing
* Error scenario testing
* Cross-browser compatibility
* Visual regression testing

### Performance Tests (Lighthouse)

* Core Web Vitals monitoring
* Bundle size analysis
* Performance budgets

### Security Tests

* Dependency vulnerability scanning
* Environment variable validation
* API security testing

## 🚀 CI/CD Pipeline

The project includes a comprehensive CI/CD pipeline with:

* **Code Quality Gates**: ESLint, TypeScript, Prettier
* **Testing**: Unit tests, E2E tests, coverage reports
* **Security**: Dependency scanning, vulnerability checks
* **Performance**: Lighthouse CI, bundle analysis
* **Deployment**: Automated staging and production deployments
* **Quality Gates**: All checks must pass before deployment

## 🌍 Community & Support

* **Documentation**: [Wiki](https://github.com/ViewUnitySystemT/ModulithCertivox/wiki)
* **Issues**: [GitHub Issues](https://github.com/ViewUnitySystemT/ModulithCertivox/issues)
* **Discussions**: [GitHub Discussions](https://github.com/ViewUnitySystemT/ModulithCertivox/discussions)
* **Roadmap**: [Project Board](https://github.com/ViewUnitySystemT/ModulithCertivox/projects)

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

## 🌐 **LIVE DEMO**

**[🚀 Try ModulithFunkCore Now!](https://viewunitysystemt.github.io/ModulithCertivox/)**

Experience the complete Yaesu FTDX101D Reference Implementation with Canvas-Only execution, real-time RF simulation, and full audit trail functionality!