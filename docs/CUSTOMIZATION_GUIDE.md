# 🎨 Form-Titan Customization Guide

This guide covers how to extend and customize Form-Titan to meet your specific requirements, from adding new field types to creating custom validation rules and layouts.

## Table of Contents

- [Custom Field Types](#custom-field-types)
- [Custom Validation Rules](#custom-validation-rules)
- [Custom Layout Components](#custom-layout-components)
- [Styling Customization](#styling-customization)
- [Event Hooks](#event-hooks)
- [Conditional Logic](#conditional-logic)
- [Internationalization](#internationalization)
- [Advanced Customizations](#advanced-customizations)

## Custom Field Types

### Creating a New Field Type

Here's how to create a custom rating field that displays stars:

```jsx
// src/components/custom-fields/RatingField.jsx
import React, { useContext, useEffect, useState } from 'react';
import { FormContext } from '../form-titan/FormEngine';

const RatingField = ({ fieldDefinition }) => {
  const { formState, formErrors, updateFieldValue, registerField } = useContext(FormContext);
  const [hoverRating, setHoverRating] = useState(0);
  
  useEffect(() => {
    registerField(fieldDefinition);
  }, [fieldDefinition, registerField]);

  const currentRating = formState[fieldDefinition.name] || 0;
  const error = formErrors[fieldDefinition.name];
  const maxRating = fieldDefinition.options?.maxRating || 5;

  const handleStarClick = (rating) => {
    updateFieldValue(fieldDefinition.name, rating);
  };

  const handleStarHover = (rating) => {
    setHoverRating(rating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="form-field">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {fieldDefinition.label}
        {fieldDefinition.validation?.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="flex items-center space-x-1">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isActive = starValue <= (hoverRating || currentRating);
          
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleStarHover(starValue)}
              onMouseLeave={handleStarLeave}
              className={`text-2xl transition-colors duration-150 ${
                isActive ? 'text-yellow-400' : 'text-gray-300'
              } hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded`}
              aria-label={`Rate ${starValue} out of ${maxRating} stars`}
            >
              ★
            </button>
          );
        })}
        
        {currentRating > 0 && (
          <span className="ml-2 text-sm text-gray-600">
            ({currentRating}/{maxRating})
          </span>
        )}
      </div>
      
      {fieldDefinition.instructions && (
        <p className="text-sm text-gray-500 mt-1">{fieldDefinition.instructions}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default RatingField;
```

### Advanced Custom Field: File Upload

```jsx
// src/components/custom-fields/FileUploadField.jsx
import React, { useContext, useEffect, useState, useRef } from 'react';
import { FormContext } from '../form-titan/FormEngine';

const FileUploadField = ({ fieldDefinition }) => {
  const { formState, formErrors, updateFieldValue, registerField } = useContext(FormContext);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    registerField(fieldDefinition);
  }, [fieldDefinition, registerField]);

  const currentFiles = formState[fieldDefinition.name] || [];
  const error = formErrors[fieldDefinition.name];
  
  const { maxFiles = 5, maxSize = 5 * 1024 * 1024, acceptedTypes = ['*'] } = fieldDefinition.options || {};

  const handleFileSelect = async (files) => {
    const fileArray = Array.from(files);
    
    // Validate files
    const validFiles = [];
    const errors = [];
    
    for (const file of fileArray) {
      if (file.size > maxSize) {
        errors.push(`${file.name} is too large (max ${maxSize / 1024 / 1024}MB)`);
        continue;
      }
      
      if (acceptedTypes[0] !== '*' && !acceptedTypes.some(type => file.type.includes(type))) {
        errors.push(`${file.name} is not an accepted file type`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (errors.length > 0) {
      // Handle validation errors
      return;
    }

    // Upload files
    setIsUploading(true);
    const uploadedFiles = [];
    
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      try {
        const uploadedFile = await uploadFile(file, (progress) => {
          setUploadProgress(((i / validFiles.length) + (progress / validFiles.length)) * 100);
        });
        uploadedFiles.push(uploadedFile);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
    
    setIsUploading(false);
    setUploadProgress(0);
    updateFieldValue(fieldDefinition.name, [...currentFiles, ...uploadedFiles]);
  };

  const uploadFile = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        onProgress(progress);
      }
    });
    
    const result = await response.json();
    return {
      id: result.id,
      name: file.name,
      size: file.size,
      type: file.type,
      url: result.url
    };
  };

  const removeFile = (fileId) => {
    const updatedFiles = currentFiles.filter(file => file.id !== fileId);
    updateFieldValue(fieldDefinition.name, updatedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="form-field">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {fieldDefinition.label}
        {fieldDefinition.validation?.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        {isUploading ? (
          <div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Uploading... {Math.round(uploadProgress)}%</p>
          </div>
        ) : (
          <div>
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600">
              Drop files here or <span className="text-blue-600 font-medium">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Max {maxFiles} files, {maxSize / 1024 / 1024}MB each
            </p>
          </div>
        )}
      </div>
      
      {/* File List */}
      {currentFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {currentFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900">{file.name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      
      {fieldDefinition.instructions && (
        <p className="text-sm text-gray-500 mt-2">{fieldDefinition.instructions}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FileUploadField;
```

### Registering Custom Fields

```jsx
// src/components/form-titan/ExtendedFormEngine.jsx
import React from 'react';
import { FormEngine as BaseFormEngine } from './FormEngine';
import RatingField from '../custom-fields/RatingField';
import FileUploadField from '../custom-fields/FileUploadField';
import ColorPickerField from '../custom-fields/ColorPickerField';
import SignatureField from '../custom-fields/SignatureField';

// Extended field component map
const EXTENDED_FIELD_COMPONENTS = {
  // Default fields
  text: TextField,
  email: TextField,
  tel: TextField,
  textarea: TextAreaField,
  select: SelectField,
  
  // Custom fields
  rating: RatingField,
  file_upload: FileUploadField,
  color_picker: ColorPickerField,
  signature: SignatureField
};

const ExtendedFormEngine = (props) => {
  return <BaseFormEngine {...props} fieldComponents={EXTENDED_FIELD_COMPONENTS} />;
};

export default ExtendedFormEngine;
```

### Using Custom Fields in JSON

```json
{
  "fields": [
    {
      "id": "satisfaction_rating",
      "name": "satisfaction_rating",
      "type": "rating",
      "label": "How satisfied are you with our service?",
      "instructions": "Click on the stars to rate your experience",
      "options": {
        "maxRating": 5
      },
      "validation": {
        "required": true
      }
    },
    {
      "id": "profile_documents",
      "name": "profile_documents", 
      "type": "file_upload",
      "label": "Upload Profile Documents",
      "instructions": "Upload up to 3 documents (PDF, JPG, PNG)",
      "options": {
        "maxFiles": 3,
        "maxSize": 5242880,
        "acceptedTypes": ["application/pdf", "image/jpeg", "image/png"]
      },
      "validation": {
        "required": true
      }
    }
  ]
}
```

## Custom Validation Rules

### Creating Custom Validators

```jsx
// src/utils/customValidators.js
export const customValidators = {
  creditCard: (value) => {
    if (!value) return null;
    
    // Remove spaces and dashes
    const cleanValue = value.replace(/[\s-]/g, '');
    
    // Check if it's all digits
    if (!/^\d+$/.test(cleanValue)) {
      return 'Credit card number must contain only digits';
    }
    
    // Luhn algorithm validation
    if (!isValidLuhn(cleanValue)) {
      return 'Invalid credit card number';
    }
    
    return null;
  },

  phoneNumber: (value, countryCode = 'US') => {
    if (!value) return null;
    
    const phoneRegexes = {
      US: /^(\+1|1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
      UK: /^(\+44|44)?[-.\s]?[0-9]{4}[-.\s]?[0-9]{6}$/,
      // Add more country patterns
    };
    
    const regex = phoneRegexes[countryCode];
    if (regex && !regex.test(value)) {
      return `Invalid ${countryCode} phone number format`;
    }
    
    return null;
  },

  strongPassword: (value) => {
    if (!value) return null;
    
    const requirements = [
      { test: /.{8,}/, message: 'at least 8 characters' },
      { test: /[A-Z]/, message: 'one uppercase letter' },
      { test: /[a-z]/, message: 'one lowercase letter' },
      { test: /\d/, message: 'one number' },
      { test: /[!@#$%^&*(),.?":{}|<>]/, message: 'one special character' }
    ];
    
    const failed = requirements.filter(req => !req.test.test(value));
    
    if (failed.length > 0) {
      return `Password must contain ${failed.map(f => f.message).join(', ')}`;
    }
    
    return null;
  },

  dateRange: (value, options = {}) => {
    if (!value) return null;
    
    const date = new Date(value);
    const { minDate, maxDate } = options;
    
    if (minDate && date < new Date(minDate)) {
      return `Date must be after ${new Date(minDate).toLocaleDateString()}`;
    }
    
    if (maxDate && date > new Date(maxDate)) {
      return `Date must be before ${new Date(maxDate).toLocaleDateString()}`;
    }
    
    return null;
  },

  crossFieldMatch: (value, formState, matchFieldName) => {
    if (!value) return null;
    
    const matchValue = formState[matchFieldName];
    if (value !== matchValue) {
      return 'Values do not match';
    }
    
    return null;
  }
};

const isValidLuhn = (number) => {
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
};
```

### Extended Validation Hook

```jsx
// src/hooks/useExtendedValidation.js
import { useState, useMemo } from 'react';
import { customValidators } from '../utils/customValidators';

export const useExtendedValidation = (formState, fields) => {
  const [formErrors, setFormErrors] = useState({});

  const validateField = (fieldDefinition, value) => {
    const errors = [];
    const validation = fieldDefinition.validation;

    if (!validation) return null;

    // Standard validation rules
    if (validation.required && (!value || value.toString().trim() === '')) {
      errors.push(`${fieldDefinition.label} is required`);
    }

    if (value && value.toString().trim() !== '') {
      // Length validation
      if (validation.minLength && value.toString().length < validation.minLength) {
        errors.push(`${fieldDefinition.label} must be at least ${validation.minLength} characters`);
      }

      if (validation.maxLength && value.toString().length > validation.maxLength) {
        errors.push(`${fieldDefinition.label} must be no more than ${validation.maxLength} characters`);
      }

      // Pattern validation
      if (validation.pattern) {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(value.toString())) {
          errors.push(`${fieldDefinition.label} format is invalid`);
        }
      }

      // Custom validation rules
      if (validation.customRules) {
        validation.customRules.forEach(rule => {
          const validator = customValidators[rule.type];
          if (validator) {
            const error = validator(value, rule.options, formState);
            if (error) errors.push(error);
          }
        });
      }

      // Cross-field validation
      if (validation.crossField) {
        const { type, targetField, message } = validation.crossField;
        const targetValue = formState[targetField];
        
        switch (type) {
          case 'match':
            if (value !== targetValue) {
              errors.push(message || 'Values do not match');
            }
            break;
          case 'different':
            if (value === targetValue) {
              errors.push(message || 'Values must be different');
            }
            break;
        }
      }
    }

    return errors.length > 0 ? errors[0] : null;
  };

  const validateAll = () => {
    const errors = {};
    fields.forEach(field => {
      const error = validateField(field, formState[field.name]);
      if (error) {
        errors[field.name] = error;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateFieldAsync = async (fieldDefinition, value) => {
    // For async validation (e.g., checking email uniqueness)
    if (fieldDefinition.validation?.asyncRules) {
      const asyncRules = fieldDefinition.validation.asyncRules;
      
      for (const rule of asyncRules) {
        if (rule.type === 'unique_email') {
          try {
            const response = await fetch(`/api/validate/email?email=${encodeURIComponent(value)}`);
            const result = await response.json();
            
            if (!result.isUnique) {
              return 'This email is already registered';
            }
          } catch (error) {
            console.error('Async validation failed:', error);
          }
        }
      }
    }
    
    return null;
  };

  return { formErrors, validateAll, validateField, validateFieldAsync };
};
```

### Using Custom Validation in JSON

```json
{
  "fields": [
    {
      "id": "password",
      "name": "password",
      "type": "password",
      "label": "Password",
      "validation": {
        "required": true,
        "customRules": [
          {
            "type": "strongPassword"
          }
        ]
      }
    },
    {
      "id": "confirm_password",
      "name": "confirm_password", 
      "type": "password",
      "label": "Confirm Password",
      "validation": {
        "required": true,
        "crossField": {
          "type": "match",
          "targetField": "password",
          "message": "Passwords do not match"
        }
      }
    },
    {
      "id": "credit_card",
      "name": "credit_card",
      "type": "text",
      "label": "Credit Card Number",
      "validation": {
        "required": true,
        "customRules": [
          {
            "type": "creditCard"
          }
        ]
      }
    },
    {
      "id": "email",
      "name": "email",
      "type": "email", 
      "label": "Email Address",
      "validation": {
        "required": true,
        "pattern": "^[^@]+@[^@]+\\.[^@]+$",
        "asyncRules": [
          {
            "type": "unique_email"
          }
        ]
      }
    }
  ]
}
```

## Custom Layout Components

### Creating Layout Components

```jsx
// src/components/custom-layouts/TabContainer.jsx
import React, { useState } from 'react';

const TabContainer = ({ layoutNode, children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = layoutNode.attributes?.tabs || [];

  return (
    <div className="tab-container">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === index
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.required && <span className="text-red-500 ml-1">*</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {children[activeTab]}
      </div>
    </div>
  );
};

export default TabContainer;
```

```jsx
// src/components/custom-layouts/AccordionContainer.jsx
import React, { useState } from 'react';

const AccordionContainer = ({ layoutNode, children }) => {
  const [openSections, setOpenSections] = useState(new Set([0])); // First section open by default
  const sections = layoutNode.attributes?.sections || [];

  const toggleSection = (index) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(index)) {
      newOpenSections.delete(index);
    } else {
      newOpenSections.add(index);
    }
    setOpenSections(newOpenSections);
  };

  return (
    <div className="accordion-container space-y-2">
      {sections.map((section, index) => (
        <div key={index} className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection(index)}
            className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {section.title}
              </h3>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  openSections.has(index) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {openSections.has(index) && (
            <div className="px-4 py-3 border-t border-gray-200">
              {children[index]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AccordionContainer;
```

### Multi-Column Layout

```jsx
// src/components/custom-layouts/MultiColumnContainer.jsx
import React from 'react';

const MultiColumnContainer = ({ layoutNode, children }) => {
  const { columns = 2, gap = 'gap-6', responsive = true } = layoutNode.attributes || {};
  
  const getGridClasses = () => {
    const baseClasses = `grid grid-cols-1 ${gap}`;
    
    if (!responsive) {
      return `${baseClasses} grid-cols-${columns}`;
    }
    
    // Responsive grid classes
    switch (columns) {
      case 2:
        return `${baseClasses} md:grid-cols-2`;
      case 3:
        return `${baseClasses} md:grid-cols-2 lg:grid-cols-3`;
      case 4:
        return `${baseClasses} md:grid-cols-2 lg:grid-cols-4`;
      default:
        return `${baseClasses} md:grid-cols-${Math.min(columns, 3)}`;
    }
  };

  return (
    <div className={getGridClasses()}>
      {children}
    </div>
  );
};

export default MultiColumnContainer;
```

### Registering Custom Layouts

```jsx
// src/components/form-titan/ExtendedLayoutRenderer.jsx
import React from 'react';
import { LayoutRenderer as BaseLayoutRenderer } from './LayoutRenderer';
import TabContainer from '../custom-layouts/TabContainer';
import AccordionContainer from '../custom-layouts/AccordionContainer';
import MultiColumnContainer from '../custom-layouts/MultiColumnContainer';

const CUSTOM_LAYOUT_COMPONENTS = {
  tabs: TabContainer,
  accordion: AccordionContainer,
  multiColumn: MultiColumnContainer,
  // Add more custom layouts
};

const ExtendedLayoutRenderer = ({ layoutNode }) => {
  const CustomComponent = CUSTOM_LAYOUT_COMPONENTS[layoutNode.customType];
  
  if (CustomComponent) {
    return (
      <CustomComponent layoutNode={layoutNode}>
        {layoutNode.children?.map((child, index) => (
          <ExtendedLayoutRenderer key={child.id || index} layoutNode={child} />
        ))}
      </CustomComponent>
    );
  }
  
  // Fall back to base layout renderer
  return <BaseLayoutRenderer layoutNode={layoutNode} />;
};

export default ExtendedLayoutRenderer;
```

### Using Custom Layouts in JSON

```json
{
  "layoutDefinition": {
    "id": "root",
    "component": "container",
    "customType": "tabs",
    "attributes": {
      "tabs": [
        {"label": "Personal Info", "required": true},
        {"label": "Preferences", "required": false},
        {"label": "Review", "required": false}
      ]
    },
    "children": [
      {
        "id": "personal_tab",
        "component": "container",
        "element": "div",
        "children": [
          {"id": "name_field", "component": "field", "fieldId": "full_name"},
          {"id": "email_field", "component": "field", "fieldId": "email"}
        ]
      },
      {
        "id": "preferences_tab",
        "component": "container", 
        "customType": "multiColumn",
        "attributes": {
          "columns": 2,
          "gap": "gap-4"
        },
        "children": [
          {"id": "theme_field", "component": "field", "fieldId": "theme"},
          {"id": "notifications_field", "component": "field", "fieldId": "notifications"}
        ]
      }
    ]
  }
}
```

## Styling Customization

### CSS Custom Properties Theme System

```css
/* src/styles/form-titan-theme.css */
:root {
  /* Color Palette */
  --ft-primary: #3b82f6;
  --ft-secondary: #64748b;
  --ft-success: #10b981;
  --ft-error: #ef4444;
  --ft-warning: #f59e0b;
  
  /* Background Colors */
  --ft-bg-primary: #ffffff;
  --ft-bg-secondary: #f8fafc;
  --ft-bg-input: #ffffff;
  
  /* Text Colors */
  --ft-text-primary: #1f2937;
  --ft-text-secondary: #6b7280;
  --ft-text-placeholder: #9ca3af;
  
  /* Border Colors */
  --ft-border-primary: #d1d5db;
  --ft-border-focus: var(--ft-primary);
  --ft-border-error: var(--ft-error);
  
  /* Spacing */
  --ft-spacing-xs: 0.25rem;
  --ft-spacing-sm: 0.5rem;
  --ft-spacing-md: 1rem;
  --ft-spacing-lg: 1.5rem;
  --ft-spacing-xl: 2rem;
  
  /* Typography */
  --ft-font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --ft-font-size-sm: 0.875rem;
  --ft-font-size-base: 1rem;
  --ft-font-size-lg: 1.125rem;
  --ft-line-height-tight: 1.25;
  --ft-line-height-normal: 1.5;
  
  /* Border Radius */
  --ft-radius-sm: 0.375rem;
  --ft-radius-md: 0.5rem;
  --ft-radius-lg: 0.75rem;
  
  /* Shadows */
  --ft-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ft-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --ft-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Dark Theme */
[data-theme="dark"] {
  --ft-bg-primary: #1f2937;
  --ft-bg-secondary: #111827;
  --ft-bg-input: #374151;
  --ft-text-primary: #f9fafb;
  --ft-text-secondary: #d1d5db;
  --ft-text-placeholder: #9ca3af;
  --ft-border-primary: #4b5563;
}

/* Form Container Styles */
.form-titan-container {
  font-family: var(--ft-font-family);
  color: var(--ft-text-primary);
  background-color: var(--ft-bg-primary);
}

/* Field Styles */
.form-field {
  margin-bottom: var(--ft-spacing-lg);
}

.form-field label {
  display: block;
  font-size: var(--ft-font-size-sm);
  font-weight: 500;
  color: var(--ft-text-primary);
  margin-bottom: var(--ft-spacing-sm);
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;
  padding: calc(var(--ft-spacing-sm) * 1.5) var(--ft-spacing-md);
  font-size: var(--ft-font-size-base);
  line-height: var(--ft-line-height-normal);
  color: var(--ft-text-primary);
  background-color: var(--ft-bg-input);
  border: 1px solid var(--ft-border-primary);
  border-radius: var(--ft-radius-md);
  box-shadow: var(--ft-shadow-sm);
  transition: all 0.2s ease-in-out;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  outline: none;
  border-color: var(--ft-border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-field input.error,
.form-field textarea.error,
.form-field select.error {
  border-color: var(--ft-border-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-field .error-message {
  font-size: var(--ft-font-size-sm);
  color: var(--ft-error);
  margin-top: var(--ft-spacing-xs);
}

.form-field .help-text {
  font-size: var(--ft-font-size-sm);
  color: var(--ft-text-secondary);
  margin-top: var(--ft-spacing-xs);
}

/* Button Styles */
.ft-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: calc(var(--ft-spacing-sm) * 1.5) var(--ft-spacing-lg);
  font-size: var(--ft-font-size-base);
  font-weight: 500;
  line-height: var(--ft-line-height-tight);
  border-radius: var(--ft-radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
}

.ft-button-primary {
  color: white;
  background-color: var(--ft-primary);
  border-color: var(--ft-primary);
}

.ft-button-primary:hover {
  background-color: color-mix(in srgb, var(--ft-primary) 90%, black);
  border-color: color-mix(in srgb, var(--ft-primary) 90%, black);
}

.ft-button-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### Component-Specific Styling

```jsx
// src/components/form-titan/StyledFormEngine.jsx
import React from 'react';
import { FormEngine } from './FormEngine';
import './form-titan-theme.css';

const StyledFormEngine = ({ 
  theme = 'light', 
  customStyles = {},
  className = '',
  ...props 
}) => {
  const containerClasses = [
    'form-titan-container',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      data-theme={theme}
      className={containerClasses}
      style={customStyles}
    >
      <FormEngine {...props} />
    </div>
  );
};

export default StyledFormEngine;
```

## Event Hooks

### Custom Event System

```jsx
// src/hooks/useFormEvents.js
import { useCallback, useRef } from 'react';

export const useFormEvents = () => {
  const eventListeners = useRef({});

  const addEventListener = useCallback((eventType, callback) => {
    if (!eventListeners.current[eventType]) {
      eventListeners.current[eventType] = [];
    }
    eventListeners.current[eventType].push(callback);
    
    // Return unsubscribe function
    return () => {
      eventListeners.current[eventType] = eventListeners.current[eventType]?.filter(
        cb => cb !== callback
      );
    };
  }, []);

  const removeEventListener = useCallback((eventType, callback) => {
    if (eventListeners.current[eventType]) {
      eventListeners.current[eventType] = eventListeners.current[eventType].filter(
        cb => cb !== callback
      );
    }
  }, []);

  const dispatchEvent = useCallback((eventType, data) => {
    const listeners = eventListeners.current[eventType] || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${eventType}:`, error);
      }
    });
  }, []);

  return { addEventListener, removeEventListener, dispatchEvent };
};
```

### Event-Driven FormEngine

```jsx
// src/components/form-titan/EventDrivenFormEngine.jsx
import React, { useEffect } from 'react';
import { FormEngine } from './FormEngine';
import { useFormEvents } from '../../hooks/useFormEvents';

const EventDrivenFormEngine = ({ 
  onFieldChange,
  onFieldFocus,
  onFieldBlur,
  onFormSubmit,
  onValidationError,
  ...props 
}) => {
  const { addEventListener, dispatchEvent } = useFormEvents();

  useEffect(() => {
    // Set up event listeners
    const unsubscribers = [];

    if (onFieldChange) {
      unsubscribers.push(addEventListener('field:change', onFieldChange));
    }

    if (onFieldFocus) {
      unsubscribers.push(addEventListener('field:focus', onFieldFocus));
    }

    if (onFieldBlur) {
      unsubscribers.push(addEventListener('field:blur', onFieldBlur));
    }

    if (onFormSubmit) {
      unsubscribers.push(addEventListener('form:submit', onFormSubmit));
    }

    if (onValidationError) {
      unsubscribers.push(addEventListener('validation:error', onValidationError));
    }

    // Cleanup
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [addEventListener, onFieldChange, onFieldFocus, onFieldBlur, onFormSubmit, onValidationError]);

  const handleFieldChange = (fieldName, value, formState) => {
    dispatchEvent('field:change', { fieldName, value, formState });
  };

  const handleFieldFocus = (fieldName) => {
    dispatchEvent('field:focus', { fieldName });
  };

  const handleFieldBlur = (fieldName, value) => {
    dispatchEvent('field:blur', { fieldName, value });
  };

  const handleFormSubmit = (formData, formId) => {
    dispatchEvent('form:submit', { formData, formId });
  };

  const handleValidationError = (errors, formId) => {
    dispatchEvent('validation:error', { errors, formId });
  };

  return (
    <FormEngine
      {...props}
      onFieldChange={handleFieldChange}
      onFieldFocus={handleFieldFocus}
      onFieldBlur={handleFieldBlur}
      onFormSubmit={handleFormSubmit}
      onValidationError={handleValidationError}
    />
  );
};

export default EventDrivenFormEngine;
```

## Conditional Logic

### Advanced Visibility Rules

```jsx
// src/utils/visibilityEngine.js
export class VisibilityEngine {
  static evaluateRule(rule, formState) {
    const { field, operator, value, conditions } = rule;
    const fieldValue = formState[field];

    // Handle complex conditions
    if (conditions && conditions.length > 0) {
      return this.evaluateConditions(conditions, formState, rule.logic || 'AND');
    }

    // Simple field-based rules
    switch (operator) {
      case 'equals':
        return fieldValue === value;
      
      case 'not_equals':
        return fieldValue !== value;
      
      case 'contains':
        return fieldValue && fieldValue.toString().includes(value);
      
      case 'not_contains':
        return !fieldValue || !fieldValue.toString().includes(value);
      
      case 'greater_than':
        return Number(fieldValue) > Number(value);
      
      case 'less_than':
        return Number(fieldValue) < Number(value);
      
      case 'greater_than_or_equal':
        return Number(fieldValue) >= Number(value);
      
      case 'less_than_or_equal':
        return Number(fieldValue) <= Number(value);
      
      case 'is_empty':
        return !fieldValue || fieldValue.toString().trim() === '';
      
      case 'is_not_empty':
        return fieldValue && fieldValue.toString().trim() !== '';
      
      case 'in_array':
        return Array.isArray(value) && value.includes(fieldValue);
      
      case 'not_in_array':
        return !Array.isArray(value) || !value.includes(fieldValue);
      
      case 'regex_match':
        return new RegExp(value).test(fieldValue?.toString() || '');
      
      default:
        console.warn(`Unknown visibility operator: ${operator}`);
        return true;
    }
  }

  static evaluateConditions(conditions, formState, logic = 'AND') {
    const results = conditions.map(condition => 
      this.evaluateRule(condition, formState)
    );

    switch (logic.toUpperCase()) {
      case 'AND':
        return results.every(result => result);
      case 'OR':
        return results.some(result => result);
      case 'NOT':
        return !results[0]; // NOT logic for single condition
      default:
        return results.every(result => result); // Default to AND
    }
  }

  static calculateFieldVisibility(fields, formState) {
    const visibility = {};

    fields.forEach(field => {
      visibility[field.id] = true; // Default to visible

      if (field.visibility && field.visibility.length > 0) {
        // Multiple visibility rules with logic
        if (field.visibilityLogic) {
          visibility[field.id] = this.evaluateConditions(
            field.visibility,
            formState,
            field.visibilityLogic
          );
        } else {
          // Default AND logic for multiple rules
          visibility[field.id] = field.visibility.every(rule =>
            this.evaluateRule(rule, formState)
          );
        }
      }
    });

    return visibility;
  }
}
```

### Complex Visibility JSON Examples

```json
{
  "fields": [
    {
      "id": "employment_status",
      "name": "employment_status",
      "type": "select",
      "label": "Employment Status",
      "options": [
        {"label": "Employed", "value": "employed"},
        {"label": "Self-employed", "value": "self_employed"},
        {"label": "Unemployed", "value": "unemployed"},
        {"label": "Student", "value": "student"}
      ]
    },
    {
      "id": "company_name",
      "name": "company_name",
      "type": "text",
      "label": "Company Name",
      "visibility": [
        {
          "field": "employment_status",
          "operator": "in_array",
          "value": ["employed", "self_employed"]
        }
      ]
    },
    {
      "id": "annual_income",
      "name": "annual_income",
      "type": "number",
      "label": "Annual Income",
      "visibility": [
        {
          "field": "employment_status",
          "operator": "not_equals",
          "value": "unemployed"
        }
      ]
    },
    {
      "id": "income_verification",
      "name": "income_verification",
      "type": "file_upload",
      "label": "Income Verification Documents",
      "visibility": [
        {
          "conditions": [
            {
              "field": "employment_status",
              "operator": "equals",
              "value": "employed"
            },
            {
              "field": "annual_income",
              "operator": "greater_than",
              "value": "100000"
            }
          ],
          "logic": "AND"
        }
      ]
    },
    {
      "id": "special_circumstances",
      "name": "special_circumstances",
      "type": "textarea",
      "label": "Special Circumstances",
      "visibility": [
        {
          "conditions": [
            {
              "field": "employment_status",
              "operator": "equals",
              "value": "unemployed"
            },
            {
              "field": "employment_status",
              "operator": "equals",
              "value": "student"
            }
          ],
          "logic": "OR"
        }
      ]
    }
  ]
}
```

## Internationalization

### i18n Hook

```jsx
// src/hooks/useFormI18n.js
import { useState, useEffect, createContext, useContext } from 'react';

const I18nContext = createContext();

export const FormI18nProvider = ({ locale = 'en', translations = {}, children }) => {
  const [currentLocale, setCurrentLocale] = useState(locale);
  const [currentTranslations, setCurrentTranslations] = useState(translations);

  const t = (key, params = {}) => {
    const translation = currentTranslations[currentLocale]?.[key] || key;
    
    // Simple parameter replacement
    return Object.keys(params).reduce((result, param) => {
      return result.replace(`{{${param}}}`, params[param]);
    }, translation);
  };

  const changeLocale = async (newLocale) => {
    setCurrentLocale(newLocale);
    
    // Load translations if not already loaded
    if (!currentTranslations[newLocale]) {
      try {
        const response = await fetch(`/locales/${newLocale}.json`);
        const translations = await response.json();
        setCurrentTranslations(prev => ({
          ...prev,
          [newLocale]: translations
        }));
      } catch (error) {
        console.error(`Failed to load translations for ${newLocale}:`, error);
      }
    }
  };

  const value = {
    locale: currentLocale,
    t,
    changeLocale,
    availableLocales: Object.keys(currentTranslations)
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useFormI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useFormI18n must be used within FormI18nProvider');
  }
  return context;
};
```

### Internationalized Field Component

```jsx
// src/components/form-titan/I18nTextField.jsx
import React, { useContext, useEffect } from 'react';
import { FormContext } from './FormEngine';
import { useFormI18n } from '../../hooks/useFormI18n';

const I18nTextField = ({ fieldDefinition }) => {
  const { formState, formErrors, updateFieldValue, registerField } = useContext(FormContext);
  const { t, locale } = useFormI18n();
  
  useEffect(() => {
    registerField(fieldDefinition);
  }, [fieldDefinition, registerField]);

  const value = formState[fieldDefinition.name] || '';
  const error = formErrors[fieldDefinition.name];

  // Get localized text
  const label = fieldDefinition.label[locale] || fieldDefinition.label.en || fieldDefinition.label;
  const placeholder = fieldDefinition.placeholder?.[locale] || fieldDefinition.placeholder?.en || fieldDefinition.placeholder;
  const instructions = fieldDefinition.instructions?.[locale] || fieldDefinition.instructions?.en || fieldDefinition.instructions;

  return (
    <div className="form-field">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {fieldDefinition.validation?.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => updateFieldValue(fieldDefinition.name, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        dir={locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr'}
      />
      {instructions && (
        <p className="text-sm text-gray-500 mt-1">{instructions}</p>
      )}
      {error && (
        <p className="text-sm text-red-500 mt-1">{t(error)}</p>
      )}
    </div>
  );
};

export default I18nTextField;
```

### Multilingual Form JSON

```json
{
  "formId": "contact-us-i18n",
  "name": {
    "en": "Contact Us Form",
    "es": "Formulario de Contacto",
    "fr": "Formulaire de Contact",
    "de": "Kontaktformular"
  },
  "fields": [
    {
      "id": "full_name",
      "name": "full_name",
      "type": "text",
      "label": {
        "en": "Full Name",
        "es": "Nombre Completo",
        "fr": "Nom Complet",
        "de": "Vollständiger Name"
      },
      "placeholder": {
        "en": "Enter your full name",
        "es": "Ingrese su nombre completo",
        "fr": "Entrez votre nom complet",
        "de": "Geben Sie Ihren vollständigen Namen ein"
      },
      "validation": {
        "required": true,
        "messages": {
          "required": {
            "en": "Full name is required",
            "es": "El nombre completo es obligatorio",
            "fr": "Le nom complet est requis",
            "de": "Vollständiger Name ist erforderlich"
          }
        }
      }
    }
  ]
}
```

This customization guide provides a comprehensive foundation for extending Form-Titan to meet any specific requirements. Each section includes practical examples and can be combined to create powerful, flexible form solutions.