# ⚙️ Form-Titan Configuration Guide

This guide covers all configuration options for Form-Titan, from environment setup to advanced customization settings.

## Table of Contents

- [Environment Setup](#environment-setup)
- [Backend Configuration](#backend-configuration)
- [Frontend Configuration](#frontend-configuration)
- [Database Configuration](#database-configuration)
- [API Configuration](#api-configuration)
- [Security Configuration](#security-configuration)
- [Performance Configuration](#performance-configuration)
- [Deployment Configuration](#deployment-configuration)

## Environment Setup

### Development Environment

Create environment files for both frontend and backend:

#### Frontend Environment (.env)

```bash
# /app/frontend/.env

# Development settings
NODE_ENV=development
REACT_APP_ENV=development

# API Configuration
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_API_VERSION=v1
REACT_APP_API_TIMEOUT=10000

# Feature Flags
REACT_APP_ENABLE_DEBUG=true
REACT_APP_ENABLE_HOT_RELOAD=true
REACT_APP_ENABLE_ANALYTICS=false

# Form Configuration
REACT_APP_DEFAULT_FORM_THEME=light
REACT_APP_MAX_FILE_SIZE=5242880
REACT_APP_SUPPORTED_LANGUAGES=en,es,fr,de

# Third-party Services
REACT_APP_GOOGLE_ANALYTICS_ID=
REACT_APP_SENTRY_DSN=
REACT_APP_STRIPE_PUBLIC_KEY=

# Validation Settings
REACT_APP_ENABLE_REAL_TIME_VALIDATION=true
REACT_APP_DEBOUNCE_DELAY=300
REACT_APP_VALIDATION_TIMEOUT=5000

# Cache Settings
REACT_APP_CACHE_FORMS=true
REACT_APP_CACHE_DURATION=300000

# Accessibility
REACT_APP_ENABLE_A11Y=true
REACT_APP_HIGH_CONTRAST_MODE=false
```

#### Backend Environment (.env)

```bash
# /app/backend/.env

# Application Settings
APP_NAME=Form-Titan
APP_VERSION=1.0.0
DEBUG=true
LOG_LEVEL=INFO

# Database Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=form_titan_dev
DB_POOL_SIZE=10
DB_TIMEOUT=30

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_PREFIX=/api
API_VERSION=v1

# CORS Settings
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001"]
CORS_METHODS=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
CORS_HEADERS=["*"]
CORS_CREDENTIALS=true

# Security Settings
SECRET_KEY=your-super-secret-key-change-in-production
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION=3600
ENCRYPTION_KEY=your-encryption-key

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600
RATE_LIMIT_STORAGE=memory

# File Upload Settings
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/tmp/uploads
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png,gif

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@form-titan.com

# Webhook Settings
WEBHOOK_TIMEOUT=30
WEBHOOK_RETRY_ATTEMPTS=3
WEBHOOK_SECRET=webhook-secret-key

# Monitoring & Analytics
SENTRY_DSN=
ANALYTICS_ENABLED=false
METRICS_ENABLED=true

# Cache Configuration
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
CACHE_ENABLED=true

# Background Jobs
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

### Production Environment

#### Frontend Production (.env.production)

```bash
# Production settings
NODE_ENV=production
REACT_APP_ENV=production

# API Configuration
REACT_APP_BACKEND_URL=https://api.your-domain.com
REACT_APP_API_VERSION=v1
REACT_APP_API_TIMEOUT=15000

# Feature Flags
REACT_APP_ENABLE_DEBUG=false
REACT_APP_ENABLE_HOT_RELOAD=false
REACT_APP_ENABLE_ANALYTICS=true

# Security
REACT_APP_CSP_ENABLED=true
REACT_APP_HTTPS_ONLY=true

# Performance
REACT_APP_ENABLE_SERVICE_WORKER=true
REACT_APP_ENABLE_CODE_SPLITTING=true
REACT_APP_ENABLE_GZIP=true

# Monitoring
REACT_APP_GOOGLE_ANALYTICS_ID=GA-XXXXX-X
REACT_APP_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# CDN Settings
REACT_APP_CDN_URL=https://cdn.your-domain.com
REACT_APP_STATIC_URL=https://static.your-domain.com
```

#### Backend Production (.env.production)

```bash
# Application Settings
APP_NAME=Form-Titan
APP_VERSION=1.0.0
DEBUG=false
LOG_LEVEL=ERROR

# Database Configuration
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net
DB_NAME=form_titan_prod
DB_POOL_SIZE=50
DB_TIMEOUT=30

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_WORKERS=4

# Security Settings
SECRET_KEY=production-secret-key-very-long-and-secure
JWT_SECRET=production-jwt-secret
JWT_EXPIRATION=3600
HTTPS_ONLY=true

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=1000
RATE_LIMIT_WINDOW=3600
RATE_LIMIT_STORAGE=redis

# Monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
ANALYTICS_ENABLED=true
METRICS_ENABLED=true

# Cache Configuration
REDIS_URL=redis://prod-redis.cache.amazonaws.com:6379
CACHE_TTL=3600
CACHE_ENABLED=true
```

## Backend Configuration

### FastAPI Application Configuration

```python
# /app/backend/config.py

import os
from typing import List, Optional
from pydantic import BaseSettings, validator

class Settings(BaseSettings):
    # Application
    app_name: str = "Form-Titan"
    app_version: str = "1.0.0"
    debug: bool = False
    log_level: str = "INFO"
    
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_prefix: str = "/api"
    api_version: str = "v1"
    api_workers: int = 1
    
    # Database
    mongo_url: str
    db_name: str
    db_pool_size: int = 10
    db_timeout: int = 30
    
    # Security
    secret_key: str
    jwt_secret: str
    jwt_expiration: int = 3600
    encryption_key: Optional[str] = None
    https_only: bool = False
    
    # CORS
    cors_origins: List[str] = ["*"]
    cors_methods: List[str] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    cors_headers: List[str] = ["*"]
    cors_credentials: bool = True
    
    # Rate Limiting
    rate_limit_enabled: bool = True
    rate_limit_requests: int = 100
    rate_limit_window: int = 3600
    rate_limit_storage: str = "memory"
    
    # File Upload
    max_file_size: int = 10485760  # 10MB
    upload_path: str = "/tmp/uploads"
    allowed_file_types: List[str] = ["pdf", "doc", "docx", "jpg", "jpeg", "png", "gif"]
    
    # Email
    smtp_host: Optional[str] = None
    smtp_port: int = 587
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    email_from: str = "noreply@form-titan.com"
    
    # Webhooks
    webhook_timeout: int = 30
    webhook_retry_attempts: int = 3
    webhook_secret: Optional[str] = None
    
    # Cache
    redis_url: Optional[str] = None
    cache_ttl: int = 3600
    cache_enabled: bool = False
    
    # Monitoring
    sentry_dsn: Optional[str] = None
    analytics_enabled: bool = False
    metrics_enabled: bool = True
    
    @validator('cors_origins', pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',')]
        return v
    
    @validator('allowed_file_types', pre=True)
    def parse_file_types(cls, v):
        if isinstance(v, str):
            return [file_type.strip() for file_type in v.split(',')]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()
```

### Application Factory

```python
# /app/backend/app.py

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import logging
import time

from .config import settings
from .middleware import RateLimitMiddleware, LoggingMiddleware
from .routes import api_router

def create_app() -> FastAPI:
    """Create and configure FastAPI application"""
    
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        debug=settings.debug,
        docs_url="/docs" if settings.debug else None,
        redoc_url="/redoc" if settings.debug else None
    )
    
    # Configure logging
    logging.basicConfig(
        level=getattr(logging, settings.log_level),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Add middleware
    setup_middleware(app)
    
    # Add routes
    app.include_router(api_router, prefix=settings.api_prefix)
    
    # Add event handlers
    setup_event_handlers(app)
    
    return app

def setup_middleware(app: FastAPI):
    """Configure application middleware"""
    
    # Security middleware
    if settings.https_only:
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=["*"]  # Configure based on your domain
        )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=settings.cors_credentials,
        allow_methods=settings.cors_methods,
        allow_headers=settings.cors_headers,
    )
    
    # Compression middleware
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    
    # Custom middleware
    app.add_middleware(LoggingMiddleware)
    
    if settings.rate_limit_enabled:
        app.add_middleware(
            RateLimitMiddleware,
            requests=settings.rate_limit_requests,
            window=settings.rate_limit_window,
            storage=settings.rate_limit_storage
        )

def setup_event_handlers(app: FastAPI):
    """Setup application event handlers"""
    
    @app.on_event("startup")
    async def startup_event():
        """Application startup handler"""
        logging.info(f"Starting {settings.app_name} v{settings.app_version}")
        
        # Initialize database connection
        await init_database()
        
        # Initialize cache
        if settings.cache_enabled:
            await init_cache()
        
        # Initialize monitoring
        if settings.sentry_dsn:
            init_sentry()
    
    @app.on_event("shutdown") 
    async def shutdown_event():
        """Application shutdown handler"""
        logging.info("Shutting down application")
        
        # Close database connections
        await close_database()
        
        # Close cache connections
        if settings.cache_enabled:
            await close_cache()

# Create app instance
app = create_app()
```

## Frontend Configuration

### React Configuration

```javascript
// /app/frontend/src/config/app.js

const config = {
  // Environment
  env: process.env.REACT_APP_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000',
    version: process.env.REACT_APP_API_VERSION || 'v1',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  },
  
  // Form Configuration
  forms: {
    defaultTheme: process.env.REACT_APP_DEFAULT_FORM_THEME || 'light',
    maxFileSize: parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 5242880,
    supportedLanguages: (process.env.REACT_APP_SUPPORTED_LANGUAGES || 'en').split(','),
    enableRealTimeValidation: process.env.REACT_APP_ENABLE_REAL_TIME_VALIDATION === 'true',
    debounceDelay: parseInt(process.env.REACT_APP_DEBOUNCE_DELAY) || 300,
    validationTimeout: parseInt(process.env.REACT_APP_VALIDATION_TIMEOUT) || 5000,
  },
  
  // Cache Configuration
  cache: {
    enabled: process.env.REACT_APP_CACHE_FORMS === 'true',
    duration: parseInt(process.env.REACT_APP_CACHE_DURATION) || 300000,
  },
  
  // Feature Flags
  features: {
    enableDebug: process.env.REACT_APP_ENABLE_DEBUG === 'true',
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    enableA11y: process.env.REACT_APP_ENABLE_A11Y === 'true',
    highContrastMode: process.env.REACT_APP_HIGH_CONTRAST_MODE === 'true',
  },
  
  // Third-party Services
  services: {
    googleAnalyticsId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
    sentryDsn: process.env.REACT_APP_SENTRY_DSN,
    stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
  },
  
  // CDN Configuration
  cdn: {
    url: process.env.REACT_APP_CDN_URL,
    staticUrl: process.env.REACT_APP_STATIC_URL,
  },
  
  // Performance
  performance: {
    enableServiceWorker: process.env.REACT_APP_ENABLE_SERVICE_WORKER === 'true',
    enableCodeSplitting: process.env.REACT_APP_ENABLE_CODE_SPLITTING === 'true',
    enableGzip: process.env.REACT_APP_ENABLE_GZIP === 'true',
  },
};

export default config;
```

### Tailwind CSS Configuration

```javascript
// /app/frontend/tailwind.config.js

const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Form-Titan brand colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: colors.gray,
        success: colors.green,
        warning: colors.amber,
        error: colors.red,
        info: colors.blue,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'form': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'form-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
  // Form-Titan specific utilities
  safelist: [
    // Dynamic field type classes
    'form-field-text',
    'form-field-email', 
    'form-field-select',
    'form-field-textarea',
    'form-field-checkbox',
    'form-field-radio',
    'form-field-date',
    'form-field-file',
    // Validation state classes
    'border-red-500',
    'border-green-500',
    'text-red-500',
    'text-green-500',
    'bg-red-50',
    'bg-green-50',
    // Theme classes
    'theme-light',
    'theme-dark',
    'theme-auto',
  ],
};
```

## Database Configuration

### MongoDB Configuration

```python
# /app/backend/database.py

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import IndexModel, ASCENDING, DESCENDING
import logging
from .config import settings

class Database:
    client: AsyncIOMotorClient = None
    database: AsyncIOMotorDatabase = None

database = Database()

async def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return database.database

async def init_database():
    """Initialize database connection and indexes"""
    try:
        # Create MongoDB client
        database.client = AsyncIOMotorClient(
            settings.mongo_url,
            maxPoolSize=settings.db_pool_size,
            serverSelectionTimeoutMS=settings.db_timeout * 1000
        )
        
        # Get database
        database.database = database.client[settings.db_name]
        
        # Test connection
        await database.client.admin.command('ping')
        logging.info("Connected to MongoDB successfully")
        
        # Create indexes
        await create_indexes()
        
    except Exception as e:
        logging.error(f"Failed to connect to MongoDB: {e}")
        raise

async def close_database():
    """Close database connection"""
    if database.client:
        database.client.close()
        logging.info("Disconnected from MongoDB")

async def create_indexes():
    """Create database indexes for optimal performance"""
    
    # Form definitions collection
    await database.database.form_definitions.create_indexes([
        IndexModel([("formId", ASCENDING)], unique=True),
        IndexModel([("createdAt", DESCENDING)]),
        IndexModel([("updatedAt", DESCENDING)]),
    ])
    
    # Form submissions collection
    await database.database.form_submissions.create_indexes([
        IndexModel([("formId", ASCENDING)]),
        IndexModel([("submissionId", ASCENDING)], unique=True),
        IndexModel([("submittedAt", DESCENDING)]),
        IndexModel([("formId", ASCENDING), ("submittedAt", DESCENDING)]),
        IndexModel([("status", ASCENDING)]),
    ])
    
    # Users collection (if using authentication)
    await database.database.users.create_indexes([
        IndexModel([("email", ASCENDING)], unique=True),
        IndexModel([("username", ASCENDING)], unique=True, sparse=True),
        IndexModel([("createdAt", DESCENDING)]),
    ])
    
    # API keys collection
    await database.database.api_keys.create_indexes([
        IndexModel([("keyId", ASCENDING)], unique=True),
        IndexModel([("userId", ASCENDING)]),
        IndexModel([("createdAt", DESCENDING)]),
        IndexModel([("expiresAt", ASCENDING)], expireAfterSeconds=0),
    ])
    
    logging.info("Database indexes created successfully")
```

### Database Schemas

```python
# /app/backend/schemas.py

from pydantic import BaseModel, Field, validator
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum

class FormStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    INACTIVE = "inactive"
    ARCHIVED = "archived"

class SubmissionStatus(str, Enum):
    PENDING = "pending"
    PROCESSED = "processed"
    FAILED = "failed"
    SPAM = "spam"

class FormDefinitionDB(BaseModel):
    """Database model for form definitions"""
    id: Optional[str] = Field(alias="_id")
    formId: str = Field(..., description="Unique form identifier")
    name: str = Field(..., description="Form display name")
    description: Optional[str] = None
    config: Dict[str, Any] = Field(default_factory=dict)
    fields: List[Dict[str, Any]] = Field(default_factory=list)
    layoutDefinition: Dict[str, Any] = Field(default_factory=dict)
    status: FormStatus = FormStatus.ACTIVE
    version: int = Field(default=1, description="Form version number")
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    createdBy: Optional[str] = None
    updatedBy: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        allow_population_by_field_name = True

class FormSubmissionDB(BaseModel):
    """Database model for form submissions"""
    id: Optional[str] = Field(alias="_id")
    submissionId: str = Field(..., description="Unique submission identifier")
    formId: str = Field(..., description="Form identifier")
    data: Dict[str, Any] = Field(..., description="Submitted form data")
    status: SubmissionStatus = SubmissionStatus.PENDING
    submittedAt: datetime = Field(default_factory=datetime.utcnow)
    processedAt: Optional[datetime] = None
    ipAddress: Optional[str] = None
    userAgent: Optional[str] = None
    referrer: Optional[str] = None
    sessionId: Optional[str] = None
    userId: Optional[str] = None
    validationErrors: List[Dict[str, Any]] = Field(default_factory=list)
    webhookDeliveries: List[Dict[str, Any]] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        allow_population_by_field_name = True
```

## API Configuration

### Rate Limiting Configuration

```python
# /app/backend/middleware/rate_limit.py

from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import time
import asyncio
from typing import Dict, Optional
import redis
import json

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app,
        requests: int = 100,
        window: int = 3600,
        storage: str = "memory",
        redis_url: Optional[str] = None
    ):
        super().__init__(app)
        self.requests = requests
        self.window = window
        self.storage = storage
        
        if storage == "redis" and redis_url:
            self.redis_client = redis.from_url(redis_url)
        else:
            self.redis_client = None
            self.memory_store: Dict[str, Dict] = {}
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for certain endpoints
        if self._should_skip_rate_limiting(request):
            return await call_next(request)
        
        client_id = self._get_client_id(request)
        
        # Check rate limit
        if await self._is_rate_limited(client_id):
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded",
                headers={
                    "X-RateLimit-Limit": str(self.requests),
                    "X-RateLimit-Window": str(self.window),
                    "Retry-After": str(self.window)
                }
            )
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers
        limit_info = await self._get_limit_info(client_id)
        response.headers["X-RateLimit-Limit"] = str(self.requests)
        response.headers["X-RateLimit-Remaining"] = str(limit_info["remaining"])
        response.headers["X-RateLimit-Reset"] = str(limit_info["reset"])
        
        return response
    
    def _should_skip_rate_limiting(self, request: Request) -> bool:
        """Check if request should skip rate limiting"""
        skip_paths = ["/health", "/metrics", "/docs", "/redoc"]
        return any(request.url.path.startswith(path) for path in skip_paths)
    
    def _get_client_id(self, request: Request) -> str:
        """Get client identifier for rate limiting"""
        # Try to get API key first
        api_key = request.headers.get("Authorization")
        if api_key and api_key.startswith("Bearer "):
            return f"api_key:{api_key[7:]}"
        
        # Fall back to IP address
        client_ip = request.client.host
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()
        
        return f"ip:{client_ip}"
```

### API Versioning Configuration

```python
# /app/backend/versioning.py

from fastapi import APIRouter, Request
from typing import Callable

class APIVersioning:
    def __init__(self):
        self.routers = {}
    
    def create_versioned_router(self, version: str) -> APIRouter:
        """Create a versioned API router"""
        router = APIRouter(prefix=f"/v{version}")
        self.routers[version] = router
        return router
    
    def deprecate_version(self, version: str, deprecated_date: str, sunset_date: str):
        """Mark an API version as deprecated"""
        if version in self.routers:
            router = self.routers[version]
            
            # Add deprecation middleware
            @router.middleware("http")
            async def add_deprecation_headers(request: Request, call_next):
                response = await call_next(request)
                response.headers["Deprecation"] = deprecated_date
                response.headers["Sunset"] = sunset_date
                response.headers["Warning"] = f'299 - "API version {version} is deprecated"'
                return response

# Version-specific routers
v1_router = APIRouter(prefix="/v1")
v2_router = APIRouter(prefix="/v2")

# V1 endpoints (deprecated)
@v1_router.get("/forms/{form_id}")
async def get_form_v1(form_id: str):
    """V1 form endpoint (deprecated)"""
    # Legacy implementation
    pass

# V2 endpoints (current)
@v2_router.get("/forms/{form_id}")
async def get_form_v2(form_id: str):
    """V2 form endpoint (current)"""
    # Current implementation
    pass
```

## Security Configuration

### Authentication Configuration

```python
# /app/backend/auth.py

from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import secrets
from .config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token handler
security = HTTPBearer()

class AuthConfig:
    """Authentication configuration"""
    
    # Password requirements
    MIN_PASSWORD_LENGTH = 8
    REQUIRE_UPPERCASE = True
    REQUIRE_LOWERCASE = True  
    REQUIRE_NUMBERS = True
    REQUIRE_SYMBOLS = True
    
    # Session settings
    SESSION_TIMEOUT = 3600  # 1 hour
    MAX_SESSIONS_PER_USER = 5
    
    # API key settings
    API_KEY_LENGTH = 32
    API_KEY_PREFIX = "ft_"
    
    # JWT settings
    JWT_ALGORITHM = "HS256"
    JWT_EXPIRATION = settings.jwt_expiration
    JWT_REFRESH_EXPIRATION = 7 * 24 * 3600  # 7 days

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(seconds=AuthConfig.JWT_EXPIRATION)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.jwt_secret, 
        algorithm=AuthConfig.JWT_ALGORITHM
    )
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Verify JWT token"""
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.jwt_secret,
            algorithms=[AuthConfig.JWT_ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def generate_api_key() -> str:
    """Generate secure API key"""
    random_part = secrets.token_urlsafe(AuthConfig.API_KEY_LENGTH)
    return f"{AuthConfig.API_KEY_PREFIX}{random_part}"

def hash_password(password: str) -> str:
    """Hash password"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    return pwd_context.verify(plain_password, hashed_password)
