#!/usr/bin/env python3
"""Render the 1200×630 OG cover PNG.

Pillow + system fonts (Avenir + Times) — close enough to Inter +
Instrument Serif for a social-preview fallback. Run from repo root:

    python3 bin/render-og.py

Writes img/og-cover.png.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT  = ROOT / "img" / "og-cover.png"

BG     = (10, 10, 10)
INK    = (239, 233, 221)        # bone
INK_2  = (199, 194, 183)
INK_3  = (138, 133, 122)
EMBER  = (255, 107, 43)

W, H = 1200, 630

# Best system substitutes available on macOS
TTC_AVENIR = "/System/Library/Fonts/Avenir.ttc"
TTC_TIMES  = "/System/Library/Fonts/Supplemental/Times New Roman Italic.ttf"
TTC_MONO   = "/System/Library/Fonts/Menlo.ttc"

def font(path: str, size: int, index: int = 0):
    try:
        return ImageFont.truetype(path, size, index=index)
    except Exception:
        return ImageFont.load_default()

# Avenir Heavy = index 5 in Avenir.ttc on most macOS installs
F_LARGE  = font(TTC_AVENIR, 130, index=5)
F_MED    = font(TTC_AVENIR, 120, index=5)
F_ITAL   = font(TTC_TIMES,  130)
F_SIG    = font(TTC_AVENIR, 22, index=0)
F_MONO   = font(TTC_MONO,   18)

img = Image.new("RGB", (W, H), BG)
d   = ImageDraw.Draw(img)

# Subtle radial-ish glows via stacked alpha rects (cheap fake of CSS gradients)
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd   = ImageDraw.Draw(glow)
for r, alpha in [(420, 22), (320, 18), (220, 14)]:
    gd.ellipse((-r//2, -r//2, r, r), fill=(*EMBER, alpha))
    gd.ellipse((W - r, H - r, W + r//2, H + r//2),
               fill=(*INK, alpha // 2))
img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
d = ImageDraw.Draw(img)

# Top kicker
d.text((80, 70), "VIJAYKARN.COM.NP", font=F_MONO, fill=INK_3, spacing=6)

# Hero stack
d.text((80, 130), "Senior", font=F_ITAL, fill=INK)
d.text((80, 270), "Full-stack", font=F_MED, fill=INK)

# "Engineer" outline (italic, stroke-only)
d.text((80, 410), "Engineer", font=F_ITAL, fill=BG,
       stroke_width=2, stroke_fill=INK)

# Signature line
d.text(
    (80, 570),
    '— Vijay "Vashu" Karn  ·  Kathmandu, Nepal  ·  PHP/Laravel · Flutter · IoT',
    font=F_SIG, fill=INK_2,
)

# Top-right v2026 chip
d.ellipse((1100, 76, 1120, 96), fill=INK)
d.text((W - 80, 110), "V2026", font=F_MONO, fill=INK_3, anchor="ra")

OUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUT, "PNG", optimize=True)
print(f"Wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")
