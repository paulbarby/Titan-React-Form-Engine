# 🚀 Form-Titan React Form Engine

> **A powerful, dynamic form rendering engine that creates beautiful, interactive forms from JSON definitions**

Form-Titan is a declarative, data-driven form engine built for React that renders complex forms from simple JSON configurations. Perfect for building dynamic forms, surveys, admin panels, and any application requiring flexible form generation.

![Form-Titan Demo](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Form-Titan+Demo)

## ✨ Key Features

- 🎯 **JSON-Driven**: Define forms entirely through JSON configurations
- 🔄 **Dynamic Rendering**: Add, remove, and modify fields without code changes
- ✅ **Smart Validation**: Built-in validation with custom rules and real-time feedback
- 📱 **Responsive Design**: Mobile-first, beautiful forms with Tailwind CSS
- 🎨 **Flexible Layouts**: Unlimited layout possibilities with recursive containers
- 🔌 **Easy Integration**: Drop-in component for any React application
- 🛠 **Extensible**: Easy to add custom field types and validation rules
- 🚀 **Production Ready**: Full TypeScript support, comprehensive testing

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/form-titan.git
cd form-titan

# Install dependencies
cd frontend && yarn install
cd ../backend && pip install -r requirements.txt
```

### 2. Start the Development Server

```bash
# Start backend (from /backend directory)
uvicorn server:app --host 0.0.0.0 --port 8000 --reload

# Start frontend (from /frontend directory)  
yarn start
```

### 3. Basic Usage

```jsx
import { FormEngine } from './path/to/FormEngine';

function MyApp() {
  return (
    <div>
      <FormEngine formId="contact-us-v1" />
    </div>
  );
}
```

That's it! Your form will automatically load and render based on the JSON configuration.

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [🏗 Architecture Guide](./docs/ARCHITECTURE.md) | Technical architecture and component structure |
| [🔌 Integration Guide](./docs/INTEGRATION_GUIDE.md) | How to integrate Form-Titan into your project |
| [🎨 Customization Guide](./docs/CUSTOMIZATION_GUIDE.md) | Adding custom fields and validation rules |
| [📚 API Documentation](./docs/API_DOCUMENTATION.md) | Backend API endpoints and data models |
| [💡 Examples](./docs/EXAMPLES.md) | Form examples and JSON schemas |
| [🔧 Configuration](./docs/CONFIGURATION.md) | Environment setup and configuration options |

## 🎬 Live Demo

Visit our [live demo](https://your-demo-url.com) to see Form-Titan in action with various form types:

- Contact Forms
- Survey Forms  
- Registration Forms
- Multi-step Forms
- Conditional Logic Forms

## 🏗 Architecture Overview

Form-Titan follows a clean, modular architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   JSON Schema   │───▶│   FormEngine     │───▶│  Rendered Form  │
│   Definition    │    │   (React Core)   │    │   (Beautiful)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                        │                       │
        ▼                        ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Backend API    │    │  Custom Hooks    │    │ Field Components│
│  (FastAPI)      │    │  (State/Logic)   │    │ (UI Components) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Core Components

- **FormEngine**: Main orchestrator component
- **FormContext**: React Context for state management
- **Custom Hooks**: `useFormState`, `useValidation`, `useRules`
- **LayoutRenderer**: Recursive component for flexible layouts
- **FieldRenderer**: Dynamic field component mapping
- **Field Components**: Individual input components (TextField, SelectField, etc.)

## 🎯 Form Definition Example

```json
{
  "formId": "user-registration",
  "name": "User Registration Form",
  "config": { "mode": "input" },
  "fields": [
    {
      "id": "email",
      "name": "email", 
      "type": "email",
      "label": "Email Address",
      "placeholder": "Enter your email",
      "validation": {
        "required": true,
        "pattern": "^[^@]+@[^@]+\\.[^@]+$"
      }
    },
    {
      "id": "age_group",
      "name": "age_group",
      "type": "select", 
      "label": "Age Group",
      "options": [
        {"label": "18-25", "value": "18-25"},
        {"label": "26-35", "value": "26-35"},
        {"label": "36+", "value": "36+"}
      ],
      "validation": {"required": true}
    }
  ],
  "layoutDefinition": {
    "id": "root",
    "component": "container",
    "element": "div",
    "attributes": {"className": "max-w-md mx-auto p-6"},
    "children": [
      {"id": "email_field", "component": "field", "fieldId": "email"},
      {"id": "age_field", "component": "field", "fieldId": "age_group"}
    ]
  }
}
```

## 🔌 Integration Examples

### Basic Integration

```jsx
import React from 'react';
import { FormEngine } from 'form-titan';

