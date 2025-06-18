# 🏗 Form-Titan Architecture Guide

This document provides a comprehensive overview of Form-Titan's technical architecture, component structure, and design principles.

## Table of Contents

- [Overview](#overview)
- [Core Principles](#core-principles)
- [System Architecture](#system-architecture)
- [Component Hierarchy](#component-hierarchy)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Validation System](#validation-system)
- [Layout System](#layout-system)
- [Extension Points](#extension-points)

## Overview

Form-Titan is built on a **declarative, data-driven architecture** that separates form definition from presentation. The engine transforms JSON configurations into fully interactive React forms through a series of well-defined components and hooks.

## Core Principles

### 1. Declarative Configuration
- Forms are defined entirely through JSON schemas
- No imperative form building code required
- Configuration drives both structure and behavior

### 2. Component Composition
- Modular component architecture
- Each component has a single responsibility
- Easy to test, maintain, and extend

### 3. Headless-Ready Design
- Core logic separated from presentation
- Custom hooks encapsulate business logic
- UI components are easily replaceable

### 4. Reactive State Management
- Centralized state through React Context
- Predictable state updates
- Efficient re-rendering with proper memoization

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  FormEngine Component                                           │
│  ├── FormContext (State Management)                             │
│  ├── Custom Hooks (useFormState, useValidation, useRules)      │
│  ├── LayoutRenderer (Recursive Layout System)                  │
│  ├── FieldRenderer (Dynamic Field Mapping)                     │
│  └── Field Components (TextField, SelectField, etc.)           │
├─────────────────────────────────────────────────────────────────┤
│                          Backend Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  FastAPI Server                                                │
│  ├── Form Definition Endpoints                                 │
│  ├── Form Submission Endpoints                                 │
│  ├── Validation Models (Pydantic)                             │
│  └── Database Layer (MongoDB)                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

### 1. FormEngine (Root Component)
**Location**: `/frontend/src/App.js` (lines 294-400)

**Responsibilities**:
- Fetches form definition from API
- Initializes core hooks and context
- Handles form submission orchestration
- Manages loading and error states

**Key Features**:
```jsx
const FormEngine = ({ formId, initialMode = 'input' }) => {
  // State management
  const [formDefinition, setFormDefinition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Core hooks initialization
  const { formState, updateFieldValue, registerField } = useFormState(fields);
  const { formErrors, validateAll } = useValidation(formState, fields);
  const { fieldVisibility } = useRules(formState, fields);
  
  // API integration
  // Form submission handling
  // Context provider setup
};
```

### 2. FormContext (State Provider)
**Location**: `/frontend/src/App.js` (lines 8-9)

**Purpose**: Provides global access to form state and actions without prop drilling.

**Context Value**:
```jsx
const contextValue = {
  formDefinition: object,     // Form JSON configuration
  formState: object,          // Current field values
  formErrors: object,         // Validation errors
  updateFieldValue: function, // Update field value
  registerField: function,    // Register field on mount
  mode: string,              // 'input' or 'edit'
  setMode: function,         // Mode switcher
  fieldVisibility: object    // Conditional visibility
};
```

### 3. Custom Hooks Layer

#### useFormState Hook
**Location**: `/frontend/src/App.js` (lines 12-35)

**Purpose**: Manages form field values and registration.

```jsx
const useFormState = (fields) => {
  const [formState, setFormState] = useState({});
  const [registeredFields, setRegisteredFields] = useState(new Set());

  const updateFieldValue = (fieldName, value) => {
    setFormState(prev => ({ ...prev, [fieldName]: value }));
  };

  const registerField = (fieldDefinition) => {
    // Field registration logic with default values
  };

  return { formState, updateFieldValue, registerField };
};
```

#### useValidation Hook  
**Location**: `/frontend/src/App.js` (lines 37-88)

**Purpose**: Handles all form validation logic.

**Validation Rules Supported**:
- `required`: Field must have a value
- `minLength`/`maxLength`: String length validation
- `pattern`: Regex pattern matching
- `min`/`max`: Numeric range validation

```jsx
const useValidation = (formState, fields) => {
  const [formErrors, setFormErrors] = useState({});

  const validateField = (fieldDefinition, value) => {
    // Individual field validation logic
  };

  const validateAll = () => {
    // Full form validation
  };

  return { formErrors, validateAll, validateField };
};
```

#### useRules Hook
**Location**: `/frontend/src/App.js` (lines 90-120)

**Purpose**: Handles conditional field visibility.

```jsx
const useRules = (formState, fields) => {
  const fieldVisibility = useMemo(() => {
    // Calculate field visibility based on rules
  }, [formState, fields]);

  return { fieldVisibility };
};
```

### 4. Renderer Components

#### LayoutRenderer
**Location**: `/frontend/src/App.js` (lines 250-292)

**Purpose**: Recursively renders the layout structure from JSON.

**Key Features**:
- Supports both `container` and `field` components
- Dynamic HTML element creation
- Recursive child rendering
- Special content handling (titles, subtitles)

```jsx
const LayoutRenderer = ({ layoutNode }) => {
  if (layoutNode.component === 'field') {
    return <FieldRenderer fieldId={layoutNode.fieldId} />;
  }
  
  if (layoutNode.component === 'container') {
    const Element = layoutNode.element || 'div';
    return React.createElement(Element, attributes, children);
  }
};
```

#### FieldRenderer
**Location**: `/frontend/src/App.js` (lines 230-248)

**Purpose**: Maps field types to React components dynamically.

```jsx
const FIELD_COMPONENTS = {
  text: TextField,
  email: TextField,
  tel: TextField,
  textarea: TextAreaField,
  select: SelectField,
};

const FieldRenderer = ({ fieldId }) => {
  const fieldDefinition = formDefinition.fields.find(field => field.id === fieldId);
  const FieldComponent = FIELD_COMPONENTS[fieldDefinition.type];
  
  return <FieldComponent fieldDefinition={fieldDefinition} />;
};
```

### 5. Field Components

#### TextField Component
**Location**: `/frontend/src/App.js` (lines 123-162)

**Features**:
- Supports text, email, and tel input types
- Real-time validation feedback
- Error state styling
- Accessibility features

#### TextAreaField Component
**Location**: `/frontend/src/App.js` (lines 164-194)

**Features**:
- Multi-line text input
- Configurable rows
- Same validation as TextField

#### SelectField Component  
**Location**: `/frontend/src/App.js` (lines 196-228)

**Features**:
- Dropdown selection
- Dynamic options from JSON
- Default "Select an option" placeholder

## Data Flow

### 1. Form Loading Flow
```
User Request → FormEngine → API Call → Form Definition → State Initialization → Render
```

1. **User navigates to form**: `<FormEngine formId="contact-us-v1" />`
2. **FormEngine fetches definition**: `GET /api/forms/{formId}`  
3. **State initialization**: Hooks are initialized with form data
4. **Context setup**: FormContext provides state to all children
5. **Recursive rendering**: LayoutRenderer processes JSON structure
6. **Field registration**: Field components register themselves

### 2. User Interaction Flow
```
User Input → Field Component → updateFieldValue → FormContext → Re-render
```

1. **User types in field**: Input onChange event fired
2. **Field component**: Calls `updateFieldValue(fieldName, value)`
3. **State update**: `formState` updated in useFormState hook
4. **Context notification**: All consuming components notified
5. **Selective re-render**: Only affected components re-render

### 3. Form Submission Flow
```
Submit Button → Validation → API Call → Response Handling → UI Update
```

1. **Form submission**: User clicks submit button
2. **Validation check**: `validateAll()` runs full form validation
3. **API request**: `POST /api/forms/{formId}/submissions`
4. **Response handling**: Success/error message display
5. **Form reset**: Clear form state on successful submission

## State Management

### Context-Based Architecture
Form-Titan uses React Context for state management instead of external libraries like Redux. This provides:

**Benefits**:
- ✅ Lightweight and built-in to React
- ✅ No additional dependencies
- ✅ Type-safe with TypeScript
- ✅ Perfect for form-scoped state

**State Structure**:
```jsx
{
  // Form definition from API
  formDefinition: {
    formId: "contact-us-v1",
    name: "Contact Us Form", 
    fields: [...],
    layoutDefinition: {...}
  },
  
  // Current field values
  formState: {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com"
  },
  
  // Validation errors
  formErrors: {
    email: "Email format is invalid"
  },
  
  // Field visibility (conditional logic)
  fieldVisibility: {
    field_id_1: true,
    field_id_2: false
  }
}
```

### State Update Patterns

**Field Value Updates**:
```jsx
// Immutable state updates
const updateFieldValue = (fieldName, value) => {
  setFormState(prev => ({
    ...prev,
    [fieldName]: value
  }));
};
```

**Validation Updates**:
```jsx
// Batch validation updates
const validateAll = () => {
  const errors = {};
  fields.forEach(field => {
    const error = validateField(field, formState[field.name]);
    if (error) errors[field.name] = error;
  });
  setFormErrors(errors);
};
```

## Validation System

### Multi-Layer Validation Architecture

1. **Client-Side Validation**:
   - Real-time validation as user types
   - Form-level validation on submit
   - Custom validation rules support

2. **Server-Side Validation**:
   - Pydantic model validation  
   - Database constraint validation
   - Business logic validation

### Validation Rules Engine

**Built-in Rules**:
```jsx
const validateField = (fieldDefinition, value) => {
  const { validation } = fieldDefinition;
  
  // Required field validation
  if (validation?.required && !value?.trim()) {
    return `${fieldDefinition.label} is required`;
  }
  
  // Length validation
  if (value && validation?.minLength && value.length < validation.minLength) {
    return `${fieldDefinition.label} must be at least ${validation.minLength} characters`;
  }
  
  // Pattern validation (regex)
  if (value && validation?.pattern) {
    const regex = new RegExp(validation.pattern);
    if (!regex.test(value)) {
      return `${fieldDefinition.label} format is invalid`;
    }
  }
  
  return null; // No error
};
```

**Custom Validation Extension**:
```jsx
// Extend validation for custom rules
const customValidationRules = {
  creditCard: (value) => {
    // Custom credit card validation logic
  },
  
  phoneNumber: (value) => {
    // Custom phone number validation logic  
  }
};
```

## Layout System

### Recursive Component Architecture

The layout system uses a recursive approach where containers can contain other containers or fields:

```json
{
  "id": "root",
  "component": "container",
  "element": "div",
  "attributes": {"className": "form-wrapper"},
  "children": [
    {
      "id": "section1", 
      "component": "container",
      "element": "section",
      "children": [
        {"id": "field1", "component": "field", "fieldId": "first_name"}
      ]
    }
  ]
}
```

### Layout Flexibility

**Supported Layouts**:
- Single column forms
- Multi-column grids
- Nested sections
- Conditional containers
- Custom HTML structures

**CSS Framework Integration**:
- Tailwind CSS classes in JSON
- Custom CSS class support
- Responsive design utilities
- Component-level styling

## Extension Points

### 1. Custom Field Types

```jsx
// Create custom field component
const CustomRatingField = ({ fieldDefinition }) => {
  const { formState, updateFieldValue } = useContext(FormContext);
  
  return (
    <div className="rating-field">
      {/* Custom rating implementation */}
    </div>
  );
};

// Register in component map
const EXTENDED_FIELD_COMPONENTS = {
  ...FIELD_COMPONENTS,
  rating: CustomRatingField,
  slider: CustomSliderField,
  colorPicker: CustomColorPickerField
};
```

### 2. Custom Validation Rules

```jsx
// Extend validation hook
const useExtendedValidation = (formState, fields) => {
  const baseValidation = useValidation(formState, fields);
  
  const customValidateField = (fieldDefinition, value) => {
    // Custom validation logic
    if (fieldDefinition.customRule === 'creditCard') {
      return validateCreditCard(value);
    }
    
    return baseValidation.validateField(fieldDefinition, value);
  };
  
  return { ...baseValidation, validateField: customValidateField };
};
```

### 3. Custom Layout Components

```jsx
// Custom layout component
const TabContainer = ({ layoutNode, children }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className="tab-container">
      <div className="tab-headers">
        {/* Tab navigation */}
      </div>
      <div className="tab-content">
        {children[activeTab]}
      </div>
    </div>
  );
};

// Register custom layout
const CUSTOM_LAYOUT_COMPONENTS = {
  container: DefaultContainer,
  tabs: TabContainer,
  accordion: AccordionContainer
};
```

### 4. Middleware and Hooks

```jsx
// Custom form middleware
const useFormMiddleware = () => {
  return {
    beforeSubmit: (formData) => {
      // Pre-submission processing
      return processedData;
    },
    
    afterSubmit: (response) => {
      // Post-submission handling
    },
    
    onFieldChange: (fieldName, oldValue, newValue) => {
      // Field change side effects
    }
  };
};
```

## Performance Considerations

### 1. Memoization Strategy
- `useMemo` for field visibility calculations
- `useCallback` for event handlers
- `React.memo` for field components

### 2. Selective Re-rendering
- Context value optimization
- Field-level state isolation
- Efficient validation updates

### 3. Bundle Optimization
- Dynamic imports for field components
- Tree shaking for unused components
- Code splitting for large forms

---

This architecture provides a solid foundation for building dynamic, maintainable forms while remaining flexible enough to accommodate future requirements and customizations.