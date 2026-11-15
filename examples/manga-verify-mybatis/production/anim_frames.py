#!/usr/bin/env python3
"""Generate animated frame sequences for the half-realistic manga-drama sample.

- f1: two-character illustration panel (slow push-in) + Lin Ke dialogue bubble.
- f2/f3/f4: real code cards with highlight fade-in + expanding underlines,
  plus a character illustration small window with a name tag.
Frames are encoded by build.sh.
"""
import json
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

BASE = Path(__file__).resolve().parent
CARDS = BASE / "cards"
BUILD = BASE / "build"
FRAMES = BUILD / "frames"
ASSETS = BASE / "../../../docs/manga/episodes/verify-mybatis-camelcase/assets"

FPS = 25
SEG = 5.057
N = round(FPS * SEG)
W, H = 720, 1280

HL_BG = (58, 53, 39)
HL_BAR = (229, 192, 123)
UL = (229, 192, 123)

FONT_PATH = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"

TAG_WEN = (122, 162, 247)   # 文哥 blue-grey
TAG_LIN = (229, 192, 123)   # 林可 amber
INK = (31, 36, 48)

WIN_W, WIN_H = 282, 360
WIN_X = W - WIN_W - 36
WIN_Y = 600


def clamp(x):
    return max(0.0, min(1.0, x))


def font(size):
    return ImageFont.truetype(FONT_PATH, size)


def load_illust(name):
    return Image.open(ASSETS / name).convert("RGB")


def cover(img, w, h, top_bias=0.2):
    """Center-cover crop to target size; bias the vertical crop upward for busts."""
    iw, ih = img.size
    r = w / h
    ir = iw / ih
    if ir > r:  # too wide, crop width
        nw = int(ih * r)
        x = (iw - nw) // 2
        im = img.crop((x, 0, x + nw, ih))
    else:       # too tall, crop height (keep head near top)
        nh = int(iw / r)
        y = int((ih - nh) * top_bias)
        im = img.crop((0, y, iw, y + nh))
    return im.resize((w, h), Image.LANCZOS)


def push_in(img, t, k=0.045):
    scale = 1.0 + k * (t / SEG)
    nw, nh = int(W * scale), int(H * scale)
    im = img.resize((nw, nh), Image.LANCZOS)
    x, y = (nw - W) // 2, (nh - H) // 2
    return im.crop((x, y, x + W, y + H))


def wrap(draw, text, fnt, max_w):
    lines, cur = [], ""
    for ch in text:
        if ch == "\n":
            lines.append(cur)
            cur = ""
            continue
        if draw.textlength(cur + ch, font=fnt) > max_w and cur:
            lines.append(cur)
            cur = ch
        else:
            cur += ch
    if cur:
        lines.append(cur)
    return lines


def draw_bubble(ov, text, tail_x, tail_y):
    d = ImageDraw.Draw(ov)
    fnt = font(30)
    pad, lh, max_w = 22, 42, W - 112
    lines = wrap(d, text, fnt, max_w)
    bw = int(max(d.textlength(l, font=fnt) for l in lines)) + 2 * pad
    bh = len(lines) * lh + 2 * pad
    bx, by = 56, 150
    d.polygon(
        [(tail_x, tail_y), (tail_x - 18, by + bh), (tail_x + 18, by + bh)],
        fill=(255, 255, 255, 255), outline=(*INK, 255),
    )
    d.rounded_rectangle(
        [bx, by, bx + bw, by + bh], radius=24,
        fill=(255, 255, 255, 255), outline=(*INK, 255), width=3,
    )
    ty = by + pad
    for line in lines:
        d.text((bx + pad, ty), line, font=fnt, fill=(*INK, 255))
        ty += lh


