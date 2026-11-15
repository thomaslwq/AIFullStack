#!/usr/bin/env python3
"""Generate animated frame sequences for the verify sample.

- f1: person still with a very slow center push-in.
- f2/f3/f4: real code cards; highlight rows fade in, key underlines expand
  left-to-right, staggered per item. Frames are encoded by build.sh.
"""
import subprocess
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageDraw
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


OPENING_HTML = """<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box;}
body{width:720px;height:1280px;background:#1f2430;color:#e5e9f0;
 font-family:'Noto Sans CJK SC',sans-serif;display:flex;flex-direction:column;padding:150px 44px 0;}
.tag{align-self:flex-start;background:#2b3140;color:#e5c07b;font-size:22px;padding:10px 18px;border-radius:999px;letter-spacing:1px;}
.title{margin-top:46px;font-size:52px;line-height:1.45;font-weight:700;}
.title .hl{color:#e5c07b;}
.result{margin-top:36px;align-self:flex-start;background:#3a2630;border-left:4px solid #e06c75;color:#e06c75;font-size:26px;padding:16px 22px;border-radius:12px;}
</style></head><body>
<div class="tag">MyBatis · 字段映射排查</div>
<div class="title">SQL 执行成功<br><span class="hl">却查不到数据？</span></div>
<div class="result">返回结果：空列表 / null</div>
</body></html>"""


def render_opening_base():
    BUILD.mkdir(parents=True, exist_ok=True)
    html_path = BUILD / "opening.html"
    html_path.write_text(OPENING_HTML, encoding="utf-8")
    png = BUILD / "opening_base.png"
    subprocess.run([
        "/usr/local/bin/chromium", "--headless", "--disable-gpu", "--no-sandbox",
        "--hide-scrollbars", "--force-device-scale-factor=1",
        "--window-size=720,1280", f"--screenshot={png}", f"file://{html_path}",
    ], check=True, capture_output=True)
    return Image.open(png).convert("RGB")


def opening_frames(base):
    src = Image.open(ASSETS / "01.jpg").convert("RGB")
    cw, ch = 580, 740
    sx0, sy0 = 70, 350
    src_c = src.crop((sx0, sy0, sx0 + cw, sy0 + ch))
    Ww, Hh = 282, 360
    ox, oy = W - Ww - 36, 600

    def draw(img, t):
        p = clamp((t - 0.2) / 0.4)
        scale = 1.0 + 0.06 * (t / SEG)
        nw, nh = int(cw * scale), int(ch * scale)
        im = src_c.resize((nw, nh), Image.LANCZOS)
        x, y = (nw - cw) // 2, (nh - ch) // 2
        im = im.crop((x, y, x + cw, y + ch)).resize((Ww, Hh), Image.LANCZOS)
        dx = int(30 * (1 - p))
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        om = Image.new("L", (Ww, Hh), 0)
        ImageDraw.Draw(om).rounded_rectangle([0, 0, Ww - 1, Hh - 1], radius=16, fill=int(255 * p))
        overlay.paste(im, (ox + dx, oy), om)
        od = ImageDraw.Draw(overlay)
        od.rounded_rectangle([ox + dx, oy, ox + dx + Ww - 1, oy + Hh - 1], radius=16,
                             outline=(*HL_BAR, int(255 * p)), width=2)
        return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

    save_frames("f1", base, draw)


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
    opening_frames(render_opening_base())
    with sync_playwright() as pw:
        for seg, html, hl_sel, ul_sel in CONFIGS:
            card_frames(pw, seg, html, hl_sel, ul_sel)


if __name__ == "__main__":
    main()
