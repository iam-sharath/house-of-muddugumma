"""Pydantic request/response schemas.

Add new models here as you add features — routers import from this
single place so schemas stay easy to find and reuse.
"""
from typing import List, Optional

from pydantic import BaseModel, EmailStr


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class CategoryIn(BaseModel):
    name: str
    description: Optional[str] = ""


class CollectionIn(BaseModel):
    name: str
    description: Optional[str] = ""
    cover_image: Optional[str] = ""


class OfferIn(BaseModel):
    title: str
    description: Optional[str] = ""
    banner: Optional[str] = ""
    start_date: Optional[str] = ""
    end_date: Optional[str] = ""
    status: str = "active"


class BannerIn(BaseModel):
    title: str
    subtitle: Optional[str] = ""
    image: str
    link: Optional[str] = ""
    kind: str = "hero"  # hero, sale, festival, new_arrival, offer
    order: int = 0
    status: str = "active"


class ProductIn(BaseModel):
    name: str
    description: Optional[str] = ""
    fabric: Optional[str] = ""
    wash: Optional[str] = ""
    price_inr: float = 0
    price_gbp: float = 0
    categories: List[str] = []
    collections: List[str] = []
    tags: List[str] = []
    colors: List[str] = []
    images: List[str] = []
    status: str = "published"  # published, draft, hidden


class SettingsIn(BaseModel):
    business_name: Optional[str] = None
    logo: Optional[str] = None
    whatsapp_number: Optional[str] = None
    business_email: Optional[str] = None
    admin_email: Optional[str] = None
    admin_password: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    youtube_url: Optional[str] = None
    business_address: Optional[str] = None
    business_hours: Optional[str] = None
    footer_text: Optional[str] = None
    homepage_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    currency: Optional[str] = None
    about_text: Optional[str] = None
