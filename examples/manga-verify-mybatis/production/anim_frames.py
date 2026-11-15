#!/usr/bin/env python3
"""Generate animated frame sequences for the verify sample.

- f1: person still with a very slow center push-in.
- f2/f3/f4: real code cards; highlight rows fade in, key underlines expand
  left-to-right, staggered per item. Frames are encoded by build.sh.
"""
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

BASE = Path(__file__).resolve().parent
CARDS = BASE / "cards"
FRAMES = BASE / "build" / "frames"
ASSETS = BASE / "../../../docs/manga/episodes/verify-mybatis-camelcase/assets"

FPS = 25
SEG = 5.057
N = round(FPS * SEG)
W, H = 720, 1280

HL_BG = (58, 53, 39)
HL_BAR = (229, 192, 123)
UL = (229, 192, 123)


def clamp(x):
    return max(0.0, min(1.0, x))


def save_frames(seg, base, draw_frame):
    out = FRAMES / seg
    out.mkdir(parents=True, exist_ok=True)
    for i in range(N):
        t = i / FPS
        img = base.copy()
        img = draw_frame(img, t)
        fade = clamp(t / 0.3)
        if fade < 1:
            img = Image.blend(Image.new("RGB", (W, H), (0, 0, 0)), img, fade)
        img.save(out / f"{i + 1:04d}.png")
    print("frames", seg, N)


def person_frames():
    src = Image.open(ASSETS / "01.jpg").convert("RGB")

    def draw(img, t):
        p = t / SEG
        scale = 1.0 + 0.045 * p
        nw, nh = int(W * scale), int(H * scale)
        im = src.resize((nw, nh), Image.LANCZOS)
        x, y = (nw - W) // 2, (nh - H) // 2
        return im.crop((x, y, x + W, y + H))

    save_frames("f1", src, draw)


# seg, html, highlight selector, underline selector
CONFIGS = [
    ("f2", "card1.html", ".hl", ".note b"),
    ("f3", "card2.html", ".col .kw", ".col .kw"),
    ("f4", "card3.html", ".hl", ".note b"),
]


def card_frames(pw, seg, html, hl_sel, ul_sel):
    url = "file://" + str((CARDS / html).resolve())
    browser = pw.chromium.launch(
        executable_path="/usr/local/bin/chromium",
        args=["--no-sandbox", "--disable-gpu"],
    )
    page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
    page.goto(url)
    # Strip the static highlight so the script can fade it in itself.
    page.add_style_tag(content=".hl{background:transparent!important;border-left:none!important;}")
    hls = [e.bounding_box() for e in page.locator(hl_sel).all() if e.bounding_box()]
    uls = [e.bounding_box() for e in page.locator(ul_sel).all() if e.bounding_box()]
    base = Image.open(BytesIO(page.screenshot())).convert("RGB")
    browser.close()

    def draw(img, t):
        ha = clamp((t - 0.55) / 0.5)
        if ha <= 0:
            return img
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(overlay)
        for b in hls:
            d.rectangle(
                [b["x"], b["y"], b["x"] + b["width"], b["y"] + b["height"]],
                fill=(*HL_BG, int(200 * ha)),
            )
            d.rectangle(
                [b["x"], b["y"], b["x"] + 4, b["y"] + b["height"]],
                fill=(*HL_BAR, int(255 * ha)),
            )
        for j, b in enumerate(uls):
            start = 1.0 + 0.15 * j
            w = b["width"] * clamp((t - start) / 0.35)
            if w > 0:
                y = b["y"] + b["height"] + 5
                d.rectangle([b["x"], y, b["x"] + w, y + 3], fill=(*UL, 230))
        return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

    save_frames(seg, base, draw)


def main():
    person_frames()
    with sync_playwright() as pw:
        for seg, html, hl_sel, ul_sel in CONFIGS:
            card_frames(pw, seg, html, hl_sel, ul_sel)


if __name__ == "__main__":
    main()
