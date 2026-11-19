"""
=============================================================================
ODOP Handicraft Authenticity Assistant - Cryptographic Passport Engine (Step 2)
File: passport.py
Author: B.Tech CSE Student Project
Purpose: Generates tamper-proof Digital Product Passports (DPP) using HMAC-SHA256
         and creates printable verification QR codes with valid mobile URLs.
=============================================================================
"""

import os
import hmac
import hashlib
import json
import base64
import uuid
import socket
from pathlib import Path
from typing import Dict, Any, Tuple, Optional
import qrcode

SECRET_KEY = os.getenv("SECRET_KEY", "odop-craftshield-secret-auth-key-2026")


def get_lan_ip() -> str:
    """
    Detects the primary LAN IP address of this machine for local network access.
    Allows phones and other devices on the same Wi-Fi network to scan QR codes.
    """
    env_ip = os.getenv("HOST_IP")
    if env_ip:
        return env_ip
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.5)
        # 8.8.8.8 does not need to be contacted; selects active routing interface
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        if ip and not ip.startswith("127."):
            return ip
    except Exception:
        pass
    try:
        hostname = socket.gethostname()
        ip = socket.gethostbyname(hostname)
        if ip and not ip.startswith("127."):
            return ip
    except Exception:
        pass
    return "127.0.0.1"


def get_default_base_url() -> str:
    """
    Determines public or LAN accessible base URL for the Next.js app.
    Priority:
    1. APP_BASE_URL or NEXT_PUBLIC_APP_URL environment variable (production or custom domain)
    2. LAN IP: http://<LAN_IP>:3000 (for local testing with mobile phones)
    3. http://localhost:3000 (fallback)
    """
    custom = os.getenv("APP_BASE_URL") or os.getenv("NEXT_PUBLIC_APP_URL")
    if custom and "localhost" not in custom and "127.0.0.1" not in custom:
        return custom.rstrip("/")
    lan_ip = get_lan_ip()
    port = os.getenv("FRONTEND_PORT", "3000")
    if lan_ip and lan_ip != "127.0.0.1":
        return f"http://{lan_ip}:{port}"
    return f"http://localhost:{port}"


def resolve_qr_base_url(base_url: Optional[str] = None) -> str:
    """
    Resolves the base URL for QR codes.
    Crucial: A QR code is scanned by external mobile devices.
    Therefore, if base_url is 'localhost' or '127.0.0.1', we MUST replace the hostname
    with the host's LAN IP (e.g. 192.168.1.3) so the phone can reach the server over Wi-Fi.
    """
    # 1. Environment variable override if explicitly set and not localhost
    env_url = os.getenv("APP_BASE_URL") or os.getenv("NEXT_PUBLIC_APP_URL")
    if env_url and "localhost" not in env_url and "127.0.0.1" not in env_url:
        return env_url.rstrip("/")

    # 2. If client supplied base_url and it is NOT localhost or 127.0.0.1
    if base_url and "localhost" not in base_url and "127.0.0.1" not in base_url:
        return base_url.rstrip("/")

    # 3. Determine port from base_url or default
    port = "3000"
    if base_url:
        clean = base_url.replace("http://", "").replace("https://", "").split("/")[0]
        if ":" in clean:
            port = clean.split(":")[-1]

    lan_ip = get_lan_ip()
    if lan_ip and lan_ip != "127.0.0.1":
        return f"http://{lan_ip}:{port}"

    return base_url.rstrip("/") if base_url else f"http://localhost:{port}"


