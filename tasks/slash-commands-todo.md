# Slash Commands Implementation Plan

## Todo List

- [x] Create `.claude/commands/` directory structure
- [x] Create /multiagent command
- [x] Create /agents-list command
- [x] Create /review-code command
- [x] Create /fix-ide command
- [x] Test all commands
- [x] Update documentation

## Progress Notes

Creating custom slash commands for multi-agent workflows...

All slash commands created successfully!

## Review Summary

### Slash Commands Created:

1. **`/multiagent`** - Main command for multi-agent coordination
   - Accepts task description as arguments
   - Analyzes task and selects appropriate agents
   - Coordinates multiple agents for complex tasks

2. **`/agents-list`** - Quick reference for all subagents
   - Shows all 7 specialized agents with emojis
   - Lists expertise areas and capabilities
   - Includes usage examples

3. **`/review-code`** - Invokes Code Quality Guardian
   - Focuses on simplicity and best practices
   - Checks for red flags and good patterns
   - Enforces "no lazy solutions" principle

4. **`/fix-ide`** - Invokes React IDE Specialist
   - Common IDE troubleshooting guide
   - Quick fixes and diagnostic steps
   - Reminders about ide-build directory

### How to Use:

Simply type the slash command in Claude Code:
- `/multiagent create a user authentication system`
- `/agents-list` (shows all available agents)
- `/review-code` (before committing changes)
- `/fix-ide` (when IDE has issues)

### Technical Implementation:

- All commands stored in `.claude/commands/` directory
- Written in Markdown format
- Support dynamic arguments with `$ARGUMENTS`
- Can invoke specific subagents based on context

The slash commands provide quick access to multi-agent workflows and specialized expertise!