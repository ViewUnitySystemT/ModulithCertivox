#!/bin/bash
# Deployment Preparation Script for ModulithCertivox
# Ensures all quality gates pass before deployment

set -e

echo "🚀 ModulithCertivox Deployment Preparation"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Starting deployment preparation..."

# Step 1: Clean previous builds
print_status "Cleaning previous builds..."
npm run clean
print_success "Build artifacts cleaned"

# Step 2: Install dependencies
print_status "Installing dependencies..."
npm ci --frozen-lockfile
print_success "Dependencies installed"

# Step 3: Environment validation
print_status "Validating environment configuration..."
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Creating from template..."
    cp env.example .env.local
    print_warning "Please configure .env.local with your settings"
fi
print_success "Environment configuration validated"

# Step 4: TypeScript check
print_status "Running TypeScript type check..."
npm run typecheck
print_success "TypeScript check passed"

# Step 5: Linting
print_status "Running ESLint..."
npm run lint
print_success "ESLint check passed"

# Step 6: Code formatting check
print_status "Checking code formatting..."
npm run format:check
print_success "Code formatting check passed"

# Step 7: Unit tests
print_status "Running unit tests..."
npm run test:coverage
print_success "Unit tests passed"

# Step 8: Build test
print_status "Testing production build..."
npm run build
print_success "Production build successful"

# Step 9: Bundle analysis
print_status "Running bundle analysis..."
npm run analyze
print_success "Bundle analysis completed"

# Step 10: Security audit
print_status "Running security audit..."
npm audit --audit-level moderate
print_success "Security audit passed"

# Step 11: Check for console.log statements
print_status "Checking for console.log statements..."
CONSOLE_LOGS=$(grep -r "console\." src/ --include="*.ts" --include="*.tsx" | grep -v "// console" | wc -l)
if [ "$CONSOLE_LOGS" -gt 0 ]; then
    print_error "Found $CONSOLE_LOGS console.log statements. Please use the logger instead."
    grep -r "console\." src/ --include="*.ts" --include="*.tsx" | grep -v "// console"
    exit 1
fi
print_success "No console.log statements found"

# Step 12: Check for TODO/FIXME comments
print_status "Checking for TODO/FIXME comments..."
TODOS=$(grep -r "TODO\|FIXME\|HACK\|XXX" src/ --include="*.ts" --include="*.tsx" | wc -l)
if [ "$TODOS" -gt 0 ]; then
    print_warning "Found $TODOS TODO/FIXME comments:"
    grep -r "TODO\|FIXME\|HACK\|XXX" src/ --include="*.ts" --include="*.tsx"
    print_warning "Consider addressing these before deployment"
fi

# Step 13: Check for any types
print_status "Checking for 'any' types..."
ANY_TYPES=$(grep -r ": any\|any\[\]" src/ --include="*.ts" --include="*.tsx" | wc -l)
if [ "$ANY_TYPES" -gt 0 ]; then
    print_warning "Found $ANY_TYPES 'any' types. Consider using more specific types:"
    grep -r ": any\|any\[\]" src/ --include="*.ts" --include="*.tsx"
fi

# Step 14: Check for @ts-ignore
print_status "Checking for @ts-ignore statements..."
TS_IGNORES=$(grep -r "@ts-ignore" src/ --include="*.ts" --include="*.tsx" | wc -l)
if [ "$TS_IGNORES" -gt 0 ]; then
    print_warning "Found $TS_IGNORES @ts-ignore statements. Consider fixing the underlying issues:"
    grep -r "@ts-ignore" src/ --include="*.ts" --include="*.tsx"
fi

# Step 15: Generate deployment report
print_status "Generating deployment report..."
cat > deployment-report.md << EOF
# ModulithCertivox Deployment Report

**Generated:** $(date)
**Version:** $(node -p "require('./package.json').version")
**Node Version:** $(node --version)
**NPM Version:** $(npm --version)

## Quality Gates Status

- ✅ TypeScript Check: PASSED
- ✅ ESLint Check: PASSED
- ✅ Code Formatting: PASSED
- ✅ Unit Tests: PASSED
- ✅ Production Build: PASSED
- ✅ Bundle Analysis: PASSED
- ✅ Security Audit: PASSED
- ✅ Console Logs Check: PASSED
- ⚠️ TODO/FIXME Comments: $TODOS found
- ⚠️ Any Types: $ANY_TYPES found
- ⚠️ TS-Ignore Statements: $TS_IGNORES found

## Build Artifacts

- Production build: ✅ Ready
- Bundle analysis: ✅ Completed
- Test coverage: ✅ Generated

## Deployment Readiness

$(if [ "$TODOS" -eq 0 ] && [ "$ANY_TYPES" -eq 0 ] && [ "$TS_IGNORES" -eq 0 ]; then echo "🟢 READY FOR DEPLOYMENT"; else echo "🟡 READY WITH WARNINGS"; fi)

## Next Steps

1. Review any warnings above
2. Configure production environment variables
3. Deploy to staging environment
4. Run E2E tests in staging
5. Deploy to production
6. Monitor application health

EOF

print_success "Deployment report generated: deployment-report.md"

# Step 16: Final status
echo ""
echo "🎉 Deployment Preparation Complete!"
echo "=================================="

if [ "$TODOS" -eq 0 ] && [ "$ANY_TYPES" -eq 0 ] && [ "$TS_IGNORES" -eq 0 ]; then
    print_success "All quality gates passed! Ready for deployment."
    echo ""
    echo "Next steps:"
    echo "1. Review deployment-report.md"
    echo "2. Configure production environment"
    echo "3. Deploy to GitHub Pages or Vercel"
    echo "4. Monitor application health"
else
    print_warning "Deployment ready with warnings. Please review:"
    echo "- TODO/FIXME comments: $TODOS"
    echo "- Any types: $ANY_TYPES"
    echo "- TS-ignore statements: $TS_IGNORES"
fi

echo ""
echo "📊 Build Statistics:"
echo "- Bundle size: $(du -sh .next/static 2>/dev/null | cut -f1 || echo 'N/A')"
echo "- Build time: $(date)"
echo ""

print_success "Deployment preparation completed successfully!"