```

### CORS and Security Headers

```python
# /app/backend/security.py

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to responses"""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # HSTS header for HTTPS
        if settings.https_only:
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        # CSP header
        if settings.debug:
            csp = "default-src 'self' 'unsafe-inline' 'unsafe-eval'"
        else:
            csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
        
        response.headers["Content-Security-Policy"] = csp
        
        return response
```

## Performance Configuration

### Caching Configuration

```python
# /app/backend/cache.py

import redis.asyncio as redis
import json
import pickle
from typing import Any, Optional, Union
from datetime import timedelta
import logging
from .config import settings

class Cache:
    """Redis-based cache implementation"""
    
    def __init__(self):
        self.redis: Optional[redis.Redis] = None
        self.enabled = settings.cache_enabled
        
    async def init(self):
        """Initialize cache connection"""
        if not self.enabled or not settings.redis_url:
            logging.info("Cache disabled or Redis URL not provided")
            return
            
        try:
            self.redis = redis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=False
            )
            await self.redis.ping()
            logging.info("Connected to Redis cache")
        except Exception as e:
            logging.error(f"Failed to connect to Redis: {e}")
            self.enabled = False
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.enabled or not self.redis:
            return None
            
        try:
            value = await self.redis.get(key)
            if value:
                return pickle.loads(value)
        except Exception as e:
            logging.error(f"Cache get error: {e}")
        
        return None
    
    async def set(
        self, 
        key: str, 
        value: Any, 
        ttl: Optional[Union[int, timedelta]] = None
    ):
        """Set value in cache"""
        if not self.enabled or not self.redis:
            return
            
        try:
            serialized_value = pickle.dumps(value)
            
            if ttl is None:
                ttl = settings.cache_ttl
            elif isinstance(ttl, timedelta):
                ttl = int(ttl.total_seconds())
                
            await self.redis.setex(key, ttl, serialized_value)
        except Exception as e:
            logging.error(f"Cache set error: {e}")
    
    async def delete(self, key: str):
        """Delete value from cache"""
        if not self.enabled or not self.redis:
            return
            
        try:
            await self.redis.delete(key)
        except Exception as e:
            logging.error(f"Cache delete error: {e}")
    
    async def clear(self):
        """Clear all cache"""
        if not self.enabled or not self.redis:
            return
            
        try:
            await self.redis.flushall()
        except Exception as e:
            logging.error(f"Cache clear error: {e}")

# Global cache instance
cache = Cache()
```

## Deployment Configuration

### Docker Configuration

```dockerfile
# /app/Dockerfile.backend

FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        libc6-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ .

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```dockerfile
# /app/Dockerfile.frontend

FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./
COPY frontend/yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY frontend/ .

# Build application
RUN yarn build

# Production image
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose Configuration

```yaml
# /app/docker-compose.yml

version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME:-admin}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD:-password}
      MONGO_INITDB_DATABASE: ${DB_NAME:-form_titan}
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    ports:
      - "27017:27017"
    networks:
      - form-titan-network

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - form-titan-network

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    restart: unless-stopped
    environment:
      - MONGO_URL=mongodb://admin:password@mongodb:27017/form_titan?authSource=admin
      - REDIS_URL=redis://redis:6379/0
    env_file:
      - backend/.env
    depends_on:
      - mongodb
      - redis
    ports:
      - "8000:8000"
    volumes:
      - ./uploads:/app/uploads
    networks:
      - form-titan-network

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    restart: unless-stopped
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:8000
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - form-titan-network

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - form-titan-network

volumes:
  mongodb_data:
  redis_data:

networks:
  form-titan-network:
    driver: bridge
```

This configuration guide provides comprehensive setup instructions for all aspects of Form-Titan, from development to production deployment.