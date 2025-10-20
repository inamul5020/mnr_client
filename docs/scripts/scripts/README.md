# 🛠️ Documentation Scripts

This directory contains automation scripts for managing and organizing documentation structure.

## Contents

- **setup_docs_structure.sh** - Creates complete documentation structure from scratch
- **organize_docs.sh** - Organizes existing documentation files and creates structure
- **DOCS_ORGANIZATION_GUIDE.md** - Complete guide for using documentation scripts

## Quick Start

### For New Projects
```bash
# Create fresh documentation structure
./docs/scripts/setup_docs_structure.sh
```

### For Existing Projects with Files
```bash
# Organize existing files and create structure
./docs/scripts/organize_docs.sh
```

## Script Descriptions

### setup_docs_structure.sh
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

### organize_docs.sh
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

## File Organization Rules

The organize_docs.sh script automatically moves files based on:

### Filename Patterns
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

### Content Analysis
For files that don't match filename patterns, the script analyzes content:
- Files containing "API" or "endpoint" → `docs/technical/`
- Files containing "setup" or "install" → `docs/guides/`
- Files containing "template" or "bolt" → `docs/templates/`
- Other files → `docs/references/`

## Important Notes

### Backup Creation
- `organize_docs.sh` automatically creates backups
- Backups are timestamped: `docs_backup_YYYYMMDD_HHMMSS`
- Keep backups until you're satisfied with organization

### File Preservation
- Scripts preserve all existing content
- Only move files, never delete
- Check moved files to ensure correct placement

### Permissions
- Scripts are automatically made executable
- Run from project root directory
- Check file permissions if issues occur

## Troubleshooting

### Common Issues
1. **Permission Denied** - Run `chmod +x docs/scripts/*.sh`
2. **Directory Exists** - Choose to backup or cancel setup
3. **Script Not Found** - Ensure scripts are in `docs/scripts/` folder
4. **Script Fails** - Check file permissions and paths

### Getting Help
- Check script output for error messages
- Review file permissions
- Ensure proper directory structure
- Test with small project first

## Documentation

For complete documentation and advanced usage, see:
- **DOCS_ORGANIZATION_GUIDE.md** - Comprehensive guide
- **Main Documentation** - Project documentation overview

---

**Script Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Production Ready
