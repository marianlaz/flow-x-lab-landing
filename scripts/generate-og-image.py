#!/usr/bin/env python3
"""Generate the Open Graph / Twitter share image for Flow Experiments Lab.

Produces public/og-image.png (1200x630) matching the site's minimal
black-on-white brand: a near-black canvas, the white "FX" logo mark, the
site title, and the tagline. Re-run this script if the branding changes.
"""
import io
from PIL import Image, ImageDraw, ImageFont
import cairosvg

W, H = 1200, 630
BG = (10, 10, 10)          # near-black, matches --background dark (oklch 0.145)
FG = (250, 250, 250)       # near-white, matches --foreground dark (oklch 0.985)
MUTED = (161, 161, 161)    # muted gray, matches --muted-foreground (oklch 0.708)
BORDER = (64, 64, 64)      # subtle divider, matches --border (oklch 0.269)

# The two "foreground" glyph paths from public/icon.svg, rendered white on a
# transparent canvas so the mark sits cleanly on the dark OG background.
LOGO_SVG = """
<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill="#FAFAFA"
    d="M101.141 53H136.632C151.023 53 162.689 64.6662 162.689 79.0573V112.904H148.112V79.0573C148.112 78.7105 148.098 78.3662 148.072 78.0251L112.581 112.898C112.701 112.902 112.821 112.904 112.941 112.904H148.112V126.672H112.941C98.5504 126.672 86.5638 114.891 86.5638 100.5V66.7434H101.141V100.5C101.141 101.15 101.191 101.792 101.289 102.422L137.56 66.7816C137.255 66.7563 136.945 66.7434 136.632 66.7434H101.141V53Z" />
  <path fill="#FAFAFA"
    d="M65.2926 124.136L14 66.7372H34.6355L64.7495 100.436V66.7372H80.1365V118.47C80.1365 126.278 70.4953 129.958 65.2926 124.136Z" />
</svg>
"""


def load_font(paths, size):
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            continue
    return ImageFont.load_default()


def main():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    margin = 90

    # Logo mark (rasterize the SVG glyph to a PNG, then paste).
    logo_size = 96
    logo_png = cairosvg.svg2png(
        bytestring=LOGO_SVG.encode("utf-8"),
        output_width=logo_size,
        output_height=logo_size,
    )
    logo = Image.open(io.BytesIO(logo_png)).convert("RGBA")
    img.paste(logo, (margin, margin), logo)

    bold = ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]
    regular = ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]

    title_font = load_font(bold, 82)
    tagline_font = load_font(regular, 40)
    sub_font = load_font(regular, 30)

    # Title
    title = "Flow Experiments Lab"
    ty = 270
    draw.text((margin, ty), title, font=title_font, fill=FG)

    # Tagline
    tagline = "A space for building and experimentation."
    draw.text((margin, ty + 120), tagline, font=tagline_font, fill=MUTED)

    # Bottom divider + audience line, echoing the site's bordered sections.
    line_y = H - 120
    draw.line([(margin, line_y), (W - margin, line_y)], fill=BORDER, width=2)
    sub = "For indie builders, founders, and technical entrepreneurs who ship."
    draw.text((margin, line_y + 34), sub, font=sub_font, fill=MUTED)

    out = "public/og-image.png"
    img.save(out, "PNG")
    print(f"wrote {out} ({W}x{H})")


if __name__ == "__main__":
    main()
