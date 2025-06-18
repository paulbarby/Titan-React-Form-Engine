import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import './App.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Form Context
const FormContext = createContext();

// Custom hooks
const useFormState = (fields) => {
  const [formState, setFormState] = useState({});
  const [registeredFields, setRegisteredFields] = useState(new Set());

  const updateFieldValue = (fieldName, value) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const registerField = (fieldDefinition) => {
    if (!registeredFields.has(fieldDefinition.id)) {
      setRegisteredFields(prev => new Set([...prev, fieldDefinition.id]));
      if (fieldDefinition.defaultValue !== undefined && formState[fieldDefinition.name] === undefined) {
        setFormState(prev => ({
          ...prev,
          [fieldDefinition.name]: fieldDefinition.defaultValue
        }));
      }
    }
  };

  return { formState, updateFieldValue, registerField };
};

const useValidation = (formState, fields) => {
  const [formErrors, setFormErrors] = useState({});

  const validateField = (fieldDefinition, value) => {
    const errors = [];
    const validation = fieldDefinition.validation;

    if (!validation) return null;

    if (validation.required && (!value || value.toString().trim() === '')) {
      errors.push(`${fieldDefinition.label} is required`);
    }

    if (value && validation.minLength && value.toString().length < validation.minLength) {
      errors.push(`${fieldDefinition.label} must be at least ${validation.minLength} characters`);
    }

    if (value && validation.maxLength && value.toString().length > validation.maxLength) {
      errors.push(`${fieldDefinition.label} must be no more than ${validation.maxLength} characters`);
    }

    if (value && validation.pattern) {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value.toString())) {
        errors.push(`${fieldDefinition.label} format is invalid`);
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

  const validateSingleField = (fieldName) => {
    const field = fields.find(f => f.name === fieldName);
    if (field) {
      const error = validateField(field, formState[fieldName]);
      setFormErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  };

  return { formErrors, validateAll, validateField: validateSingleField };
};

const useRules = (formState, fields) => {
  const fieldVisibility = useMemo(() => {
    const visibility = {};
    
    fields.forEach(field => {
      visibility[field.id] = true; // Default to visible
      
      if (field.visibility && field.visibility.length > 0) {
        // Check each visibility rule
        const isVisible = field.visibility.every(rule => {
          const fieldValue = formState[rule.field];
          
          switch (rule.operator) {
            case 'equals':
              return fieldValue === rule.value;
            case 'not_equals':
              return fieldValue !== rule.value;
            case 'contains':
              return fieldValue && fieldValue.toString().includes(rule.value);
            default:
              return true;
          }
        });
        
        visibility[field.id] = isVisible;
      }
    });
    
    return visibility;
  }, [formState, fields]);

  return { fieldVisibility };
};

// Field Components
const TextField = ({ fieldDefinition }) => {
  const { formState, formErrors, updateFieldValue, registerField } = useContext(FormContext);
  
  useEffect(() => {
    registerField(fieldDefinition);
  }, [fieldDefinition, registerField]);

  const value = formState[fieldDefinition.name] || '';
  const error = formErrors[fieldDefinition.name];

  return (
    <div className="form-field">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {fieldDefinition.label}
        {fieldDefinition.validation?.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={fieldDefinition.type === 'email' ? 'email' : fieldDefinition.type === 'tel' ? 'tel' : 'text'}
        value={value}
        onChange={(e) => updateFieldValue(fieldDefinition.name, e.target.value)}
        placeholder={fieldDefinition.placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'error-border border-red-500' : 'border-gray-300'
        }`}
      />
      {fieldDefinition.instructions && (
        <p className="text-sm text-gray-500 mt-1">{fieldDefinition.instructions}</p>
      )}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

const TextAreaField = ({ fieldDefinition }) => {
  const { formState, formErrors, updateFieldValue, registerField } = useContext(FormContext);
  
  useEffect(() => {
    registerField(fieldDefinition);
  }, [fieldDefinition, registerField]);

  const value = formState[fieldDefinition.name] || '';
  const error = formErrors[fieldDefinition.name];

  return (
    <div className="form-field">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {fieldDefinition.label}
        {fieldDefinition.validation?.required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => updateFieldValue(fieldDefinition.name, e.target.value)}
        placeholder={fieldDefinition.placeholder}
        rows={4}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'error-border border-red-500' : 'border-gray-300'
        }`}
      />
      {fieldDefinition.instructions && (
        <p className="text-sm text-gray-500 mt-1">{fieldDefinition.instructions}</p>
      )}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

const SelectField = ({ fieldDefinition }) => {
  const { formState, formErrors, updateFieldValue, registerField } = useContext(FormContext);
  
  useEffect(() => {
    registerField(fieldDefinition);
  }, [fieldDefinition, registerField]);

  const value = formState[fieldDefinition.name] || '';
  const error = formErrors[fieldDefinition.name];

  return (
    <div className="form-field">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {fieldDefinition.label}
        {fieldDefinition.validation?.required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => updateFieldValue(fieldDefinition.name, e.target.value)}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Select an option</option>
        {fieldDefinition.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {fieldDefinition.instructions && (
        <p className="text-sm text-gray-500 mt-1">{fieldDefinition.instructions}</p>
      )}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

// Field Component Map
const FIELD_COMPONENTS = {
  text: TextField,
  email: TextField,
  tel: TextField,
  textarea: TextAreaField,
  select: SelectField,
};

// Field Renderer
const FieldRenderer = ({ fieldId }) => {
  const { formDefinition, fieldVisibility } = useContext(FormContext);
  
  const fieldDefinition = formDefinition.fields.find(field => field.id === fieldId);
  
  if (!fieldDefinition || !fieldVisibility[fieldId]) {
    return null;
  }
  
  const FieldComponent = FIELD_COMPONENTS[fieldDefinition.type];
  
  if (!FieldComponent) {
    return (
      <div className="p-4 border-2 border-dashed border-red-300 rounded-md">
        <p className="text-red-500">Unknown field type: {fieldDefinition.type}</p>
      </div>
    );
  }
  
  return <FieldComponent fieldDefinition={fieldDefinition} />;
};

// Layout Renderer
const LayoutRenderer = ({ layoutNode }) => {
  const { mode } = useContext(FormContext);
  
  if (layoutNode.component === 'field') {
    return <FieldRenderer fieldId={layoutNode.fieldId} />;
  }
  
  if (layoutNode.component === 'container') {
    const Element = layoutNode.element || 'div';
    const attributes = layoutNode.attributes || {};
    
    // Special handling for title and subtitle
    let content = null;
    if (layoutNode.id === 'title') {
      content = 'Contact Us';
    } else if (layoutNode.id === 'subtitle') {
      content = 'Get in touch with us. We\'d love to hear from you!';
    }
    
    return React.createElement(
      Element,
      {
        ...attributes,
        className: attributes.className || ''
      },
      content || (layoutNode.children?.map((child) => (
        <LayoutRenderer key={child.id} layoutNode={child} />
      )))
    );
  }
  
  return null;
};

// Main Form Engine Component
const FormEngine = ({ formId, initialMode = 'input' }) => {
  const [formDefinition, setFormDefinition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Initialize hooks
  const { formState, updateFieldValue, registerField } = useFormState(formDefinition?.fields || []);
  const { formErrors, validateAll } = useValidation(formState, formDefinition?.fields || []);
  const { fieldVisibility } = useRules(formState, formDefinition?.fields || []);

  // Fetch form definition
  useEffect(() => {
    const fetchFormDefinition = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API}/forms/${formId}`);
        setFormDefinition(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load form');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormDefinition();
  }, [formId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      setSubmitMessage('Please fix the errors above');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await axios.post(`${API}/forms/${formId}/submissions`, {
        data: formState
      });
      
      setSubmitMessage(response.data.message);
      // Reset form
      Object.keys(formState).forEach(key => {
        updateFieldValue(key, '');
      });
    } catch (err) {
      setSubmitMessage(err.response?.data?.detail || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  const contextValue = {
    formDefinition,
    formState,
    formErrors,
    updateFieldValue,
    registerField,
    mode,
    setMode,
    fieldVisibility
  };

  return (
    <FormContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <LayoutRenderer layoutNode={formDefinition.layoutDefinition} />
          
          <div className="max-w-2xl mx-auto p-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            
            {submitMessage && (
              <div className={`mt-4 p-4 rounded-md ${
                submitMessage.includes('successfully') || submitMessage.includes('received')
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {submitMessage}
              </div>
            )}
          </div>
        </form>
      </div>
    </FormContext.Provider>
  );
};

// Demo App
function App() {
  return (
    <div className="App">
      <FormEngine formId="contact-us-v1" />
    </div>
  );
}

export default App;