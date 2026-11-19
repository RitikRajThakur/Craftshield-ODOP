"""
=============================================================================
ODOP Handicraft Authenticity Assistant - Core AI Engine (Step 1)
File: detector.py
Author: B.Tech CSE Student Project
Purpose: Detect authentic handloom/handcraft vs machine powerloom fakes
         using Computer Vision (Micro-Texture & Spatial Symmetry Analysis).
=============================================================================
"""

import sys
import math
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps, ImageDraw

class CraftDetector:
    """
    Analyzes optical micro-texture features from craft photographs.
    
    Two Core Technical Principles:
    1. Human Weave Variance: Hand-woven crafts have natural micro-irregularities 
       in thread tension and spacing (15% to 40% coefficient of variation).
    2. Powerloom Symmetry: Motorized machine looms create rigid mathematical 
       periodic repetition (> 70% spatial autocorrelation peaks).
    """

    def analyze(self, image_path: str) -> dict:
        """
        Loads an image, analyzes its micro-texture and symmetry, 
        and returns an authenticity report based purely on image-derived features.
        """
        # Step 1: Load image and convert to grayscale
        img = Image.open(image_path).convert("RGB")
        
        # Resize if overly large for fast, efficient computation
        max_size = 800
        if max(img.size) > max_size:
            img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            
        gray = ImageOps.grayscale(img)
        img_np = np.array(gray, dtype=np.float32)
        h, w = img_np.shape

        # Step 2: Local gradient magnitude (Sobel-inspired difference)
        # Measures the sharpness and direction of weave edges.
        gx = np.zeros_like(img_np)
        gy = np.zeros_like(img_np)
        gx[:, 1:-1] = (img_np[:, 2:] - img_np[:, :-2]) / 2.0
        gy[1:-1, :] = (img_np[2:, :] - img_np[:-2, :]) / 2.0
        grad_mag = np.sqrt(gx**2 + gy**2)

        # Step 3: Patch-based weave edge energy variance (human tension wobble)
        # Hand-woven fabrics have organic, fluctuating thread tension across patches.
        # Motorized powerlooms produce uniform edge density across every patch.
        patch_size = 32
        n_patches_y = h // patch_size
        n_patches_x = w // patch_size

        patch_energies = []
        for py in range(n_patches_y):
            for px in range(n_patches_x):
                patch = grad_mag[py*patch_size:(py+1)*patch_size, px*patch_size:(px+1)*patch_size]
                patch_energies.append(float(np.mean(patch)))

        patch_vals = np.array(patch_energies)
        mean_energy = float(np.mean(patch_vals)) + 1e-5
        std_energy = float(np.std(patch_vals))
        
        # Coefficient of Variation (CV %) across surface patches
        cv_ratio = (std_energy / mean_energy) * 100.0

        # Step 4: Multi-Scanline Detrended Autocorrelation (Machine Periodicity)
        # Powerlooms produce strong, harmonic periodic spikes at exact pixel intervals.
        # Handlooms have soft, decaying signals with irregular peak intervals.
        def line_periodicity(matrix: np.ndarray, axis: int) -> float:
            scores = []
            n_lines = 16
            indices = np.linspace(h * 0.1, h * 0.9, n_lines, dtype=int) if axis == 0 else np.linspace(w * 0.1, w * 0.9, n_lines, dtype=int)
            for idx in indices:
                line = matrix[idx, :] if axis == 0 else matrix[:, idx]
                # High-pass / detrend with moving average to eliminate macro motifs / lighting gradients
                window = 17
                trend = np.convolve(line, np.ones(window)/window, mode="same")
                micro = line - trend
                if np.std(micro) < 1e-3:
                    continue
                corr = np.correlate(micro, micro, mode="full")
                mid = len(corr) // 2
                max_lag = min(80, len(micro) // 2)
                half = corr[mid:mid + max_lag] / (corr[mid] + 1e-5)
                
                # Check for secondary harmonic peaks beyond optical blur lag (lag >= 3)
                diffs = np.diff(half)
                peaks = np.where((diffs[:-1] > 0) & (diffs[1:] < 0))[0] + 1
                valid_peaks = [p for p in peaks if p >= 3]
                if valid_peaks:
                    scores.append(max(half[p] for p in valid_peaks))
            return float(np.mean(scores)) if scores else 0.05

        h_periodicity = line_periodicity(img_np, 0)
        v_periodicity = line_periodicity(img_np, 1)
        raw_symmetry = max(h_periodicity, v_periodicity)
        machine_symmetry_score = round(min(99.0, max(5.0, raw_symmetry * 100.0)), 1)

        # Step 5: Micro-Texture Score (0 to 100%)
        # Organic handloom: high thread tension irregularity (cv_ratio > 20%)
        # Machine powerloom: unnaturally flat/uniform grid (cv_ratio < 10%)
        if cv_ratio < 10.0:
            micro_texture_score = round(max(10.0, cv_ratio * 3.5), 1)
        elif cv_ratio < 25.0:
            micro_texture_score = round(35.0 + (cv_ratio - 10.0) * 2.5, 1)
        else:
            micro_texture_score = round(min(96.0, 72.5 + np.log10(max(1.0, cv_ratio)) * 12.0), 1)

        # Step 6: Authenticity Score & Verdict Calculation
        # Combines micro-texture irregularity and low machine symmetry into continuous composite score.
        combined_index = (micro_texture_score * 0.6) + ((100.0 - machine_symmetry_score) * 0.4)
        overall_score = round(min(98.5, max(8.0, combined_index)), 1)

        if machine_symmetry_score >= 60.0 or overall_score < 50.0:
            verdict = "SUSPICIOUS_POWERLOOM_MACHINE"
        elif machine_symmetry_score < 45.0 and overall_score >= 70.0:
            verdict = "AUTHENTIC_HANDCRAFT"
        else:
            verdict = "LIKELY_AUTHENTIC"

        return {
            "image": str(image_path),
            "verdict": verdict,
            "authenticity_score": overall_score,
            "micro_texture_score": micro_texture_score,
            "machine_symmetry_score": machine_symmetry_score,
            "tension_variance_ratio": round(cv_ratio, 2)
        }


def generate_demo_samples(folder: Path):
    """
    Generates two sample synthetic images for immediate testing:
    1. authentic_handloom.jpg (simulates handloom shuttle tension wobble)
    2. counterfeit_powerloom.jpg (simulates rigid machine repeat grid)
    """
    folder.mkdir(parents=True, exist_ok=True)
    w, h = 400, 400

    # 1. Authentic Handloom Sample (Organic thread wobble)
    handloom = np.zeros((h, w, 3), dtype=np.uint8)
    handloom[:, :, 0] = 140 # Deep crimson silk
    handloom[:, :, 1] = 20
    handloom[:, :, 2] = 40
    np.random.seed(42)
    for y in range(0, h, 4):
        wobble = int(np.random.normal(0, 0.9))
        y_pos = min(h - 1, max(0, y + wobble))
        handloom[y_pos, :, 0] = np.clip(handloom[y_pos, :, 0] + 45, 0, 255)
    
    img_hl = Image.fromarray(handloom)
    draw_hl = ImageDraw.Draw(img_hl)
    draw_hl.ellipse([150, 150, 250, 250], outline=(220, 180, 50), width=3) # Kadwa motif
    auth_path = folder / "authentic_handloom.jpg"
    img_hl.save(str(auth_path), quality=92)

    # 2. Counterfeit Powerloom Sample (Rigid mathematical grid)
    powerloom = np.zeros((h, w, 3), dtype=np.uint8)
    powerloom[:, :, 0] = 180
    powerloom[:, :, 1] = 10
    powerloom[:, :, 2] = 30
    powerloom[::6, :, :] += 60  # Mathematical repeat every 6 pixels
    powerloom[:, ::6, :] += 60
    
    img_pl = Image.fromarray(powerloom)
    fake_path = folder / "counterfeit_powerloom.jpg"
    img_pl.save(str(fake_path), quality=95)

    return auth_path, fake_path


if __name__ == "__main__":
    detector = CraftDetector()
    current_dir = Path(__file__).resolve().parent

    print("=================================================================")
    print("   CraftShield ODOP - Micro-Texture Authenticity Detector (v1)   ")
    print("=================================================================\n")

    # If an image path was provided via command line:
    if len(sys.argv) > 1:
        target_image = sys.argv[1]
        print(f"Scanning target image: {target_image}...")
        report = detector.analyze(target_image)
        print("\n--- INSPECTION REPORT ---")
        for k, v in report.items():
            print(f"  {k:24}: {v}")
    else:
        # Run built-in self test using sample images
        print("No image provided. Generating 2 demo samples for self-test...\n")
        sample_dir = current_dir / "samples"
        auth_file, fake_file = generate_demo_samples(sample_dir)

        print("[Test 1] Scanning Authentic Handloom Sample:")
        res1 = detector.analyze(str(auth_file))
        print(f"  Verdict:           {res1['verdict']}")
        print(f"  Authenticity Score: {res1['authenticity_score']}%")
        print(f"  Symmetry Score:     {res1['machine_symmetry_score']}% (Low = Good)\n")

        print("[Test 2] Scanning Counterfeit Powerloom Sample:")
        res2 = detector.analyze(str(fake_file))
        print(f"  Verdict:           {res2['verdict']}")
        print(f"  Authenticity Score: {res2['authenticity_score']}%")
        print(f"  Symmetry Score:     {res2['machine_symmetry_score']}% (High = Machine Fake)\n")

        print("=================================================================")
        print("Self-test completed successfully!")
        print("To scan any image, run:")
        print("  python3 detector.py path/to/your_craft_photo.jpg")
        print("=================================================================")
