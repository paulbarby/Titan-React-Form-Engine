# 📚 Form-Titan API Documentation

This document provides comprehensive documentation for the Form-Titan backend API endpoints, data models, and integration patterns.

## Table of Contents

- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Form Definition Endpoints](#form-definition-endpoints)
- [Form Submission Endpoints](#form-submission-endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Webhooks](#webhooks)
- [SDK Examples](#sdk-examples)

## API Overview

The Form-Titan API is built with FastAPI and follows RESTful principles. All endpoints return JSON responses and use standard HTTP status codes.

**Base URL**: `https://your-domain.com/api`

**API Version**: `v1` (current)

**Content Type**: `application/json`

## Authentication

### API Key Authentication

```http
Authorization: Bearer YOUR_API_KEY
```

### JWT Authentication

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Example Request

```bash
curl -X GET "https://your-domain.com/api/forms/contact-us-v1" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

## Form Definition Endpoints

### GET /forms/{form_id}

Retrieves a complete form definition including fields, layout, and configuration.

**Parameters:**
- `form_id` (path, required): Unique identifier for the form

**Response:**
```json
{
  "formId": "contact-us-v1",
  "name": "Contact Us Form",
  "config": {
    "mode": "input"
  },
  "fields": [
    {
      "id": "first_name",
      "name": "first_name",
      "type": "text",
      "label": "First Name",
      "placeholder": "Enter your first name",
      "validation": {
        "required": true,
        "minLength": 2
      }
    }
  ],
  "layoutDefinition": {
    "id": "root",
    "component": "container",
    "element": "div",
    "attributes": {
      "className": "max-w-2xl mx-auto p-6"
    },
    "children": []
  }
}
```

**Status Codes:**
- `200 OK`: Form definition retrieved successfully
- `404 Not Found`: Form with specified ID not found
- `401 Unauthorized`: Invalid or missing authentication
- `403 Forbidden`: Insufficient permissions

### PUT /forms/{form_id}

Updates an existing form definition (Edit Mode).

**Parameters:**
- `form_id` (path, required): Unique identifier for the form

**Request Body:**
```json
{
  "formId": "contact-us-v1",
  "name": "Updated Contact Form",
  "config": {
    "mode": "edit"
  },
  "fields": [...],
  "layoutDefinition": {...}
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Form definition updated successfully",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `200 OK`: Form updated successfully
- `400 Bad Request`: Invalid form definition schema
- `404 Not Found`: Form not found
- `422 Unprocessable Entity`: Validation errors

### POST /forms

Creates a new form definition.

**Request Body:**
```json
{
  "name": "New Survey Form",
  "config": {
    "mode": "input"
  },
  "fields": [...],
  "layoutDefinition": {...}
}
```

**Response:**
```json
{
  "formId": "new-survey-v1",
  "status": "created",
  "message": "Form created successfully"
}
```

### DELETE /forms/{form_id}

Deletes a form definition and all associated submissions.

**Response:**
```json
{
  "status": "deleted",
  "message": "Form and all submissions deleted successfully"
}
```

## Form Submission Endpoints

### POST /forms/{form_id}/submissions

Submits form data for processing.

**Parameters:**
- `form_id` (path, required): Unique identifier for the form

**Request Body:**
```json
{
  "data": {
    "first_name": "John",
    "last_name": "Doe", 
    "email": "john.doe@example.com",
    "message": "Hello, this is a test message"
  },
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "referrer": "https://example.com/contact",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Response:**
```json
{
  "submissionId": "sub-uuid-12345",
  "status": "success",
  "message": "Your submission has been received successfully!",
  "submittedAt": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `201 Created`: Submission processed successfully
- `400 Bad Request`: Validation errors or malformed data
- `404 Not Found`: Form not found
- `429 Too Many Requests`: Rate limit exceeded

### GET /forms/{form_id}/submissions

Retrieves submissions for a specific form (Admin access required).

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of submissions per page (default: 50, max: 100)
- `sort` (optional): Sort field (default: createdAt)
- `order` (optional): Sort order - `asc` or `desc` (default: desc)
- `startDate` (optional): Filter submissions after this date
- `endDate` (optional): Filter submissions before this date

**Response:**
```json
{
  "submissions": [
    {
      "submissionId": "sub-uuid-12345",
      "formId": "contact-us-v1",
      "data": {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com"
      },
      "metadata": {
        "userAgent": "Mozilla/5.0...",
        "ipAddress": "192.168.1.1",
        "submittedAt": "2024-01-15T10:30:00Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

### GET /forms/{form_id}/submissions/{submission_id}

Retrieves a specific submission.

**Response:**
```json
{
  "submissionId": "sub-uuid-12345",
  "formId": "contact-us-v1",
  "data": {...},
  "metadata": {...},
  "status": "processed",
  "processedAt": "2024-01-15T10:35:00Z"
}
```

### PUT /forms/{form_id}/submissions/{submission_id}

Updates a submission status or data (Admin access required).

**Request Body:**
```json
{
  "status": "reviewed",
  "notes": "Reviewed and approved",
  "data": {
    "updated_field": "new_value"
  }
}
```

## Data Models

### FieldDefinition

```typescript
interface FieldDefinition {
  id: string;                    // Unique field identifier
  name: string;                  // Field name for form data
  type: FieldType;              // Field type (text, email, select, etc.)
  label: string;                // Display label
  placeholder?: string;         // Placeholder text
  instructions?: string;        // Help text
  defaultValue?: any;          // Default field value
  options?: FieldOption[];     // Options for select/radio fields
  validation?: ValidationRules; // Validation configuration
  visibility?: VisibilityRule[]; // Conditional visibility rules
}
```

### FieldType

```typescript
type FieldType = 
  | 'text'
  | 'email' 
  | 'tel'
  | 'password'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'datetime'
  | 'number'
  | 'file'
  | 'url'
  | 'color'
  | 'range';
```

### ValidationRules

```typescript
interface ValidationRules {
  required?: boolean;           // Field is required
  minLength?: number;          // Minimum string length
  maxLength?: number;          // Maximum string length
  pattern?: string;            // Regex pattern
  min?: number;               // Minimum numeric value
  max?: number;               // Maximum numeric value
  customRules?: CustomRule[]; // Custom validation rules
  asyncRules?: AsyncRule[];   // Async validation rules
  crossField?: CrossFieldRule; // Cross-field validation
}
```

### VisibilityRule

```typescript
interface VisibilityRule {
  field: string;              // Target field name
  operator: VisibilityOperator; // Comparison operator
  value: any;                 // Comparison value
  conditions?: VisibilityRule[]; // Nested conditions
  logic?: 'AND' | 'OR' | 'NOT'; // Logic for multiple conditions
}

type VisibilityOperator = 
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'is_empty'
  | 'is_not_empty'
  | 'in_array'
  | 'not_in_array'
  | 'regex_match';
```

### LayoutNode

```typescript
interface LayoutNode {
  id: string;                   // Unique node identifier
  component: 'container' | 'field'; // Node type
  element?: string;             // HTML element (for containers)
  attributes?: Record<string, any>; // HTML attributes
  children?: LayoutNode[];      // Child nodes (recursive)
  fieldId?: string;            // Field ID (for field nodes)
  customType?: string;         // Custom component type
}
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for one or more fields",
    "details": {
      "first_name": ["Field is required"],
      "email": ["Invalid email format"]
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req-uuid-67890"
  }
}
```

### Error Codes

| Code | Description | Status Code |
|------|-------------|-------------|
| `FORM_NOT_FOUND` | Form with specified ID not found | 404 |
| `VALIDATION_ERROR` | Form validation failed | 400 |
| `AUTHENTICATION_REQUIRED` | Missing or invalid authentication | 401 |
| `PERMISSION_DENIED` | Insufficient permissions | 403 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `INTERNAL_SERVER_ERROR` | Server error | 500 |
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable | 503 |

### Validation Error Details

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fieldName": {
        "rule": "required",
        "message": "This field is required",
        "value": null
      },
      "email": {
        "rule": "pattern", 
        "message": "Invalid email format",
        "value": "invalid-email",
        "pattern": "^[^@]+@[^@]+\\.[^@]+$"
      }
    }
  }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

**Limits:**
- Form submissions: 100 requests per hour per IP
- Form definition requests: 1000 requests per hour per API key
- Admin operations: 500 requests per hour per user

**Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1642247400
```

**Rate Limit Exceeded Response:**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 3600 seconds.",
    "retryAfter": 3600
  }
}
```

## Webhooks

Form-Titan supports webhooks for real-time notifications of form submissions and other events.

### Webhook Configuration

```json
{
  "webhookUrl": "https://your-domain.com/webhook",
  "events": ["form.submitted", "form.updated"],
  "secret": "webhook-secret-key",
  "active": true
}
```

### Webhook Payload

```json
{
  "event": "form.submitted",
  "timestamp": "2024-01-15T10:30:00Z",
  "formId": "contact-us-v1",
  "submissionId": "sub-uuid-12345",
  "data": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  },
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "ipAddress": "192.168.1.1"
  }
}
```

### Webhook Signature Verification

```python
import hmac
import hashlib

