# 🔌 Form-Titan Integration Guide

This guide walks you through integrating Form-Titan into your existing React application, from basic setup to advanced customization.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Methods](#installation-methods)
- [Basic Integration](#basic-integration)
- [Advanced Integration](#advanced-integration)
- [API Integration](#api-integration)
- [Custom Styling](#custom-styling)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)
- [TypeScript Support](#typescript-support)

## Prerequisites

Before integrating Form-Titan, ensure your project meets these requirements:

- **React**: Version 18.0+ (React 19+ recommended)
- **Node.js**: Version 16.0+
- **CSS Framework**: Tailwind CSS (recommended) or custom CSS
- **Build Tool**: Vite, Create React App, or Next.js

## Installation Methods

### Method 1: Copy Components (Recommended for Customization)

1. **Copy the FormEngine components** to your project:
```bash
# Create form-titan directory in your components folder
mkdir src/components/form-titan

# Copy the core files
cp /path/to/form-titan/frontend/src/FormEngine.js src/components/form-titan/
cp /path/to/form-titan/frontend/src/FormEngine.css src/components/form-titan/
```

2. **Install required dependencies**:
```bash
npm install axios @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities date-fns uuid
# or
yarn add axios @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities date-fns uuid
```

### Method 2: NPM Package (Future Release)

```bash
npm install form-titan-react
# or
yarn add form-titan-react
```

### Method 3: Git Submodule

```bash
git submodule add https://github.com/your-username/form-titan.git src/vendor/form-titan
```

## Basic Integration

### 1. Simple Form Integration

```jsx
// src/components/ContactForm.jsx
import React from 'react';
import { FormEngine } from './form-titan/FormEngine';

function ContactForm() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <FormEngine formId="contact-us-v1" />
    </div>
  );
}

export default ContactForm;
```

### 2. Form with Custom Container

```jsx
// src/pages/ContactPage.jsx
import React from 'react';
import { FormEngine } from '../components/form-titan/FormEngine';

function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h1>
            <p className="text-lg text-gray-600">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          
          <FormEngine 
            formId="contact-us-v1"
            className="bg-white shadow-xl rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
```

### 3. Multiple Forms on One Page

```jsx
// src/pages/FormsPage.jsx
import React, { useState } from 'react';
import { FormEngine } from '../components/form-titan/FormEngine';

function FormsPage() {
  const [activeForm, setActiveForm] = useState('contact');

  const forms = {
    contact: 'contact-us-v1',
    newsletter: 'newsletter-signup-v1', 
    feedback: 'feedback-form-v1'
  };

  return (
    <div className="container mx-auto py-8">
      {/* Form Selector */}
      <div className="flex space-x-4 mb-8">
        {Object.keys(forms).map(formKey => (
          <button
            key={formKey}
            onClick={() => setActiveForm(formKey)}
            className={`px-4 py-2 rounded-md ${
              activeForm === formKey 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {formKey.charAt(0).toUpperCase() + formKey.slice(1)}
          </button>
        ))}
      </div>

      {/* Active Form */}
      <FormEngine formId={forms[activeForm]} />
    </div>
  );
}
```

## Advanced Integration

### 1. Custom Event Handlers

```jsx
// src/components/AdvancedForm.jsx
import React, { useState } from 'react';
import { FormEngine } from './form-titan/FormEngine';

function AdvancedForm() {
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data, formId) => {
    setIsSubmitting(true);
    
    try {
      // Custom submission logic
      const response = await fetch('/api/custom/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId, data })
      });
      
      if (response.ok) {
        const result = await response.json();
        setFormData(result);
        
        // Custom success handling
        showNotification('Form submitted successfully!', 'success');
        
        // Analytics tracking
        trackEvent('form_submission', { formId, success: true });
      }
    } catch (error) {
      console.error('Submission error:', error);
      showNotification('Submission failed. Please try again.', 'error');
      trackEvent('form_submission', { formId, success: false, error: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (fieldName, value, formState) => {
    // Custom field change handling
    console.log(`Field ${fieldName} changed to:`, value);
    
    // Real-time validation or processing
    if (fieldName === 'email') {
      validateEmailAsync(value);
    }
  };

  const handleValidationError = (errors, formId) => {
    // Custom validation error handling
    console.log('Validation errors:', errors);
    
    // Focus on first error field
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      document.querySelector(`[name="${firstErrorField}"]`)?.focus();
    }
  };

  return (
    <FormEngine
      formId="advanced-form-v1"
      onSubmit={handleFormSubmit}
      onFieldChange={handleFieldChange}
      onValidationError={handleValidationError}
      customProps={{
        isSubmitting,
        customData: formData
      }}
    />
  );
}
```

### 2. Form State Management Integration

```jsx
// Integration with Redux/Zustand
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormEngine } from './form-titan/FormEngine';

function ReduxIntegratedForm() {
  const dispatch = useDispatch();
  const formState = useSelector(state => state.forms.contactForm);

  const handleFormSubmit = (data) => {
    dispatch({ type: 'SUBMIT_FORM', payload: data });
  };

  const handleFieldChange = (fieldName, value) => {
    dispatch({ 
      type: 'UPDATE_FORM_FIELD', 
      payload: { fieldName, value } 
    });
  };

  return (
    <FormEngine
      formId="contact-us-v1"
      onSubmit={handleFormSubmit}
      onFieldChange={handleFieldChange}
      initialFormState={formState}
    />
  );
}
```

### 3. Multi-Step Form Integration

```jsx
// src/components/MultiStepForm.jsx
import React, { useState } from 'react';
import { FormEngine } from './form-titan/FormEngine';

function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState({});

  const steps = [
    { id: 1, formId: 'step-1-personal-info', title: 'Personal Information' },
    { id: 2, formId: 'step-2-preferences', title: 'Preferences' },
    { id: 3, formId: 'step-3-confirmation', title: 'Confirmation' }
  ];

  const handleStepSubmit = (data, formId) => {
    // Save step data
    setStepData(prev => ({ ...prev, [formId]: data }));
    
    // Move to next step or submit final form
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitCompleteForm(stepData);
    }
  };

  const submitCompleteForm = async (completeData) => {
    try {
      await fetch('/api/multi-step-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeData)
      });
    } catch (error) {
      console.error('Final submission error:', error);
    }
  };

  const currentStepConfig = steps[currentStep - 1];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep >= step.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {step.id}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className="w-12 h-px bg-gray-300 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Form */}
      <FormEngine
        formId={currentStepConfig.formId}
        onSubmit={handleStepSubmit}
        initialFormState={stepData[currentStepConfig.formId]}
      />

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        
        <span className="text-sm text-gray-500">
          Step {currentStep} of {steps.length}
        </span>
      </div>
    </div>
  );
}
```

## API Integration

### 1. Custom API Configuration

```jsx
// src/config/formTitanConfig.js
export const FORM_TITAN_CONFIG = {
  apiBaseUrl: process.env.REACT_APP_FORM_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  retryAttempts: 3,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
};

