#!/bin/bash
# CSS Migration Script - Auto-generated

echo "🎨 Starting CSS migration to design system..."

# Phase 1: Backup existing files
echo "📦 Creating backups..."
mkdir -p css-backups
cp static/product-creation-hub.css css-backups/
cp static/styles.css css-backups/
cp ide-build/static/features/terminal-voice.css css-backups/

# Phase 2: Remove obsolete files
echo "🗑️  Removing obsolete CSS files..."
rm -f ide-build/static/css/main.*.css.map
rm -f ide-build/static/aggressive-fixes.css
rm -f ide-build/static/fix-terminal-header.css

# Phase 3: Update HTML files to reference design system
echo "📝 Updating HTML references..."
# (Manual step - update script loaders and HTML files)

echo "✅ CSS migration preparation complete!"
echo "📋 Next steps:"
echo "   1. Update HTML files to import design-system.css"
echo "   2. Test all applications"
echo "   3. Remove old CSS imports"
