#!/bin/bash

# Claude Code Auto-Commit Hook
# This hook automatically commits code changes to GitHub when successful edits are made

# Exit if we're not in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Not in a git repository, skipping auto-commit"
    exit 0
fi

# Check if there are any changes to commit
if [[ -z $(git status --porcelain) ]]; then
    echo "No changes to commit"
    exit 0
fi

# Generate commit message with timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
COMMIT_MSG="Auto-commit: Code changes at $TIMESTAMP"

# Check if specific files were modified and create more descriptive message
MODIFIED_FILES=$(git diff --name-only)
if [[ -n "$MODIFIED_FILES" ]]; then
    FILE_COUNT=$(echo "$MODIFIED_FILES" | wc -l | tr -d ' ')
    if [[ $FILE_COUNT -eq 1 ]]; then
        COMMIT_MSG="Auto-commit: Updated $(echo "$MODIFIED_FILES" | head -1)"
    else
        COMMIT_MSG="Auto-commit: Updated $FILE_COUNT files"
    fi
fi

# Stage all changes
git add -A

# Commit with generated message
git commit -m "$COMMIT_MSG" -m "🤖 Committed by Claude Code auto-commit hook"

# Push to remote if available
if git remote | grep -q origin; then
    echo "Pushing changes to GitHub..."
    git push origin HEAD
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed to GitHub"
    else
        echo "⚠️  Push failed, but changes are committed locally"
    fi
else
    echo "✅ Changes committed locally (no remote configured)"
fi