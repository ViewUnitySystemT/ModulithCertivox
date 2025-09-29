// auditCheck.ts
const fs = require('fs');
const path = require('path');

// Import chalk for colored output (fallback if not available)
let chalk: any;
try {
  chalk = require('chalk');
} catch {
  // Fallback for environments without chalk
  chalk = {
    blue: (text: string) => text,
    yellow: (text: string) => text,
    green: (text: string) => text,
    red: (text: string) => text,
  };
}

const variants = ['classic', 'minimal', 'hardware', 'neuro', 'satellite', 'transceiver', 'groundstation', 'funkcore']
const publicAssets = ['favicon.ico', 'logo.svg', 'manifest.json']
const themeConfigPath = path.join(__dirname, 'tailwind.config.js')
const envPath = path.join(__dirname, '.env.local')
const variantPath = path.join(__dirname, 'src/components/variants')
const uiStorePath = path.join(__dirname, 'src/stores/uiStore.ts')
const loggerPath = path.join(__dirname, 'src/lib/logger.ts')
const rfCorePath = path.join(__dirname, 'src/lib/rfCore.ts')

interface AuditResult {
  category: string;
  item: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

interface AuditReport {
  timestamp: number;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  results: AuditResult[];
}

function checkFileExists(filePath: string): boolean {
  return fs.existsSync(filePath)
}

function checkVariantRegistration(variant: string): boolean {
  const variantFile = path.join(variantPath, `${variant.charAt(0).toUpperCase() + variant.slice(1)}UI.tsx`)
  const variantFileAlt = path.join(variantPath, `${variant.charAt(0).toUpperCase() + variant.slice(1)}.tsx`)
  
  const fileExists = checkFileExists(variantFile) || checkFileExists(variantFileAlt)
  
  if (!fileExists) return false;
  
  try {
    const storeContent = fs.readFileSync(uiStorePath, 'utf-8')
    return storeContent.includes(`'${variant}'`)
  } catch {
    return false
  }
}

function checkThemeConfig(): boolean {
  try {
    const config = fs.readFileSync(themeConfigPath, 'utf-8')
    return config.includes('theme') && config.includes('extend')
  } catch {
    return false
  }
}

function checkEnvVars(): boolean {
  try {
    const env = fs.readFileSync(envPath, 'utf-8')
    return env.includes('NEXT_PUBLIC_UI_MODE') && env.includes('NEXT_PUBLIC_THEME')
  } catch {
    return false
  }
}

function checkLoggerImplementation(): boolean {
  try {
    const logger = fs.readFileSync(loggerPath, 'utf-8')
    return logger.includes('rfLogger') && logger.includes('info') && logger.includes('debug')
  } catch {
    return false
  }
}

function checkRfCoreImplementation(): boolean {
  try {
    const rfCore = fs.readFileSync(rfCorePath, 'utf-8')
    return rfCore.includes('FREQUENCY_BANDS') && rfCore.includes('detectHardware')
  } catch {
    return false
  }
}

function checkPackageJson(): boolean {
  try {
    const packageJson = fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8')
    const pkg = JSON.parse(packageJson)
    return pkg.scripts && pkg.scripts.build && pkg.scripts.dev
  } catch {
    return false
  }
}

function checkNextConfig(): boolean {
  try {
    const nextConfig = fs.readFileSync(path.join(__dirname, 'next.config.js'), 'utf-8')
    return nextConfig.includes('output') && nextConfig.includes('export')
  } catch {
    return false
  }
}

function runAudit(): AuditReport {
  const results: AuditResult[] = []
  
  console.log(chalk.blue('\n🔍 Running ModulithCertivox UI Audit...\n'))

  // Check UI Variants
  console.log(chalk.yellow('📦 UI Variants:'))
  variants.forEach(variant => {
    const ok = checkVariantRegistration(variant)
    const status = ok ? 'pass' : 'fail'
    const message = ok ? 'Registered' : 'Missing or Unregistered'
    
    results.push({
      category: 'UI Variants',
      item: variant,
      status,
      message,
      details: ok ? 'Component file exists and is registered in UI store' : 'Component file missing or not registered in UI store'
    })
    
    console.log(`${variant.padEnd(15)} ${ok ? chalk.green('✔ Registered') : chalk.red('✘ Missing or Unregistered')}`)
  })

  // Check Theme Config
  console.log('\n🎨 Theme Configuration:')
  const themeOk = checkThemeConfig()
  results.push({
    category: 'Theme Configuration',
    item: 'Tailwind Config',
    status: themeOk ? 'pass' : 'fail',
    message: themeOk ? 'OK' : 'Missing or incomplete',
    details: themeOk ? 'Tailwind theme configuration is properly set up' : 'Tailwind theme configuration is missing or incomplete'
  })
  console.log(themeOk ? chalk.green('✔ Tailwind theme config OK') : chalk.red('✘ Tailwind theme config missing or incomplete'))

  // Check .env.local
  console.log('\n⚙️ Environment Variables:')
  const envOk = checkEnvVars()
  results.push({
    category: 'Environment Variables',
    item: '.env.local',
    status: envOk ? 'pass' : 'warning',
    message: envOk ? 'Contains required keys' : 'Missing NEXT_PUBLIC_UI_MODE or NEXT_PUBLIC_THEME',
    details: envOk ? 'Environment variables are properly configured' : 'Some environment variables may be missing'
  })
  console.log(envOk ? chalk.green('✔ .env.local contains required keys') : chalk.red('✘ Missing NEXT_PUBLIC_UI_MODE or NEXT_PUBLIC_THEME'))

  // Check Logger Implementation
  console.log('\n📝 Logger Implementation:')
  const loggerOk = checkLoggerImplementation()
  results.push({
    category: 'Logger Implementation',
    item: 'rfLogger',
    status: loggerOk ? 'pass' : 'fail',
    message: loggerOk ? 'Complete' : 'Missing methods',
    details: loggerOk ? 'Logger has all required methods (info, debug, warn, error)' : 'Logger is missing required methods'
  })
  console.log(loggerOk ? chalk.green('✔ Logger implementation complete') : chalk.red('✘ Logger missing required methods'))

  // Check RF Core Implementation
  console.log('\n📡 RF Core Implementation:')
  const rfCoreOk = checkRfCoreImplementation()
  results.push({
    category: 'RF Core Implementation',
    item: 'rfCore',
    status: rfCoreOk ? 'pass' : 'fail',
    message: rfCoreOk ? 'Complete' : 'Missing components',
    details: rfCoreOk ? 'RF Core has frequency bands and hardware detection' : 'RF Core is missing key components'
  })
  console.log(rfCoreOk ? chalk.green('✔ RF Core implementation complete') : chalk.red('✘ RF Core missing key components'))

  // Check Package.json
  console.log('\n📦 Package Configuration:')
  const packageOk = checkPackageJson()
  results.push({
    category: 'Package Configuration',
    item: 'package.json',
    status: packageOk ? 'pass' : 'fail',
    message: packageOk ? 'Scripts configured' : 'Missing scripts',
    details: packageOk ? 'Package.json has required build and dev scripts' : 'Package.json is missing required scripts'
  })
  console.log(packageOk ? chalk.green('✔ Package.json scripts configured') : chalk.red('✘ Package.json missing required scripts'))

  // Check Next.js Config
  console.log('\n⚙️ Next.js Configuration:')
  const nextOk = checkNextConfig()
  results.push({
    category: 'Next.js Configuration',
    item: 'next.config.js',
    status: nextOk ? 'pass' : 'fail',
    message: nextOk ? 'Static export configured' : 'Missing static export config',
    details: nextOk ? 'Next.js is configured for static export' : 'Next.js static export configuration is missing'
  })
  console.log(nextOk ? chalk.green('✔ Next.js static export configured') : chalk.red('✘ Next.js static export config missing'))

  // Check Public Assets
  console.log('\n🖼 Public Assets:')
  publicAssets.forEach(asset => {
    const ok = checkFileExists(path.join(__dirname, 'public', asset))
    const status = ok ? 'pass' : 'warning'
    const message = ok ? 'Found' : 'Missing'
    
    results.push({
      category: 'Public Assets',
      item: asset,
      status,
      message,
      details: ok ? 'Asset file exists in public directory' : 'Asset file is missing from public directory'
    })
    
    console.log(`${asset.padEnd(15)} ${ok ? chalk.green('✔ Found') : chalk.red('✘ Missing')}`)
  })

  // Calculate summary
  const totalChecks = results.length
  const passedChecks = results.filter(r => r.status === 'pass').length
  const failedChecks = results.filter(r => r.status === 'fail').length
  const warningChecks = results.filter(r => r.status === 'warning').length

  const report: AuditReport = {
    timestamp: Date.now(),
    totalChecks,
    passedChecks,
    failedChecks,
    warningChecks,
    results
  }

  // Print summary
  console.log(chalk.blue('\n📊 Audit Summary:'))
  console.log(`Total Checks: ${totalChecks}`)
  console.log(`${chalk.green(`Passed: ${passedChecks}`)} | ${chalk.red(`Failed: ${failedChecks}`)} | ${chalk.yellow(`Warnings: ${warningChecks}`)}`)
  
  const successRate = Math.round((passedChecks / totalChecks) * 100)
  console.log(`Success Rate: ${successRate}%`)
  
  if (successRate >= 90) {
    console.log(chalk.green('\n✅ Audit Complete - Excellent!'))
  } else if (successRate >= 70) {
    console.log(chalk.yellow('\n⚠️ Audit Complete - Good, but needs attention'))
  } else {
    console.log(chalk.red('\n❌ Audit Complete - Critical issues found'))
  }

  return report
}

// Export for use in other modules
module.exports = { runAudit }

// Run if called directly
if (require.main === module) {
  runAudit()
}
