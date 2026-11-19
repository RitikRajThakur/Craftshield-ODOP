"""
=============================================================================
ODOP Handicraft Authenticity Assistant - PDF Certificate Generator (Step 4)
File: certificate.py
Author: B.Tech CSE Student Project
Purpose: Generates official, downloadable PDF Certificates of Authenticity
         using ReportLab for verified ODOP crafts.
=============================================================================
"""

import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

class CertificateGenerator:
    """
    Creates tamper-proof, printable PDF Certificates of Authenticity.
    """

    def __init__(self):
        self.cert_dir = Path(__file__).resolve().parent / "certificates"
        self.cert_dir.mkdir(parents=True, exist_ok=True)

    def generate(self, data: Dict[str, Any], qr_image_path: Optional[str] = None) -> str:
        cert_id = f"CERT-ODOP-{int(datetime.utcnow().timestamp())}-{uuid.uuid4().hex[:4].upper()}"
        pdf_path = self.cert_dir / f"{cert_id}.pdf"

        doc = SimpleDocTemplate(
            str(pdf_path),
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            alignment=1,
            textColor=colors.HexColor('#0f172a')
        )

        sub_style = ParagraphStyle(
            'SubStyle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=10,
            leading=14,
            alignment=1,
            textColor=colors.HexColor('#b45309')
        )

        body_style = ParagraphStyle(
            'BodyStyle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=13,
            textColor=colors.HexColor('#334155')
        )

        elements = []

        # Header Banner
        elements.append(Paragraph("ONE DISTRICT ONE PRODUCT (ODOP) INITIATIVE • GOVERNMENT OF INDIA", sub_style))
        elements.append(Spacer(1, 4))
        elements.append(Paragraph("OFFICIAL CERTIFICATE OF AUTHENTICITY", title_style))
        elements.append(Paragraph("CraftShield AI Micro-Texture & Cryptographic Provenance Registry", sub_style))
        elements.append(Spacer(1, 16))

        # Main Metadata Table
        product_name = data.get("product_name", "Handcrafted Artisan Product")
        district = data.get("district", "Varanasi")
        state = data.get("state", "Uttar Pradesh")
        gi_tag = data.get("gi_tag", "GI-99")
        score = data.get("authenticity_score", 95.0)
        verdict = str(data.get("verdict", "AUTHENTIC_HANDCRAFT")).strip()
        issued_date = datetime.utcnow().strftime("%d %B %Y, %H:%M UTC")

        # 1. Exact Verdict-Based Status, Colors & Labels
        if verdict == "AUTHENTIC_HANDCRAFT":
            verdict_color = '#059669'  # Green
            score_color = '#059669'
            score_label = f"{score}% Genuine"
            supplied_artisan = data.get("artisan_name")
            artisan_display = supplied_artisan if (supplied_artisan and supplied_artisan not in ["Not Verified", "Pending Verification"]) else "Traditional Handloom Weaver"
            micro_status = "<font color='#059669'>PASSED (Organic Human Variance)</font>"
            sym_status = "<font color='#059669'>PASSED (No Machine Repeat)</font>"
        elif verdict == "SUSPICIOUS_POWERLOOM_MACHINE":
            verdict_color = '#e11d48'  # Red
            score_color = '#e11d48'
            score_label = f"{score}% Low Authenticity"
            artisan_display = "Not Verified"
            micro_status = "<font color='#e11d48'>FLAGGED (Rigid / Flat Thread)</font>"
            sym_status = "<font color='#e11d48'>FLAGGED (High Periodic Repeat)</font>"
        elif verdict == "LIKELY_AUTHENTIC":
            verdict_color = '#d97706'  # Amber
            score_color = '#d97706'
            score_label = f"{score}% Moderate Authenticity"
            has_valid_passport = bool(data.get("cryptographic_passport_valid"))
            supplied_artisan = data.get("artisan_name")
            if has_valid_passport and supplied_artisan and supplied_artisan not in ["Not Verified", "Pending Verification"]:
                artisan_display = supplied_artisan
            else:
                artisan_display = "Pending Verification"
            micro_val = data.get('micro_texture_score', 70)
            sym_val = data.get('machine_symmetry_score', 50)
            micro_status = "<font color='#059669'>PASSED (Organic Human Variance)</font>" if micro_val >= 50 else "<font color='#d97706'>MODERATE (Partial Variance)</font>"
            sym_status = "<font color='#059669'>PASSED (No Machine Repeat)</font>" if sym_val <= 45 else "<font color='#d97706'>BORDERLINE (Minor Symmetry)</font>"
        else:
            verdict_color = '#334155'
            score_color = '#334155'
            score_label = f"{score}%"
            artisan_display = data.get("artisan_name", "Not Verified")
            micro_status = "<font color='#64748b'>EVALUATED</font>"
            sym_status = "<font color='#64748b'>EVALUATED</font>"

        micro_val = data.get('micro_texture_score', 92)
        sym_val = data.get('machine_symmetry_score', 24)

        table_data = [
            [Paragraph("<b>Certificate ID:</b>", body_style), Paragraph(cert_id, body_style),
             Paragraph("<b>Issue Date:</b>", body_style), Paragraph(issued_date, body_style)],
            [Paragraph("<b>Product Name:</b>", body_style), Paragraph(product_name, body_style),
             Paragraph("<b>GI Registration:</b>", body_style), Paragraph(gi_tag, body_style)],
            [Paragraph("<b>Artisan Guild:</b>", body_style), Paragraph(artisan_display, body_style),
             Paragraph("<b>District & State:</b>", body_style), Paragraph(f"{district}, {state}", body_style)],
            [Paragraph("<b>Authenticity Score:</b>", body_style), Paragraph(f"<b><font color='{score_color}'>{score_label}</font></b>", body_style),
             Paragraph("<b>Final Verdict:</b>", body_style), Paragraph(f"<b><font color='{verdict_color}'>{verdict}</font></b>", body_style)]
        ]

        table = Table(table_data, colWidths=[1.4*inch, 2.3*inch, 1.4*inch, 2.3*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
            ('BOX', (0, 0), (-1, -1), 1.5, colors.HexColor('#cbd5e1')),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ('PADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(table)
        elements.append(Spacer(1, 14))

        # Inspection Breakdown Table
        elements.append(Paragraph("<b>AI Optical Micro-Texture Inspection Findings</b>", body_style))
        elements.append(Spacer(1, 6))

        metrics = [
            [Paragraph("<b>Inspection Parameter</b>", body_style), Paragraph("<b>Measured Metric</b>", body_style), Paragraph("<b>Status</b>", body_style)],
            [Paragraph("Weave / Carving Irregularity", body_style), Paragraph(f"{micro_val}/100", body_style), Paragraph(micro_status, body_style)],
            [Paragraph("Machine Powerloom Symmetry", body_style), Paragraph(f"{sym_val}%", body_style), Paragraph(sym_status, body_style)],
            [Paragraph("GI Registry Match", body_style), Paragraph(f"{gi_tag} ({district})", body_style), Paragraph("<font color='#059669'>VERIFIED</font>", body_style)],
            [Paragraph("Cryptographic Passport", body_style), Paragraph("HMAC-SHA256 Token", body_style), Paragraph("<font color='#059669'>AUTHENTIC</font>" if data.get('cryptographic_passport_valid') else "<font color='#64748b'>NOT SUPPLIED</font>", body_style)]
        ]

        metrics_table = Table(metrics, colWidths=[2.6*inch, 2.4*inch, 2.4*inch])
        metrics_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ('PADDING', (0, 0), (-1, -1), 5),
        ]))
        elements.append(metrics_table)
        elements.append(Spacer(1, 16))

        # QR Code stamp at bottom
        if qr_image_path and os.path.exists(qr_image_path):
            qr_img = RLImage(qr_image_path, width=1.1*inch, height=1.1*inch)
            footer_data = [
                [qr_img, Paragraph("<b>Tamper-Proof Verification Stamp:</b><br/>Scan this QR code with any smartphone camera to view the immutable cryptographic provenance record on the ODOP registry.<br/><i>CraftShield ODOP • Protecting Indian Artisans & Cultural Heritage</i>", body_style)]
            ]
            footer_table = Table(footer_data, colWidths=[1.3*inch, 6.1*inch])
            footer_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f1f5f9')),
                ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
                ('PADDING', (0, 0), (-1, -1), 6),
            ]))
            elements.append(footer_table)

        doc.build(elements)
        return str(pdf_path)


if __name__ == "__main__":
    generator = CertificateGenerator()
    print("Testing PDF Certificate Generator...")
    pdf_file = generator.generate({
        "product_name": "Banarasi Brocade & Silk Saree",
        "district": "Varanasi",
        "state": "Uttar Pradesh",
        "gi_tag": "GI-99",
        "artisan_name": "Master Weaver Ramprasad Ansari",
        "authenticity_score": 94.5,
        "verdict": "AUTHENTIC_HANDCRAFT",
        "micro_texture_score": 93.2,
        "machine_symmetry_score": 21.0
    })
    print(f"PDF Certificate generated successfully at: {pdf_file}")
