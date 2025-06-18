# 🤝 Contributing to Form-Titan

Thank you for your interest in contributing to Form-Titan! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Development Standards](#development-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Pledge

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 16+ and yarn
- Python 3.9+ and pip
- MongoDB (local or cloud)
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/form-titan.git
   cd form-titan
   ```

2. **Install Dependencies**
   ```bash
   # Frontend
   cd frontend && yarn install
   
   # Backend
   cd ../backend && pip install -r requirements.txt
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

4. **Start Development Servers**
   ```bash
   # Backend
   cd backend && uvicorn main:app --reload
   
   # Frontend (in another terminal)
   cd frontend && yarn start
   ```

## Contribution Guidelines

### Types of Contributions

We welcome the following types of contributions:

- **Bug Fixes**: Fix issues in existing code
- **New Features**: Add new functionality
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage
- **Performance**: Optimize existing code
- **Refactoring**: Improve code quality

### Areas for Contribution

#### High Priority
- [ ] Additional field types (file upload, signature, date range)
- [ ] Enhanced validation rules
- [ ] Accessibility improvements
- [ ] Mobile responsiveness enhancements
- [ ] Performance optimizations

#### Medium Priority
- [ ] Internationalization (i18n) support
- [ ] Theme customization system
- [ ] Advanced conditional logic
- [ ] Form analytics and insights
- [ ] Export/import functionality

#### Low Priority
- [ ] Drag-and-drop form builder UI
- [ ] Form templates library
- [ ] Advanced layout components
- [ ] Integration with popular services
- [ ] Form versioning system

## Pull Request Process

### Before You Start

1. **Check Existing Issues**: Look for existing issues related to your contribution
2. **Create an Issue**: If no issue exists, create one to discuss your proposed changes
3. **Get Feedback**: Wait for maintainer feedback before starting work on large features

### Development Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number-description
   ```

2. **Make Your Changes**
   - Follow the coding standards (see below)
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   # Run frontend tests
   cd frontend && yarn test
   
   # Run backend tests
   cd backend && python -m pytest
   
   # Test the full application
   yarn test:e2e
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new rating field component"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

We use the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(forms): add file upload field component
fix(validation): resolve email validation regex issue
docs(api): update form submission endpoint documentation
test(forms): add unit tests for rating field
```

### Pull Request Template

When creating a pull request, please include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing performed

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
```

## Issue Guidelines

### Reporting Bugs

When reporting bugs, please include:

1. **Clear Title**: Descriptive title summarizing the issue
2. **Environment**: Browser, OS, Node.js version, etc.
3. **Steps to Reproduce**: Detailed steps to reproduce the issue
4. **Expected Behavior**: What you expected to happen
5. **Actual Behavior**: What actually happened
6. **Screenshots/Code**: Visual evidence or code snippets
7. **Additional Context**: Any other relevant information

**Bug Report Template:**
```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**Additional Context**
Add any other context about the problem here.
```

### Feature Requests

When requesting features, please include:

1. **Problem Statement**: What problem does this solve?
2. **Proposed Solution**: How would you like it to work?
3. **Alternatives**: Have you considered alternatives?
4. **Use Cases**: Real-world scenarios where this would be useful
5. **Priority**: How important is this feature?

## Development Standards

### Code Style

#### Frontend (React/JavaScript)

```javascript
// Use functional components with hooks
const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);
  
  // Use descriptive variable names
  const isFormValid = validateForm(formData);
  
  // Use early returns to reduce nesting
  if (!isFormValid) {
    return <ErrorMessage />;
  }
  
  return (
    <div className="component-wrapper">
      {/* JSX content */}
    </div>
  );
};

// Export components as default
export default MyComponent;
```

**React Best Practices:**
- Use functional components and hooks
- Implement proper prop-types or TypeScript
- Follow the single responsibility principle
- Use meaningful component and variable names
- Implement proper error boundaries
- Optimize re-renders with useMemo and useCallback

#### Backend (Python/FastAPI)

```python
# Use type hints
from typing import List, Optional
from pydantic import BaseModel

# Follow PEP 8 style guide
class FormDefinition(BaseModel):
    form_id: str
    name: str
    fields: List[FieldDefinition]
    created_at: Optional[datetime] = None

