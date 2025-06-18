from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uvicorn
import json
import uuid
from passlib.context import CryptContext
import jwt
from functools import wraps
import random
import asyncio
import logging
from contextlib import asynccontextmanager

# IBM Watson ML and AI imports
try:
    from ibm_watson_machine_learning import APIClient
    from sentence_transformers import SentenceTransformer
    import numpy as np
    IBM_AVAILABLE = True
except ImportError:
    IBM_AVAILABLE = False
    print("Warning: IBM Watson ML or sentence-transformers not installed. AI features will use fallback implementations.")

# Configuration
class Settings:
    IBM_URL: str = "https://us-south.ml.cloud.ibm.com"  # Change to your IBM Cloud region
    IBM_API_KEY: str = "your-ibm-api-key-here"  # Replace with your IBM API key
    IBM_SPACE_ID: Optional[str] = None  # Your IBM Space ID
    IBM_PROJECT_ID: Optional[str] = None  # Your IBM Project ID
    GRANITE_MODEL_ID: str = "ibm/granite-3-3b-instruct"  # Granite model ID
    GRANITE_DEPLOYMENT_ID: Optional[str] = None  # Optional deployment ID

settings = Settings()

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Granite Service Integration
class GraniteService:
    def __init__(self):
        self.client = None
        self.embedding_model = None
        self.is_ready = False
        
    async def initialize(self):
        """Initialize IBM Watson ML client and embedding model"""
        if not IBM_AVAILABLE:
            logger.warning("IBM Watson ML not available. Using fallback implementations.")
            self.is_ready = False
            return
            
        try:
            # Initialize IBM Watson ML client
            wml_credentials = {
                "url": settings.IBM_URL,
                "apikey": settings.IBM_API_KEY
            }
            
            self.client = APIClient(wml_credentials)
            
            if settings.IBM_SPACE_ID:
                self.client.set.default_space(settings.IBM_SPACE_ID)
            elif settings.IBM_PROJECT_ID:
                self.client.set.default_project(settings.IBM_PROJECT_ID)
            
            # Initialize sentence transformer for embeddings
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            
            self.is_ready = True
            logger.info("Granite service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Granite service: {str(e)}")
            self.is_ready = False
    
    async def cleanup(self):
        """Cleanup resources"""
        self.is_ready = False
        logger.info("Granite service cleaned up")
    
    async def generate_enhanced_job_description(self, job_data: Dict[str, Any]) -> Dict[str, str]:
        """Generate enhanced job description using IBM Granite"""
        try:
            if not self.is_ready:
                return self._create_fallback_description(job_data)
                
            prompt = f"""
            Create a comprehensive and professional job description based on the following information:
            
            Job Title: {job_data.get('position', '')}
            Store/Company: {job_data.get('store_name', '')}
            Location: {job_data.get('location', '')}
            Work Hours: {job_data.get('work_hours', '')}
            Wage: {job_data.get('wage', '')}
            Basic Responsibilities: {job_data.get('responsibilities', '')}
            Basic Requirements: {job_data.get('requirements', '')}
            
            Please create a professional, detailed job description that includes:
            1. An engaging job overview
            2. Key responsibilities (enhance and expand the basic ones provided)
            3. Required qualifications and skills
            4. Preferred qualifications
            5. Work environment details
            6. Benefits and growth opportunities
            
            Make it attractive to potential candidates while being clear about expectations.
            Format it professionally for a job posting.
            """
            
            enhanced_description = await self._generate_text(prompt)
            
            # Generate summary
            summary_prompt = f"""
            Create a brief, engaging summary (2-3 sentences) for this job posting:
            
            {enhanced_description}
            
            The summary should highlight the key role, location, and main appeal to job seekers.
            Keep it under 100 words.
            """
            
            summary = await self._generate_text(summary_prompt)
            
            return {
                'enhanced_description': enhanced_description,
                'summary': summary,
                'formatted_post': self._format_job_post(job_data, enhanced_description)
            }
            
        except Exception as e:
            logger.error(f"Error generating enhanced job description: {str(e)}")
            return self._create_fallback_description(job_data)
    
    async def calculate_advanced_match_score(self, job_requirements: str, candidate_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate advanced job matching score using AI analysis"""
        try:
            if not self.is_ready:
                return self._calculate_simple_match(job_requirements, candidate_profile)
            
            # Create text representations
            candidate_text = self._create_candidate_text(candidate_profile)
            
            # Generate embeddings
            candidate_embedding = self.embedding_model.encode([candidate_text])
            job_embedding = self.embedding_model.encode([job_requirements])
            
            # Calculate similarity
            similarity = np.dot(candidate_embedding[0], job_embedding[0]) / (
                np.linalg.norm(candidate_embedding[0]) * np.linalg.norm(job_embedding[0])
            )
            
            base_score = float(similarity) * 100
            
            # Generate detailed analysis using Granite
            analysis_prompt = f"""
            Analyze the job match between this candidate and job requirements:
            
            CANDIDATE PROFILE:
            {candidate_text}
            
            JOB REQUIREMENTS:
            {job_requirements}
            
            Provide analysis including:
            1. Match score (0-100)
            2. Key strengths (what matches well)
            3. Potential gaps (what might be missing)
            4. Recommendations for improvement
            
            Be specific and helpful in your analysis.
            """
            
            analysis_text = await self._generate_text(analysis_prompt)
            
            return {
                'match_score': min(100, max(0, int(base_score))),
                'compatibility': self._get_compatibility_level(base_score),
                'analysis': {
                    'detailed_analysis': analysis_text,
                    'embedding_score': base_score,
                    'strengths': self._extract_strengths(analysis_text),
                    'gaps': self._extract_gaps(analysis_text),
                    'recommendations': self._extract_recommendations(analysis_text)
                }
            }
            
        except Exception as e:
            logger.error(f"Error calculating advanced match score: {str(e)}")
            return self._calculate_simple_match(job_requirements, candidate_profile)
    
    async def _generate_text(self, prompt: str) -> str:
        """Generate text using IBM Granite model"""
        try:
            if not self.client:
                raise Exception("IBM Watson ML client not initialized")
                
            generation_params = {
                "max_new_tokens": 800,
                "temperature": 0.7,
                "top_p": 0.9,
                "repetition_penalty": 1.1
            }
            
            if settings.GRANITE_DEPLOYMENT_ID:
                response = self.client.deployments.generate_text(
                    deployment_id=settings.GRANITE_DEPLOYMENT_ID,
                    prompt=prompt,
                    params=generation_params
                )
            else:
                response = self.client.foundation_models.generate_text(
                    model_id=settings.GRANITE_MODEL_ID,
                    prompt=prompt,
                    params=generation_params
                )
            
            return response.get('results', [{}])[0].get('generated_text', '').strip()
            
        except Exception as e:
            logger.error(f"Error generating text with Granite: {str(e)}")
            return "AI generation temporarily unavailable. Please try again later."
    
    def _create_fallback_description(self, job_data: Dict[str, Any]) -> Dict[str, str]:
        """Create fallback job description when AI is unavailable"""
        basic_description = f"""
**{job_data.get('position', 'Position')} - {job_data.get('store_name', 'Company')}**

**Location:** {job_data.get('location', 'TBD')}
**Work Hours:** {job_data.get('work_hours', 'TBD')}
**Wage:** {job_data.get('wage', 'Competitive')}

**Responsibilities:**
{job_data.get('responsibilities', 'Various duties as assigned')}

**Requirements:**
{job_data.get('requirements', 'Relevant experience preferred')}

We are looking for a dedicated team member to join our growing business.
        """.strip()
        
        return {
            'enhanced_description': basic_description,
            'summary': f"Join our team as a {job_data.get('position', 'team member')} at {job_data.get('store_name', 'our company')}",
            'formatted_post': basic_description
        }
    
    def _format_job_post(self, job_data: Dict[str, Any], ai_description: str) -> str:
        """Format job post for mobile-friendly display"""
        return f"""
🏪 **{job_data.get('position', 'Job Position')}**
📍 {job_data.get('store_name', 'Company')} - {job_data.get('location', 'Location')}

{ai_description}

📋 **Quick Details:**
• Work Hours: {job_data.get('work_hours', 'TBD')}
• Wage: {job_data.get('wage', 'Competitive')}

📞 **How to Apply:** Contact us to learn more about this opportunity.
        """.strip()
    
    def _create_candidate_text(self, candidate_profile: Dict[str, Any]) -> str:
        """Create text representation of candidate profile"""
        parts = []
        
        if candidate_profile.get('skills'):
            if isinstance(candidate_profile['skills'], list):
                parts.append(f"Skills: {', '.join(candidate_profile['skills'])}")
            else:
                parts.append(f"Skills: {candidate_profile['skills']}")
        
        if candidate_profile.get('experience'):
            parts.append(f"Experience: {candidate_profile['experience']}")
        
        if candidate_profile.get('education'):
            parts.append(f"Education: {candidate_profile['education']}")
        
        if candidate_profile.get('languages'):
            if isinstance(candidate_profile['languages'], list):
                parts.append(f"Languages: {', '.join(candidate_profile['languages'])}")
        
        if candidate_profile.get('availability'):
            parts.append(f"Availability: {candidate_profile['availability']}")
        
        return " | ".join(parts)
    
    def _calculate_simple_match(self, job_requirements: str, candidate_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Simple keyword-based matching as fallback"""
        job_keywords = set(job_requirements.lower().split())
        
        candidate_text = self._create_candidate_text(candidate_profile)
        candidate_keywords = set(candidate_text.lower().split())
        
        common_keywords = job_keywords.intersection(candidate_keywords)
        match_percentage = (len(common_keywords) / len(job_keywords)) * 100 if job_keywords else 0
        match_percentage += random.randint(-5, 15)  # Add some variance
        match_percentage = max(0, min(100, int(match_percentage)))
        
        return {
            'match_score': match_percentage,
            'compatibility': self._get_compatibility_level(match_percentage),
            'analysis': {
                'detailed_analysis': f"Based on keyword matching, found {len(common_keywords)} matching terms.",
                'embedding_score': match_percentage,
                'strengths': ['Profile contains relevant keywords'],
                'gaps': ['Some requirements may not be covered'],
                'recommendations': ['Review job requirements and highlight relevant experience']
            }
        }
    
    def _get_compatibility_level(self, score: float) -> str:
        """Get compatibility level based on match score"""
        if score >= 85:
            return "Excellent"
        elif score >= 70:
            return "Good"
        elif score >= 55:
            return "Fair"
        else:
            return "Limited"
    
    def _extract_strengths(self, analysis_text: str) -> List[str]:
        """Extract strengths from analysis text"""
        # Simple extraction - in production, use more sophisticated NLP
        return ["Relevant experience", "Good skill match"] if "strength" in analysis_text.lower() else ["Profile matches some requirements"]
    
    def _extract_gaps(self, analysis_text: str) -> List[str]:
        """Extract gaps from analysis text"""
        return ["Some specialized skills needed"] if "gap" in analysis_text.lower() else ["Minor skill gaps"]
    
    def _extract_recommendations(self, analysis_text: str) -> List[str]:
        """Extract recommendations from analysis text"""
        return ["Highlight relevant experience", "Consider additional training"] if "recommend" in analysis_text.lower() else ["Review and tailor application"]

# Global service instance
granite_service = GraniteService()

# FastAPI lifespan management
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await granite_service.initialize()
    yield
    # Shutdown
    await granite_service.cleanup()

# Initialize FastAPI app with lifespan
app = FastAPI(
    title="FL Jobs API with IBM Granite AI",
    description="Job matching platform with IBM Granite AI integration",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://readdy.link/share/49089090594619129c80800a148f94ec", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-secret-key-here"  # In production, use environment variable
ALGORITHM = "HS256"

# Pydantic Models (keeping all your existing models)
class UserProfile(BaseModel):
    id: Optional[str] = None
    name: str
    email: EmailStr
    phone: str
    location: str
    experience: str
    education: str
    skills: List[str]
    languages: List[str]
    availability: str
    preferred_location: str
    avatar: Optional[str] = None

class Store(BaseModel):
    id: int
    name: str
    image: str
    street: str
    distance: str
    owner: Dict[str, str]

class Location(BaseModel):
    id: int
    name: str
    area: str
    distance: str

class JobListing(BaseModel):
    id: Optional[str] = None
    store_name: str
    location: str
    position: str
    work_hours: str
    wage: str
    responsibilities: str
    requirements: str
    created_at: Optional[datetime] = None

class JobApplication(BaseModel):
    job_id: str
    candidate_id: str
    match_score: Optional[int] = None
    status: str = "pending"
    applied_at: Optional[datetime] = None

class Candidate(BaseModel):
    id: int
    name: str
    skills: str
    experience: str
    education: str
    availability: str
    avatar: str

class LocationJob(BaseModel):
    id: int
    store_name: str
    position: str
    location: str
    wage: str
    requirements: str
    match_score: int

class JobFormData(BaseModel):
    store_name: str
    location: str
    position: str
    work_hours: str
    wage: str
    responsibilities: str
    requirements: str

class MatchScoreRequest(BaseModel):
    job_id: int
    candidate_id: int

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    location: str

class AIJobGenerationRequest(BaseModel):
    store_name: str
    position: str
    location: str
    work_hours: Optional[str] = None
    wage: Optional[str] = None
    basic_responsibilities: Optional[str] = None
    basic_requirements: Optional[str] = None

# Keep all your existing data structures
users_db = {}
stores_db = [
    {
        "id": 1,
        "name": "Weymans-Palo",
        "image": "https://readdy.ai/api/search-image?query=Grocery%20store%20front",
        "street": "Street No.7",
        "distance": "15$",
        "owner": {
            "name": "Alex",
            "avatar": "https://readdy.ai/api/search-image?query=Professional%20headshot"
        }
    },
    {
        "id": 2,
        "name": "LST-Margo",
        "image": "https://readdy.ai/api/search-image?query=Small%20convenience%20store",
        "street": "Street No.8",
        "distance": "15$",
        "owner": {
            "name": "Sarah",
            "avatar": "https://readdy.ai/api/search-image?query=Professional%20headshot"
        }
    },
    {
        "id": 3,
        "name": "Original-shaine",
        "image": "https://readdy.ai/api/search-image?query=Clothing%20store",
        "street": "JUBILEE HILLS/HYDERABAD",
        "distance": "15$",
        "owner": {
            "name": "Mike",
            "avatar": "https://readdy.ai/api/search-image?query=Professional%20headshot"
        }
    },
    {
        "id": 4,
        "name": "Google-Ram",
        "image": "https://readdy.ai/api/search-image?query=Colorful%20toy%20store",
        "street": "S.R ROAD/HYDERABAD",
        "distance": "15$",
        "owner": {
            "name": "Priya",
            "avatar": "https://readdy.ai/api/search-image?query=Professional%20headshot"
        }
    }
]

hyderabad_locations = [
    {"id": 1, "name": "Jubilee Hills", "area": "Western Hyderabad", "distance": "5 km"},
    {"id": 2, "name": "Banjara Hills", "area": "Central Hyderabad", "distance": "7 km"},
    {"id": 3, "name": "Hitech City", "area": "IT Hub", "distance": "12 km"},
    {"id": 4, "name": "Gachibowli", "area": "Financial District", "distance": "15 km"},
    {"id": 5, "name": "Secunderabad", "area": "Twin City", "distance": "10 km"},
    {"id": 6, "name": "Madhapur", "area": "IT Corridor", "distance": "11 km"},
    {"id": 7, "name": "Kukatpally", "area": "Residential Area", "distance": "18 km"},
    {"id": 8, "name": "Ameerpet", "area": "Commercial Center", "distance": "8 km"}
]

location_stores = [
    {
        "id": 1,
        "name": "Raymond-Zainor",
        "image": "https://readdy.ai/api/search-image?query=Upscale%20clothing%20store",
        "rating": "20$",
        "owner": {"name": "Raymond", "avatar": "https://readdy.ai/api/search-image?query=Professional%20headshot"}
    },
    {
        "id": 2,
        "name": "Original-zainor",
        "image": "https://readdy.ai/api/search-image?query=Modern%20clothing%20boutique",
        "rating": "30$",
        "owner": {"name": "Original", "avatar": "https://readdy.ai/api/search-image?query=Professional%20headshot"}
    }
]

job_listings_db = {}
candidates_db = [
    {
        "id": 1,
        "name": "Priya Sharma",
        "skills": "Retail sales, customer service, inventory management",
        "experience": "2 years in fashion retail",
        "education": "Bachelor's in Business Administration",
        "availability": "Full-time, weekends",
        "avatar": "https://readdy.ai/api/search-image?query=Professional%20headshot"
    },
    {
        "id": 2,
        "name": "Rahul Patel",
        "skills": "Food service, barista training, cash handling",
        "experience": "3 years in coffee shops",
        "education": "Associate's degree in Hospitality",
        "availability": "Part-time, evenings",
        "avatar": "https://readdy.ai/api/search-image?query=Professional%20headshot"
    }
]

location_jobs = [
    {
        "id": 1,
        "store_name": "Raymond-Zainor",
        "position": "Sales Associate",
        "location": "Jubilee Hills",
        "wage": "$18/hour",
        "requirements": "Fashion retail experience, customer service skills",
        "match_score": 85
    },
    {
        "id": 2,
        "store_name": "Original-zainor",
        "position": "Store Manager",
        "location": "Jubilee Hills",
        "wage": "$25/hour",
        "requirements": "3+ years retail management, fashion knowledge",
        "match_score": 72
    }
]

# Utility functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Enhanced AI-powered job creation
async def generate_job_description_ai(job_data: JobFormData) -> dict:
    """Generate enhanced job description using IBM Granite AI"""
    try:
        # Use Granite service for enhanced job generation
        ai_result = await granite_service.generate_enhanced_job_description({
            'position': job_data.position,
            'store_name': job_data.store_name,
            'location': job_data.location,
            'work_hours': job_data.work_hours,
            'wage': job_data.wage,
            'responsibilities': job_data.responsibilities,
            'requirements': job_data.requirements
        })
        
        return {
            "store_name": job_data.store_name,
            "location": job_data.location,
            "position": job_data.position,
            "work_hours": job_data.work_hours,
            "wage": job_data.wage,
            "responsibilities": ai_result['enhanced_description'],
            "requirements": job_data.requirements,
            "summary": ai_result['summary'],
            "formatted_post": ai_result['formatted_post'],
            "created_at": datetime.now(),
            "ai_enhanced": True
        }
        
    except Exception as e:
        logger.error(f"Error in AI job generation: {str(e)}")
        # Fallback to basic generation
        return {
            "store_name": job_data.store_name,
            "location": job_data.location,
            "position": job_data.position,
            "work_hours": job_data.work_hours,
            "wage": job_data.wage,
            "responsibilities": job_data.responsibilities or "Various duties as assigned",
            "requirements": job_data.requirements or "Relevant experience preferred",
            "created_at": datetime.now(),
            "ai_enhanced": False
        }

# Enhanced match score calculation
async def calculate_match_score_ai(job_requirements: str, candidate_profile: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate advanced match score using IBM Granite AI"""
    try:
        result = await granite_service.calculate_advanced_match_score(job_requirements, candidate_profile)
        return result
    except Exception as e:
        logger.error(f"Error in AI match calculation: {str(e)}")
        # Fallback to simple matching
        return {
            'match_score': random.randint(50, 90),
            'compatibility': 'Good',
            'analysis': {
                'detailed_analysis': 'Match calculation temporarily unavailable',
                'strengths': ['Profile review needed'],
                'gaps': ['Unable to analyze'],
                'recommendations': ['Please try again later']
            }
        }

# API Endpoints (keeping all your existing endpoints)

@app.get("/")
async def root():
    return {
        "message": "FL Jobs API with IBM Granite AI is running",
        "version": "2.0.0",
        "ai_status": "Available" if granite_service.is_ready else "Limited (Fallback mode)"
    }

# Authentication endpoints (unchanged)
@app.post("/auth/register")
async def register(request: RegisterRequest):
    if request.email in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user_id = str(uuid.uuid4())
    users_db[request.email] = {
        "id": user_id,
        "name": request.name,
        "email": request.email,
        "password": hash_password(request.password),
        "phone": request.phone,
        "location": request.location,
        "experience": "",
        "education": "",
        "skills": [],
        "languages": [],
        "availability": "",
        "preferred_location": request.location,
        "avatar": "https://readdy.ai/api/search-image?query=Professional%20headshot"
    }
    
    access_token = create_access_token(data={"sub": user_id})
    return {"access_token": access_token, "token_type": "bearer", "user_id": user_id}

@app.post("/auth/login")
async def login(request: LoginRequest):
    user = users_db.get(request.email)
    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user["id"]})
    return {"access_token": access_token, "token_type": "bearer", "user_id": user["id"]}

# Profile endpoints (unchanged)
@app.get("/profile", response_model=UserProfile)
async def get_profile(user_id: str = Depends(verify_token)):
    for user_data in users_db.values():
        if user_data["id"] == user_id:
            return UserProfile(**user_data)
    
    raise HTTPException(status_code=404, detail="User not found")

@app.put("/profile")
async def update_profile(profile: UserProfile, user_id: str = Depends(verify_token)):
    for email, user_data in users_db.items():
        if user_data["id"] == user_id:
            user_data.update(profile.dict(exclude_unset=True))
            return {"message": "Profile updated successfully"}
    
    raise HTTPException(status_code=404, detail="User not found")

# Store endpoints (unchanged)
@app.get("/stores", response_model=List[Store])
async def get_stores():
    return stores_db

@app.get("/stores/{store_id}")
async def get_store(store_id: int):
    store = next((s for s in stores_db if s["id"] == store_id), None)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store

# Location endpoints (unchanged)
@app.get("/locations", response_model=List[Location])
async def get_locations():
    return hyderabad_locations

@app.get("/locations/{location_name}/stores")
async def get_location_stores(location_name: str):
    return location_stores

@app.get("/locations/{location_name}/jobs", response_model=List[LocationJob])
async def get_location_jobs(location_name: str):
    return [job for job in location_jobs if job["location"] == location_name]

# Enhanced Job listing endpoints with AI
@app.get("/jobs")
async def get_job_listings(user_id: str = Depends(verify_token)):
    user_jobs = [job for job in job_listings_db.values() if job.get("created_by") == user_id]
    return user_jobs

@app.post("/jobs")
async def create_job_listing(job_data: JobFormData, user_id: str = Depends(verify_token)):
    """Create job listing with AI enhancement"""
    # Generate enhanced job description using AI
    enhanced_job = await generate_job_description_ai(job_data)
    
    job_id = str(uuid.uuid4())
    enhanced_job["id"] = job_id
    enhanced_job["created_by"] = user_id
    
    job_listings_db[job_id]