#!/bin/bash

# 📚 Documentation Organization Script
# This script organizes existing documentation files and recreates the complete structure
# It preserves existing content while organizing everything properly

echo "📚 Organizing documentation structure..."
echo "========================================"

# Create backup of existing docs
echo "💾 Creating backup of existing documentation..."
if [ -d "docs" ]; then
    cp -r docs docs_backup_$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup created: docs_backup_$(date +%Y%m%d_%H%M%S)"
fi

# Create main docs directory
mkdir -p docs

# Create all subdirectories
echo "📁 Creating directory structure..."
mkdir -p docs/guides
mkdir -p docs/technical
mkdir -p docs/deployment
mkdir -p docs/testing
mkdir -p docs/features
mkdir -p docs/tools
mkdir -p docs/references
mkdir -p docs/assets
mkdir -p docs/archives
mkdir -p docs/templates/bolt
mkdir -p docs/templates/git
mkdir -p docs/chats

echo "✅ Directory structure created"

# Function to move files based on content and name
organize_file() {
    local file="$1"
    local filename=$(basename "$file")
    local extension="${filename##*.}"
    
    # Skip if it's a directory
    if [ -d "$file" ]; then
        return
    fi
    
    # Skip if it's already in the right place
    if [[ "$file" == docs/* ]]; then
        return
    fi
    
    echo "📄 Organizing: $filename"
    
    # Determine target directory based on filename and content
    case "$filename" in
        *setup*|*install*|*guide*|*tutorial*)
            mv "$file" docs/guides/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
            ;;
        *api*|*technical*|*error*|*debug*|*troubleshoot*)
            mv "$file" docs/technical/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
            ;;
        *deploy*|*production*|*docker*|*server*)
            mv "$file" docs/deployment/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
            ;;
        *test*|*qa*|*quality*)
            mv "$file" docs/testing/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
            ;;
        *feature*|*requirement*|*spec*)
            mv "$file" docs/features/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
            ;;
        *template*|*tool*|*utility*)
            if [[ "$filename" == *bolt* ]]; then
                mv "$file" docs/templates/bolt/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
            elif [[ "$filename" == *git* || "$filename" == *project* ]]; then
                mv "$file" docs/templates/git/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
            else
                mv "$file" docs/tools/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
            fi
            ;;
        *chat*|*session*|*log*|*conversation*)
            mv "$file" docs/chats/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
            ;;
        *reference*|*doc*|*manual*)
            mv "$file" docs/references/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
            ;;
        *.png|*.jpg|*.jpeg|*.gif|*.svg|*.pdf|*.diagram*)
            mv "$file" docs/assets/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
            ;;
        *old*|*deprecated*|*archive*|*backup*)
            mv "$file" docs/archives/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
            ;;
        *)
            # Try to determine by content
            if [ -f "$file" ]; then
                content=$(head -20 "$file" 2>/dev/null | tr '[:upper:]' '[:lower:]')
                if [[ "$content" == *"api"* || "$content" == *"endpoint"* ]]; then
                    mv "$file" docs/technical/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
                elif [[ "$content" == *"setup"* || "$content" == *"install"* ]]; then
                    mv "$file" docs/guides/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
                elif [[ "$content" == *"template"* || "$content" == *"bolt"* ]]; then
                    mv "$file" docs/templates/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
                else
                    mv "$file" docs/references/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
                fi
            fi
            ;;
    esac
}

# Organize existing files
echo "🔄 Organizing existing files..."
find . -maxdepth 2 -name "*.md" -not -path "./docs/*" -not -path "./.git/*" | while read file; do
    organize_file "$file"
done

# Organize other documentation files
find . -maxdepth 2 \( -name "*.txt" -o -name "*.doc" -o -name "*.docx" -o -name "*.pdf" \) -not -path "./docs/*" -not -path "./.git/*" | while read file; do
    organize_file "$file"
done

# Run the setup script to create missing files
echo "📝 Creating documentation structure..."
./docs/scripts/setup_docs_structure.sh

echo ""
echo "✅ Documentation organization complete!"
echo ""
echo "📊 Summary:"
echo "  - Created organized directory structure"
echo "  - Moved existing files to appropriate locations"
echo "  - Created comprehensive documentation files"
echo "  - Backup created before organization"
echo ""
echo "📁 Your documentation is now organized in:"
echo "  - docs/guides/ - User guides and tutorials"
echo "  - docs/technical/ - Technical documentation"
echo "  - docs/deployment/ - Deployment guides"
echo "  - docs/testing/ - Testing documentation"
echo "  - docs/features/ - Feature specifications"
echo "  - docs/tools/ - Tools and utilities"
echo "  - docs/references/ - Reference materials"
echo "  - docs/assets/ - Images and diagrams"
echo "  - docs/archives/ - Archived materials"
echo "  - docs/templates/ - Development templates"
echo "  - docs/chats/ - Development session logs"
echo ""
echo "🎯 You can now add new files to the appropriate directories!"
