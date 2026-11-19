"""
=============================================================================
ODOP Handicraft Authenticity Assistant - FastAPI REST API Server (Step 5)
File: server.py
Author: B.Tech CSE Student Project
Purpose: Production REST API connecting Computer Vision Detector, Cryptographic 
         Passports, ODOP Registry, and PDF Certificate Generator.
=============================================================================
"""

import os
import uuid
import json
import base64
from pathlib import Path
from typing import Optional, Dict, Any, List

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import io
import qrcode
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel

# Import our custom engines
from detector import CraftDetector
from passport import PassportEngine, resolve_qr_base_url
from odop_registry import ODOP_REGISTRY, get_craft_by_district
from certificate import CertificateGenerator

app = FastAPI(
    title="CraftShield ODOP - AI Handicraft Authenticity Assistant",
    version="1.0.0",
    description="API for verifying handicraft authenticity, minting cryptographic passports, and validating GI Tags."
)

# Enable CORS for React frontend (supports localhost, LAN, and Vercel domains)
cors_env = os.getenv("CORS_ORIGINS", "*")
allowed_origins = [o.strip() for o in cors_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins != ["*"] else ["*"],
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True if allowed_origins != ["*"] else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines & storage folders
detector = CraftDetector()
passport_engine = PassportEngine()
certificate_gen = CertificateGenerator()

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
SAMPLE_DIR = BASE_DIR / "samples"


# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/")
def home():
    return {
        "project": "CraftShield ODOP",
        "description": "AI-Based Handicraft Authenticity Assistant",
        "docs": "/docs",
        "status": "online"
    }

@app.get("/api/odop/crafts")
def list_odop_crafts():
    """Returns official ODOP crafts directory."""
    return ODOP_REGISTRY

@app.get("/api/samples")
def list_demo_samples():
    """Returns 1-click test presets for frontend evaluation."""
    return [
        {
            "id": "sample-banarasi-auth",
            "name": "Authentic Banarasi Handloom Silk (Varanasi, UP)",
            "district": "Varanasi",
            "state": "Uttar Pradesh",
            "product_name": "Banarasi Brocade & Silk Saree",
            "gi_tag": "GI-99",
            "category": "Textiles & Handloom",
            "filename": "authentic_handloom.jpg",
            "expected": "AUTHENTIC",
            "badge": "Genuine Kadwa Weave"
        },
        {
            "id": "sample-banarasi-fake",
            "name": "Counterfeit Powerloom Silk Replica (Machine Made)",
            "district": "Varanasi",
            "state": "Uttar Pradesh",
            "product_name": "Powerloom Synthetic Silk (Machine Imitation)",
            "gi_tag": "GI-99",
            "category": "Textiles & Handloom",
            "filename": "counterfeit_powerloom.jpg",
            "expected": "COUNTERFEIT",
            "badge": "Machine Grid Repeat"
        }
    ]

@app.get("/api/sample-image/{filename}")
def get_sample_image(filename: str):
    path = SAMPLE_DIR / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="Sample image not found")
    return FileResponse(str(path), media_type="image/jpeg")

