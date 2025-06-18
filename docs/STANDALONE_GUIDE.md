# 🟨 Form-Titan Standalone JavaScript Guide

This guide covers the standalone JavaScript version of Form-Titan that works without React dependencies. Perfect for embedding forms in any website, CMS, or legacy application.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
- [Customization](#customization)
- [Maintenance](#maintenance)
- [Migration Guide](#migration-guide)
- [Troubleshooting](#troubleshooting)

## Overview

Form-Titan Standalone is a pure JavaScript implementation of the Form-Titan form engine. It provides the same powerful features as the React version but can be used in any web environment:

- **Pure JavaScript** - No React, Vue, or other framework dependencies
- **Same JSON Schema** - Compatible with React version form definitions
- **Modern Features** - ES6+ with fallbacks for older browsers
- **Lightweight** - Minimal bundle size with tree-shaking support
- **Extensible** - Plugin system for custom fields and validators
- **Accessible** - WCAG 2.1 compliant with keyboard navigation

### Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Legacy Support**: IE 11+ (with polyfills)

## Quick Start

### 1. Include the Files

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="form-titan.css">
</head>
<body>
    <div id="my-form"></div>
    
    <script src="form-titan.js"></script>
    <script>
        // Your form code here
    </script>
</body>
</html>
```

### 2. Create a Form

```javascript
// Create form engine instance
const formEngine = FormTitan.create('my-form', {
    theme: 'default',
    validateOnChange: true
});

// Load form from JSON definition
const formDefinition = {
    formId: 'contact-form',
    name: 'Contact Us',
    fields: [
        {
            id: 'name',
            name: 'name',
            type: 'text',
            label: 'Your Name',
            validation: { required: true }
        },
        {
            id: 'email',
            name: 'email',
            type: 'email',
            label: 'Email Address',
            validation: { required: true }
        }
    ],
    layoutDefinition: {
        id: 'root',
        component: 'container',
        element: 'div',
        children: [
            { id: 'name_field', component: 'field', fieldId: 'name' },
            { id: 'email_field', component: 'field', fieldId: 'email' }
        ]
    }
};

formEngine.loadForm(formDefinition);
```

### 3. Handle Events

```javascript
formEngine.on('formSubmitted', ({ formData, result }) => {
    console.log('Form submitted:', formData);
    alert('Thank you for your submission!');
});

formEngine.on('fieldChange', ({ fieldName, value }) => {
    console.log(`${fieldName} changed to:`, value);
});
```

## Installation

### Method 1: Direct Download

Download the files and include them in your project:

```
standalone/
├── form-titan.js      # Main JavaScript file
├── form-titan.css     # Stylesheet
└── example.html       # Example usage
```

### Method 2: CDN (Future)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/form-titan/dist/form-titan.css">
<script src="https://cdn.jsdelivr.net/npm/form-titan/dist/form-titan.js"></script>
```

### Method 3: npm (Future)

```bash
npm install form-titan-standalone
```

```javascript
import FormTitan from 'form-titan-standalone';
// or
const FormTitan = require('form-titan-standalone');
```

### Polyfills for Legacy Browsers

For IE 11 support, include polyfills before Form-Titan:

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6,Array.prototype.find,Array.prototype.includes,Object.assign,Promise"></script>
<script src="form-titan.js"></script>
```

## Basic Usage

### Creating a Form Engine

```javascript
const options = {
    theme: 'default',           // Theme: 'default', 'dark', 'high-contrast'
    validateOnChange: true,     // Validate fields as user types
    validateOnBlur: true,       // Validate when field loses focus
    autoSubmit: false,          // Auto-submit when valid
    showLoadingStates: true,    // Show loading indicators
    apiUrl: '/api',            // Backend API base URL
    resetOnSubmit: false       // Reset form after successful submission
};

const formEngine = FormTitan.create('container-id', options);
```

### Loading Forms

#### From JSON Definition

```javascript
const formDefinition = { /* ... */ };
formEngine.loadForm(formDefinition);
```

#### From API Endpoint

```javascript
// Loads from /api/forms/contact-form
formEngine.loadForm('contact-form');
```

#### From External URL

```javascript
formEngine.options.apiUrl = 'https://api.example.com';
formEngine.loadForm('my-form-id');
```

### Form Data Management

```javascript
// Get current form data
const data = formEngine.getFormData();

// Set form data
formEngine.setFormData({
    name: 'John Doe',
    email: 'john@example.com'
});

// Get specific field value
const name = formEngine.getFieldValue('name');

// Set specific field value
formEngine.setFieldValue('name', 'Jane Doe');

// Reset form
formEngine.resetForm();

// Validate form
const isValid = formEngine.validate();
```

### Event Handling

```javascript
// Form lifecycle events
formEngine.on('formLoaded', (definition) => {
    console.log('Form loaded:', definition.name);
});

formEngine.on('formRendered', () => {
    console.log('Form rendered successfully');
});

formEngine.on('formSubmitted', ({ formData, result }) => {
    console.log('Form submitted:', formData);
});

formEngine.on('formReset', () => {
    console.log('Form was reset');
});

// Field events
formEngine.on('fieldChange', ({ fieldName, value, formData }) => {
    console.log(`Field ${fieldName} changed to:`, value);
});

// Validation events
formEngine.on('validationChange', ({ fieldName, error, errors }) => {
    if (error) {
        console.log(`Validation error on ${fieldName}:`, error);
    }
});

formEngine.on('validationFailed', (errors) => {
    console.log('Form validation failed:', errors);
});

// State change events
formEngine.on('loadingChange', (isLoading) => {
    console.log('Loading state:', isLoading);
});

formEngine.on('submittingChange', (isSubmitting) => {
    console.log('Submitting state:', isSubmitting);
});

// Error handling
formEngine.on('error', ({ message, error }) => {
    console.error('Form error:', message, error);
});

// Cleanup
formEngine.on('destroyed', () => {
    console.log('Form engine destroyed');
});
```

## API Reference

### FormTitan Global Object

#### Static Methods

```javascript
// Create new form engine
FormTitan.create(containerId, options)

// Get existing form engine
FormTitan.get(containerId)

// Register custom field type
FormTitan.registerField(type, FieldClass)

// Register custom validator
FormTitan.registerValidator(name, validatorFunction)

// Utility functions
FormTitan.Utils.generateId()
FormTitan.Utils.debounce(func, wait)
FormTitan.Utils.createElement(tag, attributes, children)

// Version info
FormTitan.version
```

### FormEngine Instance

#### Properties

```javascript
formEngine.containerId       // Container element ID
formEngine.container         // DOM element reference
formEngine.formDefinition    // Current form definition
formEngine.formState         // Form state manager
formEngine.validator         // Validation engine
formEngine.isLoading         // Loading state
formEngine.isSubmitting      // Submitting state
formEngine.options           // Configuration options
```

#### Methods

```javascript
// Form loading
await formEngine.loadForm(formIdOrDefinition)
await formEngine.fetchFormDefinition(formId)

// Form rendering
formEngine.render()

// Data management
formEngine.getFormData()
formEngine.setFormData(data)
formEngine.getFieldValue(fieldName)
formEngine.setFieldValue(fieldName, value)

// Validation
formEngine.validate()

// Form operations
formEngine.resetForm()
await formEngine.submitForm(formData)

// State management
formEngine.setLoading(loading)
formEngine.setSubmitting(submitting)

// Utilities
formEngine.showMessage(message, type)
formEngine.handleError(message, error)
formEngine.getField(fieldId)

// Cleanup
formEngine.destroy()
```

### Field Types

#### Built-in Field Types

```javascript
// Text-based fields
'text'      // Single line text input
'email'     // Email input with validation
'tel'       // Telephone number input
'password'  // Password input
'number'    // Numeric input
'url'       // URL input
'textarea'  // Multi-line text input

// Selection fields
'select'    // Dropdown selection
'radio'     // Radio button group
'checkbox'  // Checkbox group or single checkbox

// Date/time fields
'date'      // Date picker
```

#### Field Definition Schema

```javascript
{
    id: 'field_id',                    // Unique identifier
    name: 'field_name',                // Form data key
    type: 'text',                      // Field type
    label: 'Field Label',              // Display label
    placeholder: 'Enter value...',     // Placeholder text
    instructions: 'Help text',         // Instructions/help text
    defaultValue: 'default',           // Default value
    options: [                         // Options for select/radio/checkbox
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' }
    ],
    validation: {                      // Validation rules
        required: true,
        minLength: 5,
        maxLength: 100,
        pattern: '^[A-Za-z]+$',
        min: 0,
        max: 100,
        customRules: [
            { type: 'custom_validator', options: {} }
        ]
    },
    visibility: [                      // Conditional visibility
        {
            field: 'other_field',
            operator: 'equals',
            value: 'some_value'
        }
    ]
}
```

### Validation Rules

#### Built-in Validators

```javascript
// Required field
{ required: true }

// String length
{ minLength: 5, maxLength: 100 }

// Numeric range
{ min: 0, max: 100 }

// Pattern matching
{ pattern: '^[A-Za-z]+$' }

// Email validation (automatic for email fields)
```

#### Visibility Operators

```javascript
'equals'                // Field value equals target value
'not_equals'           // Field value does not equal target value
'contains'             // Field value contains target value
'not_contains'         // Field value does not contain target value
'greater_than'         // Field value is greater than target
'less_than'            // Field value is less than target
'is_empty'             // Field is empty
'is_not_empty'         // Field is not empty
'in_array'             // Field value is in target array
```

## Customization

### Custom Field Types

Create custom field components by extending the BaseField class:

```javascript
class CustomField extends FormTitan.BaseField {
    render() {
        this.element = this.createFieldWrapper();
        
        // Create your custom input element
        this.inputElement = FormTitan.Utils.createElement('input', {
            type: 'text',
            id: this.fieldDefinition.id,
            name: this.fieldDefinition.name,
            className: 'field-input custom-field-input',
            value: this.getValue() || '',
            onInput: (e) => this.setValue(e.target.value),
            onBlur: () => this.updateValidation()
        });
        
        // Add custom styling or behavior
        this.inputElement.style.border = '2px solid blue';
        
        this.element.appendChild(this.inputElement);
        this.element.appendChild(this.createErrorElement());
        
        return this.element;
    }
    
    // Override other methods as needed
    updateValidation() {
        super.updateValidation();
        // Custom validation logic
    }
}

// Register the custom field type
FormTitan.registerField('custom', CustomField);
```

### Advanced Custom Field Example

```javascript
class RatingField extends FormTitan.BaseField {
    render() {
        this.element = this.createFieldWrapper();
        this.element.classList.add('rating-field');
        
        const ratingContainer = FormTitan.Utils.createElement('div', {
            className: 'rating-container'
        });
        
        const maxRating = this.fieldDefinition.options?.maxRating || 5;
        
        for (let i = 1; i <= maxRating; i++) {
            const star = FormTitan.Utils.createElement('button', {
                type: 'button',
                className: 'rating-star',
                dataset: { rating: i },
                onClick: (e) => {
                    e.preventDefault();
                    this.setValue(i);
                    this.updateStars();
                }
            }, ['⭐']);
            
            ratingContainer.appendChild(star);
        }
        
        this.element.appendChild(ratingContainer);
        this.element.appendChild(this.createErrorElement());
        
        this.updateStars();
        
        return this.element;
    }
    
    updateStars() {
        const rating = this.getValue() || 0;
        const stars = this.element.querySelectorAll('.rating-star');
        
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
}

FormTitan.registerField('rating', RatingField);
```

### Custom Validators

```javascript
// Simple validator
FormTitan.registerValidator('phone', (value, options) => {
    if (!value) return null;
    
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(value)) {
        return 'Invalid phone number format';
    }
    
    return null;
});

// Advanced validator with options
FormTitan.registerValidator('creditCard', (value, options, formData) => {
    if (!value) return null;
    
    // Remove spaces and dashes
    const cleaned = value.replace(/[\s\-]/g, '');
    
    // Check if all digits
    if (!/^\d+$/.test(cleaned)) {
        return 'Credit card must contain only numbers';
    }
    
    // Luhn algorithm validation
    if (!isValidLuhn(cleaned)) {
        return 'Invalid credit card number';
    }
    
    return null;
});

function isValidLuhn(number) {
    let sum = 0;
    let alternate = false;
    
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number[i]);
        
        if (alternate) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        alternate = !alternate;
    }
    
    return sum % 10 === 0;
}
```

### Custom Themes

Create custom themes by extending the CSS:

```css
/* Custom theme */
.form-titan-theme-corporate {
    --primary-color: #2c5282;
    --secondary-color: #4a5568;
    --success-color: #38a169;
    --error-color: #e53e3e;
    --border-color: #cbd5e0;
    --background-color: #f7fafc;
    --text-color: #2d3748;
    --border-radius: 4px;
}

.form-titan-theme-corporate .field-input {
    border: 2px solid var(--border-color);
    font-family: 'Georgia', serif;
}

.form-titan-theme-corporate .form-submit-button {
    background: linear-gradient(135deg, var(--primary-color), #3182ce);
    text-transform: uppercase;
    letter-spacing: 1px;
}
```

### Layout Customization

```javascript
// Custom layout component
class TabLayoutRenderer extends FormTitan.LayoutRenderer {
    renderContainer(layoutNode) {
        if (layoutNode.customType === 'tabs') {
            return this.renderTabContainer(layoutNode);
        }
        
        return super.renderContainer(layoutNode);
    }
    
    renderTabContainer(layoutNode) {
        const container = FormTitan.Utils.createElement('div', {
            className: 'tab-container'
        });
        
        const tabs = layoutNode.attributes?.tabs || [];
        
        // Create tab headers
        const tabHeaders = FormTitan.Utils.createElement('div', {
            className: 'tab-headers'
        });
        
        tabs.forEach((tab, index) => {
            const tabButton = FormTitan.Utils.createElement('button', {
                type: 'button',
                className: `tab-button ${index === 0 ? 'active' : ''}`,
                onClick: () => this.switchTab(container, index)
            }, [tab.label]);
            
            tabHeaders.appendChild(tabButton);
        });
        
        container.appendChild(tabHeaders);
        
        // Create tab content
        const tabContent = FormTitan.Utils.createElement('div', {
            className: 'tab-content'
        });
        
        layoutNode.children.forEach((child, index) => {
            const tabPane = FormTitan.Utils.createElement('div', {
                className: `tab-pane ${index === 0 ? 'active' : ''}`,
                dataset: { tabIndex: index }
            });
            
            tabPane.appendChild(this.render(child));
            tabContent.appendChild(tabPane);
        });
        
        container.appendChild(tabContent);
        
        return container;
    }
    
    switchTab(container, activeIndex) {
        // Update tab buttons
        const buttons = container.querySelectorAll('.tab-button');
        buttons.forEach((button, index) => {
            button.classList.toggle('active', index === activeIndex);
        });
        
        // Update tab panes
        const panes = container.querySelectorAll('.tab-pane');
        panes.forEach((pane, index) => {
            pane.classList.toggle('active', index === activeIndex);
        });
    }
}

// Override the default layout renderer
formEngine.layoutRenderer = new TabLayoutRenderer(formEngine);
```

## Maintenance

### Updating Form-Titan

#### Version Compatibility

The standalone version follows semantic versioning:

- **Major versions** (1.x.x → 2.x.x): Breaking changes
- **Minor versions** (1.1.x → 1.2.x): New features, backward compatible
- **Patch versions** (1.1.1 → 1.1.2): Bug fixes, backward compatible

#### Update Process

1. **Check Release Notes**: Review breaking changes and new features
2. **Test in Development**: Update in a development environment first
3. **Update Custom Code**: Modify custom fields/validators if needed
4. **Deploy Gradually**: Use feature flags or staged rollouts

#### Migration Checklist

```javascript
// Before updating
const currentVersion = FormTitan.version;
console.log('Current version:', currentVersion);

// After updating
const newVersion = FormTitan.version;
console.log('New version:', newVersion);

// Check for breaking changes
if (newVersion.split('.')[0] !== currentVersion.split('.')[0]) {
    console.warn('Major version change detected. Review migration guide.');
}
```

### Performance Optimization

#### Bundle Size Optimization

```javascript
// Tree shaking with module bundlers
import { FormEngine, TextField, SelectField } from 'form-titan-standalone';

// Only register needed field types
FormTitan.fieldTypes.clear();
FormTitan.registerField('text', TextField);
FormTitan.registerField('select', SelectField);
```

#### Memory Management

```javascript
// Proper cleanup when removing forms
formEngine.destroy();

// Remove from global registry
FormTitan.engines.delete(containerId);

// Clear event listeners
formEngine.off('fieldChange', myHandler);
```

#### Performance Monitoring

```javascript
// Monitor form performance
formEngine.on('formRendered', () => {
    const renderTime = performance.now() - startTime;
    console.log(`Form rendered in ${renderTime}ms`);
});

// Track memory usage
setInterval(() => {
    if (performance.memory) {
        console.log('Memory usage:', performance.memory.usedJSHeapSize);
    }
}, 10000);
```

### Debugging

#### Debug Mode

```javascript
// Enable debug mode
const formEngine = FormTitan.create('container', {
    debug: true,
    logLevel: 'verbose'
});

// Manual debugging
formEngine.on('*', (eventName, data) => {
    console.log(`Event: ${eventName}`, data);
});
```

#### Common Issues

```javascript
// Check if container exists
if (!document.getElementById('my-form')) {
    console.error('Form container not found');
}

// Validate form definition
function validateFormDefinition(definition) {
    const required = ['formId', 'fields', 'layoutDefinition'];
    const missing = required.filter(prop => !definition[prop]);
    
    if (missing.length > 0) {
        console.error('Missing required properties:', missing);
        return false;
    }
    
    return true;
}

// Check field registration
if (!FormTitan.fieldTypes.has('custom')) {
    console.warn('Custom field type not registered');
}
```

### Testing

#### Unit Testing Custom Components

```javascript
// Test custom field component
describe('CustomField', () => {
    let field;
    let mockFormState;
    let mockFormEngine;
    
    beforeEach(() => {
        mockFormState = {
            getValue: jest.fn(),
            setValue: jest.fn(),
            getError: jest.fn()
        };
        
        mockFormEngine = {
            validator: {
                validateField: jest.fn()
            }
        };
        
        const fieldDefinition = {
            id: 'test_field',
            name: 'test_field',
            type: 'custom',
            label: 'Test Field'
        };
        
        field = new CustomField(fieldDefinition, mockFormState, mockFormEngine);
    });
    
    it('should render correctly', () => {
        const element = field.render();
        expect(element.tagName).toBe('DIV');
        expect(element.querySelector('.field-input')).toBeTruthy();
    });
    
    it('should update value on input', () => {
        const element = field.render();
        const input = element.querySelector('.field-input');
        
        input.value = 'test value';
        input.dispatchEvent(new Event('input'));
        
        expect(mockFormState.setValue).toHaveBeenCalledWith('test_field', 'test value');
    });
});
```

#### Integration Testing

```javascript
// Test form integration
describe('Form Integration', () => {
    let container;
    let formEngine;
    
    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'test-form';
        document.body.appendChild(container);
        
        formEngine = FormTitan.create('test-form');
    });
    
    afterEach(() => {
        formEngine.destroy();
        document.body.removeChild(container);
    });
    
    it('should load and render form', async () => {
        const formDefinition = {
            formId: 'test',
            fields: [
                {
                    id: 'name',
                    name: 'name',
                    type: 'text',
                    label: 'Name'
                }
            ],
            layoutDefinition: {
                id: 'root',
                component: 'container',
                children: [
                    { id: 'name_field', component: 'field', fieldId: 'name' }
                ]
            }
        };
        
        await formEngine.loadForm(formDefinition);
        
        expect(container.querySelector('input[name="name"]')).toBeTruthy();
    });
});
```

## Migration Guide

### From React Version

The standalone version maintains compatibility with React version form definitions:

```javascript
// React form definition works directly
const reactFormDefinition = { /* existing definition */ };
formEngine.loadForm(reactFormDefinition);
```

### From Other Form Libraries

#### From jQuery Form Libraries

```javascript
// Before (jQuery)
$('#my-form').validate({
    rules: {
        name: 'required',
        email: {
            required: true,
            email: true
        }
    }
});

// After (Form-Titan)
const formDefinition = {
    formId: 'my-form',
    fields: [
        {
            id: 'name',
            name: 'name',
            type: 'text',
            label: 'Name',
            validation: { required: true }
        },
        {
            id: 'email',
            name: 'email',
            type: 'email',
            label: 'Email',
            validation: { required: true }
        }
    ],
    // ... layout definition
};

formEngine.loadForm(formDefinition);
```

#### From FormData API

```javascript
// Convert FormData to Form-Titan definition
function convertFormDataToDefinition(form) {
    const fields = [];
    const formData = new FormData(form);
    
    for (const input of form.elements) {
        if (input.name) {
            fields.push({
                id: input.name,
                name: input.name,
                type: input.type === 'email' ? 'email' : 'text',
                label: input.placeholder || input.name,
                validation: {
                    required: input.required
                }
            });
        }
    }
    
    return {
        formId: form.id,
        fields: fields,
        layoutDefinition: generateLayoutFromFields(fields)
    };
}
```

## Troubleshooting

### Common Issues

#### Form Not Rendering

```javascript
// Check container exists
const container = document.getElementById('my-form');
if (!container) {
    console.error('Container element not found');
}

// Check form definition
console.log('Form definition:', formEngine.formDefinition);

// Check for JavaScript errors
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});
```

#### Validation Not Working

```javascript
// Check validation configuration
console.log('Validation options:', formEngine.options.validateOnChange);

