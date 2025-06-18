# 💡 Form-Titan Examples

This document provides comprehensive examples of Form-Titan forms, from simple contact forms to complex multi-step surveys with conditional logic.

## Table of Contents

- [Basic Forms](#basic-forms)
- [Advanced Forms](#advanced-forms)
- [Conditional Logic Examples](#conditional-logic-examples)
- [Multi-Step Forms](#multi-step-forms)
- [Custom Field Examples](#custom-field-examples)
- [Layout Examples](#layout-examples)
- [Validation Examples](#validation-examples)
- [Real-World Use Cases](#real-world-use-cases)

## Basic Forms

### Simple Contact Form

```json
{
  "formId": "contact-basic",
  "name": "Basic Contact Form",
  "config": { "mode": "input" },
  "fields": [
    {
      "id": "name",
      "name": "name",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your full name",
      "validation": { "required": true, "minLength": 2 }
    },
    {
      "id": "email",
      "name": "email", 
      "type": "email",
      "label": "Email Address",
      "placeholder": "your.email@example.com",
      "validation": { 
        "required": true,
        "pattern": "^[^@]+@[^@]+\\.[^@]+$"
      }
    },
    {
      "id": "message",
      "name": "message",
      "type": "textarea",
      "label": "Message",
      "placeholder": "How can we help you?",
      "validation": { "required": true, "minLength": 10 }
    }
  ],
  "layoutDefinition": {
    "id": "root",
    "component": "container",
    "element": "div",
    "attributes": { "className": "max-w-md mx-auto p-6 bg-white rounded-lg shadow" },
    "children": [
      {
        "id": "header",
        "component": "container",
        "element": "h2",
        "attributes": { "className": "text-2xl font-bold mb-4 text-center" },
        "children": []
      },
      { "id": "name_field", "component": "field", "fieldId": "name" },
      { "id": "email_field", "component": "field", "fieldId": "email" },
      { "id": "message_field", "component": "field", "fieldId": "message" }
    ]
  }
}
```

### Newsletter Signup

```json
{
  "formId": "newsletter-signup",
  "name": "Newsletter Subscription",
  "config": { "mode": "input" },
  "fields": [
    {
      "id": "email",
      "name": "email",
      "type": "email",
      "label": "Email Address",
      "placeholder": "Enter your email",
      "validation": { "required": true }
    },
    {
      "id": "frequency",
      "name": "frequency",
      "type": "select",
      "label": "Email Frequency",
      "options": [
        { "label": "Daily", "value": "daily" },
        { "label": "Weekly", "value": "weekly" },
        { "label": "Monthly", "value": "monthly" }
      ],
      "defaultValue": "weekly",
      "validation": { "required": true }
    },
    {
      "id": "topics",
      "name": "topics",
      "type": "checkbox",
      "label": "Topics of Interest",
      "options": [
        { "label": "Technology", "value": "tech" },
        { "label": "Business", "value": "business" },
        { "label": "Design", "value": "design" },
        { "label": "Marketing", "value": "marketing" }
      ]
    }
  ],
  "layoutDefinition": {
    "id": "root",
    "component": "container",
    "element": "div",
    "attributes": { "className": "max-w-sm mx-auto p-4 border rounded-lg" },
    "children": [
      { "id": "email_field", "component": "field", "fieldId": "email" },
      { "id": "frequency_field", "component": "field", "fieldId": "frequency" },
      { "id": "topics_field", "component": "field", "fieldId": "topics" }
    ]
  }
}
```

## Advanced Forms

### Job Application Form

```json
{
  "formId": "job-application",
  "name": "Job Application Form",
  "config": { "mode": "input" },
  "fields": [
    {
      "id": "personal_info_section",
      "name": "personal_info_section",
      "type": "section",
      "label": "Personal Information"
    },
    {
      "id": "first_name",
      "name": "first_name",
      "type": "text",
      "label": "First Name",
      "validation": { "required": true, "minLength": 2 }
    },
    {
      "id": "last_name",
      "name": "last_name", 
      "type": "text",
      "label": "Last Name",
      "validation": { "required": true, "minLength": 2 }
    },
    {
      "id": "email",
      "name": "email",
      "type": "email",
      "label": "Email Address",
      "validation": { "required": true }
    },
    {
      "id": "phone",
      "name": "phone",
      "type": "tel",
      "label": "Phone Number",
      "validation": { "required": true }
    },
    {
      "id": "position",
      "name": "position",
      "type": "select",
      "label": "Position Applied For",
      "options": [
        { "label": "Frontend Developer", "value": "frontend" },
        { "label": "Backend Developer", "value": "backend" },
        { "label": "Full Stack Developer", "value": "fullstack" },
        { "label": "UI/UX Designer", "value": "designer" },
        { "label": "Product Manager", "value": "pm" }
      ],
      "validation": { "required": true }
    },
    {
      "id": "experience",
      "name": "experience",
      "type": "select",
      "label": "Years of Experience",
      "options": [
        { "label": "0-1 years", "value": "junior" },
        { "label": "2-5 years", "value": "mid" },
        { "label": "5+ years", "value": "senior" }
      ],
      "validation": { "required": true }
    },
    {
      "id": "salary_expectation",
      "name": "salary_expectation",
      "type": "number",
      "label": "Salary Expectation (USD)",
      "placeholder": "e.g., 75000",
      "validation": { "min": 30000, "max": 300000 }
    },
    {
      "id": "resume",
      "name": "resume",
      "type": "file",
      "label": "Resume/CV",
      "validation": { "required": true },
      "options": {
        "acceptedTypes": ["application/pdf", "application/msword"],
        "maxSize": 5242880
      }
    },
    {
      "id": "portfolio",
      "name": "portfolio",
      "type": "url",
      "label": "Portfolio URL",
      "placeholder": "https://your-portfolio.com",
      "visibility": [
        {
          "field": "position",
          "operator": "in_array",
          "value": ["frontend", "fullstack", "designer"]
        }
      ]
    },
    {
      "id": "cover_letter",
      "name": "cover_letter",
      "type": "textarea",
      "label": "Cover Letter",
      "placeholder": "Tell us why you're interested in this position...",
      "validation": { "required": true, "minLength": 100 }
    },
    {
      "id": "availability",
      "name": "availability",
      "type": "date",
      "label": "Earliest Start Date",
      "validation": { "required": true }
    },
    {
      "id": "remote_work",
      "name": "remote_work",
      "type": "radio",
      "label": "Remote Work Preference",
      "options": [
        { "label": "Full-time remote", "value": "full_remote" },
        { "label": "Hybrid (2-3 days remote)", "value": "hybrid" },
        { "label": "Office-based", "value": "office" },
        { "label": "Flexible", "value": "flexible" }
      ],
      "validation": { "required": true }
    }
  ],
  "layoutDefinition": {
    "id": "root",
    "component": "container",
    "element": "div",
    "attributes": { "className": "max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg" },
    "children": [
      {
        "id": "header",
        "component": "container",
        "element": "div",
        "attributes": { "className": "text-center mb-8" },
        "children": [
          {
            "id": "title",
            "component": "container",
            "element": "h1",
            "attributes": { "className": "text-3xl font-bold text-gray-900" },
            "children": []
          }
        ]
      },
      {
        "id": "personal_section",
        "component": "container",
        "element": "div",
        "attributes": { "className": "mb-8" },
        "children": [
          {
            "id": "personal_header",
            "component": "container",
            "element": "h2",
            "attributes": { "className": "text-xl font-semibold mb-4 text-gray-800" },
            "children": []
          },
          {
            "id": "name_row",
            "component": "container",
            "element": "div",
            "attributes": { "className": "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" },
            "children": [
              { "id": "first_name_field", "component": "field", "fieldId": "first_name" },
              { "id": "last_name_field", "component": "field", "fieldId": "last_name" }
            ]
          },
          {
            "id": "contact_row",
            "component": "container",
            "element": "div",
            "attributes": { "className": "grid grid-cols-1 md:grid-cols-2 gap-4" },
            "children": [
              { "id": "email_field", "component": "field", "fieldId": "email" },
              { "id": "phone_field", "component": "field", "fieldId": "phone" }
            ]
          }
        ]
      },
      {
        "id": "position_section",
        "component": "container",
        "element": "div",
        "attributes": { "className": "mb-8" },
        "children": [
          {
            "id": "position_header",
            "component": "container", 
            "element": "h2",
            "attributes": { "className": "text-xl font-semibold mb-4 text-gray-800" },
            "children": []
          },
          {
            "id": "job_details_row",
            "component": "container",
            "element": "div",
            "attributes": { "className": "grid grid-cols-1 md:grid-cols-2 gap-4" },
            "children": [
              { "id": "position_field", "component": "field", "fieldId": "position" },
              { "id": "experience_field", "component": "field", "fieldId": "experience" }
            ]
          },
          { "id": "salary_field", "component": "field", "fieldId": "salary_expectation" },
          { "id": "portfolio_field", "component": "field", "fieldId": "portfolio" }
        ]
      },
      {
        "id": "documents_section",
        "component": "container",
        "element": "div", 
        "attributes": { "className": "mb-8" },
        "children": [
          { "id": "resume_field", "component": "field", "fieldId": "resume" },
          { "id": "cover_letter_field", "component": "field", "fieldId": "cover_letter" }
        ]
      },
      {
        "id": "preferences_section",
        "component": "container",
        "element": "div",
        "attributes": { "className": "mb-8" },
        "children": [
          { "id": "availability_field", "component": "field", "fieldId": "availability" },
          { "id": "remote_work_field", "component": "field", "fieldId": "remote_work" }
        ]
      }
    ]
  }
}
```

## Conditional Logic Examples

### Dynamic Survey Form

```json
{
  "formId": "customer-satisfaction",
  "name": "Customer Satisfaction Survey",
  "config": { "mode": "input" },
  "fields": [
    {
      "id": "customer_type",
      "name": "customer_type",
      "type": "radio",
      "label": "What type of customer are you?",
      "options": [
        { "label": "New customer (first purchase)", "value": "new" },
        { "label": "Returning customer", "value": "returning" },
        { "label": "Long-time customer (1+ years)", "value": "longtime" }
      ],
      "validation": { "required": true }
    },
    {
      "id": "first_impression",
      "name": "first_impression",
      "type": "rating",
      "label": "What was your first impression of our service?",
      "options": { "maxRating": 5 },
      "visibility": [
        { "field": "customer_type", "operator": "equals", "value": "new" }
      ],
      "validation": { "required": true }
    },
    {
      "id": "previous_experience",
      "name": "previous_experience",
      "type": "select",
      "label": "How would you rate your previous experiences?",
      "options": [
        { "label": "Excellent", "value": "excellent" },
        { "label": "Good", "value": "good" },
        { "label": "Fair", "value": "fair" },
        { "label": "Poor", "value": "poor" }
      ],
      "visibility": [
        {
          "field": "customer_type",
          "operator": "in_array",
          "value": ["returning", "longtime"]
        }
      ],
      "validation": { "required": true }
    },
    {
      "id": "improvement_areas",
      "name": "improvement_areas",
      "type": "checkbox",
      "label": "What areas could we improve?",
      "options": [
        { "label": "Customer service", "value": "service" },
        { "label": "Product quality", "value": "quality" },
        { "label": "Pricing", "value": "pricing" },
        { "label": "Delivery speed", "value": "delivery" },
        { "label": "Website/app experience", "value": "website" }
      ],
      "visibility": [
        {
          "field": "previous_experience",
          "operator": "in_array", 
          "value": ["fair", "poor"]
        }
      ]
    },
    {
      "id": "satisfaction_rating",
      "name": "satisfaction_rating",
      "type": "rating",
      "label": "Overall satisfaction rating",
      "options": { "maxRating": 10 },
      "validation": { "required": true }
    },
    {
      "id": "follow_up_reason",
      "name": "follow_up_reason",
      "type": "textarea",
      "label": "Please tell us more about your rating",
      "placeholder": "What made you give this rating?",
      "visibility": [
        {
          "conditions": [
            { "field": "satisfaction_rating", "operator": "less_than_or_equal", "value": "6" },
            { "field": "satisfaction_rating", "operator": "equals", "value": "10" }
          ],
          "logic": "OR"
        }
      ],
      "validation": { "required": true, "minLength": 20 }
    },
    {
      "id": "recommend_likelihood",
      "name": "recommend_likelihood", 
      "type": "rating",
      "label": "How likely are you to recommend us to others?",
      "instructions": "0 = Not at all likely, 10 = Extremely likely",
      "options": { "maxRating": 10 },
      "validation": { "required": true }
    },
    {
      "id": "testimonial_permission",
      "name": "testimonial_permission",
      "type": "checkbox",
      "label": "May we use your feedback as a testimonial?",
      "options": [
        { "label": "Yes, you may use my feedback publicly", "value": "yes" }
      ],
      "visibility": [
        { "field": "recommend_likelihood", "operator": "greater_than_or_equal", "value": "8" }
      ]
    },
    {
      "id": "contact_for_follow_up",
      "name": "contact_for_follow_up",
      "type": "radio",
      "label": "Would you like us to follow up with you?",
      "options": [
        { "label": "Yes, please contact me", "value": "yes" },
        { "label": "No, thank you", "value": "no" }
      ],
      "visibility": [
        { "field": "satisfaction_rating", "operator": "less_than_or_equal", "value": "7" }
      ]
    },
    {
      "id": "contact_email",
      "name": "contact_email",
      "type": "email",
      "label": "Email address for follow-up",
      "validation": { "required": true },
      "visibility": [
        { "field": "contact_for_follow_up", "operator": "equals", "value": "yes" }
      ]
    }
  ],
  "layoutDefinition": {
    "id": "root",
    "component": "container",
    "element": "div",
    "attributes": { "className": "max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg" },
    "children": [
      {
        "id": "header",
        "component": "container",
        "element": "div",
        "attributes": { "className": "text-center mb-8" },
        "children": [
          {
            "id": "title",
            "component": "container",
            "element": "h1", 
            "attributes": { "className": "text-3xl font-bold text-gray-900 mb-2" },
            "children": []
          },
          {
            "id": "subtitle",
            "component": "container",
            "element": "p",
            "attributes": { "className": "text-gray-600" },
            "children": []
          }
        ]
      },
      { "id": "customer_type_field", "component": "field", "fieldId": "customer_type" },
      { "id": "first_impression_field", "component": "field", "fieldId": "first_impression" },
      { "id": "previous_experience_field", "component": "field", "fieldId": "previous_experience" },
      { "id": "improvement_areas_field", "component": "field", "fieldId": "improvement_areas" },
      { "id": "satisfaction_rating_field", "component": "field", "fieldId": "satisfaction_rating" },
      { "id": "follow_up_reason_field", "component": "field", "fieldId": "follow_up_reason" },
      { "id": "recommend_likelihood_field", "component": "field", "fieldId": "recommend_likelihood" },
      { "id": "testimonial_permission_field", "component": "field", "fieldId": "testimonial_permission" },
      { "id": "contact_for_follow_up_field", "component": "field", "fieldId": "contact_for_follow_up" },
      { "id": "contact_email_field", "component": "field", "fieldId": "contact_email" }
    ]
  }
}
```

## Multi-Step Forms

### User Registration Wizard

```json
{
  "formId": "user-registration-wizard",
  "name": "User Registration",
  "config": { "mode": "input", "multiStep": true },
  "steps": [
    {
      "id": "step1",
      "title": "Account Information", 
      "description": "Create your account credentials"
    },
    {
      "id": "step2",
      "title": "Personal Details",
      "description": "Tell us about yourself"
    },
    {
      "id": "step3",
      "title": "Preferences",
      "description": "Customize your experience"
    },
    {
      "id": "step4", 
      "title": "Verification",
      "description": "Verify your information"
    }
  ],
  "fields": [
    {
      "id": "username",
      "name": "username",
      "type": "text",
      "label": "Username",
      "step": "step1",
      "validation": { 
        "required": true, 
        "minLength": 3,
        "pattern": "^[a-zA-Z0-9_]+$",
        "asyncRules": [{ "type": "unique_username" }]
      }
    },
    {
      "id": "email",
      "name": "email",
      "type": "email", 
      "label": "Email Address",
      "step": "step1",
      "validation": { 
        "required": true,
        "asyncRules": [{ "type": "unique_email" }]
      }
    },
    {
      "id": "password",
      "name": "password",
      "type": "password",
      "label": "Password",
      "step": "step1",
      "validation": {
        "required": true,
        "customRules": [{ "type": "strong_password" }]
      }
    },
    {
      "id": "confirm_password", 
      "name": "confirm_password",
      "type": "password",
      "label": "Confirm Password",
      "step": "step1",
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
      "id": "first_name",
      "name": "first_name",
      "type": "text",
      "label": "First Name",
      "step": "step2",
      "validation": { "required": true }
    },
    {
      "id": "last_name",
      "name": "last_name",
      "type": "text",
      "label": "Last Name", 
      "step": "step2",
      "validation": { "required": true }
    },
    {
      "id": "date_of_birth",
      "name": "date_of_birth",
      "type": "date",
      "label": "Date of Birth",
      "step": "step2",
      "validation": { 
        "required": true,
        "customRules": [{ "type": "minimum_age", "options": { "minAge": 13 } }]
      }
    },
    {
      "id": "phone",
      "name": "phone", 
      "type": "tel",
      "label": "Phone Number",
      "step": "step2",
      "validation": { "required": false }
    },
    {
      "id": "country",
      "name": "country",
      "type": "select",
      "label": "Country",
      "step": "step2",
      "options": [
        { "label": "United States", "value": "US" },
        { "label": "Canada", "value": "CA" },
        { "label": "United Kingdom", "value": "GB" },
        { "label": "Australia", "value": "AU" }
      ],
      "validation": { "required": true }
    },
    {
      "id": "theme",
      "name": "theme",
      "type": "radio",
      "label": "Preferred Theme",
      "step": "step3",
      "options": [
        { "label": "Light", "value": "light" },
        { "label": "Dark", "value": "dark" },
        { "label": "Auto (system)", "value": "auto" }
      ],
      "defaultValue": "auto"
    },
    {
      "id": "notifications",
      "name": "notifications",
      "type": "checkbox",
      "label": "Notification Preferences",
      "step": "step3", 
      "options": [
        { "label": "Email notifications", "value": "email" },
        { "label": "SMS notifications", "value": "sms" },
        { "label": "Push notifications", "value": "push" },
        { "label": "Marketing emails", "value": "marketing" }
      ]
    },
    {
      "id": "privacy_policy",
      "name": "privacy_policy",
      "type": "checkbox",
      "label": "Legal Agreements",
      "step": "step4",
      "options": [
        { "label": "I agree to the Privacy Policy", "value": "privacy" },
        { "label": "I agree to the Terms of Service", "value": "terms" }
      ],
      "validation": { "required": true }
    },
    {
      "id": "marketing_consent",
      "name": "marketing_consent",
      "type": "checkbox",
      "label": "Marketing Communications",
      "step": "step4",
      "options": [
        { "label": "I consent to receive marketing communications", "value": "consent" }
      ]
    }
  ],
  "layoutDefinition": {
    "id": "root",
    "component": "container",
    "customType": "wizard",
    "attributes": {
      "className": "max-w-2xl mx-auto",
      "steps": [
        {
          "id": "step1",
          "title": "Account Information",
          "description": "Create your account credentials",
          "fields": ["username", "email", "password", "confirm_password"]
        },
        {
          "id": "step2", 
          "title": "Personal Details",
          "description": "Tell us about yourself",
          "fields": ["first_name", "last_name", "date_of_birth", "phone", "country"]
        },
        {
          "id": "step3",
          "title": "Preferences", 
          "description": "Customize your experience",
          "fields": ["theme", "notifications"]
        },
        {
          "id": "step4",
          "title": "Verification",
          "description": "Verify your information",
          "fields": ["privacy_policy", "marketing_consent"]
        }
      ]
    },
    "children": []
  }
}
```

## Custom Field Examples

### Advanced Rating Component

```json
{
  "formId": "product-review",
  "name": "Product Review Form",
  "fields": [
    {
      "id": "overall_rating",
      "name": "overall_rating",
      "type": "rating",
      "label": "Overall Rating",
      "options": {
        "maxRating": 5,
        "allowHalf": true,
        "size": "large",
        "labels": ["Poor", "Fair", "Good", "Very Good", "Excellent"]
      },
      "validation": { "required": true }
    },
    {
      "id": "detailed_ratings",
      "name": "detailed_ratings",
      "type": "rating_grid",
      "label": "Rate Different Aspects",
      "options": {
        "aspects": [
          { "key": "quality", "label": "Quality" },
          { "key": "value", "label": "Value for Money" },
          { "key": "design", "label": "Design" },
          { "key": "usability", "label": "Ease of Use" }
        ],
        "maxRating": 5
      }
    }
  ]
}
```

### Color Picker Field

```json
{
  "formId": "theme-customizer",
  "name": "Theme Customization",
  "fields": [
    {
      "id": "primary_color",
      "name": "primary_color",
      "type": "color_picker",
      "label": "Primary Brand Color",
      "defaultValue": "#3b82f6",
      "options": {
        "format": "hex",
        "showAlpha": false,
        "presetColors": [
          "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"
        ]
      }
    },
    {
      "id": "secondary_color",
      "name": "secondary_color", 
      "type": "color_picker",
      "label": "Secondary Color",
      "defaultValue": "#64748b",
      "options": {
        "format": "rgba",
        "showAlpha": true
      }
    }
  ]
}
```

### File Upload with Preview

```json
{
  "formId": "profile-setup",
  "name": "Profile Setup",
  "fields": [
    {
      "id": "profile_photo",
      "name": "profile_photo",
      "type": "image_upload",
      "label": "Profile Photo",
      "options": {
        "maxFiles": 1,
        "maxSize": 2097152,
        "acceptedTypes": ["image/jpeg", "image/png", "image/webp"],
        "cropAspectRatio": "1:1",
        "showPreview": true,
        "resizeOptions": {
          "width": 400,
          "height": 400,
          "quality": 0.8
        }
      },
      "validation": { "required": true }
    },
    {
      "id": "documents",
      "name": "documents",
      "type": "file_upload",
      "label": "Supporting Documents",
      "options": {
        "maxFiles": 5,
        "maxSize": 10485760,
        "acceptedTypes": ["application/pdf", "image/*"],
        "showProgress": true,
        "enableDragDrop": true
      }
    }
  ]
}
```

## Layout Examples

### Dashboard-Style Layout

```json
{
  "layoutDefinition": {
    "id": "root",
    "component": "container",
    "element": "div",
    "attributes": { "className": "min-h-screen bg-gray-50 p-6" },
    "children": [
      {
        "id": "header",
        "component": "container",
        "element": "div",
        "attributes": { "className": "mb-8 text-center" },
        "children": [
          {
            "id": "title",
            "component": "container",
            "element": "h1",
            "attributes": { "className": "text-4xl font-bold text-gray-900 mb-2" },
            "children": []
          }
        ]
      },
      {
        "id": "main_grid",
        "component": "container",
        "element": "div", 
        "attributes": { "className": "grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto" },
        "children": [
          {
            "id": "left_panel",
            "component": "container",
            "element": "div",
            "attributes": { "className": "lg:col-span-2 bg-white rounded-lg shadow p-6" },
            "children": [
              { "id": "field1", "component": "field", "fieldId": "field1" },
              { "id": "field2", "component": "field", "fieldId": "field2" }
            ]
          },
          {
            "id": "right_panel",
            "component": "container",
            "element": "div",
            "attributes": { "className": "bg-white rounded-lg shadow p-6" },
            "children": [
              { "id": "field3", "component": "field", "fieldId": "field3" }
            ]
          }
        ]
      }
    ]
  }
}
```

### Card-Based Layout

```json
{
  "layoutDefinition": {
    "id": "root",
    "component": "container", 
    "element": "div",
    "attributes": { "className": "max-w-4xl mx-auto p-6" },
    "children": [
      {
        "id": "cards_container",
        "component": "container",
        "element": "div",
        "attributes": { "className": "grid grid-cols-1 md:grid-cols-2 gap-6" },
        "children": [
          {
            "id": "card1",
            "component": "container",
            "element": "div",
            "attributes": { "className": "bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500" },
            "children": [
              {
                "id": "card1_header",
                "component": "container",
                "element": "h3",
                "attributes": { "className": "text-lg font-semibold text-gray-900 mb-4" },
                "children": []
              },
              { "id": "field1", "component": "field", "fieldId": "field1" },
              { "id": "field2", "component": "field", "fieldId": "field2" }
            ]
          },
          {
            "id": "card2",
            "component": "container", 
            "element": "div",
            "attributes": { "className": "bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500" },
            "children": [
              {
                "id": "card2_header",
                "component": "container",
                "element": "h3", 
                "attributes": { "className": "text-lg font-semibold text-gray-900 mb-4" },
                "children": []
              },
              { "id": "field3", "component": "field", "fieldId": "field3" }
            ]
          }
        ]
      }
    ]
  }
}
```

## Validation Examples

### Complex Cross-Field Validation

```json
{
  "fields": [
    {
      "id": "start_date",
      "name": "start_date",
      "type": "date",
      "label": "Start Date",
      "validation": { "required": true }
    },
    {
      "id": "end_date",
      "name": "end_date",
      "type": "date", 
      "label": "End Date",
      "validation": {
        "required": true,
        "customRules": [
          {
            "type": "date_after",
            "options": { "afterField": "start_date" },
            "message": "End date must be after start date"
          }
        ]
      }
    },
    {
      "id": "duration",
      "name": "duration",
      "type": "number",
      "label": "Duration (days)",
      "validation": {
        "customRules": [
          {
            "type": "calculated_field",
            "options": {
              "calculation": "daysBetween(start_date, end_date)",
              "tolerance": 1
            }
          }
        ]
      }
    }
  ]
}
```

### Real-time Validation

```json
{
  "fields": [
    {
      "id": "username",
      "name": "username",
      "type": "text",
      "label": "Username",
      "validation": {
        "required": true,
        "minLength": 3,
        "pattern": "^[a-zA-Z0-9_]+$",
        "asyncRules": [
          {
            "type": "username_availability",
            "debounceMs": 500,
            "endpoint": "/api/validate/username"
          }
        ]
      }
    },
    {
      "id": "domain_name",
      "name": "domain_name",
      "type": "text",
      "label": "Domain Name",
      "validation": {
        "required": true,
        "asyncRules": [
          {
            "type": "domain_availability",
            "debounceMs": 1000,
            "endpoint": "/api/validate/domain"
          }
        ]
      }
    }
  ]
}
```

## Real-World Use Cases

### E-commerce Checkout Form

```json
{
  "formId": "checkout-form",
  "name": "Checkout",
  "config": { "mode": "input" },
  "fields": [
    {
      "id": "billing_address",
      "name": "billing_address",
      "type": "address",
      "label": "Billing Address",
      "validation": { "required": true },
      "options": {
        "enableAutocomplete": true,
        "validateAddress": true
      }
    },
    {
      "id": "same_as_billing",
      "name": "same_as_billing",
      "type": "checkbox",
      "label": "Shipping address same as billing",
      "options": [
        { "label": "Use billing address for shipping", "value": "yes" }
      ]
    },
    {
      "id": "shipping_address",
      "name": "shipping_address",
      "type": "address",
      "label": "Shipping Address",
      "visibility": [
        { "field": "same_as_billing", "operator": "not_contains", "value": "yes" }
      ],
      "validation": { "required": true }
    },
    {
      "id": "payment_method",
      "name": "payment_method",
      "type": "radio",
      "label": "Payment Method",
      "options": [
        { "label": "Credit Card", "value": "credit_card" },
        { "label": "PayPal", "value": "paypal" },
        { "label": "Apple Pay", "value": "apple_pay" }
      ],
      "validation": { "required": true }
    },
    {
      "id": "credit_card_details",
      "name": "credit_card_details",
      "type": "credit_card",
      "label": "Credit Card Information",
      "visibility": [
        { "field": "payment_method", "operator": "equals", "value": "credit_card" }
      ],
      "validation": { "required": true },
      "options": {
        "enableCardDetection": true,
        "secureInput": true
      }
    }
  ]
}
```

### Event Registration Form

```json
{
  "formId": "event-registration",
  "name": "Conference Registration", 
  "fields": [
    {
      "id": "ticket_type",
      "name": "ticket_type",
      "type": "radio",
      "label": "Ticket Type",
      "options": [
        { "label": "Early Bird ($199)", "value": "early_bird" },
        { "label": "Regular ($299)", "value": "regular" },
        { "label": "Student ($99)", "value": "student" },
        { "label": "VIP ($499)", "value": "vip" }
      ],
      "validation": { "required": true }
    },
    {
      "id": "student_id",
      "name": "student_id",
      "type": "text",
      "label": "Student ID",
      "visibility": [
        { "field": "ticket_type", "operator": "equals", "value": "student" }
      ],
      "validation": { "required": true }
    },
    {
      "id": "dietary_restrictions",
      "name": "dietary_restrictions",
      "type": "select",
      "label": "Dietary Restrictions",
      "options": [
        { "label": "None", "value": "none" },
        { "label": "Vegetarian", "value": "vegetarian" },
        { "label": "Vegan", "value": "vegan" },
        { "label": "Gluten-free", "value": "gluten_free" },
        { "label": "Other", "value": "other" }
      ]
    },
    {
      "id": "other_dietary",
      "name": "other_dietary",
      "type": "text",
      "label": "Please specify",
      "visibility": [
        { "field": "dietary_restrictions", "operator": "equals", "value": "other" }
      ],
      "validation": { "required": true }
    },
    {
      "id": "sessions",
      "name": "sessions",
      "type": "checkbox",
      "label": "Select Sessions to Attend",
      "options": [
        { "label": "Keynote: Future of Technology", "value": "keynote" },
        { "label": "Workshop: React Best Practices", "value": "react_workshop" },
        { "label": "Panel: AI in Development", "value": "ai_panel" },
        { "label": "Workshop: Advanced CSS", "value": "css_workshop" }
      ],
      "validation": { 
        "customRules": [
          { "type": "min_selections", "options": { "min": 1 } }
        ]
      }
    }
  ]
}
```

These examples demonstrate the flexibility and power of Form-Titan's JSON-driven approach, showing how complex forms with conditional logic, validation, and custom layouts can be created through configuration alone.