// Custom API client
import axios from 'axios';

export const formTitanAPI = axios.create({
  baseURL: FORM_TITAN_CONFIG.apiBaseUrl,
  timeout: FORM_TITAN_CONFIG.timeout,
  headers: FORM_TITAN_CONFIG.headers
});

// Request/response interceptors
formTitanAPI.interceptors.request.use(
  (config) => {
    // Add auth token, request ID, etc.
    config.headers['X-Request-ID'] = generateRequestId();
    return config;
  },
  (error) => Promise.reject(error)
);

formTitanAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle auth errors, retry logic, etc.
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);
```

### 2. Backend API Setup

```python
# backend/custom_endpoints.py
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
import logging

router = APIRouter(prefix="/api/v2")

@router.get("/forms/{form_id}")
async def get_form_definition(
    form_id: str,
    user: User = Depends(get_current_user)
):
    """Get form definition with user-specific customizations"""
    try:
        # Get base form definition
        form_def = await get_base_form_definition(form_id)
        
        # Apply user-specific customizations
        if user.preferences:
            form_def = apply_user_preferences(form_def, user.preferences)
            
        # Apply A/B testing variations
        form_def = apply_ab_testing(form_def, user.ab_test_group)
        
        return form_def
        
    except Exception as e:
        logging.error(f"Error loading form {form_id}: {e}")
        raise HTTPException(status_code=500, detail="Form loading failed")

