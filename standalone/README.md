# 🟨 Form-Titan Standalone

Pure JavaScript form engine that works without React - perfect for any website, CMS, or legacy application.

## ✨ Features

- **🚀 Zero Dependencies** - Pure JavaScript, no React required
- **📱 Mobile Ready** - Responsive design with touch support  
- **♿ Accessible** - WCAG 2.1 compliant with keyboard navigation
- **🎨 Themeable** - Multiple themes with CSS custom properties
- **🔧 Extensible** - Plugin system for custom fields and validators
- **⚡ Lightweight** - Minimal bundle size (~15KB gzipped)
- **🌐 Universal** - Works in all modern browsers + IE11

## 🚀 Quick Start

### 1. Include Files

```html
<link rel="stylesheet" href="form-titan.css">
<script src="form-titan.js"></script>
```

### 2. Create Container

```html
<div id="my-form"></div>
```

### 3. Initialize Form

```javascript
const formEngine = FormTitan.create('my-form');

const formDefinition = {
    formId: 'contact',
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
            label: 'Email',
            validation: { required: true }
        }
    ],
    layoutDefinition: {
        id: 'root',
        component: 'container',
        children: [
            { id: 'name_field', component: 'field', fieldId: 'name' },
            { id: 'email_field', component: 'field', fieldId: 'email' }
        ]
    }
};

formEngine.loadForm(formDefinition);
```

## 📁 Files

- **`form-titan.js`** - Main JavaScript library (15KB)
- **`form-titan.css`** - Stylesheet with themes (8KB)
- **`example.html`** - Interactive demo with examples
- **`README.md`** - This documentation

## 🎮 Interactive Demo

Open `example.html` in your browser to see:

- 📝 **Live Forms** - Contact, survey, and job application examples
- 🎨 **Theme Switcher** - Default, dark, and high-contrast themes
- 📊 **Real-time Analytics** - Form state and validation monitoring
- 🔧 **Developer Tools** - Validation, data inspection, and reset controls

## 🔌 API Reference

### Creating Form Engine

```javascript
const options = {
    theme: 'default',           // 'default', 'dark', 'high-contrast'
    validateOnChange: true,     // Real-time validation
    validateOnBlur: true,       // Validate on field blur
    showLoadingStates: true,    // Loading indicators
    apiUrl: '/api'             // Backend API URL
};

const formEngine = FormTitan.create('container-id', options);
```

### Loading Forms

```javascript
// From JSON definition
formEngine.loadForm(formDefinition);

// From API endpoint
formEngine.loadForm('form-id');

// From external URL
formEngine.options.apiUrl = 'https://api.example.com';
formEngine.loadForm('remote-form');
```

### Event Handling

```javascript
// Form events
formEngine.on('formSubmitted', ({ formData, result }) => {
    console.log('Submitted:', formData);
});

formEngine.on('fieldChange', ({ fieldName, value }) => {
    console.log(`${fieldName} = ${value}`);
});

formEngine.on('validationChange', ({ fieldName, error }) => {
    if (error) console.log(`Error: ${error}`);
});
```

### Data Management

```javascript
// Get/set form data
const data = formEngine.getFormData();
formEngine.setFormData({ name: 'John', email: 'john@example.com' });

// Individual fields
const name = formEngine.getFieldValue('name');
formEngine.setFieldValue('name', 'Jane');

// Validation and reset
const isValid = formEngine.validate();
formEngine.resetForm();
```

## 🎨 Supported Field Types

| Type | Description | Features |
|------|-------------|----------|
| `text` | Single-line text | Validation, placeholder |
| `email` | Email address | Built-in email validation |
| `tel` | Phone number | Phone number input |
| `password` | Password field | Hidden input |
| `number` | Numeric input | Min/max validation |
| `url` | URL input | URL validation |
| `textarea` | Multi-line text | Configurable rows |
| `select` | Dropdown menu | Multiple options |
| `radio` | Radio buttons | Single selection |
| `checkbox` | Checkboxes | Multiple selection |
| `date` | Date picker | Date selection |

## 🛠 Customization

### Custom Field Types

