from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, SQLModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from .database import create_db_and_tables, get_session
from .models import Email, MirrorIndex, MirrorTag, Entity

app = FastAPI(title="MEGA System", version="0.1.0", description="Make Email Great Again - Backend API")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "MEGA System Online", "status": "active"}

# --- Ingestion Simulation ---
class EmailIngestRequest(SQLModel):
    subject: str
    sender: str
    body: str
    received_at: Optional[datetime] = None

@app.post("/ingest")
def ingest_email(email_req: EmailIngestRequest, session: Session = Depends(get_session)):
    """
    Simulates the Agentic AI Ingestion Pipeline.
    """
    # 1. Save Physical Email
    db_email = Email(
        message_id=f"msg_{datetime.now().timestamp()}",
        sender=email_req.sender,
        recipients=["me@broker.com"],
        subject=email_req.subject,
        body_text=email_req.body,
        received_at=email_req.received_at or datetime.now()
    )
    session.add(db_email)
    session.commit()
    session.refresh(db_email)
    
    # 2. Advanced AI Intelligence Simulation (Horizontal & Vertical)
    is_quote = "quote" in email_req.subject.lower() or "premium" in email_req.body.lower()
    is_claim = any(x in email_req.subject.lower() or x in email_req.body.lower() for x in ["claim", "loss", "incident", "damage"])
    is_renewal = "renewal" in email_req.subject.lower() or "renewal" in email_req.body.lower()
    is_meeting_memo = "meeting" in email_req.subject.lower() or "notes" in email_req.subject.lower()
    
    # Extract premium/deductible if it's a quote (Simulating OCR)
    acord_payload = {}
    if is_quote:
        import re
        premium_match = re.search(r"Premium:\s*\$?([\d,]+)", email_req.body)
        deductible_match = re.search(r"Deductible:\s*\$?([\d,]+)", email_req.body)
        if premium_match:
            acord_payload["premium"] = premium_match.group(1).replace(",", "")
        if deductible_match:
            acord_payload["deductible"] = deductible_match.group(1).replace(",", "")

    # 3. Create Mirror Index
    mirror = MirrorIndex(
        email_id=db_email.id,
        embedding=[0.1] * 1536,
        is_quote=is_quote,
        is_claim=is_claim,
        is_renewal=is_renewal,
        is_meeting_memo=is_meeting_memo,
        acord_payload=acord_payload,
        priority_score=0.9 if (is_quote or is_claim) else 0.1
    )
    session.add(mirror)
    session.commit()
    session.refresh(mirror)
    
    # 4. Auto-tagging (Identity Resolution Simulation)
    clients_to_check = ['Client A', 'Global Logistics', 'Tech Corp']
    carriers_to_check = ['Chubb', 'AIG', 'Liberty Mutual']
    
    # Detect Clients
    for client_name in clients_to_check:
        if client_name.lower() in email_req.body.lower() or client_name.lower() in email_req.subject.lower():
            session.add(MirrorTag(mirror_index_id=mirror.id, tag_type="EntityRef", value=client_name))
            
    # Detect Carriers
    for carrier_name in carriers_to_check:
        if carrier_name.lower() in email_req.body.lower() or carrier_name.lower() in email_req.subject.lower() or carrier_name.lower() in email_req.sender.lower():
            session.add(MirrorTag(mirror_index_id=mirror.id, tag_type="EntityRef", value=carrier_name))
    
    if is_quote:
        session.add(MirrorTag(mirror_index_id=mirror.id, tag_type="Intent", value="Quotation"))
    if is_claim:
        session.add(MirrorTag(mirror_index_id=mirror.id, tag_type="Intent", value="Claim"))
    if is_renewal:
        session.add(MirrorTag(mirror_index_id=mirror.id, tag_type="Intent", value="Renewal"))

    session.commit()
    session.refresh(mirror)
    
    return {
        "id": str(mirror.id),
        "is_quote": mirror.is_quote,
        "is_claim": mirror.is_claim,
        "acord_data": mirror.acord_payload
    }

@app.post("/agent/mine-skills")
def mine_skills(session: Session = Depends(get_session)):
    """
    Dimension 6.1: Skills Mining.
    Analyzes historical emails to extract reusable broker skills.
    """
    # Prototype logic: find emails from 'me@broker.com' that follow a request
    # and extract them as 'Skills'
    new_skill = BrokerSkill(
        name="Explain Premium Increase",
        description="Explaining why premium went up based on market trends",
        prompt_template="Draft a reply to {{client_name}} explaining that the {{insurance_type}} premium increased by {{percentage}}% due to re-insurance market hardening.",
        variables=["client_name", "insurance_type", "percentage"]
    )
    session.add(new_skill)
    session.commit()
    return {"status": "success", "skill_extracted": new_skill.name}

# --- Retrieval Endpoints ---
@app.get("/emails/mirror", response_model=List[dict])
def get_mirror_view(
    view_type: str = "time", # time, entity, intention
    entity_filter: Optional[str] = None,
    session: Session = Depends(get_session)
):
    """
    The Core 'Mirror View' Logic.
    Supports time-based, entity-based, and attribute-based views.
    """
    if view_type == "entity" and entity_filter:
        # Join with tags to filter by entity
        query = select(MirrorIndex, Email).join(Email).join(MirrorTag).where(MirrorTag.value == entity_filter).distinct()
    elif view_type == "intention":
        if entity_filter == "quote":
            query = select(MirrorIndex, Email).join(Email).where(MirrorIndex.is_quote == True)
        elif entity_filter == "claim":
            query = select(MirrorIndex, Email).join(Email).where(MirrorIndex.is_claim == True)
        elif entity_filter == "renewal":
            query = select(MirrorIndex, Email).join(Email).where(MirrorIndex.is_renewal == True)
        elif entity_filter == "meeting_memo":
            query = select(MirrorIndex, Email).join(Email).where(MirrorIndex.is_meeting_memo == True)
        else:
            query = select(MirrorIndex, Email).join(Email)
    else:
        # Default: Time View
        query = select(MirrorIndex, Email).join(Email).order_by(Email.received_at.desc())
            
    results = session.exec(query).all()
    
    output = []
    for mirror, email in results:
        output.append({
            "id": str(email.id),
            "subject": email.subject,
            "sender": email.sender,
            "preview": email.body_text[:120],
            "tags": [t.value for t in mirror.tags],
            "is_quote": mirror.is_quote,
            "is_claim": mirror.is_claim,
            "is_renewal": mirror.is_renewal,
            "acord_data": mirror.acord_payload,
            "received_at": email.received_at
        })
    
    return output