@router.post("/forms/{form_id}/submissions")
async def submit_form(
    form_id: str,
    submission: Dict[str, Any],
    user: User = Depends(get_current_user)
):
    """Handle form submission with custom processing"""
    try:
        # Validate submission
        validation_result = await validate_submission(form_id, submission)
        if not validation_result.is_valid:
            raise HTTPException(status_code=400, detail=validation_result.errors)
        
        # Process submission
        result = await process_form_submission(form_id, submission, user)
        
        # Trigger workflows (email, webhooks, etc.)
        await trigger_post_submission_workflows(form_id, result)
        
        return {
            "submissionId": result.id,
            "status": "success",
            "message": "Thank you for your submission!"
        }
        
    except Exception as e:
        logging.error(f"Submission error for form {form_id}: {e}")
        raise HTTPException(status_code=500, detail="Submission failed")
```

### 3. Real-time Updates with WebSockets

```jsx
// src/hooks/useFormWebSocket.js
import { useEffect, useState } from 'react';

export const useFormWebSocket = (formId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/forms/${formId}`);
    
    ws.onopen = () => {
      setIsConnected(true);
      setSocket(ws);
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleRealtimeUpdate(message);
    };
    
    ws.onclose = () => {
      setIsConnected(false);
      setSocket(null);
    };
    
    return () => ws.close();
  }, [formId]);

  const sendMessage = (message) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  };

  return { socket, isConnected, sendMessage };
};

// Usage in FormEngine
function CollaborativeForm({ formId }) {
  const { sendMessage, isConnected } = useFormWebSocket(formId);
  
  const handleFieldChange = (fieldName, value) => {
    // Send real-time updates to other users
    sendMessage({
      type: 'field_change',
      fieldName,
      value,
      timestamp: Date.now()
    });
  };

  return (
    <div>
      {isConnected && (
        <div className="bg-green-100 p-2 mb-4 rounded">
          🟢 Connected - Real-time collaboration enabled
        </div>
      )}
      
      <FormEngine
        formId={formId}
        onFieldChange={handleFieldChange}
      />
    </div>
  );
}
```

## Custom Styling

### 1. Tailwind CSS Integration

```jsx
// src/components/CustomFormEngine.jsx
import React from 'react';
import { FormEngine } from './form-titan/FormEngine';

function CustomStyledForm() {
  const customFormDefinition = {
    // Override default styling in JSON
    layoutDefinition: {
      id: "root",
      component: "container",
      element: "div",
      attributes: {
        className: "max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-2xl"
      },
      children: [
        {
          id: "header",
          component: "container", 
          element: "div",
          attributes: {
            className: "text-center mb-12"
          },
          children: [
            // Custom styled header elements
          ]
        }
      ]
    }
  };

  return (
    <FormEngine
      formId="custom-styled-form"
      customDefinition={customFormDefinition}
      className="custom-form-wrapper"
    />
  );
}
```

### 2. CSS-in-JS Styling

```jsx
// src/components/StyledFormEngine.jsx
import React from 'react';
import styled from 'styled-components';
import { FormEngine } from './form-titan/FormEngine';

const StyledFormWrapper = styled.div`
  .form-titan-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .form-field {
    margin-bottom: 1.5rem;
    
    label {
      color: #2d3748;
      font-weight: 600;
      margin-bottom: 0.5rem;
      display: block;
    }
    
    input, textarea, select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      transition: all 0.3s ease;
      
      &:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        outline: none;
      }
      
      &.error {
        border-color: #f56565;
        box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
      }
    }
  }

  .submit-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 14px 28px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