def overlay_window(ov, t, src, tag, bg, fg):
    p = clamp((t - 0.2) / 0.4)
    if p <= 0:
        return
    scale = 1.0 + 0.06 * (t / SEG)
    nw, nh = int(WIN_W * scale), int(WIN_H * scale)
    im = cover(src, nw, nh)
    x, y = (nw - WIN_W) // 2, (nh - WIN_H) // 2
    im = im.crop((x, y, x + WIN_W, y + WIN_H))
    mask = Image.new("L", (WIN_W, WIN_H), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, WIN_W - 1, WIN_H - 1], radius=16, fill=int(255 * p))
    dx = int(30 * (1 - p))
    ox = WIN_X + dx
    ov.paste(im, (ox, WIN_Y), mask)
    d = ImageDraw.Draw(ov)
    d.rounded_rectangle(
        [ox, WIN_Y, ox + WIN_W - 1, WIN_Y + WIN_H - 1],
        radius=16, outline=(*bg, int(255 * p)), width=2)
    tag_fnt = font(24)
    tw = int(d.textlength(tag, font=tag_fnt)) + 32
    d.rounded_rectangle(
        [ox, WIN_Y - 48, ox + tw, WIN_Y - 8],
        radius=12, fill=(*bg, int(255 * p)))
    d.text((ox + 16, WIN_Y - 40), tag, font=tag_fnt, fill=(*fg, int(255 * p)))


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


def duo_frames():
    subs = json.loads((BASE / "subtitles.json").read_text(encoding="utf-8"))
    line1 = subs[0]["subtitle_text"]
    base = load_illust("illust-duo.jpg")

    def draw(img, t):
        img = push_in(img, t)
        ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw_bubble(ov, line1, tail_x=180, tail_y=555)
        return Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")

    save_frames("f1", base, draw)


# seg, html, highlight selector, underline selector, illust, tag, tag bg, tag fg
CONFIGS = [
    ("f2", "card1.html", ".hl", ".note b", "illust-wenge.jpg", "文哥", TAG_WEN, (255, 255, 255)),
    ("f3", "card2.html", ".col .kw", ".col .kw", "illust-linke.jpg", "林可", TAG_LIN, INK),
    ("f4", "card3.html", ".hl", ".note b", "illust-wenge.jpg", "文哥", TAG_WEN, (255, 255, 255)),
]


def card_frames(pw, seg, html, hl_sel, ul_sel, src, tag, bg, fg):
    url = "file://" + str((CARDS / html).resolve())
    browser = pw.chromium.launch(
        executable_path="/usr/local/bin/chromium",
        args=["--no-sandbox", "--disable-gpu"],
    )
    page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
    page.goto(url)
    page.add_style_tag(content=".hl{background:transparent!important;border-left:none!important;}")
    hls = [e.bounding_box() for e in page.locator(hl_sel).all() if e.bounding_box()]
    uls = [e.bounding_box() for e in page.locator(ul_sel).all() if e.bounding_box()]
    base = Image.open(BytesIO(page.screenshot())).convert("RGB")
    browser.close()

    def draw(img, t):
        ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(ov)
        ha = clamp((t - 0.55) / 0.5)
        if ha > 0:
            for b in hls:
                d.rectangle(
                    [b["x"], b["y"], b["x"] + b["width"], b["y"] + b["height"]],
                    fill=(*HL_BG, int(200 * ha)))
                d.rectangle(
                    [b["x"], b["y"], b["x"] + 4, b["y"] + b["height"]],
                    fill=(*HL_BAR, int(255 * ha)))
            for j, b in enumerate(uls):
                start = 1.0 + 0.15 * j
                w = b["width"] * clamp((t - start) / 0.35)
                if w > 0:
                    y = b["y"] + b["height"] + 5
                    d.rectangle([b["x"], y, b["x"] + w, y + 3], fill=(*UL, 230))
        overlay_window(ov, t, src, tag, bg, fg)
        return Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")

    save_frames(seg, base, draw)


def main():
    duo_frames()
    with sync_playwright() as pw:
        for seg, html, hl, ul, ill, tag, bg, fg in CONFIGS:
            card_frames(pw, seg, html, hl, ul, load_illust(ill), tag, bg, fg)


if __name__ == "__main__":
    main()
