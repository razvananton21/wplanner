# Documentation Guide

## Overview

The codebase documentation is split into three complementary files for better organization and readability:

1. `codebase_part1.md`: Frontend Architecture
2. `codebase_part2.md`: Backend Architecture
3. `codebase_part3.md`: Communication & Integration


## When to Use Each File

### Frontend Architecture (`codebase_part1.md`)
Use this file when:
- Working on React components
- Modifying Redux state
- Adding new frontend services
- Creating custom hooks
- Updating routing logic

Key sections:
- Entry points (`main.jsx`, `App.jsx`)
- Component organization
- Service implementations
- State management
- Custom hooks

### Backend Architecture (`codebase_part2.md`)
Use this file when:
- Working on PHP controllers
- Modifying entities
- Updating repositories
- Adding new services
- Changing security settings
- Modifying database schema

Key sections:
- Controllers structure
- Entity definitions
- Repository patterns
- Service layer
- Security implementation
- Database schema

### Communication & Integration (`codebase_part3.md`)
Use this file when:
- Implementing new features that span frontend and backend
- Debugging data flow issues
- Adding error handling
- Writing tests
- Setting up new integrations

Key sections:
- Frontend-Backend flows
- State management patterns
- Error handling strategies
- Integration points
- Testing approaches

## Common Scenarios

### Adding a New Feature
1. Check `codebase_part3.md` for similar integration patterns
2. Reference `codebase_part1.md` for frontend implementation details
3. Reference `codebase_part2.md` for backend implementation details

### Debugging Issues
1. Use `codebase_part3.md` to trace the data flow
2. Check relevant component details in `codebase_part1.md`
3. Verify backend implementation in `codebase_part2.md`

### Code Modifications
1. Identify the affected layer (frontend/backend/both)
2. Reference the appropriate documentation file(s)
3. Follow the modification patterns provided

## Best Practices

1. **Cross-Reference**: When working on features that span multiple layers, keep all relevant documentation files open.

2. **Update Documentation**: When making significant changes:
   - Update the relevant documentation file(s)
   - Maintain the existing structure and format
   - Add new patterns if introducing novel approaches

3. **Search Strategy**:
   - Start with the most relevant file based on your task
   - Use the table of contents to navigate quickly
   - Cross-reference when needed

4. **Version Control**:
   - Keep documentation in sync with code changes
   - Include documentation updates in the same PR as code changes
   - Review documentation changes as part of code review

## Documentation Maintenance

### When to Update
- Adding new features
- Changing existing patterns
- Modifying architecture
- Adding new dependencies
- Changing integration patterns

### How to Update
1. Identify the relevant documentation file(s)
2. Follow the existing format and structure
3. Update all affected sections
4. Maintain cross-references between files
5. Keep examples current and relevant

## Getting Help

If you need help:
1. Start with these documentation files
2. Check the relevant test files
3. Review recent pull requests
4. Consult with team members

Remember: These documentation files are living documents. Keep them updated as the codebase evolves. 