@app.post("/api/verify")
async def verify_craft(
    file: UploadFile = File(...),
    district: Optional[str] = Form("Varanasi"),
    product_name: Optional[str] = Form("Banarasi Brocade & Silk Saree"),
    gi_tag: Optional[str] = Form("GI-99"),
    passport_token: Optional[str] = Form(None)
):
    """
    Core Verification Endpoint:
    1. Saves uploaded image
    2. Runs Computer Vision micro-texture & powerloom symmetry analysis
    3. Validates HMAC cryptographic passport if supplied
    4. Checks official ODOP GI registry
    5. Generates official PDF Certificate of Authenticity
    """
    # 1. Save uploaded image
    ext = Path(file.filename).suffix or ".jpg"
    filename = f"scan_{uuid.uuid4().hex[:8]}{ext}"
    saved_path = UPLOAD_DIR / filename

    content = await file.read()
    with open(saved_path, "wb") as f:
        f.write(content)

    # 2. Run Computer Vision Detector
    cv_result = detector.analyze(str(saved_path))

    # 3. Check Cryptographic Passport
    crypto_valid = False
    crypto_msg = "No passport supplied (physical scan only)"
    passport_data = None

    if passport_token:
        try:
            raw = base64.urlsafe_b64decode(passport_token.encode("utf-8")).decode("utf-8")
            passport_data = json.loads(raw)
            is_valid, msg = passport_engine.verify(passport_data)
            crypto_valid = is_valid
            crypto_msg = msg
            if is_valid:
                district = passport_data.get("district", district)
                product_name = passport_data.get("product_name", product_name)
                gi_tag = passport_data.get("gi_tag", gi_tag)
        except Exception:
            crypto_msg = "Invalid or corrupted passport token."

    # 4. Check official ODOP Registry
    registry_craft = get_craft_by_district(district)
    gi_match = False
    physical_test = "Extract edge thread and test with fire (pure silk burns to ash, fake melts)."
    if registry_craft:
        gi_match = True
        physical_test = registry_craft.get("physical_test", physical_test)

    # 5. Generate PDF Certificate
    qr_img = passport_data.get("qr_image_path") if passport_data else None
    cert_path = certificate_gen.generate({
        "product_name": product_name,
        "district": district,
        "state": registry_craft["state"] if registry_craft else "India",
        "gi_tag": gi_tag,
        "artisan_name": passport_data.get("artisan_name", "Registered Artisan Guild") if passport_data else "Traditional Handloom Weaver",
        "authenticity_score": cv_result["authenticity_score"],
        "verdict": cv_result["verdict"],
        "micro_texture_score": cv_result["micro_texture_score"],
        "machine_symmetry_score": cv_result["machine_symmetry_score"],
        "cryptographic_passport_valid": crypto_valid
    }, qr_image_path=qr_img)

    cert_filename = Path(cert_path).name

    # 6. Construct bilingual explanation
    if cv_result["verdict"] in ["AUTHENTIC_HANDCRAFT", "LIKELY_AUTHENTIC"]:
        explanation_en = (
            f"The analyzed {product_name} demonstrates authentic markers of manual human weaving. "
            f"Micro-texture analysis confirmed natural thread tension variations ({cv_result['tension_variance_ratio']}% variance) "
            f"with low mechanical grid symmetry ({cv_result['machine_symmetry_score']}%). "
            f"Compliant with official ODOP standards for {district}."
        )
        explanation_hi = (
            f"यह {product_name} हाथ से बुने असली उत्पाद के लक्षण प्रदर्शित करता है। "
            f"माइक्रो-टेक्सचर विश्लेषण में हाथ की बुनाई का स्वाभाविक तनाव ({cv_result['tension_variance_ratio']}%) "
            f"और कम मशीन समरूपता ({cv_result['machine_symmetry_score']}%) पाई गई है।"
        )
    else:
        explanation_en = (
            f"WARNING: High probability of powerloom/machine counterfeit ({cv_result['machine_symmetry_score']}% machine repeat). "
            f"The analyzed {product_name} exhibits artificial mathematical grid periodicity characteristic of motorized automated looms."
        )
        explanation_hi = (
            f"चेतावनी: इस {product_name} में पावरलूम / मशीन से बने होने के अत्यधिक लक्षण हैं ({cv_result['machine_symmetry_score']}% समरूपता)। "
            f"यह हाथ से बुने असली उत्पाद के विपरीत एकसमान कृत्रिम ग्रिड प्रदर्शित करता है।"
        )

    return {
        "verdict": cv_result["verdict"],
        "authenticity_score": cv_result["authenticity_score"],
        "micro_texture_score": cv_result["micro_texture_score"],
        "machine_symmetry_score": cv_result["machine_symmetry_score"],
        "tension_variance_ratio": cv_result["tension_variance_ratio"],
        "district": district,
        "product_name": product_name,
        "gi_tag": gi_tag,
        "gi_registry_verified": gi_match,
        "cryptographic_passport_valid": crypto_valid,
        "passport_message": crypto_msg,
        "explanation_en": explanation_en,
        "explanation_hi": explanation_hi,
        "physical_test": physical_test,
        "certificate_url": f"/api/certificate/{cert_filename}"
    }

class PassportRequest(BaseModel):
    artisan_id: str
    artisan_name: str
    product_name: str
    district: str
    state: str
    gi_tag: str
    batch_no: str
    production_date: str
    material: str
    app_url: Optional[str] = None
    base_url: Optional[str] = None

