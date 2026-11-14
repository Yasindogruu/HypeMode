#!/usr/bin/env python3
"""HypeMode ekran görüntülerini otomatik çeker (README galerisi için).

Kullanım:
    pip install playwright && playwright install chromium
    python tools/screenshots.py --url https://yasindogruu.github.io/HypeMode/ -o docs/screenshots
"""
import argparse, asyncio, os
from playwright.async_api import async_playwright

PAGES = [("bugun", "home"), ("kalp", "hrd"), ("uyku", "slp"), ("yuk", "yuk"), ("antrenman", "programs"),
         ("yemek", "food"), ("araclar", "tools"), ("profil", "friends"), ("ayarlar", "settings")]
PREP = """(()=>{A.obSkip();const S=window.__hm.S();S.settings.rz={v:2,cloud:false,health:true};A.giDemo();})()"""


async def shoot(url, out):
    os.makedirs(out, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        async def page(w, h, scale, touch):
            c = await b.new_context(viewport={"width": w, "height": h}, device_scale_factor=scale, has_touch=touch, is_mobile=w < 600)
            pg = await c.new_page()
            await pg.add_init_script("try{localStorage.setItem('hm-open',String(Date.now()));localStorage.setItem('hm-local','1')}catch(e){}")
            await pg.goto(url); await pg.wait_for_timeout(1500)
            await pg.evaluate(PREP); await pg.wait_for_timeout(1500)
            return pg
        async def go(pg, v):
            await pg.evaluate(f"(()=>{{document.querySelectorAll('.dsp,.qsp,.scrim').forEach(e=>e.remove());A.go('{v}');scrollTo(0,0)}})()")
            await pg.wait_for_timeout(1600)
        pg = await page(390, 844, 2, True)
        for name, view in PAGES:
            await go(pg, view); await pg.screenshot(path=os.path.join(out, name + ".png")); print("✓", name)
        for name, (w, h, t) in {"ipad": (1180, 820, True), "masaustu": (1440, 900, False)}.items():
            pg = await page(w, h, 1, t); await go(pg, "home"); await pg.screenshot(path=os.path.join(out, name + ".png")); print("✓", name)
        await b.close()


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--url", default="https://yasindogruu.github.io/HypeMode/")
    ap.add_argument("-o", "--out", default="docs/screenshots")
    a = ap.parse_args()
    asyncio.run(shoot(a.url, a.out))
