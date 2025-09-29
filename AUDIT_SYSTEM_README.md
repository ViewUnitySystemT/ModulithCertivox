# 🧪 ModulithCertivox Audit System

Ein vollständiges, modular aufgebautes Audit-System für das ModulithCertivox-Projekt, das alle UI-Varianten, Theme-Initialisierung und Asset-Integrität prüft.

## 📋 Übersicht

Das Audit-System besteht aus zwei Hauptkomponenten:

1. **Audit-Checkscript** (`auditCheck.ts`) - CLI-Tool für Entwicklungs- und CI/CD-Workflows
2. **Live-Audit-Canvas** (`LiveAuditCanvas.tsx`) - Interaktive UI-Komponente für Echtzeit-Überwachung

## 🛠 Installation & Setup

### Voraussetzungen

```bash
# TypeScript Node.js (für CLI-Script)
npm install -g ts-node

# Chalk für farbige Ausgabe (optional)
npm install chalk
```

### Script ausführen

```bash
# Direkt mit ts-node
ts-node auditCheck.ts

# Über npm script
npm run audit

# Mit pnpm
pnpm audit
```

## 🔍 Audit-Kategorien

### 1. UI Variants
- Überprüft alle UI-Varianten: `classic`, `minimal`, `hardware`, `neuro`, `satellite`, `transceiver`, `groundstation`, `funkcore`
- Validiert Komponenten-Dateien und Registrierung im UI Store

### 2. Theme Configuration
- Überprüft Tailwind CSS-Konfiguration
- Validiert Theme-Extensionen und Custom Properties

### 3. Environment Variables
- Überprüft `.env.local` auf erforderliche Variablen
- Validiert `NEXT_PUBLIC_UI_MODE` und `NEXT_PUBLIC_THEME`

### 4. Logger Implementation
- Überprüft `rfLogger` auf alle erforderlichen Methoden
- Validiert `info`, `debug`, `warn`, `error` Funktionen

### 5. RF Core Implementation
- Überprüft `rfCore.ts` auf Frequenzbänder und Hardware-Erkennung
- Validiert `FREQUENCY_BANDS` und `detectHardware` Funktionen

### 6. Package Configuration
- Überprüft `package.json` auf erforderliche Scripts
- Validiert Build- und Dev-Scripts

### 7. Next.js Configuration
- Überprüft `next.config.js` auf Static Export-Konfiguration
- Validiert `output: 'export'` Einstellung

### 8. Public Assets
- Überprüft öffentliche Assets: `favicon.ico`, `logo.svg`, `manifest.json`
- Validiert Asset-Verfügbarkeit

## 🎨 Live-Audit-Canvas

### Features

- **Echtzeit-Überwachung**: Interaktive UI für Live-Audits
- **Ampelstatus**: Visuelle Anzeige mit Farbkodierung (Grün/Gelb/Rot)
- **Export-Funktion**: JSON-Export der Audit-Ergebnisse
- **Kategorisierte Ansicht**: Gruppierte Ergebnisse nach Kategorien
- **Success Rate**: Prozentuale Erfolgsrate mit Fortschrittsbalken
- **Animierte UI**: Smooth Transitions und Loading-States

### Verwendung

```tsx
import LiveAuditCanvas from './components/canvas/LiveAuditCanvas';

// In der Canvas-Komponente
case 'audit':
  return <LiveAuditCanvas />;
```

## 📊 Audit-Ergebnisse

### Status-Kategorien

- ✅ **Pass**: Alle Checks erfolgreich
- ⚠️ **Warning**: Nicht-kritische Probleme
- ❌ **Fail**: Kritische Probleme

### Success Rate

- **90%+**: Excellent - System ist vollständig konfiguriert
- **70-89%**: Good - Kleinere Probleme vorhanden
- **<70%**: Critical - Wichtige Komponenten fehlen

## 🔧 CI/CD Integration

Das Audit-System ist in den GitHub Actions Workflow integriert:

```yaml
- name: Run System Audit
  run: pnpm audit
```

### Pre-Deploy Checks

Das Audit läuft automatisch bei:
- Pull Requests
- Main Branch Pushes
- Develop Branch Pushes

## 📁 Dateistruktur

```
├── auditCheck.ts                 # CLI Audit-Script
├── src/components/canvas/
│   └── LiveAuditCanvas.tsx      # Live Audit UI-Komponente
├── .github/workflows/
│   └── ci-cd.yml                # CI/CD Integration
└── package.json                 # npm Scripts
```

## 🚀 Erweiterte Nutzung

### Custom Audit Checks

```typescript
// Neue Audit-Kategorie hinzufügen
function checkCustomFeature(): boolean {
  // Custom validation logic
  return true;
}

// In runAudit() integrieren
const customOk = checkCustomFeature();
results.push({
  category: 'Custom Features',
  item: 'Custom Feature',
  status: customOk ? 'pass' : 'fail',
  message: customOk ? 'OK' : 'Failed',
  details: 'Custom feature validation'
});
```

### Export-Format

```json
{
  "timestamp": 1696000000000,
  "totalChecks": 18,
  "passedChecks": 15,
  "failedChecks": 1,
  "warningChecks": 2,
  "results": [
    {
      "category": "UI Variants",
      "item": "classic",
      "status": "pass",
      "message": "Registered",
      "details": "Component file exists and is registered in UI store"
    }
  ]
}
```

## 🐛 Troubleshooting

### Häufige Probleme

1. **"ts-node not found"**
   ```bash
   npm install -g ts-node
   ```

2. **"Chalk not found"**
   ```bash
   npm install chalk
   ```

3. **"File not found"**
   - Überprüfen Sie die Dateipfade
   - Stellen Sie sicher, dass alle Komponenten existieren

### Debug-Modus

```bash
# Mit Debug-Ausgabe
DEBUG=true ts-node auditCheck.ts
```

## 📈 Performance

- **CLI-Script**: ~2-3 Sekunden für vollständigen Audit
- **Live-Canvas**: Echtzeit-Updates mit 2-Sekunden-Simulation
- **Memory Usage**: Minimaler Speicherverbrauch
- **File I/O**: Optimierte Datei-Zugriffe

## 🔮 Roadmap

- [ ] **Webhook Integration**: Automatische Benachrichtigungen
- [ ] **Historical Data**: Audit-Verlauf speichern
- [ ] **Custom Rules**: Benutzerdefinierte Audit-Regeln
- [ ] **Performance Metrics**: Ladezeiten und Bundle-Größen
- [ ] **Security Checks**: Dependency-Vulnerability-Scans

## 📞 Support

Bei Problemen oder Fragen:
1. Überprüfen Sie die Audit-Ergebnisse
2. Konsultieren Sie die Troubleshooting-Sektion
3. Erstellen Sie ein Issue im Repository

---

**ModulithCertivox Audit System** - Professionelle Systemintegrität für RF-Kommunikationssysteme 🚀