# Use async/await for I/O operations
async def get_form_definition(form_id: str) -> FormDefinition:
    """Get form definition by ID"""
    form_data = await database.forms.find_one({"formId": form_id})
    if not form_data:
        raise HTTPException(status_code=404, detail="Form not found")
    return FormDefinition(**form_data)

# Use descriptive function and variable names
async def validate_form_submission(
    form_definition: FormDefinition,
    submission_data: Dict[str, Any]
) -> ValidationResult:
    """Validate form submission against definition"""
    # Implementation here
    pass
```

**Python Best Practices:**
- Follow PEP 8 style guide
- Use type hints consistently
- Write descriptive docstrings
- Handle exceptions appropriately
- Use async/await for I/O operations
- Implement proper logging

### File Structure

```
frontend/src/
├── components/          # Reusable UI components
│   ├── common/         # Common components
│   ├── forms/          # Form-specific components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── styles/             # Global styles
└── tests/              # Test files

backend/
├── app/
│   ├── api/           # API route handlers
│   ├── core/          # Core functionality
│   ├── models/        # Database models
│   ├── schemas/       # Pydantic schemas
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── tests/         # Test files
├── migrations/        # Database migrations
└── scripts/          # Utility scripts
```

## Testing Guidelines

### Frontend Testing

```javascript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { FormEngine } from '../FormEngine';

describe('FormEngine', () => {
  it('renders form from definition', () => {
    const mockDefinition = {
      formId: 'test-form',
      fields: [
        { id: 'name', type: 'text', label: 'Name' }
      ]
    };
    
    render(<FormEngine formDefinition={mockDefinition} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });
  
  it('validates required fields', async () => {
    // Test validation logic
  });
});
```

### Backend Testing

```python
# API testing with pytest and httpx
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_get_form_definition():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/forms/test-form")
    
    assert response.status_code == 200
    assert response.json()["formId"] == "test-form"

@pytest.mark.asyncio
async def test_submit_form():
    form_data = {
        "name": "John Doe",
        "email": "john@example.com"
    }
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/forms/test-form/submissions", json={"data": form_data})
    
    assert response.status_code == 201
    assert "submissionId" in response.json()
```

### Test Coverage

- Aim for 80%+ test coverage
- Write unit tests for individual components/functions
- Write integration tests for API endpoints
- Include end-to-end tests for critical user flows

## Documentation Guidelines

### Code Documentation

```javascript
/**
 * Validates form field according to field definition
 * @param {Object} fieldDefinition - The field definition object
 * @param {any} value - The value to validate
 * @param {Object} formState - Current form state for cross-field validation
 * @returns {string|null} Error message or null if valid
 */
const validateField = (fieldDefinition, value, formState) => {
  // Implementation
};
```

```python
def validate_form_submission(
    form_definition: FormDefinition,
    submission_data: Dict[str, Any]
) -> ValidationResult:
    """
    Validate form submission data against form definition.
    
    Args:
        form_definition: The form definition schema
        submission_data: User-submitted form data
    
    Returns:
        ValidationResult object with validation status and errors
    
    Raises:
        ValidationError: If form definition is invalid
    """
    # Implementation
```

### README Updates

When adding new features:
1. Update the main README.md
2. Add examples to docs/EXAMPLES.md
3. Update API documentation if applicable
4. Add configuration options to docs/CONFIGURATION.md

### Changelog

We maintain a CHANGELOG.md following [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
## [Unreleased]

### Added
- New rating field component
- Enhanced validation system

### Changed
- Improved form submission performance

### Fixed
- Email validation regex issue

### Deprecated
- Old validation API (use new validation hooks)

### Removed
- Unused utility functions

### Security
- Updated dependencies to fix vulnerabilities
```

## Release Process

1. **Version Bump**: Update version in package.json and __init__.py
2. **Update Changelog**: Move changes from "Unreleased" to new version
3. **Create Release**: Use GitHub releases with proper tags
4. **Deploy**: Follow deployment guidelines

## Getting Help

- **Discord**: Join our Discord server for real-time help
- **GitHub Discussions**: Use GitHub discussions for general questions
- **Issues**: Create issues for bugs and feature requests
- **Email**: Contact maintainers at dev@form-titan.com

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Annual contributor spotlight
- Hall of fame for significant contributions

Thank you for contributing to Form-Titan! 🚀