function ContactPage() {
  return (
    <div className="container mx-auto py-8">
      <h1>Get in Touch</h1>
      <FormEngine 
        formId="contact-us-v1"
        onSubmit={(data) => console.log('Form submitted:', data)}
        onError={(error) => console.error('Form error:', error)}
      />
    </div>
  );
}
```

### Advanced Integration with Custom Handlers

```jsx
import React, { useState } from 'react';
import { FormEngine } from 'form-titan';

function CustomFormPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await myCustomAPI.submitForm(formData);
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormEngine
      formId="custom-form-v1"
      customSubmitHandler={handleFormSubmit}
      loadingState={isLoading}
      customValidation={(data) => {
        // Custom validation logic
        return validationErrors;
      }}
    />
  );
}
```

## 🛠 Adding Custom Field Types

```jsx
// 1. Create your custom field component
const RatingField = ({ fieldDefinition }) => {
  const { formState, updateFieldValue } = useContext(FormContext);
  
  return (
    <div className="rating-field">
      <label>{fieldDefinition.label}</label>
      {[1,2,3,4,5].map(rating => (
        <button
          key={rating}
          onClick={() => updateFieldValue(fieldDefinition.name, rating)}
          className={`star ${formState[fieldDefinition.name] >= rating ? 'active' : ''}`}
        >
          ⭐
        </button>
      ))}
    </div>
  );
};

// 2. Register the field type
const CUSTOM_FIELD_COMPONENTS = {
  ...FIELD_COMPONENTS,
  rating: RatingField
};

// 3. Use in your JSON definition
{
  "id": "satisfaction_rating",
  "name": "satisfaction_rating", 
  "type": "rating",
  "label": "How satisfied are you?",
  "validation": {"required": true}
}
```

## 🎨 Styling and Theming

Form-Titan uses Tailwind CSS for styling. You can customize the appearance in several ways:

### 1. Custom CSS Classes in JSON

```json
{
  "attributes": {
    "className": "bg-blue-50 border-2 border-blue-200 rounded-lg p-4"
  }
}
```

### 2. Global Theme Override

```css
/* Override default styles */
.form-titan-container {
  --primary-color: #your-brand-color;
  --border-radius: 8px;
}
```

### 3. Custom Field Styling

```jsx
const CustomTextField = ({ fieldDefinition }) => {
  return (
    <div className="custom-field-wrapper">
      {/* Your custom styling */}
    </div>
  );
};
```

## 📊 Supported Field Types

| Field Type | Description | Validation Options |
|------------|-------------|-------------------|
| `text` | Standard text input | required, minLength, maxLength, pattern |
| `email` | Email input with validation | required, pattern |
| `tel` | Telephone number input | required, pattern |
| `textarea` | Multi-line text input | required, minLength, maxLength |
| `select` | Dropdown selection | required |
| `checkbox` | Single checkbox | required |
| `radio` | Radio button group | required |
| `date` | Date picker | required, min, max |
| `number` | Number input | required, min, max |
| `password` | Password input | required, minLength, pattern |

## 🧪 Testing

```bash
# Run frontend tests
cd frontend && yarn test

# Run backend tests  
cd backend && python -m pytest

# Run end-to-end tests
yarn test:e2e
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] **Edit Mode**: Drag-and-drop form builder interface
- [ ] **More Field Types**: File upload, rich text, signature pad
- [ ] **Advanced Validation**: Cross-field validation, async validation
- [ ] **Themes**: Pre-built theme packages
- [ ] **Form Analytics**: Built-in form analytics and insights
- [ ] **Multi-language**: i18n support
- [ ] **Form Templates**: Pre-built form templates library

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [FastAPI](https://fastapi.tiangolo.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Drag-and-drop powered by [DnD Kit](https://dndkit.com/)

## 📞 Support

- 📚 [Documentation](./docs/)
- 🐛 [Report Issues](https://github.com/your-username/form-titan/issues)
- 💬 [Discussions](https://github.com/your-username/form-titan/discussions)
- 📧 Email: support@form-titan.com

---

**Made with ❤️ by the Form-Titan Team**