// Manual validation test
const isValid = formEngine.validate();
console.log('Form valid:', isValid);

// Check field definitions
formEngine.formDefinition.fields.forEach(field => {
    console.log(`Field ${field.name}:`, field.validation);
});
```

#### Styling Issues

```javascript
// Check CSS loading
const stylesheets = document.querySelectorAll('link[href*="form-titan"]');
if (stylesheets.length === 0) {
    console.warn('Form-Titan CSS not loaded');
}

// Check theme application
console.log('Applied theme:', formEngine.options.theme);
console.log('Container classes:', formEngine.container.className);
```

#### Performance Issues

```javascript
// Monitor form size
console.log('Field count:', formEngine.formDefinition.fields.length);
console.log('DOM nodes:', formEngine.container.querySelectorAll('*').length);

// Check for memory leaks
setInterval(() => {
    console.log('Active engines:', FormTitan.engines.size);
}, 5000);
```

### Browser Compatibility Issues

#### IE 11 Support

```javascript
// Check for required features
if (!Array.prototype.find) {
    console.error('Array.find not supported. Include polyfills.');
}

if (!Object.assign) {
    console.error('Object.assign not supported. Include polyfills.');
}

// Conditional loading
if (window.navigator.userAgent.indexOf('MSIE') !== -1 ||
    window.navigator.userAgent.indexOf('Trident/') !== -1) {
    // Load polyfills for IE
    loadPolyfills().then(() => {
        initializeForm();
    });
} else {
    initializeForm();
}
```

#### Mobile Safari Issues

```javascript
// Viewport fixes
document.addEventListener('DOMContentLoaded', () => {
    // Fix viewport on iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.classList.add('ios-device');
    }
});

// Keyboard handling
formEngine.on('fieldChange', ({ fieldName }) => {
    // Scroll field into view on mobile
    if (window.innerWidth < 768) {
        const field = document.querySelector(`[data-field-id="${fieldName}"]`);
        if (field) {
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});
```

### Error Reporting

```javascript
// Set up error reporting
formEngine.on('error', ({ message, error }) => {
    // Send to error tracking service
    if (window.Sentry) {
        window.Sentry.captureException(error, {
            tags: {
                component: 'form-titan',
                formId: formEngine.formDefinition?.formId
            },
            extra: {
                message: message,
                formState: formEngine.getFormData()
            }
        });
    }
    
    // Log to console
    console.error('Form-Titan Error:', {
        message,
        error,
        formId: formEngine.formDefinition?.formId,
        version: FormTitan.version
    });
});
```

This comprehensive guide provides everything needed to successfully implement, customize, and maintain the Form-Titan standalone JavaScript version in any web environment.