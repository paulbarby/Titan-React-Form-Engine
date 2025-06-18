/**
 * Form-Titan Standalone JavaScript Engine
 * A pure JavaScript form rendering engine that works without React
 * 
 * @version 1.0.0
 * @author Form-Titan Team
 * @license MIT
 */

(function(global) {
  'use strict';

  // Core FormTitan namespace
  const FormTitan = {
    version: '1.0.0',
    engines: new Map(),
    fieldTypes: new Map(),
    validators: new Map(),
    layoutComponents: new Map()
  };

  /**
   * Utility functions
   */
  const Utils = {
    // Generate unique IDs
    generateId: () => 'ft_' + Math.random().toString(36).substr(2, 9),
    
    // Deep merge objects
    deepMerge: (target, source) => {
      const result = { ...target };
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = Utils.deepMerge(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
      return result;
    },
    
    // Debounce function
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    // Get nested object value
    getNestedValue: (obj, path) => {
      return path.split('.').reduce((current, key) => current && current[key], obj);
    },
    
    // Set nested object value
    setNestedValue: (obj, path, value) => {
      const keys = path.split('.');
      const lastKey = keys.pop();
      const target = keys.reduce((current, key) => {
        if (!current[key]) current[key] = {};
        return current[key];
      }, obj);
      target[lastKey] = value;
    },
    
    // Create DOM element with attributes
    createElement: (tag, attributes = {}, children = []) => {
      const element = document.createElement(tag);
      
      // Set attributes
      Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
          element.className = value;
        } else if (key === 'dataset') {
          Object.entries(value).forEach(([dataKey, dataValue]) => {
            element.dataset[dataKey] = dataValue;
          });
        } else if (key.startsWith('on') && typeof value === 'function') {
          element.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
          element.setAttribute(key, value);
        }
      });
      
      // Add children
      children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
          element.appendChild(child);
        }
      });
      
      return element;
    }
  };

  /**
   * Event system for form interactions
   */
  class EventEmitter {
    constructor() {
      this.events = {};
    }
    
    on(event, callback) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(callback);
      
      // Return unsubscribe function
      return () => {
        this.events[event] = this.events[event].filter(cb => cb !== callback);
      };
    }
    
    emit(event, data) {
      if (this.events[event]) {
        this.events[event].forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            console.error(`Error in event listener for ${event}:`, error);
          }
        });
      }
    }
    
    off(event, callback) {
      if (this.events[event]) {
        this.events[event] = this.events[event].filter(cb => cb !== callback);
      }
    }
  }

  /**
   * Form state management
   */
  class FormState {
    constructor(initialData = {}) {
      this.data = { ...initialData };
      this.errors = {};
      this.touched = {};
      this.eventEmitter = new EventEmitter();
    }
    
    getValue(fieldName) {
      return Utils.getNestedValue(this.data, fieldName);
    }
    
    setValue(fieldName, value) {
      Utils.setNestedValue(this.data, fieldName, value);
      this.touched[fieldName] = true;
      this.eventEmitter.emit('fieldChange', { fieldName, value, formData: this.data });
    }
    
    getError(fieldName) {
      return this.errors[fieldName];
    }
    
    setError(fieldName, error) {
      if (error) {
        this.errors[fieldName] = error;
      } else {
        delete this.errors[fieldName];
      }
      this.eventEmitter.emit('errorChange', { fieldName, error, errors: this.errors });
    }
    
    clearErrors() {
      this.errors = {};
      this.eventEmitter.emit('errorsCleared');
    }
    
    isTouched(fieldName) {
      return Boolean(this.touched[fieldName]);
    }
    
    isValid() {
      return Object.keys(this.errors).length === 0;
    }
    
    getData() {
      return { ...this.data };
    }
    
    reset() {
      this.data = {};
      this.errors = {};
      this.touched = {};
      this.eventEmitter.emit('formReset');
    }
  }

  /**
   * Validation engine
   */
  class ValidationEngine {
    constructor() {
      this.rules = new Map();
      this.setupDefaultRules();
    }
    
    setupDefaultRules() {
      this.rules.set('required', (value, options) => {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return 'This field is required';
        }
        return null;
      });
      
      this.rules.set('minLength', (value, options) => {
        if (value && value.length < options.minLength) {
          return `Must be at least ${options.minLength} characters`;
        }
        return null;
      });
      
      this.rules.set('maxLength', (value, options) => {
        if (value && value.length > options.maxLength) {
          return `Must be no more than ${options.maxLength} characters`;
        }
        return null;
      });
      
      this.rules.set('pattern', (value, options) => {
        if (value && options.pattern) {
          const regex = new RegExp(options.pattern);
          if (!regex.test(value)) {
            return 'Invalid format';
          }
        }
        return null;
      });
      
      this.rules.set('email', (value) => {
        if (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return 'Invalid email address';
          }
        }
        return null;
      });
      
      this.rules.set('min', (value, options) => {
        if (value && Number(value) < options.min) {
          return `Must be at least ${options.min}`;
        }
        return null;
      });
      
      this.rules.set('max', (value, options) => {
        if (value && Number(value) > options.max) {
          return `Must be no more than ${options.max}`;
        }
        return null;
      });
    }
    
    addRule(name, validator) {
      this.rules.set(name, validator);
    }
    
    validateField(fieldDefinition, value, formData = {}) {
      const validation = fieldDefinition.validation;
      if (!validation) return null;
      
      // Check required
      if (validation.required) {
        const error = this.rules.get('required')(value, validation);
        if (error) return error;
      }
      
      // Skip other validations if value is empty and not required
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return null;
      }
      
      // Check other validation rules
      const rulesToCheck = ['minLength', 'maxLength', 'pattern', 'min', 'max'];
      
      for (const rule of rulesToCheck) {
        if (validation[rule] !== undefined) {
          const validator = this.rules.get(rule);
          if (validator) {
            const error = validator(value, validation);
            if (error) return error;
          }
        }
      }
      
      // Check email for email type fields
      if (fieldDefinition.type === 'email') {
        const error = this.rules.get('email')(value);
        if (error) return error;
      }
      
      // Check custom rules
      if (validation.customRules) {
        for (const customRule of validation.customRules) {
          const validator = this.rules.get(customRule.type);
          if (validator) {
            const error = validator(value, customRule.options, formData);
            if (error) return error;
          }
        }
      }
      
      return null;
    }
    
    validateAll(fields, formData) {
      const errors = {};
      
      fields.forEach(field => {
        const value = Utils.getNestedValue(formData, field.name);
        const error = this.validateField(field, value, formData);
        if (error) {
          errors[field.name] = error;
        }
      });
      
      return errors;
    }
  }

  /**
   * Field component base class
   */
  class BaseField {
    constructor(fieldDefinition, formState, formEngine) {
      this.fieldDefinition = fieldDefinition;
      this.formState = formState;
      this.formEngine = formEngine;
      this.element = null;
      this.inputElement = null;
    }
    
    render() {
      throw new Error('render() method must be implemented by field components');
    }
    
    getValue() {
      return this.formState.getValue(this.fieldDefinition.name);
    }
    
    setValue(value) {
      this.formState.setValue(this.fieldDefinition.name, value);
      this.updateValidation();
    }
    
    updateValidation() {
      const value = this.getValue();
      const error = this.formEngine.validator.validateField(
        this.fieldDefinition, 
        value, 
        this.formState.getData()
      );
      this.formState.setError(this.fieldDefinition.name, error);
      this.updateErrorDisplay();
    }
    
    updateErrorDisplay() {
      if (!this.element) return;
      
      const error = this.formState.getError(this.fieldDefinition.name);
      const errorElement = this.element.querySelector('.field-error');
      
      if (error) {
        this.element.classList.add('has-error');
        if (this.inputElement) {
          this.inputElement.classList.add('error');
        }
        if (errorElement) {
          errorElement.textContent = error;
          errorElement.style.display = 'block';
        }
      } else {
        this.element.classList.remove('has-error');
        if (this.inputElement) {
          this.inputElement.classList.remove('error');
        }
        if (errorElement) {
          errorElement.style.display = 'none';
        }
      }
    }
    
    createFieldWrapper() {
      const wrapper = Utils.createElement('div', {
        className: `form-field form-field-${this.fieldDefinition.type}`,
        dataset: { fieldId: this.fieldDefinition.id }
      });
      
      // Add label
      if (this.fieldDefinition.label) {
        const label = Utils.createElement('label', {
          className: 'field-label',
          for: this.fieldDefinition.id
        }, [this.fieldDefinition.label]);
        
        if (this.fieldDefinition.validation?.required) {
          label.appendChild(Utils.createElement('span', {
            className: 'required-indicator'
          }, [' *']));
        }
        
        wrapper.appendChild(label);
      }
      
      return wrapper;
    }
    
    createErrorElement() {
      return Utils.createElement('div', {
        className: 'field-error',
        style: 'display: none;'
      });
    }
    
    createInstructionsElement() {
      if (!this.fieldDefinition.instructions) return null;
      
      return Utils.createElement('div', {
        className: 'field-instructions'
      }, [this.fieldDefinition.instructions]);
    }
  }

  /**
   * Text field component
   */
  class TextField extends BaseField {
    render() {
      this.element = this.createFieldWrapper();
      
      this.inputElement = Utils.createElement('input', {
        type: this.getInputType(),
        id: this.fieldDefinition.id,
        name: this.fieldDefinition.name,
        className: 'field-input',
        placeholder: this.fieldDefinition.placeholder || '',
        value: this.getValue() || '',
        onInput: (e) => this.setValue(e.target.value),
        onBlur: () => this.updateValidation()
      });
      
      this.element.appendChild(this.inputElement);
      
      const instructions = this.createInstructionsElement();
      if (instructions) {
        this.element.appendChild(instructions);
      }
      
      this.element.appendChild(this.createErrorElement());
      
      return this.element;
    }
    
    getInputType() {
      const typeMap = {
        'text': 'text',
        'email': 'email',
        'tel': 'tel',
        'password': 'password',
        'number': 'number',
        'url': 'url'
      };
      return typeMap[this.fieldDefinition.type] || 'text';
    }
  }

  /**
   * Textarea field component
   */
  class TextareaField extends BaseField {
    render() {
      this.element = this.createFieldWrapper();
      
      this.inputElement = Utils.createElement('textarea', {
        id: this.fieldDefinition.id,
        name: this.fieldDefinition.name,
        className: 'field-input',
        placeholder: this.fieldDefinition.placeholder || '',
        rows: this.fieldDefinition.options?.rows || 4,
        onInput: (e) => this.setValue(e.target.value),
        onBlur: () => this.updateValidation()
      });
      
      this.inputElement.value = this.getValue() || '';
      
      this.element.appendChild(this.inputElement);
      
      const instructions = this.createInstructionsElement();
      if (instructions) {
        this.element.appendChild(instructions);
      }
      
      this.element.appendChild(this.createErrorElement());
      
      return this.element;
    }
  }

  /**
   * Select field component
   */
  class SelectField extends BaseField {
    render() {
      this.element = this.createFieldWrapper();
      
      this.inputElement = Utils.createElement('select', {
        id: this.fieldDefinition.id,
        name: this.fieldDefinition.name,
        className: 'field-input',
        onChange: (e) => this.setValue(e.target.value),
        onBlur: () => this.updateValidation()
      });
      
      // Add default option
      this.inputElement.appendChild(Utils.createElement('option', {
        value: ''
      }, ['Select an option']));
      
      // Add options
      if (this.fieldDefinition.options) {
        this.fieldDefinition.options.forEach(option => {
          this.inputElement.appendChild(Utils.createElement('option', {
            value: option.value,
            selected: this.getValue() === option.value
          }, [option.label]));
        });
      }
      
      this.element.appendChild(this.inputElement);
      
      const instructions = this.createInstructionsElement();
      if (instructions) {
        this.element.appendChild(instructions);
      }
      
      this.element.appendChild(this.createErrorElement());
      
      return this.element;
    }
  }

  /**
   * Checkbox field component
   */
  class CheckboxField extends BaseField {
    render() {
      this.element = this.createFieldWrapper();
      this.element.classList.add('checkbox-field');
      
      if (this.fieldDefinition.options && this.fieldDefinition.options.length > 0) {
        // Multiple checkboxes
        this.renderMultipleCheckboxes();
      } else {
        // Single checkbox
        this.renderSingleCheckbox();
      }
      
      const instructions = this.createInstructionsElement();
      if (instructions) {
        this.element.appendChild(instructions);
      }
      
      this.element.appendChild(this.createErrorElement());
      
      return this.element;
    }
    
    renderSingleCheckbox() {
      const wrapper = Utils.createElement('div', { className: 'checkbox-wrapper' });
      
      this.inputElement = Utils.createElement('input', {
        type: 'checkbox',
        id: this.fieldDefinition.id,
        name: this.fieldDefinition.name,
        className: 'checkbox-input',
        checked: Boolean(this.getValue()),
        onChange: (e) => this.setValue(e.target.checked)
      });
      
      const label = Utils.createElement('label', {
        for: this.fieldDefinition.id,
        className: 'checkbox-label'
      }, [this.fieldDefinition.label || 'Check this box']);
      
      wrapper.appendChild(this.inputElement);
      wrapper.appendChild(label);
      this.element.appendChild(wrapper);
    }
    
    renderMultipleCheckboxes() {
      const currentValue = this.getValue() || [];
      
      this.fieldDefinition.options.forEach((option, index) => {
        const wrapper = Utils.createElement('div', { className: 'checkbox-wrapper' });
        const inputId = `${this.fieldDefinition.id}_${index}`;
        
        const input = Utils.createElement('input', {
          type: 'checkbox',
          id: inputId,
          name: this.fieldDefinition.name,
          className: 'checkbox-input',
          value: option.value,
          checked: currentValue.includes(option.value),
          onChange: (e) => this.handleMultipleCheckboxChange(e)
        });
        
        const label = Utils.createElement('label', {
          for: inputId,
          className: 'checkbox-label'
        }, [option.label]);
        
        wrapper.appendChild(input);
        wrapper.appendChild(label);
        this.element.appendChild(wrapper);
      });
    }
    
    handleMultipleCheckboxChange(e) {
      const currentValue = this.getValue() || [];
      const value = e.target.value;
      
      let newValue;
      if (e.target.checked) {
        newValue = [...currentValue, value];
      } else {
        newValue = currentValue.filter(v => v !== value);
      }
      
      this.setValue(newValue);
    }
  }

  /**
   * Radio field component
   */
  class RadioField extends BaseField {
    render() {
      this.element = this.createFieldWrapper();
      this.element.classList.add('radio-field');
      
      if (this.fieldDefinition.options) {
        this.fieldDefinition.options.forEach((option, index) => {
          const wrapper = Utils.createElement('div', { className: 'radio-wrapper' });
          const inputId = `${this.fieldDefinition.id}_${index}`;
          
          const input = Utils.createElement('input', {
            type: 'radio',
            id: inputId,
            name: this.fieldDefinition.name,
            className: 'radio-input',
            value: option.value,
            checked: this.getValue() === option.value,
            onChange: (e) => this.setValue(e.target.value)
          });
          
          const label = Utils.createElement('label', {
            for: inputId,
            className: 'radio-label'
          }, [option.label]);
          
          wrapper.appendChild(input);
          wrapper.appendChild(label);
          this.element.appendChild(wrapper);
        });
      }
      
      const instructions = this.createInstructionsElement();
      if (instructions) {
        this.element.appendChild(instructions);
      }
      
      this.element.appendChild(this.createErrorElement());
      
      return this.element;
    }
  }

  /**
   * Date field component
   */
  class DateField extends BaseField {
    render() {
      this.element = this.createFieldWrapper();
      
      this.inputElement = Utils.createElement('input', {
        type: 'date',
        id: this.fieldDefinition.id,
        name: this.fieldDefinition.name,
        className: 'field-input',
        value: this.getValue() || '',
        onChange: (e) => this.setValue(e.target.value),
        onBlur: () => this.updateValidation()
      });
      
      this.element.appendChild(this.inputElement);
      
      const instructions = this.createInstructionsElement();
      if (instructions) {
        this.element.appendChild(instructions);
      }
      
      this.element.appendChild(this.createErrorElement());
      
      return this.element;
    }
  }

  /**
   * Layout renderer for recursive form layouts
   */
  class LayoutRenderer {
    constructor(formEngine) {
      this.formEngine = formEngine;
    }
    
    render(layoutNode) {
      if (layoutNode.component === 'field') {
        return this.renderField(layoutNode);
      } else if (layoutNode.component === 'container') {
        return this.renderContainer(layoutNode);
      }
      
      return Utils.createElement('div');
    }
    
    renderField(layoutNode) {
      const field = this.formEngine.getField(layoutNode.fieldId);
      if (!field) {
        console.warn(`Field with ID ${layoutNode.fieldId} not found`);
        return Utils.createElement('div');
      }
      
      const FieldComponent = FormTitan.fieldTypes.get(field.type);
      if (!FieldComponent) {
        console.warn(`Field type ${field.type} not registered`);
        return Utils.createElement('div', {}, [`Unknown field type: ${field.type}`]);
      }
      
      const fieldInstance = new FieldComponent(field, this.formEngine.formState, this.formEngine);
      return fieldInstance.render();
    }
    
    renderContainer(layoutNode) {
      const element = layoutNode.element || 'div';
      const attributes = layoutNode.attributes || {};
      
      const container = Utils.createElement(element, attributes);
      
      // Handle special containers with content
      if (layoutNode.id === 'title' && !layoutNode.children?.length) {
        container.textContent = this.formEngine.formDefinition.name || 'Form';
      } else if (layoutNode.id === 'subtitle' && !layoutNode.children?.length) {
        container.textContent = this.formEngine.formDefinition.description || '';
      }
      
      // Render children
      if (layoutNode.children) {
        layoutNode.children.forEach(child => {
          const childElement = this.render(child);
          container.appendChild(childElement);
        });
      }
      
      return container;
    }
  }

  /**
   * Visibility engine for conditional field display
   */
  class VisibilityEngine {
    constructor(formState) {
      this.formState = formState;
    }
    
    evaluateRule(rule, formData) {
      const fieldValue = Utils.getNestedValue(formData, rule.field);
      
      switch (rule.operator) {
        case 'equals':
          return fieldValue === rule.value;
        case 'not_equals':
          return fieldValue !== rule.value;
        case 'contains':
          return fieldValue && fieldValue.toString().includes(rule.value);
        case 'not_contains':
          return !fieldValue || !fieldValue.toString().includes(rule.value);
        case 'greater_than':
          return Number(fieldValue) > Number(rule.value);
        case 'less_than':
          return Number(fieldValue) < Number(rule.value);
        case 'is_empty':
          return !fieldValue || fieldValue.toString().trim() === '';
        case 'is_not_empty':
          return fieldValue && fieldValue.toString().trim() !== '';
        case 'in_array':
          return Array.isArray(rule.value) && rule.value.includes(fieldValue);
        default:
          return true;
      }
    }
    
    isFieldVisible(field, formData) {
      if (!field.visibility || field.visibility.length === 0) {
        return true;
      }
      
      return field.visibility.every(rule => this.evaluateRule(rule, formData));
    }
    
    updateFieldVisibility(fields, container) {
      const formData = this.formState.getData();
      
      fields.forEach(field => {
        const fieldElement = container.querySelector(`[data-field-id="${field.id}"]`);
        if (fieldElement) {
          const isVisible = this.isFieldVisible(field, formData);
          fieldElement.style.display = isVisible ? '' : 'none';
        }
      });
    }
  }

  /**
   * Main Form Engine class
   */
  class FormEngine extends EventEmitter {
    constructor(containerId, options = {}) {
      super();
      
      this.containerId = containerId;
      this.container = document.getElementById(containerId);
      
      if (!this.container) {
        throw new Error(`Container with ID '${containerId}' not found`);
      }
      
      this.options = Utils.deepMerge({
        apiUrl: '/api',
        validateOnChange: true,
        validateOnBlur: true,
        autoSubmit: false,
        showLoadingStates: true,
        theme: 'default'
      }, options);
      
      this.formDefinition = null;
      this.formState = new FormState();
      this.validator = new ValidationEngine();
      this.layoutRenderer = new LayoutRenderer(this);
      this.visibilityEngine = new VisibilityEngine(this.formState);
      
      this.isLoading = false;
      this.isSubmitting = false;
      
      this.setupEventListeners();
      this.applyTheme();
    }
    
    setupEventListeners() {
      // Listen to form state changes
      this.formState.eventEmitter.on('fieldChange', ({ fieldName, value, formData }) => {
        this.emit('fieldChange', { fieldName, value, formData });
        
        // Update conditional visibility
        if (this.formDefinition) {
          this.visibilityEngine.updateFieldVisibility(this.formDefinition.fields, this.container);
        }
      });
      
      this.formState.eventEmitter.on('errorChange', ({ fieldName, error, errors }) => {
        this.emit('validationChange', { fieldName, error, errors });
      });
    }
    
    applyTheme() {
      this.container.classList.add(`form-titan-theme-${this.options.theme}`);
    }
    
    async loadForm(formIdOrDefinition) {
      this.setLoading(true);
      
      try {
        if (typeof formIdOrDefinition === 'string') {
          // Load from API
          this.formDefinition = await this.fetchFormDefinition(formIdOrDefinition);
        } else {
          // Use provided definition
          this.formDefinition = formIdOrDefinition;
        }
        
        this.render();
        this.emit('formLoaded', this.formDefinition);
        
      } catch (error) {
        this.handleError('Failed to load form', error);
      } finally {
        this.setLoading(false);
      }
    }
    
    async fetchFormDefinition(formId) {
      const response = await fetch(`${this.options.apiUrl}/forms/${formId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    }
    
    render() {
      if (!this.formDefinition) {
        return;
      }
      
      // Clear container
      this.container.innerHTML = '';
      
      // Create form element
      const formElement = Utils.createElement('form', {
        className: 'form-titan-form',
        onSubmit: (e) => this.handleSubmit(e)
      });
      
      // Render layout
      const layoutElement = this.layoutRenderer.render(this.formDefinition.layoutDefinition);
      formElement.appendChild(layoutElement);
      
      // Add submit button if not present in layout
      if (!formElement.querySelector('button[type="submit"]')) {
        const submitButton = Utils.createElement('button', {
          type: 'submit',
          className: 'form-submit-button'
        }, ['Submit']);
        formElement.appendChild(submitButton);
      }
      
      this.container.appendChild(formElement);
      
      // Initialize visibility
      this.visibilityEngine.updateFieldVisibility(this.formDefinition.fields, this.container);
      
      this.emit('formRendered');
    }
    
    async handleSubmit(e) {
      e.preventDefault();
      
      if (this.isSubmitting) return;
      
      this.setSubmitting(true);
      
      try {
        // Validate form
        const errors = this.validator.validateAll(this.formDefinition.fields, this.formState.getData());
        
        if (Object.keys(errors).length > 0) {
          // Set errors in form state
          Object.entries(errors).forEach(([fieldName, error]) => {
            this.formState.setError(fieldName, error);
          });
          
          // Update error display
          this.updateAllFieldErrors();
          
          this.emit('validationFailed', errors);
          return;
        }
        
        // Submit form
        const formData = this.formState.getData();
        const result = await this.submitForm(formData);
        
        this.emit('formSubmitted', { formData, result });
        
        // Show success message
        this.showMessage('Form submitted successfully!', 'success');
        
        // Reset form if configured
        if (this.options.resetOnSubmit) {
          this.resetForm();
        }
        
      } catch (error) {
        this.handleError('Failed to submit form', error);
      } finally {
        this.setSubmitting(false);
      }
    }
    
    async submitForm(formData) {
      const response = await fetch(`${this.options.apiUrl}/forms/${this.formDefinition.formId}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: formData })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    }
    
    updateAllFieldErrors() {
      this.formDefinition.fields.forEach(field => {
        const fieldElement = this.container.querySelector(`[data-field-id="${field.id}"]`);
        if (fieldElement) {
          const error = this.formState.getError(field.name);
          const errorElement = fieldElement.querySelector('.field-error');
          
          if (error) {
            fieldElement.classList.add('has-error');
            if (errorElement) {
              errorElement.textContent = error;
              errorElement.style.display = 'block';
            }
          } else {
            fieldElement.classList.remove('has-error');
            if (errorElement) {
              errorElement.style.display = 'none';
            }
          }
        }
      });
    }
    
    setLoading(loading) {
      this.isLoading = loading;
      this.container.classList.toggle('form-loading', loading);
      
      if (loading && this.options.showLoadingStates) {
        this.showMessage('Loading form...', 'info');
      }
      
      this.emit('loadingChange', loading);
    }
    
    setSubmitting(submitting) {
      this.isSubmitting = submitting;
      this.container.classList.toggle('form-submitting', submitting);
      
      const submitButton = this.container.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = submitting;
        submitButton.textContent = submitting ? 'Submitting...' : 'Submit';
      }
      
      this.emit('submittingChange', submitting);
    }
    
    showMessage(message, type = 'info') {
      // Remove existing messages
      const existingMessage = this.container.querySelector('.form-message');
      if (existingMessage) {
        existingMessage.remove();
      }
      
      const messageElement = Utils.createElement('div', {
        className: `form-message form-message-${type}`
      }, [message]);
      
      this.container.insertBefore(messageElement, this.container.firstChild);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.remove();
        }
      }, 5000);
    }
    
    handleError(message, error) {
      console.error(message, error);
      this.showMessage(message, 'error');
      this.emit('error', { message, error });
    }
    
    resetForm() {
      this.formState.reset();
      this.render();
      this.emit('formReset');
    }
    
    getField(fieldId) {
      return this.formDefinition?.fields.find(field => field.id === fieldId);
    }
    
    getFieldValue(fieldName) {
      return this.formState.getValue(fieldName);
    }
    
    setFieldValue(fieldName, value) {
      this.formState.setValue(fieldName, value);
    }
    
    getFormData() {
      return this.formState.getData();
    }
    
    setFormData(data) {
      Object.entries(data).forEach(([fieldName, value]) => {
        this.formState.setValue(fieldName, value);
      });
    }
    
    validate() {
      const errors = this.validator.validateAll(this.formDefinition.fields, this.formState.getData());
      
      Object.entries(errors).forEach(([fieldName, error]) => {
        this.formState.setError(fieldName, error);
      });
      
      this.updateAllFieldErrors();
      
      return Object.keys(errors).length === 0;
    }
    
    destroy() {
      // Remove event listeners
      this.container.innerHTML = '';
      this.container.classList.remove(`form-titan-theme-${this.options.theme}`);
      
      // Remove from global registry
      FormTitan.engines.delete(this.containerId);
      
      this.emit('destroyed');
    }
  }

  // Register default field types
  FormTitan.fieldTypes.set('text', TextField);
  FormTitan.fieldTypes.set('email', TextField);
  FormTitan.fieldTypes.set('tel', TextField);
  FormTitan.fieldTypes.set('password', TextField);
  FormTitan.fieldTypes.set('number', TextField);
  FormTitan.fieldTypes.set('url', TextField);
  FormTitan.fieldTypes.set('textarea', TextareaField);
  FormTitan.fieldTypes.set('select', SelectField);
  FormTitan.fieldTypes.set('checkbox', CheckboxField);
  FormTitan.fieldTypes.set('radio', RadioField);
  FormTitan.fieldTypes.set('date', DateField);

  // Public API
  FormTitan.create = function(containerId, options = {}) {
    const engine = new FormEngine(containerId, options);
    FormTitan.engines.set(containerId, engine);
    return engine;
  };

  FormTitan.get = function(containerId) {
    return FormTitan.engines.get(containerId);
  };

  FormTitan.registerField = function(type, FieldClass) {
    FormTitan.fieldTypes.set(type, FieldClass);
  };

  FormTitan.registerValidator = function(name, validator) {
    // Add to all existing engines
    FormTitan.engines.forEach(engine => {
      engine.validator.addRule(name, validator);
    });
  };

  FormTitan.Utils = Utils;
  FormTitan.BaseField = BaseField;
  FormTitan.FormEngine = FormEngine;

  // Export to global scope
  global.FormTitan = FormTitan;

  // AMD support
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return FormTitan;
    });
  }

  // CommonJS support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormTitan;
  }

})(typeof window !== 'undefined' ? window : this);