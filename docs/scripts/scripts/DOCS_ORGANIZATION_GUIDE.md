# 📚 Documentation Organization Guide

This guide explains how to use the documentation organization scripts to maintain a clean, organized documentation structure.

## 🚀 Quick Start

### **For New Projects**
```bash
# Create fresh documentation structure
./setup_docs_structure.sh
```

### **For Existing Projects with Files**
```bash
# Organize existing files and create structure
./organize_docs.sh
```

## 📋 Available Scripts

### **1. setup_docs_structure.sh**
Creates a complete documentation structure from scratch.

**What it does:**
- ✅ Creates all documentation directories
- ✅ Creates comprehensive README files
- ✅ Sets up template structure
- ✅ Creates placeholder files for each directory

**When to use:**
- Starting a new project
- Creating documentation structure from scratch
- Recreating documentation after cleanup

### **2. organize_docs.sh**
Organizes existing documentation files and creates the structure.

**What it does:**
- ✅ Creates backup of existing docs
- ✅ Creates directory structure
- ✅ Moves existing files to appropriate locations
- ✅ Creates missing documentation files
- ✅ Preserves all existing content

**When to use:**
- Organizing existing documentation
- Cleaning up scattered documentation files
- Maintaining organized structure over time

## 📁 Directory Structure Created

```
docs/
├── README.md                    # Main documentation index
├── CHANGELOG.md                 # Version history
├── guides/                      # User guides and tutorials
│   └── README.md
├── technical/                   # Technical documentation
│   └── README.md
├── deployment/                  # Production deployment guides
│   └── README.md
├── testing/                     # Testing procedures and QA
│   └── README.md
├── features/                    # Feature-specific documentation
│   └── README.md
├── tools/                       # Templates and utility files
│   └── README.md
├── references/                  # External resources and docs
│   └── README.md
├── assets/                      # Diagrams and visual documentation
│   └── README.md
├── archives/                    # Historical documentation
│   └── README.md
├── templates/                   # Development templates
│   ├── README.md
│   ├── bolt/                    # Bolt.new AI templates
│   └── git/                     # Git/project templates
└── chats/                       # Development session logs
    └── README.md
```

## 🔄 File Organization Rules

The `organize_docs.sh` script automatically moves files based on:

### **Filename Patterns**
- `*setup*`, `*install*`, `*guide*`, `*tutorial*` → `docs/guides/`
- `*api*`, `*technical*`, `*error*`, `*debug*` → `docs/technical/`
- `*deploy*`, `*production*`, `*docker*` → `docs/deployment/`
- `*test*`, `*qa*`, `*quality*` → `docs/testing/`
- `*feature*`, `*requirement*`, `*spec*` → `docs/features/`
- `*template*`, `*tool*`, `*utility*` → `docs/tools/`
- `*chat*`, `*session*`, `*log*` → `docs/chats/`
- `*reference*`, `*doc*`, `*manual*` → `docs/references/`
- `*.png`, `*.jpg`, `*.pdf`, `*.diagram*` → `docs/assets/`
- `*old*`, `*deprecated*`, `*archive*` → `docs/archives/`

### **Content Analysis**
For files that don't match filename patterns, the script analyzes content:
- Files containing "API" or "endpoint" → `docs/technical/`
- Files containing "setup" or "install" → `docs/guides/`
- Files containing "template" or "bolt" → `docs/templates/`
- Other files → `docs/references/`

## 🎯 Usage Examples

### **Example 1: Organizing Scattered Files**
```bash
# Before: Files scattered in root directory
ls -la
# README.md
# API_DOCS.md
# setup_guide.md
# deployment_notes.md
# chat_log.md

# Run organization script
./organize_docs.sh

# After: Files organized in proper directories
ls docs/
# guides/setup_guide.md
# technical/API_DOCS.md
# deployment/deployment_notes.md
# chats/chat_log.md
```

### **Example 2: Creating Fresh Structure**
```bash
# Create new documentation structure
./setup_docs_structure.sh

# Add your content to appropriate directories
echo "# My Guide" > docs/guides/my_guide.md
echo "# API Reference" > docs/technical/api_reference.md
```

### **Example 3: Regular Maintenance**
```bash
# After adding new files, reorganize
./organize_docs.sh

# This will:
# 1. Create backup
# 2. Move new files to appropriate locations
# 3. Update documentation structure
```

## 🔧 Customization

### **Adding New File Types**
Edit the `organize_file()` function in `organize_docs.sh`:

```bash
# Add new pattern
*my_pattern*)
    mv "$file" docs/my_directory/ 2>/dev/null || echo "  ⚠️  Could not move $filename"
    ;;
```

### **Modifying Directory Structure**
Edit both scripts to add new directories:

```bash
# Add new directory
mkdir -p docs/my_new_directory

# Create README for new directory
cat > docs/my_new_directory/README.md << 'EOF'
# My New Directory
Description of what goes here.
EOF
```

## 📝 Best Practices

### **File Naming**
- Use descriptive filenames with keywords
- Include file type in filename (e.g., `api_reference.md`)
- Use consistent naming conventions

### **Content Organization**
- Keep related files together
- Use clear headings and structure
- Include cross-references between documents

### **Regular Maintenance**
- Run organization script regularly
- Review and update documentation structure
- Archive outdated materials

## 🚨 Important Notes

### **Backup Creation**
- `organize_docs.sh` automatically creates backups
- Backups are timestamped: `docs_backup_YYYYMMDD_HHMMSS`
- Keep backups until you're satisfied with organization

### **File Preservation**
- Scripts preserve all existing content
- Only move files, never delete
- Check moved files to ensure correct placement

### **Git Integration**
- Run scripts before committing documentation changes
- Review changes before pushing to repository
- Use git to track documentation evolution

## 🔍 Troubleshooting

### **Files Not Moved**
- Check file permissions
- Ensure files are not in use
- Review filename patterns in script

### **Wrong Directory**
- Manually move files to correct location
- Update script patterns for future use
- Add custom patterns as needed

### **Missing Directories**
- Run `setup_docs_structure.sh` to recreate structure
- Check script execution permissions
- Verify script is in project root

## 📞 Support

### **Getting Help**
- Check script output for error messages
- Review file permissions and paths
- Test with small number of files first

### **Contributing**
- Submit improvements to organization logic
- Add new file type patterns
- Enhance documentation structure

---

**Script Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Production Ready
