from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Form Engine Models
class FieldValidation(BaseModel):
    required: Optional[bool] = False
    minLength: Optional[int] = None
    maxLength: Optional[int] = None
    pattern: Optional[str] = None
    min: Optional[float] = None
    max: Optional[float] = None

class FieldOption(BaseModel):
    label: str
    value: str

class VisibilityRule(BaseModel):
    field: str
    operator: str  # 'equals', 'not_equals', 'contains', etc.
    value: str

class FieldDefinition(BaseModel):
    id: str
    name: str
    type: str  # 'text', 'select', 'date', 'checkbox', etc.
    label: str
    placeholder: Optional[str] = None
    instructions: Optional[str] = None
    defaultValue: Optional[str] = None
    options: Optional[List[FieldOption]] = None
    validation: Optional[FieldValidation] = None
    visibility: Optional[List[VisibilityRule]] = None

class LayoutNode(BaseModel):
    id: str
    component: str  # 'container' or 'field'
    element: Optional[str] = None  # HTML element for containers
    attributes: Optional[Dict[str, Any]] = None
    children: Optional[List['LayoutNode']] = None
    fieldId: Optional[str] = None  # For field components

class FormConfig(BaseModel):
    mode: str = 'input'  # 'input' or 'edit'

class FormDefinition(BaseModel):
    formId: str
    name: str
    config: FormConfig
    fields: List[FieldDefinition]
    layoutDefinition: LayoutNode

class FormSubmission(BaseModel):
    submissionId: str = Field(default_factory=lambda: str(uuid.uuid4()))
    formId: str
    data: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class FormSubmissionCreate(BaseModel):
    data: Dict[str, Any]

class FormSubmissionResponse(BaseModel):
    submissionId: str
    status: str
    message: str

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Update LayoutNode to handle recursive definition
LayoutNode.model_rebuild()

# Sample form definition for demo
SAMPLE_FORM_DEFINITION = {
    "formId": "contact-us-v1",
    "name": "Contact Us Form",
    "config": {"mode": "input"},
    "fields": [
        {
            "id": "first_name",
            "name": "first_name",
            "type": "text",
            "label": "First Name",
            "placeholder": "Enter your first name",
            "validation": {"required": True, "minLength": 2}
        },
        {
            "id": "last_name",
            "name": "last_name",
            "type": "text",
            "label": "Last Name",
            "placeholder": "Enter your last name",
            "validation": {"required": True, "minLength": 2}
        },
        {
            "id": "email",
            "name": "email",
            "type": "email",
            "label": "Email Address",
            "placeholder": "Enter your email",
            "validation": {"required": True, "pattern": "^[^@]+@[^@]+\\.[^@]+$"}
        },
        {
            "id": "phone",
            "name": "phone",
            "type": "tel",
            "label": "Phone Number",
            "placeholder": "Enter your phone number",
            "validation": {"required": False}
        },
        {
            "id": "message",
            "name": "message",
            "type": "textarea",
            "label": "Message",
            "placeholder": "Enter your message",
            "validation": {"required": True, "minLength": 10}
        },
        {
            "id": "contact_method",
            "name": "contact_method",
            "type": "select",
            "label": "Preferred Contact Method",
            "options": [
                {"label": "Email", "value": "email"},
                {"label": "Phone", "value": "phone"},
                {"label": "Either", "value": "either"}
            ],
            "validation": {"required": True}
        }
    ],
    "layoutDefinition": {
        "id": "root",
        "component": "container",
        "element": "div",
        "attributes": {"className": "max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"},
        "children": [
            {
                "id": "header",
                "component": "container",
                "element": "div",
                "attributes": {"className": "mb-6"},
                "children": [
                    {
                        "id": "title",
                        "component": "container",
                        "element": "h1",
                        "attributes": {"className": "text-3xl font-bold text-gray-900 mb-2"},
                        "children": []
                    },
                    {
                        "id": "subtitle",
                        "component": "container",
                        "element": "p",
                        "attributes": {"className": "text-gray-600"},
                        "children": []
                    }
                ]
            },
            {
                "id": "form_body",
                "component": "container",
                "element": "div",
                "attributes": {"className": "space-y-4"},
                "children": [
                    {
                        "id": "name_row",
                        "component": "container",
                        "element": "div",
                        "attributes": {"className": "grid grid-cols-1 md:grid-cols-2 gap-4"},
                        "children": [
                            {
                                "id": "first_name_field",
                                "component": "field",
                                "fieldId": "first_name"
                            },
                            {
                                "id": "last_name_field",
                                "component": "field",
                                "fieldId": "last_name"
                            }
                        ]
                    },
                    {
                        "id": "email_field",
                        "component": "field",
                        "fieldId": "email"
                    },
                    {
                        "id": "phone_field",
                        "component": "field",
                        "fieldId": "phone"
                    },
                    {
                        "id": "contact_method_field",
                        "component": "field",
                        "fieldId": "contact_method"
                    },
                    {
                        "id": "message_field",
                        "component": "field",
                        "fieldId": "message"
                    }
                ]
            }
        ]
    }
}

# Basic routes
@api_router.get("/")
async def root():
    return {"message": "Form-Titan API is running!"}

# Form Definition Routes
@api_router.get("/forms/{form_id}", response_model=FormDefinition)
async def get_form_definition(form_id: str):
    # For now, return sample form definition
    if form_id == "contact-us-v1":
        return SAMPLE_FORM_DEFINITION
    else:
        raise HTTPException(status_code=404, detail="Form not found")

@api_router.put("/forms/{form_id}")
async def save_form_definition(form_id: str, form_definition: FormDefinition):
    # For now, just return success
    # In a real app, this would save to the database
    return {"status": "success", "message": "Form definition updated successfully"}

@api_router.post("/forms/{form_id}/submissions", response_model=FormSubmissionResponse)
async def submit_form(form_id: str, submission: FormSubmissionCreate):
    # Create submission record
    submission_obj = FormSubmission(
        formId=form_id,
        data=submission.data
    )
    
    # Save to database
    await db.form_submissions.insert_one(submission_obj.dict())
    
    return FormSubmissionResponse(
        submissionId=submission_obj.submissionId,
        status="success",
        message="Your submission has been received successfully!"
    )

@api_router.get("/forms/{form_id}/submissions")
async def get_form_submissions(form_id: str):
    submissions = await db.form_submissions.find({"formId": form_id}).to_list(100)
    return [FormSubmission(**submission) for submission in submissions]

# Legacy Status Check Routes
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()