@app.post("/api/passport/mint")
def mint_passport(req: PassportRequest):
    """Mints a new cryptographic digital passport and QR code."""
    res = passport_engine.create_passport(
        artisan_id=req.artisan_id,
        artisan_name=req.artisan_name,
        product_name=req.product_name,
        district=req.district,
        state=req.state,
        gi_tag=req.gi_tag,
        batch_no=req.batch_no,
        production_date=req.production_date,
        material=req.material,
        base_url=req.app_url or req.base_url
    )
    qr_filename = Path(res["qr_image_path"]).name
    res["qr_url"] = f"/api/qr/{qr_filename}"
    return res

@app.get("/api/passport/verify/{passport_id}")
def verify_passport_endpoint(passport_id: str, token: Optional[str] = None):
    """
    Verifies a digital passport by ID and optional cryptographic token.
    Cross-checks the HMAC-SHA256 signature and the official ODOP registry.
    """
    passport_data = None

    # 1. If token is provided, decode and verify token payload
    if token:
        decoded = passport_engine.decode_token(token)
        if decoded:
            passport_data = decoded
        else:
            return {
                "status": "INVALID",
                "is_valid": False,
                "message": "Invalid or corrupted cryptographic passport token.",
                "passport": None,
                "gi_registry_verified": False
            }

    # 2. If token wasn't provided or fallback needed, check stored ledger
    if not passport_data:
        stored = passport_engine.get_passport(passport_id)
        if stored:
            passport_data = stored
        else:
            return {
                "status": "NOT_FOUND",
                "is_valid": False,
                "message": f"Passport ID '{passport_id}' not found in official ODOP ledger.",
                "passport": None,
                "gi_registry_verified": False
            }

    # Verify ID match if decoded from token
    if passport_data.get("passport_id") != passport_id:
        return {
            "status": "INVALID",
            "is_valid": False,
            "message": f"Token passport_id '{passport_data.get('passport_id')}' does not match requested passport_id '{passport_id}'.",
            "passport": passport_data,
            "gi_registry_verified": False
        }

    # 3. Cryptographically verify HMAC-SHA256 signature
    is_valid, msg = passport_engine.verify(passport_data)

    # 4. Check official ODOP GI Registry match
    district = passport_data.get("district", "")
    craft = get_craft_by_district(district)
    gi_verified = False
    gi_details = None

    if craft:
        gi_match = (
            craft.get("gi_tag") == passport_data.get("gi_tag") or
            district.lower() in craft.get("district", "").lower()
        )
        if gi_match:
            gi_verified = True
            gi_details = {
                "registered_product": craft.get("product_name"),
                "registered_district": craft.get("district"),
                "registered_state": craft.get("state"),
                "gi_tag": craft.get("gi_tag"),
                "category": craft.get("category"),
                "physical_test": craft.get("physical_test")
            }

    from datetime import datetime, timezone
    return {
        "status": "AUTHENTIC" if is_valid else "INVALID",
        "is_valid": is_valid,
        "message": msg,
        "passport": passport_data,
        "gi_registry_verified": gi_verified,
        "gi_details": gi_details,
        "verified_at": datetime.now(timezone.utc).isoformat()
    }

@app.get("/api/passport/{passport_id}")
def get_passport_endpoint(passport_id: str):
    """Retrieves stored passport metadata by ID."""
    stored = passport_engine.get_passport(passport_id)
    if not stored:
        raise HTTPException(status_code=404, detail="Passport not found")
    return stored

@app.get("/api/certificate/{filename}")
def download_certificate(filename: str):
    path = certificate_gen.cert_dir / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="Certificate not found")
    return FileResponse(str(path), media_type="application/pdf", filename=filename)

@app.get("/api/qr/{filename}")
def get_qr_image(filename: str):
    path = passport_engine.qr_dir / filename
    if not path.exists():
        # Ephemeral container fallback: generate QR code in memory if disk was wiped on restart
        pid = filename.replace("qr_", "").replace(".png", "")
        stored = passport_engine.get_passport(pid)
        verify_url = stored.get("verify_url") if stored else None
        if not verify_url:
            base = resolve_qr_base_url()
            verify_url = f"{base}/verify/{pid}"
        
        qr = qrcode.QRCode(version=1, box_size=8, border=2)
        qr.add_data(verify_url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="#0f172a", back_color="#ffffff")
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        buf.seek(0)
        return Response(content=buf.getvalue(), media_type="image/png")

    return FileResponse(str(path), media_type="image/png")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"Starting CraftShield ODOP Server on http://0.0.0.0:{port}...")
    uvicorn.run("server:app", host="0.0.0.0", port=port)