```javascript
class RatingField extends FormTitan.BaseField {
    render() {
        this.element = this.createFieldWrapper();
        
        const stars = FormTitan.Utils.createElement('div', {
            className: 'rating-stars'
        });
        
        for (let i = 1; i <= 5; i++) {
            const star = FormTitan.Utils.createElement('button', {
                type: 'button',
                className: 'star',
                onClick: () => this.setValue(i)
            }, ['⭐']);
            
            stars.appendChild(star);
        }
        
        this.element.appendChild(stars);
        return this.element;
    }
}

FormTitan.registerField('rating', RatingField);
```

### Custom Validators

```javascript
FormTitan.registerValidator('phone', (value) => {
    if (!value) return null;
    
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(value) ? null : 'Invalid phone number';
});
```

### Custom Themes

```css
.form-titan-theme-corporate {
    --primary-color: #2c5282;
    --border-radius: 4px;
    --spacing-md: 1.5rem;
}

.form-titan-theme-corporate .field-input {
    border: 2px solid var(--primary-color);
    font-family: 'Georgia', serif;
}
```

## 🌍 Browser Support

- **Modern**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Legacy**: IE 11+ (with polyfills)

### IE 11 Setup

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6,Array.prototype.find,Object.assign"></script>
<script src="form-titan.js"></script>
```

## 📦 Integration Examples

### WordPress

```php
// In functions.php
function enqueue_form_titan() {
    wp_enqueue_style('form-titan', get_template_directory_uri() . '/js/form-titan.css');
    wp_enqueue_script('form-titan', get_template_directory_uri() . '/js/form-titan.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'enqueue_form_titan');
```

```html
<!-- In template -->
<div id="contact-form"></div>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const formEngine = FormTitan.create('contact-form');
    formEngine.loadForm('contact-us');
});
</script>
```

### Static Site Generators

```html
<!-- Hugo/Jekyll/11ty -->
<div id="newsletter-form"></div>
<script>
    const formEngine = FormTitan.create('newsletter-form', {
        apiUrl: 'https://api.netlify.com/build_hooks'
    });
    
    formEngine.loadForm({
        formId: 'newsletter',
        fields: [
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
            children: [
                { id: 'email_field', component: 'field', fieldId: 'email' }
            ]
        }
    });
});
</script>
```

### Content Management Systems

```javascript
// Drupal/Joomla integration
(function($) {
    Drupal.behaviors.formTitan = {
        attach: function(context, settings) {
            $('.form-titan-container', context).once('form-titan').each(function() {
                const formId = $(this).data('form-id');
                const formEngine = FormTitan.create(this.id);
                formEngine.loadForm(formId);
            });
        }
    };
})(jQuery);
```

## 🔧 Development

### Building from Source

```bash
# Clone repository
git clone https://github.com/your-org/form-titan.git
cd form-titan/standalone

# Build standalone version
npm run build:standalone

# Watch for changes
npm run watch:standalone

# Run tests
npm test
```

### Testing

```javascript
// Unit tests
npm run test:unit

// Integration tests  
npm run test:integration

// Browser tests
npm run test:browser

// All tests
npm test
```

## 📈 Performance

- **Bundle Size**: 15KB gzipped (JS + CSS)
- **Runtime**: <50ms initialization
- **Memory**: <2MB for typical forms
- **Rendering**: 60fps animations

### Optimization Tips

```javascript
// Tree shaking (when using bundler)
import { FormEngine, TextField } from 'form-titan-standalone';

// Lazy loading
const FormTitan = await import('./form-titan.js');

// Preload critical forms
document.addEventListener('DOMContentLoaded', () => {
    FormTitan.preload(['contact-form', 'newsletter']);
});
```

## 🆘 Support

- **📚 Documentation**: See [STANDALONE_GUIDE.md](../docs/STANDALONE_GUIDE.md)
- **🐛 Issues**: [GitHub Issues](https://github.com/your-org/form-titan/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/your-org/form-titan/discussions)
- **📧 Email**: support@form-titan.com

## 📄 License

MIT License - see [LICENSE](../LICENSE) file

## 🙏 Contributing

We welcome contributions! See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

**Made with ❤️ by the Form-Titan Team**