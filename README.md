# 🛡️ CraftShield ODOP: AI-Based Handicraft Authenticity Assistant

> **A Complete Full-Stack AI System for Authenticating Traditional Indian Handicrafts under the One District One Product (ODOP) Initiative.**  
> Powered by **Computer Vision Micro-Texture Analysis**, **HMAC-SHA256 Cryptographic Passports**, **Bilingual AI Reporting (English & Hindi)**, and **Official PDF Certificate Generation**.

---

## 📌 Project Overview

Under the **One District One Product (ODOP)** initiative by the Government of India, indigenous crafts (like *Banarasi Silk* from Varanasi, *Channapatna Wooden Toys* from Ramanagara, and *Kashmir Pashmina* from Srinagar) are being promoted globally. However, cheap counterfeit machine replicas (from automated powerlooms and plastic molds) severely degrade artisan livelihoods.

**CraftShield ODOP** provides a two-factor defense:
1. **Physical Inspection (Computer Vision):** Evaluates macro photographs of the craft to distinguish human hand-tension irregularities from powerloom mechanical symmetry.
2. **Digital Provenance (Cryptographic Passports):** Mints tamper-proof **HMAC-SHA256** digital passports and QR tags linked to registered artisan Pehchan cards and official Geographical Indication (GI) registries.
3. **Official PDF Certificate:** Automatically generates a print-ready Certificate of Authenticity via ReportLab.

---

## 🏛️ Project Structure

```
ODOP_Project/
├── detector.py          # Step 1: Core Computer Vision texture & symmetry engine
├── passport.py          # Step 2: HMAC-SHA256 Cryptographic Digital Passport engine
├── odop_registry.py     # Step 3: Official Indian ODOP & GI Tag catalog
├── certificate.py       # Step 4: ReportLab PDF Certificate of Authenticity generator
├── server.py            # Step 5: FastAPI REST API backend with Swagger docs
├── frontend/            # Step 6: Modern React 19 + Vite + Tailwind CSS Web UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation and English/Hindi toggle
│   │   │   ├── VerificationStudio.jsx  # Live scanner, 1-click presets, score meter
│   │   │   ├── ArtisanPortal.jsx       # Minting digital passports & QR tags
│   │   │   ├── ODOPExplorer.jsx        # Searchable ODOP craft directory
│   │   │   └── HowItWorksModal.jsx     # Technical system architecture guide
│   │   ├── api.js                      # Clean API client
│   │   └── App.jsx
├── samples/             # Demo test images (Authentic Handloom vs Powerloom Fake)
├── qrcodes/             # Generated cryptographic QR tags
├── certificates/        # Generated official PDF certificates
├── run.sh               # One-click startup script
└── README.md            # Comprehensive project documentation
```

---

## ⚡ How to Run

### Option 1: One-Click Launch (Recommended)
From inside your `ODOP_Project` folder:
```bash
./run.sh
```
This automatically starts:
* **Frontend Web App:** [http://localhost:5173](http://localhost:5173)
* **Backend API & Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option 2: Run Step-by-Step

#### 1. Test Core AI Detector (CLI):
```bash
python3 detector.py
```

#### 2. Test Cryptographic Passport Generator (CLI):
```bash
python3 passport.py
```

#### 3. Test PDF Certificate Generator:
```bash
python3 certificate.py
```

#### 4. Run Backend API Server:
```bash
python3 server.py
```

#### 5. Run Frontend Web App:
```bash
cd frontend
npm run dev
```

---

## 🔬 How the Computer Vision Algorithm Works

When asked in interviews: *"How does your AI know if a saree is handloom or powerloom?"*

1. **Human Weave Variance (Local Gradient Analysis):**
   * On a pit loom, human hand tension naturally wobbles by 15% to 40% (measured via patch-based Coefficient of Variation).
2. **Machine Grid Periodicity (Spatial Autocorrelation):**
   * A motorized powerloom repeats thread beats with rigid mathematical precision.
   * We calculate 1D/2D spatial autocorrelation signals. Powerlooms generate sharp repeating peaks ($> 70\%$ symmetry), whereas handlooms produce smooth natural decay.

---

## 🎯 Placement & Viva Highlights

* **Full-Stack Integration:** Python FastAPI async backend paired with modern React 19 + Tailwind CSS frontend.
* **Security & Cryptography:** Tamper-proof HMAC-SHA256 digital signatures ensure counterfeiters cannot modify product metadata.
* **Domain Alignment:** Directly implements national policies: ODOP, PM Vishwakarma, and GI Registry.