function StyledFormEngine(props) {
  return (
    <StyledFormWrapper>
      <FormEngine {...props} />
    </StyledFormWrapper>
  );
}
```

### 3. Theme Provider Integration

```jsx
// src/context/ThemeContext.jsx
import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const FormThemeProvider = ({ theme, children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      <div className={`form-theme-${theme.name}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useFormTheme = () => useContext(ThemeContext);

// Usage
const lightTheme = {
  name: 'light',
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#ffffff',
    text: '#1f2937'
  },
  spacing: {
    fieldGap: '1rem',
    containerPadding: '1.5rem'
  }
};

function ThemedApp() {
  return (
    <FormThemeProvider theme={lightTheme}>
      <FormEngine formId="themed-form-v1" />
    </FormThemeProvider>
  );
}
```

## Error Handling

### 1. Global Error Boundary

```jsx
// src/components/FormErrorBoundary.jsx
import React from 'react';

class FormErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Form-Titan Error:', error, errorInfo);
    
    // Send error to monitoring service
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Form Loading Error
          </h3>
          <p className="text-red-600 mb-4">
            We encountered an error while loading this form. Please try refreshing the page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <FormErrorBoundary>
      <FormEngine formId="contact-us-v1" />
    </FormErrorBoundary>
  );
}
```

### 2. API Error Handling

```jsx
// src/utils/apiErrorHandler.js
export const handleFormApiError = (error, formId) => {
  const errorInfo = {
    formId,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return {
          type: 'validation',
          message: 'Please check your input and try again.',
          details: data.detail || data.errors
        };
      case 404:
        return {
          type: 'not_found',
          message: 'This form is no longer available.',
          action: 'redirect_home'
        };
      case 429:
        return {
          type: 'rate_limit',
          message: 'Too many requests. Please wait a moment and try again.',
          retryAfter: data.retry_after
        };
      case 500:
        logError('server_error', { ...errorInfo, error: data });
        return {
          type: 'server_error',
          message: 'Server error. Our team has been notified.',
          supportId: data.support_id
        };
      default:
        logError('unknown_api_error', { ...errorInfo, status, data });
        return {
          type: 'unknown',
          message: 'An unexpected error occurred. Please try again.'
        };
    }
  } else if (error.request) {
    // Network error
    logError('network_error', { ...errorInfo, error: error.message });
    return {
      type: 'network',
      message: 'Unable to connect. Please check your internet connection.',
      action: 'retry'
    };
  } else {
    // Client-side error
    logError('client_error', { ...errorInfo, error: error.message });
    return {
      type: 'client',
      message: 'An error occurred while processing your request.',
      details: error.message
    };
  }
};

const logError = (type, details) => {
  console.error(`Form-Titan ${type}:`, details);
  
  // Send to monitoring service
  if (window.analytics) {
    window.analytics.track('form_error', { type, ...details });
  }
};
```

## Performance Optimization

### 1. Code Splitting

```jsx
// src/components/LazyFormEngine.jsx
import React, { Suspense, lazy } from 'react';

const FormEngine = lazy(() => import('./form-titan/FormEngine'));

function LazyFormEngine(props) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading form...</span>
      </div>
    }>
      <FormEngine {...props} />
    </Suspense>
  );
}

export default LazyFormEngine;
```

### 2. Form Preloading

```jsx
// src/hooks/useFormPreloader.js
import { useEffect } from 'react';
import { formTitanAPI } from '../config/formTitanConfig';

export const useFormPreloader = (formIds) => {
  useEffect(() => {
    const preloadForms = async () => {
      try {
        // Preload form definitions
        const promises = formIds.map(formId => 
          formTitanAPI.get(`/forms/${formId}`)
        );
        
        const responses = await Promise.all(promises);
        
        // Cache in sessionStorage for quick access
        responses.forEach((response, index) => {
          sessionStorage.setItem(
            `form_${formIds[index]}`, 
            JSON.stringify(response.data)
          );
        });
      } catch (error) {
        console.warn('Form preloading failed:', error);
      }
    };

    if (formIds.length > 0) {
      preloadForms();
    }
  }, [formIds]);
};

// Usage in app root
function App() {
  useFormPreloader(['contact-us-v1', 'newsletter-v1', 'feedback-v1']);
  
  return (
    <Router>
      {/* Your app routes */}
    </Router>
  );
}
```

### 3. Memoization and Optimization

```jsx
// src/components/OptimizedFormEngine.jsx
import React, { memo, useMemo, useCallback } from 'react';
import { FormEngine } from './form-titan/FormEngine';

const OptimizedFormEngine = memo(({ formId, onSubmit, ...props }) => {
  const memoizedSubmitHandler = useCallback(
    (data) => {
      // Expensive operations here
      return onSubmit?.(data);
    },
    [onSubmit]
  );

  const formConfig = useMemo(() => ({
    cacheTimeout: 300000, // 5 minutes
    debounceDelay: 300,
    validateOnChange: false,
    validateOnBlur: true
  }), []);

  return (
    <FormEngine
      formId={formId}
      onSubmit={memoizedSubmitHandler}
      config={formConfig}
      {...props}
    />
  );
});

OptimizedFormEngine.displayName = 'OptimizedFormEngine';
export default OptimizedFormEngine;
```

## TypeScript Support

### 1. Type Definitions

```typescript
// src/types/formTitan.ts
export interface FieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number';
  label: string;
  placeholder?: string;
  instructions?: string;
  defaultValue?: string | number | boolean;
  options?: Array<{ label: string; value: string; }>;
  validation?: ValidationRules;
  visibility?: VisibilityRule[];
}

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface VisibilityRule {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number;
}

export interface LayoutNode {
  id: string;
  component: 'container' | 'field';
  element?: string;
  attributes?: Record<string, any>;
  children?: LayoutNode[];
  fieldId?: string;
}

export interface FormDefinition {
  formId: string;
  name: string;
  config: {
    mode: 'input' | 'edit';
  };
  fields: FieldDefinition[];
  layoutDefinition: LayoutNode;
}

export interface FormEngineProps {
  formId: string;
  initialMode?: 'input' | 'edit';
  onSubmit?: (data: Record<string, any>, formId: string) => void | Promise<void>;
  onFieldChange?: (fieldName: string, value: any, formState: Record<string, any>) => void;
  onValidationError?: (errors: Record<string, string>, formId: string) => void;
  className?: string;
  customDefinition?: Partial<FormDefinition>;
}
```

### 2. Typed FormEngine Component

```typescript
// src/components/form-titan/FormEngine.tsx
import React, { useState, useEffect } from 'react';
import { FormDefinition, FormEngineProps } from '../../types/formTitan';

const FormEngine: React.FC<FormEngineProps> = ({
  formId,
  initialMode = 'input',
  onSubmit,
  onFieldChange,
  onValidationError,
  className,
  customDefinition
}) => {
  const [formDefinition, setFormDefinition] = useState<FormDefinition | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Type-safe form state management
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Rest of component implementation...
  
  return (
    <div className={`form-titan-container ${className || ''}`}>
      {/* Component JSX */}
    </div>
  );
};

export default FormEngine;
```

### 3. Custom Hooks with TypeScript

```typescript
// src/hooks/useFormState.ts
import { useState, useCallback } from 'react';
import { FieldDefinition } from '../types/formTitan';

interface UseFormStateReturn {
  formState: Record<string, any>;
  updateFieldValue: (fieldName: string, value: any) => void;
  registerField: (fieldDefinition: FieldDefinition) => void;
  resetForm: () => void;
}

export const useFormState = (fields: FieldDefinition[]): UseFormStateReturn => {
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [registeredFields, setRegisteredFields] = useState<Set<string>>(new Set());

  const updateFieldValue = useCallback((fieldName: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  const registerField = useCallback((fieldDefinition: FieldDefinition) => {
    if (!registeredFields.has(fieldDefinition.id)) {
      setRegisteredFields(prev => new Set([...prev, fieldDefinition.id]));
      
      if (fieldDefinition.defaultValue !== undefined) {
        updateFieldValue(fieldDefinition.name, fieldDefinition.defaultValue);
      }
    }
  }, [registeredFields, updateFieldValue]);

  const resetForm = useCallback(() => {
    setFormState({});
    setRegisteredFields(new Set());
  }, []);

  return {
    formState,
    updateFieldValue,
    registerField,
    resetForm
  };
};
```

This comprehensive integration guide provides everything needed to successfully integrate Form-Titan into any React application, from basic setup to advanced customization and optimization.