class PassportEngine:
    """
    Creates and verifies Cryptographic Digital Product Passports for ODOP handicrafts.
    Prevents counterfeiters from forging certificates or copying labels.
    """

    def __init__(self, secret: str = SECRET_KEY):
        self.secret = secret.encode("utf-8")
        self.base_dir = Path(__file__).resolve().parent
        self.qr_dir = self.base_dir / "qrcodes"
        self.qr_dir.mkdir(parents=True, exist_ok=True)
        self.storage_file = self.base_dir / "passports.json"
        self._init_storage()

    def _init_storage(self):
        """Initializes JSON ledger for storing minted passports."""
        if not self.storage_file.exists():
            try:
                with open(self.storage_file, "w", encoding="utf-8") as f:
                    json.dump({}, f, indent=2)
            except Exception as e:
                print(f"Warning: could not create storage file: {e}")

    def _load_passports(self) -> Dict[str, Any]:
        """Loads all stored passports from JSON ledger."""
        try:
            if self.storage_file.exists():
                with open(self.storage_file, "r", encoding="utf-8") as f:
                    return json.load(f)
        except Exception as e:
            print(f"Warning: could not read passports file: {e}")
        return {}

    def _save_passports(self, data: Dict[str, Any]):
        """Persists updated passports ledger to disk."""
        try:
            with open(self.storage_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving passports storage: {e}")

    def get_passport(self, passport_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves stored passport by its unique ID."""
        passports = self._load_passports()
        return passports.get(passport_id)

    def _canonical(self, data: Dict[str, Any]) -> str:
        """Standardizes metadata order before signing."""
        fields = [
            "passport_id", "artisan_id", "product_name", "district",
            "state", "gi_tag", "batch_no", "production_date", "material"
        ]
        return "|".join(f"{k}:{str(data.get(k, '')).strip()}" for k in fields)

    def sign(self, data: Dict[str, Any]) -> str:
        """Generates HMAC-SHA256 signature."""
        msg = self._canonical(data).encode("utf-8")
        return hmac.new(self.secret, msg, hashlib.sha256).hexdigest()

    def decode_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Safely decodes a base64 URL-safe passport token into its JSON dictionary."""
        try:
            if not token:
                return None
            padded = token + "=" * (-len(token) % 4)
            raw = base64.urlsafe_b64decode(padded.encode("utf-8")).decode("utf-8")
            return json.loads(raw)
        except Exception:
            return None

    def create_passport(
        self,
        artisan_id: str,
        artisan_name: str,
        product_name: str,
        district: str,
        state: str,
        gi_tag: str,
        batch_no: str,
        production_date: str,
        material: str,
        base_url: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Mints a new cryptographic digital passport and saves a printable QR code
        pointing to the mobile-friendly verification page.
        """
        short_id = uuid.uuid4().hex[:8].upper()
        passport_id = f"ODOP-{district[:3].upper()}-{short_id}"

        payload = {
            "passport_id": passport_id,
            "artisan_id": artisan_id,
            "artisan_name": artisan_name,
            "product_name": product_name,
            "district": district,
            "state": state,
            "gi_tag": gi_tag,
            "batch_no": batch_no,
            "production_date": production_date,
            "material": material
        }

        signature = self.sign(payload)
        payload["signature"] = signature

        # Resolve target base URL for verification page
        # Never allow localhost in a QR code payload since external phones cannot resolve it
        resolved_base = resolve_qr_base_url(base_url)
        
        # Encode for QR code payload
        token = base64.urlsafe_b64encode(json.dumps(payload).encode("utf-8")).decode("utf-8")
        verify_url = f"{resolved_base}/verify/{passport_id}?token={token}"

        # Generate QR code containing the valid HTTP verification URL
        qr = qrcode.QRCode(version=1, box_size=8, border=2)
        qr.add_data(verify_url)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="#0f172a", back_color="#ffffff")

        qr_path = self.qr_dir / f"qr_{passport_id}.png"
        qr_img.save(str(qr_path))

        payload["qr_image_path"] = str(qr_path)
        payload["verify_url"] = verify_url
        payload["token"] = token

        # Persist to local passports store for ID lookup
        passports = self._load_passports()
        passports[passport_id] = payload
        self._save_passports(passports)

        return payload

    def verify(self, payload: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Verifies if the passport payload has been tampered with or modified.
        """
        signature = payload.get("signature", "")
        if not signature:
            return False, "Missing cryptographic signature."

        expected = self.sign(payload)
        if hmac.compare_digest(expected, signature):
            return True, "Authentic HMAC-SHA256 signature verified. Passport is untampered."
        else:
            return False, "SIGNATURE MISMATCH: Metadata was altered or forged!"


if __name__ == "__main__":
    engine = PassportEngine()
    print("=================================================================")
    print("  CraftShield ODOP - Cryptographic Passport Generator (Step 2)   ")
    print("=================================================================\n")

    print(f"Detected Host LAN IP: {get_lan_ip()}")
    print(f"Default Base URL:     {get_default_base_url()}\n")

    # Demo: Mint a passport for Banarasi Silk
    passport = engine.create_passport(
        artisan_id="UP-VNS-WEAVER-7821",
        artisan_name="Master Weaver Ramprasad Ansari",
        product_name="Banarasi Brocade & Silk Saree",
        district="Varanasi",
        state="Uttar Pradesh",
        gi_tag="GI-99",
        batch_no="BATCH-2026-01",
        production_date="2026-10-15",
        material="Pure Katan Silk with Gold/Silver Zari"
    )

    print(f"Minted Passport ID:  {passport['passport_id']}")
    print(f"HMAC-SHA256 Sig:     {passport['signature']}")
    print(f"Verification URL:    {passport['verify_url']}")
    print(f"Printable QR Saved:  {passport['qr_image_path']}\n")

    # Test 1: Verify valid passport
    is_valid, msg = engine.verify(passport)
    print(f"[Test 1] Valid Passport Check:    {'PASSED' if is_valid else 'FAILED'} ({msg})")

    # Test 2: Tamper with passport (counterfeiter changes Silk to Polyester)
    tampered = dict(passport)
    tampered["material"] = "Synthetic Polyester"
    is_valid_fake, msg_fake = engine.verify(tampered)
    print(f"[Test 2] Tampered Passport Check:  {'DETECTED AS FAKE' if not is_valid_fake else 'FAILED'} ({msg_fake})\n")
    print("=================================================================")