def verify_webhook_signature(payload, signature, secret):
    """Verify webhook signature"""
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(f"sha256={expected_signature}", signature)
```

## SDK Examples

### Python SDK

```python
from form_titan import FormTitanClient

# Initialize client
client = FormTitanClient(
    api_key="your-api-key",
    base_url="https://your-domain.com/api"
)

# Get form definition
form = client.forms.get("contact-us-v1")

# Submit form data
submission = client.submissions.create(
    form_id="contact-us-v1",
    data={
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com"
    }
)

# Get submissions
submissions = client.submissions.list(
    form_id="contact-us-v1",
    page=1,
    limit=50
)
```

### JavaScript SDK

```javascript
import { FormTitanClient } from 'form-titan-js';

// Initialize client
const client = new FormTitanClient({
  apiKey: 'your-api-key',
  baseURL: 'https://your-domain.com/api'
});

// Get form definition
const form = await client.forms.get('contact-us-v1');

// Submit form data
const submission = await client.submissions.create('contact-us-v1', {
  first_name: 'John',
  last_name: 'Doe', 
  email: 'john.doe@example.com'
});

// Get submissions with pagination
const submissions = await client.submissions.list('contact-us-v1', {
  page: 1,
  limit: 50,
  sort: 'createdAt',
  order: 'desc'
});
```

### cURL Examples

#### Get Form Definition
```bash
curl -X GET "https://your-domain.com/api/forms/contact-us-v1" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

#### Submit Form Data
```bash
curl -X POST "https://your-domain.com/api/forms/contact-us-v1/submissions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "message": "Hello from cURL!"
    }
  }'
```

#### Get Submissions
```bash
curl -X GET "https://your-domain.com/api/forms/contact-us-v1/submissions?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### Postman Collection

A complete Postman collection is available for testing all API endpoints:

```json
{
  "info": {
    "name": "Form-Titan API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{API_KEY}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "BASE_URL",
      "value": "https://your-domain.com/api"
    },
    {
      "key": "API_KEY", 
      "value": "your-api-key"
    }
  ]
}
```

This API documentation provides everything needed to integrate with Form-Titan programmatically, whether you're building a frontend application, setting up webhooks, or creating custom integrations.