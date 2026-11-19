"""
=============================================================================
ODOP Handicraft Authenticity Assistant - Official Registry Data (Step 3)
File: odop_registry.py
Author: B.Tech CSE Student Project
Purpose: Official knowledge base of One District One Product (ODOP) and 
         Geographical Indication (GI) certified Indian handicrafts.
=============================================================================
"""

ODOP_REGISTRY = [
    {
        "id": "ODOP-VNS-01",
        "district": "Varanasi",
        "state": "Uttar Pradesh",
        "product_name": "Banarasi Brocade & Silk Saree",
        "category": "Textiles & Handloom",
        "gi_tag": "GI-99",
        "registered_year": 2009,
        "description": "Hand-woven pure mulberry silk brocade featuring intricate gold/silver zari motifs crafted on traditional pit looms.",
        "authenticity_markers": [
            "Kadwa / Kadhuan weave technique with floating threads manually locked on reverse",
            "Natural microscopic variation in hand-spun silk thread diameter (14-22 denier)",
            "Irregular selvage borders indicating manual shuttle tension beats",
            "Pure silver/gold electroplated core zari thread (burns to fragile gray ash)"
        ],
        "counterfeit_red_flags": [
            "Powerloom machine cuts: floating threads are mechanically clipped flat on back",
            "Perfect synthetic grid symmetry with zero thread count irregularity",
            "Polyester/lurex metallic sheen that melts into hard plastic bead under heat",
            "Uniform machine-stamped selvage border edges"
        ],
        "physical_test": "Burn Test: Pure silk thread smells like burnt hair and forms fragile ash; polyester fake melts into a hard bead."
    },
    {
        "id": "ODOP-RMN-02",
        "district": "Ramanagara",
        "state": "Karnataka",
        "product_name": "Channapatna Wooden Toys & Lacquerware",
        "category": "Woodcraft & Toys",
        "gi_tag": "GI-23",
        "registered_year": 2006,
        "description": "Ivory wood (Wrightia tinctoria) turned on hand lathes, polished with non-toxic natural lacquer colored with turmeric, indigo, and kumkum.",
        "authenticity_markers": [
            "Hand-turned concentric lathe rings with organic micro-grooves",
            "Smooth organic wood grain contours with natural lacquer shellac sheen",
            "Natural vegetable dye hues (turmeric yellow, kumkum red, indigo blue)",
            "Warm touch and zero chemical petroleum paint odor"
        ],
        "counterfeit_red_flags": [
            "Molded plastic seams or MDF / fiberboard base",
            "High-gloss toxic synthetic enamel paint with strong chemical odor",
            "Lead or phthalate surface coating with peeling edges",
            "Absence of lathe center mounting indentations"
        ],
        "physical_test": "Water & Rub Test: Genuine vegetable lacquer does not leach in cold water and feels warm; synthetic paint chips easily."
    },
    {
        "id": "ODOP-SNG-03",
        "district": "Srinagar",
        "state": "Jammu & Kashmir",
        "product_name": "Kashmir Pashmina & Kani Shawl",
        "category": "Textiles & Handloom",
        "gi_tag": "GI-46",
        "registered_year": 2008,
        "description": "Hand-spun and hand-woven underfleece of Changthangi mountain goat, with fiber fineness between 12-15 microns.",
        "authenticity_markers": [
            "Ultra-fine fiber diameter strictly between 12 and 15 microns",
            "Diamond / Chashm-e-Bulbul weave pattern showing manual tension variations",
            "Open, unhemmed fringed edges with raw hand-spun warp ends",
            "Feather-light warmth (a full shawl passes easily through a finger ring)"
        ],
        "counterfeit_red_flags": [
            "Blended with sheep wool, viscose, or acrylic synthetic fibers (> 19 microns)",
            "Uniform machine-brushed mechanical fleece surface",
            "Hemmed or mechanically overcast stitch edges",
            "Static electricity spark when rubbed vigorously"
        ],
        "physical_test": "Ring Test: Authentic Pashmina effortlessly glides through a finger ring and produces zero static spark."
    },
    {
        "id": "ODOP-JAI-04",
        "district": "Jaipur",
        "state": "Rajasthan",
        "product_name": "Jaipur Blue Pottery",
        "category": "Ceramics & Pottery",
        "gi_tag": "GI-33",
        "registered_year": 2008,
        "description": "Traditional non-clay ceramic craft made from ground quartz stone, Fuller's earth, and natural gum, hand-painted with cobalt blue.",
        "authenticity_markers": [
            "Hand-painted brush strokes with natural cobalt pigment saturation gradients",
            "Micro-crazing (fine hairline crackle lines in transparent quartz glaze)",
            "Dull white ceramic paste core on unglazed bottom rim",
            "Slight weightiness due to pure quartz stone composition"
        ],
        "counterfeit_red_flags": [
            "Screen-printed or transfer-decal graphic patterns with digital dot matrices",
            "Red/brown terracotta clay core underneath chipped glaze",
            "Synthetic oil-based paint coated over ordinary plaster of Paris"
        ],
        "physical_test": "Glaze & Ring Test: Ceramic body is impervious to water; taps with a distinct crystalline resonance unlike clay terracotta."
    },
    {
        "id": "ODOP-MDB-05",
        "district": "Madhubani",
        "state": "Bihar",
        "product_name": "Mithila / Madhubani Painting",
        "category": "Traditional Painting",
        "gi_tag": "GI-105",
        "registered_year": 2007,
        "description": "Folk art created using bamboo twigs, nibs, and natural dyes (lampblack, indigo, turmeric) on handmade paper.",
        "authenticity_markers": [
            "Double-line border outlines drawn with bamboo twigs showing hand tremor dynamics",
            "Natural pigment bleeding on handmade paper fibers with uneven absorption",
            "Geometric fill patterns (Kachni line hatching and Bharni solid color fills)"
        ],
        "counterfeit_red_flags": [
            "CMYK digital offset or inkjet printing with microscopic dot matrix halftone rosettes",
            "Single uniform chemical black marker outline",
            "Coated glossy mill-made paper with zero fiber absorption"
        ],
        "physical_test": "Magnifier Test: Authentic ink shows uneven fiber capillary absorption; counterfeit prints show four-color halftone dots."
    }
]

# Quick lookup helpers
DISTRICT_LOOKUP = {c["district"].lower(): c for c in ODOP_REGISTRY}

def get_craft_by_district(district_name: str):
    return DISTRICT_LOOKUP.get(district_name.lower().strip())
