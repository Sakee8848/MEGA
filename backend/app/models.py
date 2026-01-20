from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional, Dict
from datetime import datetime
from uuid import UUID, uuid4
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

class Entity(SQLModel, table=True):
    """
    Dimension 2: Identity Resolution.
    Represents Clients, Insurers, Projects, or specific Risk Objects.
    """
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(index=True)
    type: str = Field(index=True) # client, insurer, project
    entity_metadata: Dict = Field(default_factory=dict, sa_column=sa.Column(sa.JSON))
    
    tags: List["MirrorTag"] = Relationship(back_populates="entity")

class Email(SQLModel, table=True):
    """
    Physical Layer: The immutable storage of the email.
    """
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    message_id: str = Field(unique=True, index=True)
    sender: str = Field(index=True)
    recipients: List[str] = Field(sa_column=sa.Column(sa.JSON))
    subject: str
    body_text: str
    received_at: datetime = Field(default_factory=datetime.now)
    
    # Relationship to Logical Layer
    mirror_index: Optional["MirrorIndex"] = Relationship(back_populates="email")

class MirrorIndex(SQLModel, table=True):
    """
    Logical Layer: The AI-enriched projection of an email.
    """
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email_id: UUID = Field(foreign_key="email.id")
    
    # Vector Embedding for Dimension 3 (Hybrid Search)
    # Using a list of floats as a simple representation for SQLite
    # In production, this would be a pgvector column
    embedding: List[float] = Field(sa_column=sa.Column(sa.JSON))
    
    # Dimension 4: Multi-dimensional Attributes
    is_quote: bool = Field(default=False)
    is_claim: bool = Field(default=False)
    is_meeting_memo: bool = Field(default=False)
    is_renewal: bool = Field(default=False)
    priority_score: float = Field(default=0.0)
    
    # Extracted Insurance Data (ACORD dynamic payload)
    acord_payload: Dict = Field(default_factory=dict, sa_column=sa.Column(sa.JSON))
    
    # Dynamic Tags/Dimensions
    tags: List["MirrorTag"] = Relationship(back_populates="mirror_index")
    
    email: Email = Relationship(back_populates="mirror_index")

class MirrorTag(SQLModel, table=True):
    """
    Dimension 5: Multi-dimensional Tagging.
    Connects a MirrorIndex to multiple Entities or custom tags.
    """
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    mirror_index_id: UUID = Field(foreign_key="mirrorindex.id")
    entity_id: Optional[UUID] = Field(default=None, foreign_key="entity.id")
    
    tag_type: str = Field(index=True) # EntityRef, ProjectRef, Intent
    value: str
    confidence: float = Field(default=1.0)
    
    mirror_index: MirrorIndex = Relationship(back_populates="tags")
    entity: Optional[Entity] = Relationship(back_populates="tags")

class BrokerSkill(SQLModel, table=True):
    """
    Dimension 6: Skills & Knowledge.
    Stores extracted broker skills/prompts.
    """
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str
    description: str
    prompt_template: str
    variables: List[str] = Field(sa_column=sa.Column(sa.JSON))
