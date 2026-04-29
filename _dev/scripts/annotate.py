from PIL import Image, ImageDraw, ImageFont
import textwrap

# ── font setup ────────────────────────────────────────────────────────────────
try:
    font_bold  = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 22)
    font_body  = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 18)
    font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 15)
    font_num   = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
except:
    font_bold  = ImageFont.load_default()
    font_body  = font_bold
    font_small = font_bold
    font_num   = font_bold

PANEL_W   = 560
DOT_R     = 18
LINE_COL  = (220, 60, 60)
DOT_COL   = (220, 60, 60)
TEXT_COL  = (20, 20, 20)
HEAD_COL  = (220, 60, 60)
PANEL_BG  = (245, 245, 242)
BORDER    = (200, 200, 195)


def draw_callout(draw, cx, cy, label, img_w):
    """Draw numbered circle on the image side."""
    r = DOT_R
    # red circle
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=DOT_COL, outline="white", width=2)
    # number centred
    bbox = draw.textbbox((0, 0), str(label), font=font_num)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((cx - tw // 2, cy - th // 2 - 1), str(label), font=font_num, fill="white")


def draw_line(draw, cx, cy, panel_x, panel_y):
    """Draw a line from callout dot to the annotation panel row."""
    draw.line([(cx + DOT_R, cy), (panel_x - 8, panel_y)], fill=LINE_COL, width=2)


def annotate(src, dst, title, subtitle, points):
    """
    points = list of dicts:
      { 'dot': (x, y),        # position of callout dot on image (pre-scale)
        'label': 'Good',      # 'Good' | 'Bad' | 'Note'
        'head': 'short title',
        'body': 'annotation text' }
    """
    img = Image.open(src).convert("RGB")
    img_w, img_h = img.size

    # Scale image down so it sits nicely next to the panel
    scale    = 0.55
    thumb_w  = int(img_w * scale)
    thumb_h  = int(img_h * scale)
    thumb    = img.resize((thumb_w, thumb_h), Image.LANCZOS)

    # Canvas
    pad      = 40
    row_h    = 130
    panel_h  = pad + len(points) * row_h + pad
    canvas_h = max(thumb_h, panel_h) + pad * 2 + 80   # 80 for title bar
    canvas_w = thumb_w + PANEL_W + pad * 3

    canvas = Image.new("RGB", (canvas_w, canvas_h), PANEL_BG)
    draw   = ImageDraw.Draw(canvas)

    # ── title bar ────────────────────────────────────────────────────────────
    draw.rectangle([0, 0, canvas_w, 70], fill=(30, 30, 30))
    draw.text((pad, 14), title, font=font_bold, fill="white")
    draw.text((pad + 6, 40), subtitle, font=font_small, fill=(180, 180, 180))

    # ── paste thumbnail ───────────────────────────────────────────────────────
    img_x = pad
    img_y = 70 + pad
    canvas.paste(thumb, (img_x, img_y))

    # thin border around image
    draw.rectangle([img_x - 1, img_y - 1, img_x + thumb_w, img_y + thumb_h],
                   outline=BORDER, width=1)

    # ── panel area ────────────────────────────────────────────────────────────
    panel_x = img_x + thumb_w + pad
    panel_y_start = img_y

    draw_canvas = ImageDraw.Draw(canvas)

    label_colours = {
        "Good": (34, 139, 60),
        "Bad":  (200, 50, 50),
        "Note": (60, 100, 180),
    }

    for i, pt in enumerate(points):
        # dot on image
        dx = img_x + int(pt["dot"][0] * scale)
        dy = img_y + int(pt["dot"][1] * scale)
        draw_callout(draw_canvas, dx, dy, i + 1, thumb_w)

        # row in panel
        row_y = panel_y_start + i * row_h

        # connector line
        draw_canvas.line([(dx, dy), (panel_x, row_y + 30)], fill=LINE_COL, width=1)

        # row background
        draw_canvas.rectangle([panel_x, row_y + 4, panel_x + PANEL_W - 20, row_y + row_h - 4],
                               fill="white", outline=BORDER, width=1)

        # number badge
        draw_canvas.ellipse([panel_x + 8, row_y + 12, panel_x + 36, row_y + 40],
                            fill=DOT_COL)
        bbox = draw_canvas.textbbox((0,0), str(i+1), font=font_num)
        tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
        draw_canvas.text((panel_x + 22 - tw//2, row_y + 26 - th//2 - 1),
                         str(i+1), font=font_num, fill="white")

        # label tag (Good / Bad / Note)
        tag     = pt.get("label", "Note")
        tag_col = label_colours.get(tag, (80, 80, 80))
        tag_x   = panel_x + 44
        tag_y   = row_y + 14
        bbox    = draw_canvas.textbbox((0,0), tag, font=font_small)
        tw      = bbox[2] - bbox[0]
        draw_canvas.rectangle([tag_x - 4, tag_y - 2, tag_x + tw + 6, tag_y + 18],
                               fill=tag_col)
        draw_canvas.text((tag_x, tag_y), tag, font=font_small, fill="white")

        # heading
        draw_canvas.text((panel_x + 44, row_y + 36), pt["head"], font=font_bold, fill=TEXT_COL)

        # body wrapped
        wrapped = textwrap.wrap(pt["body"], width=46)
        for j, line in enumerate(wrapped[:3]):
            draw_canvas.text((panel_x + 44, row_y + 60 + j * 20), line,
                             font=font_small, fill=(80, 80, 80))

    canvas.save(dst)
    print(f"saved {dst}")


# ── STAGE 1 ───────────────────────────────────────────────────────────────────
annotate(
    src="crop_stage1_hero.png",
    dst="annotated_stage1.png",
    title="Stage 1 -- Early Prototype",
    subtitle="Black and white structural layout. No brand identity applied.",
    points=[
        {
            "dot": (58, 22),
            "label": "Bad",
            "head": "Default Arial font",
            "body": "Arial was used as a placeholder before the brand typeface was chosen. It makes the site look completely generic and has no connection to the Focal&Co. identity.",
        },
        {
            "dot": (720, 22),
            "label": "Note",
            "head": "Text-only logo",
            "body": "The logo is plain bold text rather than the SVG lockup. This was intentional at this stage to focus on layout structure before adding brand assets.",
        },
        {
            "dot": (720, 152),
            "label": "Note",
            "head": "Centred hero headline",
            "body": "Basic centred alignment gives the page a starting structure. No typographic scale or letter-spacing has been applied so it lacks visual confidence.",
        },
        {
            "dot": (720, 250),
            "label": "Bad",
            "head": "Outlined button with no fill",
            "body": "The CTA has no visual weight. It does not draw the eye and would not encourage a user to click. There is no hierarchy between the heading and the button.",
        },
        {
            "dot": (720, 330),
            "label": "Note",
            "head": "White background, no brand colour",
            "body": "No brand colour has been applied at all. The white background is purely functional. The next step was to apply the dark base (#1a1b0f) from the brand guidelines.",
        },
    ]
)

# ── STAGE 2 ───────────────────────────────────────────────────────────────────
annotate(
    src="crop_stage2_hero.png",
    dst="annotated_stage2.png",
    title="Stage 2 -- Brand Colour and Typeface Applied",
    subtitle="Dark base and yellow accent introduced. Poppins loaded from Google Fonts.",
    points=[
        {
            "dot": (95, 36),
            "label": "Good",
            "head": "Yellow accent on logo (#f4ec5f)",
            "body": "Applying the primary brand yellow to the logo was the first real brand decision. It immediately separates the identity from a generic site.",
        },
        {
            "dot": (720, 36),
            "label": "Good",
            "head": "Dark base colour applied (#1a1b0f)",
            "body": "Switching to the near-black background gave the page its brand character. This single change had the biggest visual impact of any decision in the process.",
        },
        {
            "dot": (720, 215),
            "label": "Good",
            "head": "Poppins loaded via Google Fonts",
            "body": "Poppins replaced Arial as the body and heading font. It is warmer and more considered but it is still not the display serif specified in the brand guidelines.",
        },
        {
            "dot": (720, 390),
            "label": "Bad",
            "head": "CTA button still flat",
            "body": "The yellow button uses the correct colour but has no depth, shadow or hover state. It looks pasted on rather than designed. This was improved in the final version.",
        },
        {
            "dot": (1200, 36),
            "label": "Note",
            "head": "Nav links in muted grey",
            "body": "Using #c7c7c7 for nav links creates hierarchy so the logo reads first. This is a deliberate typographic choice based on the brand colour palette.",
        },
    ]
)

# ── STAGE 3 ───────────────────────────────────────────────────────────────────
annotate(
    src="crop_stage3_hero.png",
    dst="annotated_stage3.png",
    title="Stage 3 -- Final Design",
    subtitle="PP Fragment Glare typeface, SVG logo lockup, editorial scale and interactive elements.",
    points=[
        {
            "dot": (113, 37),
            "label": "Good",
            "head": "Full SVG logo lockup",
            "body": "The logomark and wordmark SVG replace the text placeholder. It matches the brand asset exactly and scales cleanly at any size without blurring.",
        },
        {
            "dot": (1186, 37),
            "label": "Good",
            "head": "Pill-style navigation components",
            "body": "The nav buttons are designed pill shapes rather than default browser elements. This makes the navigation feel considered and on-brand.",
        },
        {
            "dot": (530, 150),
            "label": "Good",
            "head": "PP Fragment Glare at editorial scale",
            "body": "The correct display serif typeface is now used for the headline. Tight tracking (-0.03em) and a very large size give the design the bold, confident tone the brand requires.",
        },
        {
            "dot": (723, 335),
            "label": "Good",
            "head": "Showreel card in the headline",
            "body": "An interactive card is embedded within the display type. This adds depth and visual interest that sets the final design apart from the earlier flat stages.",
        },
        {
            "dot": (967, 420),
            "label": "Note",
            "head": "Showreel label with arrow",
            "body": "Small typographic labels with directional cues guide the user. This detail would not have been possible to add until the layout and type hierarchy were resolved.",
        },
    ]
)
